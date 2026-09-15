import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';

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

export interface SessionData {
  sessionId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Environment detection
const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || '';
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

let pgPool: pg.Pool | null = null;
let pgInitialized = false;

function getPgPool(): pg.Pool | null {
  if (!postgresUrl) return null;
  if (!pgPool) {
    const isLocalhost = postgresUrl.includes('localhost') || postgresUrl.includes('127.0.0.1');
    pgPool = new pg.Pool({
      connectionString: postgresUrl,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pgPool;
}

// Ensure Postgres Tables Exist & Migrate seed data
async function ensurePgSchema(pool: pg.Pool): Promise<void> {
  if (pgInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS corefuel_users (
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        registered_at TIMESTAMPTZ NOT NULL,
        last_login_at TIMESTAMPTZ NOT NULL,
        auth_provider VARCHAR(50) DEFAULT 'Email',
        notification_sent BOOLEAN DEFAULT FALSE,
        saved_address JSONB,
        order_history JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS corefuel_sessions (
        session_id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) NOT NULL REFERENCES corefuel_users(id) ON DELETE CASCADE,
        created_at BIGINT NOT NULL,
        expires_at BIGINT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_corefuel_users_email ON corefuel_users (LOWER(email));
      CREATE INDEX IF NOT EXISTS idx_corefuel_sessions_user ON corefuel_sessions (user_id);
    `);

    // Migrate any seed / local users if DB is empty
    const countRes = await pool.query('SELECT COUNT(*) FROM corefuel_users');
    const count = parseInt(countRes.rows[0].count, 10);
    if (count === 0) {
      const existing = loadLocalUsers();
      for (const u of existing) {
        await pool.query(
          `INSERT INTO corefuel_users (
            id, email, name, avatar_url, created_at, updated_at, registered_at,
            last_login_at, auth_provider, notification_sent, saved_address, order_history
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING`,
          [
            u.id,
            u.email.toLowerCase(),
            u.name,
            u.avatarUrl || null,
            u.createdAt || new Date().toISOString(),
            u.updatedAt || new Date().toISOString(),
            u.registeredAt || new Date().toISOString(),
            u.lastLoginAt || new Date().toISOString(),
            u.authProvider || 'Email',
            Boolean(u.notificationSent),
            JSON.stringify(u.savedAddress || null),
            JSON.stringify(u.orderHistory || []),
          ]
        );
      }
      if (existing.length > 0) {
        console.log(`[POSTGRES_MIGRATION] Migrated ${existing.length} local users into PostgreSQL`);
      }
    }

    pgInitialized = true;
  } catch (err: any) {
    console.error('[POSTGRES_INIT_ERROR] Failed to ensure schema:', err.message);
  }
}

// Upstash / Vercel KV REST helper
async function kvCommand(cmd: string, ...args: (string | number)[]): Promise<any> {
  if (!kvUrl || !kvToken) return null;
  const url = `${kvUrl.replace(/\/$/, '')}/${[cmd, ...args].map(encodeURIComponent).join('/')}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${kvToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`KV command ${cmd} failed with HTTP ${response.status}`);
  }
  const data = (await response.json()) as { result: any };
  return data.result;
}

// Local filesystem fallback implementation
function getLocalFilePath(filename: string): string {
  const cwdDir = path.resolve(process.cwd(), 'data');
  const cwdFile = path.join(cwdDir, filename);

  try {
    if (!fs.existsSync(cwdDir)) {
      fs.mkdirSync(cwdDir, { recursive: true });
    }
    const testFile = path.join(cwdDir, `.test_${Date.now()}`);
    fs.writeFileSync(testFile, '1');
    fs.unlinkSync(testFile);
    return cwdFile;
  } catch {
    const tmpDir = path.resolve('/tmp', 'corefuel_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, filename);
  }
}

let cachedLocalUsers: StoredUser[] | null = null;
let cachedLocalSessions: SessionData[] | null = null;

function loadLocalUsers(): StoredUser[] {
  if (cachedLocalUsers && cachedLocalUsers.length > 0) {
    return cachedLocalUsers;
  }
  const file = getLocalFilePath('users.json');
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedLocalUsers = parsed;
        return parsed;
      }
    }
    const seedFile = path.resolve(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(seedFile) && seedFile !== file) {
      const raw = fs.readFileSync(seedFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedLocalUsers = parsed;
        return parsed;
      }
    }
  } catch {}
  cachedLocalUsers = cachedLocalUsers || [];
  return cachedLocalUsers;
}

function saveLocalUsers(users: StoredUser[]): void {
  cachedLocalUsers = [...users];
  const file = getLocalFilePath('users.json');
  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LOCAL_DB_WRITE_ERROR]', err);
  }
}

function loadLocalSessions(): SessionData[] {
  const now = Date.now();
  if (cachedLocalSessions) {
    return cachedLocalSessions.filter((s) => s.expiresAt > now);
  }
  const file = getLocalFilePath('sessions.json');
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((s: SessionData) => s.expiresAt > now);
        cachedLocalSessions = valid;
        return valid;
      }
    }
  } catch {}
  cachedLocalSessions = cachedLocalSessions || [];
  return cachedLocalSessions.filter((s) => s.expiresAt > now);
}

