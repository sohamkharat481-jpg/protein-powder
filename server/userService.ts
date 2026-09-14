import fs from 'fs';
import path from 'path';
import { sendNewUserRegistrationEmail } from './emailService.js';

export interface StoredUser {
  id: string; // unique internal account ID
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  registeredAt: string;
  lastLoginAt: string;
  authProvider: 'Email';
  notificationSent: boolean;
  savedAddress?: any;
  orderHistory?: any[];
}

let memoryUsers: StoredUser[] = [];

function resolveDbFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDir = path.resolve('/tmp', 'corefuel_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, 'users.json');
  }

  const localDir = path.resolve(process.cwd(), 'data');
  const localFile = path.join(localDir, 'users.json');

  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(localDir, '.write_test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return localFile;
  } catch {
    // Read-only filesystem fallback to /tmp
    const tmpDir = path.resolve('/tmp', 'corefuel_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, 'users.json');
  }
}

let dbFilePath = resolveDbFilePath();

function ensureDataDirectory() {
  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
  if (!fs.existsSync(dbFilePath)) {
    const seedFile = path.resolve(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(seedFile) && seedFile !== dbFilePath) {
      try {
        fs.copyFileSync(seedFile, dbFilePath);
        return;
      } catch {}
    }
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify([], null, 2), 'utf-8');
    } catch {}
  }
}

export function getAllUsers(): StoredUser[] {
  try {
    ensureDataDirectory();
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      const parsed: StoredUser[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryUsers = parsed;
        return parsed;
      }
    }
    return memoryUsers;
  } catch (err) {
    console.error('[DATABASE_READ_ERROR] Error reading users database:', err);
    return memoryUsers;
  }
}

export function saveAllUsers(users: StoredUser[]): void {
  memoryUsers = [...users];
  try {
    ensureDataDirectory();
    fs.writeFileSync(dbFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DATABASE_WRITE_ERROR] Error writing users database, trying /tmp fallback:', err);
    try {
      dbFilePath = path.resolve('/tmp', 'corefuel_data', 'users.json');
      ensureDataDirectory();
      fs.writeFileSync(dbFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (fallbackErr) {
      console.error('[DATABASE_WRITE_FATAL] Memory state preserved:', fallbackErr);
    }
  }
}

export function getUserByEmail(email: string): StoredUser | null {
  const normalized = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function authenticateCustomer(payload: {
  email: string;
  name?: string;
  savedAddress?: any;
}): Promise<{
  success: boolean;
  isNewUser: boolean;
  user: StoredUser;
  notificationStatus?: any;
}> {
  if (!payload.email || typeof payload.email !== 'string') {
    throw new Error('Valid customer email address is required');
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
    throw new Error('Please provide a valid email format');
  }

  const users = getAllUsers();
  const now = new Date().toISOString();

  // Multi-user matching: match by unique customer email
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (existingIndex !== -1) {
    // Existing user logging in
    const existing = users[existingIndex];
    existing.lastLoginAt = now;
    existing.updatedAt = now;
    if (payload.name && payload.name.trim()) {
      existing.name = payload.name.trim();
    }
    if (payload.savedAddress) {
      existing.savedAddress = payload.savedAddress;
    }

    users[existingIndex] = existing;
    saveAllUsers(users);

    console.log(`[AUTH_LOGIN] Existing customer signed in: ${existing.email} (ID: ${existing.id})`);

    return {
      success: true,
      isNewUser: false,
      user: existing,
    };
  }

  // Brand New Customer Registration
  const assignedName = payload.name?.trim() || 'CoreFuel Athlete';
  const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: StoredUser = {
    id: newUserId,
    name: assignedName,
    email: normalizedEmail,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      assignedName
    )}&backgroundColor=00d2ff,ff7700`,
    createdAt: now,
    updatedAt: now,
    registeredAt: now,
    lastLoginAt: now,
    authProvider: 'Email',
    notificationSent: false,
    savedAddress: payload.savedAddress || null,
    orderHistory: [],
  };

  // 1. SAVE NEW USER RECORD FIRST
  users.push(newUser);
  saveAllUsers(users);
  console.log(`[AUTH_REGISTER] New customer registered and saved in database: ${newUser.email} (ID: ${newUser.id})`);

  // 2. TRIGGER SERVER-SIDE NOTIFICATION EMAIL TO FOUNDER
  let notificationStatus: any = null;
  try {
    notificationStatus = await sendNewUserRegistrationEmail({
      name: newUser.name,
      email: newUser.email,
      registeredAt: newUser.registeredAt,
      authMethod: 'CoreFuel Account',
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
  users[idx].updatedAt = new Date().toISOString();
  saveAllUsers(users);
  return users[idx];
}
