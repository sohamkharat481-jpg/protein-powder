import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StoredUser, getAllUsers } from './userService';

export interface SessionData {
  sessionId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_FILE = path.resolve(process.cwd(), 'data', 'sessions.json');
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function ensureSessionStorage(): void {
  const dir = path.dirname(SESSION_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SESSION_FILE)) {
    fs.writeFileSync(SESSION_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function loadSessions(): SessionData[] {
  ensureSessionStorage();
  try {
    const data = fs.readFileSync(SESSION_FILE, 'utf-8');
    const list: SessionData[] = JSON.parse(data);
    const now = Date.now();
    return list.filter((s) => s.expiresAt > now);
  } catch (err) {
    console.error('[SESSION_READ_ERROR]', err);
    return [];
  }
}

function saveSessions(sessions: SessionData[]): void {
  ensureSessionStorage();
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SESSION_WRITE_ERROR]', err);
  }
}

export function createSession(userId: string): string {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const sessions = loadSessions();
  sessions.push({
    sessionId,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  saveSessions(sessions);
  return sessionId;
}

export function getSessionUser(sessionId?: string): StoredUser | null {
  if (!sessionId) return null;
  const sessions = loadSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (!session) return null;

  const users = getAllUsers();
  return users.find((u) => u.id === session.userId) || null;
}

export function destroySession(sessionId?: string): void {
  if (!sessionId) return;
  const sessions = loadSessions();
  const filtered = sessions.filter((s) => s.sessionId !== sessionId);
  saveSessions(filtered);
}
