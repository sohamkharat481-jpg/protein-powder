import fs from 'fs';
import path from 'path';
import { sendNewUserRegistrationEmail } from './emailService';

export interface StoredUser {
  id: string;
  googleId?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  registeredAt: string;
  lastLoginAt: string;
  authProvider: 'Google';
  notificationSent: boolean;
  savedAddress?: any;
  orderHistory?: any[];
}

const DB_FILE = path.resolve(process.cwd(), 'data', 'users.json');

function ensureDataDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllUsers(): StoredUser[] {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DATABASE_READ_ERROR] Error reading users.json:', err);
    return [];
  }
}

export function saveAllUsers(users: StoredUser[]): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DATABASE_WRITE_ERROR] Error writing users.json:', err);
    throw err;
  }
}

export async function authenticateGoogleUser(payload: {
  email: string;
  name?: string;
  avatarUrl?: string;
  googleId?: string;
  savedAddress?: any;
}): Promise<{
  success: boolean;
  isNewUser: boolean;
  user: StoredUser;
  notificationStatus?: any;
}> {
  if (!payload.email || typeof payload.email !== 'string') {
    throw new Error('Valid user email address is required');
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  const users = getAllUsers();

  const existingIndex = users.findIndex(
    (u) => u.email.toLowerCase() === normalizedEmail || (payload.googleId && u.googleId === payload.googleId)
  );

  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    // Existing user logging in again
    const existing = users[existingIndex];
    existing.lastLoginAt = now;
    if (payload.name && payload.name.trim()) {
      existing.name = payload.name.trim();
    }
    if (payload.avatarUrl) {
      existing.avatarUrl = payload.avatarUrl;
    }
    if (payload.savedAddress) {
      existing.savedAddress = payload.savedAddress;
    }

    users[existingIndex] = existing;
    saveAllUsers(users);

    console.log(`[AUTH_LOGIN] Existing user logged in: ${existing.email} (ID: ${existing.id}). No notification sent.`);

    return {
      success: true,
      isNewUser: false,
      user: existing,
    };
  }

  // Brand New User Registration
  const newUser: StoredUser = {
    id: `usr_g_${Date.now()}`,
    googleId: payload.googleId || `gid_${Date.now()}`,
    name: payload.name?.trim() || 'CoreFuel Athlete',
    email: normalizedEmail,
    avatarUrl:
      payload.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        payload.name || 'CoreFuel'
      )}&backgroundColor=00d2ff,ff7700`,
    registeredAt: now,
    lastLoginAt: now,
    authProvider: 'Google',
    notificationSent: false,
    savedAddress: payload.savedAddress || null,
    orderHistory: [],
  };

  // 1. SAVE NEW USER RECORD FIRST (Rule 6: notification ONLY after registered)
  users.push(newUser);
  saveAllUsers(users);
  console.log(`[AUTH_REGISTER] New user registered and saved in database: ${newUser.email} (ID: ${newUser.id})`);

  // 2. TRIGGER SERVER-SIDE NOTIFICATION EMAIL TO FOUNDER
  let notificationStatus: any = null;
  try {
    notificationStatus = await sendNewUserRegistrationEmail({
      name: newUser.name,
      email: newUser.email,
      registeredAt: newUser.registeredAt,
      authMethod: 'Google',
    });

    // 3. UPDATE NOTIFICATION FLAG IN DATABASE
    const updatedUsers = getAllUsers();
    const idx = updatedUsers.findIndex((u) => u.id === newUser.id);
    if (idx !== -1) {
      updatedUsers[idx].notificationSent = true;
      saveAllUsers(updatedUsers);
    }
  } catch (notifErr: any) {
    console.error('[NOTIFICATION_DISPATCH_ERROR] Failed to send registration email:', notifErr.message);
    notificationStatus = { success: false, error: notifErr.message };
  }

  return {
    success: true,
    isNewUser: true,
    user: newUser,
    notificationStatus,
  };
}

export function updateUserAddress(userId: string, savedAddress: any): StoredUser | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  users[idx].savedAddress = savedAddress;
  saveAllUsers(users);
  return users[idx];
}