function saveLocalSessions(sessions: SessionData[]): void {
  const now = Date.now();
  const valid = sessions.filter((s) => s.expiresAt > now);
  cachedLocalSessions = valid;
  const file = getLocalFilePath('sessions.json');
  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(valid, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LOCAL_SESSION_WRITE_ERROR]', err);
  }
}

// -------------------------------------------------------------
// UNIFIED DATABASE API (Postgres -> Upstash KV -> Local Fallback)
// -------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();

  // 1. Try PostgreSQL
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgSchema(pool);
      const res = await pool.query('SELECT * FROM corefuel_users WHERE LOWER(email) = $1 LIMIT 1', [normalized]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          avatarUrl: row.avatar_url,
          createdAt: new Date(row.created_at).toISOString(),
          updatedAt: new Date(row.updated_at).toISOString(),
          registeredAt: new Date(row.registered_at).toISOString(),
          lastLoginAt: new Date(row.last_login_at).toISOString(),
          authProvider: row.auth_provider || 'Email',
          notificationSent: Boolean(row.notification_sent),
          savedAddress: typeof row.saved_address === 'string' ? JSON.parse(row.saved_address) : row.saved_address,
          orderHistory: typeof row.order_history === 'string' ? JSON.parse(row.order_history) : row.order_history || [],
        };
      }
      return null;
    } catch (err) {
      console.error('[POSTGRES_QUERY_ERROR] findUserByEmail, falling back:', err);
    }
  }

  // 2. Try Upstash / Vercel KV
  if (kvUrl && kvToken) {
    try {
      const userId = await kvCommand('GET', `user:email:${normalized}`);
      if (userId) {
        const rawUser = await kvCommand('GET', `user:${userId}`);
        if (rawUser) {
          return typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
        }
      }
      return null;
    } catch (err) {
      console.error('[KV_QUERY_ERROR] findUserByEmail, falling back:', err);
    }
  }

  // 3. Local fallback
  const local = loadLocalUsers();
  return local.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  if (!id) return null;

  // 1. Try PostgreSQL
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgSchema(pool);
      const res = await pool.query('SELECT * FROM corefuel_users WHERE id = $1 LIMIT 1', [id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          avatarUrl: row.avatar_url,
          createdAt: new Date(row.created_at).toISOString(),
          updatedAt: new Date(row.updated_at).toISOString(),
          registeredAt: new Date(row.registered_at).toISOString(),
          lastLoginAt: new Date(row.last_login_at).toISOString(),
          authProvider: row.auth_provider || 'Email',
          notificationSent: Boolean(row.notification_sent),
          savedAddress: typeof row.saved_address === 'string' ? JSON.parse(row.saved_address) : row.saved_address,
          orderHistory: typeof row.order_history === 'string' ? JSON.parse(row.order_history) : row.order_history || [],
        };
      }
      return null;
    } catch (err) {
      console.error('[POSTGRES_QUERY_ERROR] findUserById, falling back:', err);
    }
  }

  // 2. Try Upstash / Vercel KV
  if (kvUrl && kvToken) {
    try {
      const rawUser = await kvCommand('GET', `user:${id}`);
      if (rawUser) {
        return typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
      }
      return null;
    } catch (err) {
      console.error('[KV_QUERY_ERROR] findUserById, falling back:', err);
    }
  }

  // 3. Local fallback
  const local = loadLocalUsers();
  return local.find((u) => u.id === id) || null;
}

