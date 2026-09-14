import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StoredUser, getAllUsers } from './userService.js';

export interface SessionData {
  sessionId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

let memorySessions: SessionData[] = [];

function resolveSessionFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = path.resolve('/tmp', 'corefuel_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, 'sessions.json');
  }

  const localDir = path.resolve(process.cwd(), 'data');
  const localFile = path.join(localDir, 'sessions.json');

  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const testFile = path.join(localDir, '.session_test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return localFile;
  } catch {
    const tmpDir = path.resolve('/tmp', 'corefuel_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, 'sessions.json');
  }
}

let sessionFilePath = resolveSessionFilePath();
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function ensureSessionStorage(): void {
  const dir = path.dirname(sessionFilePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
  if (!fs.existsSync(sessionFilePath)) {
    const seedFile = path.resolve(process.cwd(), 'data', 'sessions.json');
    if (fs.existsSync(seedFile) && seedFile !== sessionFilePath) {
      try {
        fs.copyFileSync(seedFile, sessionFilePath);
        return;
      } catch {}
    }
    try {
      fs.writeFileSync(sessionFilePath, JSON.stringify([], null, 2), 'utf-8');
    } catch {}
  }
}

function loadSessions(): SessionData[] {
  ensureSessionStorage();
  const now = Date.now();
  try {
    if (fs.existsSync(sessionFilePath)) {
      const data = fs.readFileSync(sessionFilePath, 'utf-8');
      const list: SessionData[] = JSON.parse(data);
      const valid = list.filter((s) => s.expiresAt > now);
      if (valid.length > 0) {
        memorySessions = valid;
        return valid;
      }
    }
    return memorySessions.filter((s) => s.expiresAt > now);
  } catch (err) {
    console.error('[SESSION_READ_ERROR]', err);
    return memorySessions.filter((s) => s.expiresAt > now);
  }
}

function saveSessions(sessions: SessionData[]): void {
  const now = Date.now();
  const valid = sessions.filter((s) => s.expiresAt > now);
  memorySessions = valid;
  ensureSessionStorage();
  try {
    fs.writeFileSync(sessionFilePath, JSON.stringify(valid, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SESSION_WRITE_ERROR]', err);
    try {
      sessionFilePath = path.resolve('/tmp', 'corefuel_data', 'sessions.json');
      ensureSessionStorage();
      fs.writeFileSync(sessionFilePath, JSON.stringify(valid, null, 2), 'utf-8');
    } catch {}
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
