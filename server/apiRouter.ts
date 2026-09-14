import express, { Request, Response } from 'express';
import { authenticateCustomer, updateUserAddress, StoredUser } from './userService';
import { getRecipientEmail, getSmtpConfig, getNotificationLogs } from './emailService';
import { createSession, getSessionUser, destroySession } from './sessionService';

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '10mb' }));

// Helper to extract session id
function getSessionIdFromReq(req: Request): string | undefined {
  return req.cookies?.corefuel_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
}

// Helper to set secure session cookie
function setSessionCookie(res: Response, sessionId: string) {
  res.cookie('corefuel_session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

function mapUserToPublicProfile(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isMember: true,
    createdAt: user.createdAt || user.registeredAt,
    updatedAt: user.updatedAt || user.registeredAt,
    joinedDate: new Date(user.createdAt || user.registeredAt).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
    phone: user.savedAddress?.phone || '',
    savedAddress: user.savedAddress || null,
    orderHistory: user.orderHistory || [],
  };
}

// Health Check
apiRouter.get('/health', (req, res) => {
  const { host, port, secure, user, pass } = getSmtpConfig();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CoreFuel Nutrition Backend',
    environment: process.env.NODE_ENV || 'development',
    founderNotification: {
      recipient: getRecipientEmail(),
      smtpConfigured: Boolean(user && host),
      smtpSecure: secure,
      smtpPort: port,
      smtpHost: host,
      hasSmtpPassword: Boolean(pass),
    },
  });
});

// Notifications Status & Audit Logs Endpoint
apiRouter.get('/auth/notifications-status', (req, res) => {
  const { host, port, secure, user, pass } = getSmtpConfig();
  const logs = getNotificationLogs();
  
  res.json({
    recipient: getRecipientEmail(),
    smtpHost: host,
    smtpPort: port,
    smtpSecure: secure,
    smtpUser: user,
    hasPasswordConfigured: Boolean(pass),
    totalNotificationsLogged: logs.length,
    recentNotifications: logs.slice(-5).reverse(),
  });
});

// 1. Current Authenticated Session check: GET /api/auth/me
apiRouter.get('/auth/me', (req, res) => {
  const sessionId = getSessionIdFromReq(req);
  const user = getSessionUser(sessionId);

  if (!user) {
    res.json({
      authenticated: false,
      user: null,
    });
    return;
  }

  res.json({
    authenticated: true,
    user: mapUserToPublicProfile(user),
  });
});

// 2. Customer Authentication (Login & Signup): POST /api/auth/login
apiRouter.post(['/auth/login', '/auth/customer-login'], async (req, res) => {
  try {
    const { email, fullName, name } = req.body;

    const providedEmail = (email || '').trim();
    const providedName = (fullName || name || '').trim();

    if (!providedEmail) {
      res.status(400).json({
        success: false,
        error: 'Please enter your email address.',
      });
      return;
    }

    if (!providedEmail.includes('@') || !providedEmail.includes('.')) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address (e.g., athlete@example.com).',
      });
      return;
    }

    // Authenticate or register customer in isolated account
    const authResult = await authenticateCustomer({
      email: providedEmail,
      name: providedName,
    });

    // Create session
    const sessionId = createSession(authResult.user.id);
    setSessionCookie(res, sessionId);

    res.json({
      success: true,
      isNewUser: authResult.isNewUser,
      sessionId,
      user: mapUserToPublicProfile(authResult.user),
    });
  } catch (err: any) {
    console.error('[AUTH_LOGIN_ERROR]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Authentication error. Please try again.',
    });
  }
});

// 3. Logout: POST /api/auth/logout
apiRouter.post('/auth/logout', (req, res) => {
  const sessionId = getSessionIdFromReq(req);
  if (sessionId) {
    destroySession(sessionId);
  }
  res.clearCookie('corefuel_session', {
    path: '/',
    sameSite: 'none',
    secure: true,
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// 4. Update saved delivery address for the active session user: POST /api/auth/update-address
// Strict User Isolation: Address updates are strictly tied to the verified session
apiRouter.post('/auth/update-address', (req, res) => {
  try {
    const sessionId = getSessionIdFromReq(req);
    const sessionUser = getSessionUser(sessionId);

    if (!sessionUser) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to your CoreFuel account.',
      });
      return;
    }

    const { savedAddress } = req.body;
    if (!savedAddress || typeof savedAddress !== 'object') {
      res.status(400).json({
        success: false,
        error: 'savedAddress object is required',
      });
      return;
    }

    // Only update the active session user's address
    const updated = updateUserAddress(sessionUser.id, savedAddress);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'User not found in database',
      });
      return;
    }

    res.json({
      success: true,
      user: mapUserToPublicProfile(updated),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