export async function saveUser(user: StoredUser): Promise<StoredUser> {
  // 1. Try PostgreSQL
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgSchema(pool);
      await pool.query(
        `INSERT INTO corefuel_users (
          id, email, name, avatar_url, created_at, updated_at, registered_at,
          last_login_at, auth_provider, notification_sent, saved_address, order_history
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          name = EXCLUDED.name,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = EXCLUDED.updated_at,
          last_login_at = EXCLUDED.last_login_at,
          notification_sent = EXCLUDED.notification_sent,
          saved_address = EXCLUDED.saved_address,
          order_history = EXCLUDED.order_history`,
        [
          user.id,
          user.email.toLowerCase(),
          user.name,
          user.avatarUrl || null,
          user.createdAt,
          user.updatedAt,
          user.registeredAt,
          user.lastLoginAt,
          user.authProvider,
          Boolean(user.notificationSent),
          JSON.stringify(user.savedAddress || null),
          JSON.stringify(user.orderHistory || []),
        ]
      );
      // Keep local cache in sync
      const local = loadLocalUsers();
      const idx = local.findIndex((u) => u.id === user.id);
      if (idx !== -1) local[idx] = user;
      else local.push(user);
      saveLocalUsers(local);
      return user;
    } catch (err) {
      console.error('[POSTGRES_SAVE_ERROR] saveUser, writing local fallback:', err);
    }
  }

  // 2. Try Upstash / Vercel KV
  if (kvUrl && kvToken) {
    try {
      const serialized = JSON.stringify(user);
      await kvCommand('SET', `user:${user.id}`, serialized);
      await kvCommand('SET', `user:email:${user.email.toLowerCase()}`, user.id);
      await kvCommand('SADD', 'users:index', user.id);
      // Keep local in sync
      const local = loadLocalUsers();
      const idx = local.findIndex((u) => u.id === user.id);
      if (idx !== -1) local[idx] = user;
      else local.push(user);
      saveLocalUsers(local);
      return user;
    } catch (err) {
      console.error('[KV_SAVE_ERROR] saveUser, falling back to local:', err);
    }
  }

  // 3. Local fallback
  const local = loadLocalUsers();
  const idx = local.findIndex((u) => u.id === user.id);
  if (idx !== -1) local[idx] = user;
  else local.push(user);
  saveLocalUsers(local);
  return user;
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  // 1. Try PostgreSQL
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgSchema(pool);
      await pool.query(
        'INSERT INTO corefuel_sessions (session_id, user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)',
        [sessionId, userId, now, expiresAt]
      );
      // Clean up old expired sessions asynchronously
      pool.query('DELETE FROM corefuel_sessions WHERE expires_at < $1', [now]).catch(() => {});
      return sessionId;
    } catch (err) {
      console.error('[POSTGRES_SESSION_CREATE_ERROR], falling back:', err);
    }
  }

  // 2. Try Upstash / Vercel KV
  if (kvUrl && kvToken) {
    try {
      const sessionObj: SessionData = { sessionId, userId, createdAt: now, expiresAt };
      const seconds = Math.floor(SESSION_TTL_MS / 1000);
      await kvCommand('SETEX', `session:${sessionId}`, seconds, JSON.stringify(sessionObj));
      return sessionId;
    } catch (err) {
      console.error('[KV_SESSION_CREATE_ERROR], falling back:', err);
    }
  }

  // 3. Local fallback
  const sessions = loadLocalSessions();
  sessions.push({ sessionId, userId, createdAt: now, expiresAt });
  saveLocalSessions(sessions);
  return sessionId;
}

export async function getSessionUser(sessionId?: string): Promise<StoredUser | null> {
  if (!sessionId) return null;
  const now = Date.now();

  // 1. Try PostgreSQL
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgSchema(pool);
      const res = await pool.query(
        `SELECT u.* FROM corefuel_sessions s
         JOIN corefuel_users u ON s.user_id = u.id
         WHERE s.session_id = $1 AND s.expires_at > $2
         LIMIT 1`,
        [sessionId, now]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          avatarUrl: row.avatar_url,
          createdAt: new Date(row.created_at).toISOString(),
          updatedAt: new Date(row.updated_at).toISOString(),
          registeredAt: new Date(row.registered_at).toISOString(),
          lastLoginAt: new Date(row.last_login_at).toISOString(),
          authProvider: row.auth_provider || 'Email',
          notificationSent: Boolean(row.notification_sent),
          savedAddress: typeof row.saved_address === 'string' ? JSON.parse(row.saved_address) : row.saved_address,
          orderHistory: typeof row.order_history === 'string' ? JSON.parse(row.order_history) : row.order_history || [],
        };
      }
      return null;
    } catch (err) {
      console.error('[POSTGRES_SESSION_GET_ERROR], falling back:', err);
    }
  }

  // 2. Try Upstash / Vercel KV
  if (kvUrl && kvToken) {
    try {
      const rawSession = await kvCommand('GET', `session:${sessionId}`);
      if (rawSession) {
        const session: SessionData = typeof rawSession === 'string' ? JSON.parse(rawSession) : rawSession;
        if (session.expiresAt > now) {
          return findUserById(session.userId);
        }
      }
      return null;
    } catch (err) {
      console.error('[KV_SESSION_GET_ERROR], falling back:', err);
    }
  }

  // 3. Local fallback
  const sessions = loadLocalSessions();
  const found = sessions.find((s) => s.sessionId === sessionId && s.expiresAt > now);
  if (!found) return null;
  return findUserById(found.userId);
}

export async function destroySession(sessionId?: string): Promise<void> {
  if (!sessionId) return;

  // 1. Try PostgreSQL
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgSchema(pool);
      await pool.query('DELETE FROM corefuel_sessions WHERE session_id = $1', [sessionId]);
      return;
    } catch (err) {
      console.error('[POSTGRES_SESSION_DELETE_ERROR], falling back:', err);
    }
  }

  // 2. Try Upstash / Vercel KV
  if (kvUrl && kvToken) {
    try {
      await kvCommand('DEL', `session:${sessionId}`);
      return;
    } catch (err) {
      console.error('[KV_SESSION_DELETE_ERROR], falling back:', err);
    }
  }

  // 3. Local fallback
  const sessions = loadLocalSessions();
  const filtered = sessions.filter((s) => s.sessionId !== sessionId);
  saveLocalSessions(filtered);
}

export function getDatabaseDiagnostics(): {
  provider: string;
  isCloudPersistent: boolean;
  configuredEnvVar: string;
  autoMigrated: boolean;
} {
  if (postgresUrl) {
    return {
      provider: 'PostgreSQL (Vercel Postgres / Neon / Supabase)',
      isCloudPersistent: true,
      configuredEnvVar: process.env.DATABASE_URL ? 'DATABASE_URL' : 'POSTGRES_URL',
      autoMigrated: pgInitialized,
    };
  }
  if (kvUrl && kvToken) {
    return {
      provider: 'Upstash Redis / Vercel KV (REST Engine)',
      isCloudPersistent: true,
      configuredEnvVar: process.env.KV_REST_API_URL ? 'KV_REST_API_URL' : 'UPSTASH_REDIS_REST_URL',
      autoMigrated: true,
    };
  }
  return {
    provider: 'Local Persistent Store (Ready for DATABASE_URL or KV_REST_API_URL)',
    isCloudPersistent: false,
    configuredEnvVar: 'None (Set DATABASE_URL or KV_REST_API_URL in Vercel)',
    autoMigrated: true,
  };
}
