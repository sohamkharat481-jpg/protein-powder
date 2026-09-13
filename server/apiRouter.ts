import express, { Request, Response } from 'express';
import { authenticateGoogleUser, getAllUsers, updateUserAddress, StoredUser } from './userService';
import { getRecipientEmail, getSmtpConfig, getNotificationLogs } from './emailService';
import { createSession, getSessionUser, destroySession } from './sessionService';

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '10mb' }));

// Helper to extract session id
function getSessionIdFromReq(req: Request): string | undefined {
  return req.cookies?.corefuel_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
}

// Helper to set session cookie
function setSessionCookie(res: Response, sessionId: string) {
  res.cookie('corefuel_session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
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
    googleOAuthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID),
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

// Public config for Google OAuth
apiRouter.get('/auth/config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
  res.json({
    googleClientId: clientId,
    hasGoogleAuth: Boolean(clientId),
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
    user: {
      id: user.id,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isMember: true,
      joinedDate: new Date(user.registeredAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      phone: user.savedAddress?.phone || '',
      savedAddress: user.savedAddress || null,
      orderHistory: user.orderHistory || [],
    },
  });
});

// 2. Google Token Verification (Google Identity Services ID Token): POST /api/auth/google/verify
apiRouter.post('/auth/google/verify', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Google ID token credential is required',
      });
      return;
    }

    // Securely verify token with Google's public tokeninfo endpoint
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!googleRes.ok) {
      const errText = await googleRes.text();
      console.error('[GOOGLE_VERIFY_FAIL]', errText);
      res.status(401).json({
        success: false,
        error: 'Invalid or expired Google credential token',
      });
      return;
    }

    const payload = await googleRes.json();
    const { sub, email, email_verified, name, picture, aud } = payload;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'No email found in Google credential',
      });
      return;
    }

    const isVerified = email_verified === 'true' || email_verified === true;
    if (!isVerified) {
      res.status(403).json({
        success: false,
        error: 'Google email is not verified',
      });
      return;
    }

    // Check aud against configured GOOGLE_CLIENT_ID if present
    const configuredClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (configuredClientId && aud !== configuredClientId) {
      console.warn(`[AUD_MISMATCH] Token audience ${aud} did not match configured client id ${configuredClientId}`);
    }

    // Authenticate / register user in database
    const authResult = await authenticateGoogleUser({
      googleId: sub,
      email,
      name: name || 'CoreFuel Athlete',
      avatarUrl: picture,
    });

    // Create session
    const sessionId = createSession(authResult.user.id);
    setSessionCookie(res, sessionId);

    const userProfile = {
      id: authResult.user.id,
      googleId: authResult.user.googleId,
      name: authResult.user.name,
      email: authResult.user.email,
      avatarUrl: authResult.user.avatarUrl,
      isMember: true,
      joinedDate: new Date(authResult.user.registeredAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      phone: authResult.user.savedAddress?.phone || '',
      savedAddress: authResult.user.savedAddress || null,
      orderHistory: authResult.user.orderHistory || [],
    };

    res.json({
      success: true,
      isNewUser: authResult.isNewUser,
      sessionId,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('[GOOGLE_VERIFY_ERROR]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error verifying Google authentication token',
    });
  }
});

// 3. Google OAuth 2.0 Authorization URL: GET /api/auth/google/url
apiRouter.get('/auth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
  if (!clientId) {
    res.status(400).json({
      success: false,
      error: 'Google OAuth Client ID is not configured in environment variables (GOOGLE_CLIENT_ID)',
    });
    return;
  }

  const baseUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    access_type: 'offline',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ success: true, url: authUrl });
});

// 4. Google OAuth Callback with postMessage: GET /api/auth/google/callback
apiRouter.get(['/auth/google/callback', '/auth/google/callback/'], async (req, res) => {
  const { code, error } = req.query;

  if (error || !code) {
    res.send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; background: #07080a; color: #fff; text-align: center; padding: 50px;">
          <h3>Authentication cancelled or failed</h3>
          <p>${error || 'No authorization code returned.'}</p>
          <script>
            setTimeout(() => { if (window.opener) window.close(); }, 3000);
          </script>
        </body>
      </html>
    `);
    return;
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    const baseUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[GOOGLE_OAUTH_TOKEN_ERROR]', errText);
      throw new Error('Failed to exchange authorization code for Google token');
    }

    const tokens = await tokenRes.json();
    
    // Fetch user info with access token
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userInfoRes.json();

    const authResult = await authenticateGoogleUser({
      googleId: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      avatarUrl: userInfo.picture,
    });

    const sessionId = createSession(authResult.user.id);
    setSessionCookie(res, sessionId);

    const userProfile = {
      id: authResult.user.id,
      googleId: authResult.user.googleId,
      name: authResult.user.name,
      email: authResult.user.email,
      avatarUrl: authResult.user.avatarUrl,
      isMember: true,
      joinedDate: new Date(authResult.user.registeredAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      phone: authResult.user.savedAddress?.phone || '',
      savedAddress: authResult.user.savedAddress || null,
      orderHistory: authResult.user.orderHistory || [],
    };

    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>CoreFuel Authentication</title></head>
        <body style="font-family: sans-serif; background: #07080a; color: #00d2ff; text-align: center; padding: 50px;">
          <h2>Authentication Successful!</h2>
          <p style="color: #bbb;">Synchronizing your CoreFuel athlete profile...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                sessionId: '${sessionId}',
                user: ${JSON.stringify(userProfile)}
              }, '*');
              window.close();
            } else {
              window.location.href = '/#login';
            }
          </script>
        </body>
      </html>
    `);
  } catch (callbackErr: any) {
    console.error('[GOOGLE_CALLBACK_ERROR]', callbackErr);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; background: #07080a; color: #ff5555; text-align: center; padding: 50px;">
          <h3>OAuth Error</h3>
          <p>${callbackErr.message || 'Authentication failed'}</p>
        </body>
      </html>
    `);
  }
});

// 5. Dynamic Athlete Login (Allows multi-account / multi-device login without hardcoded users): POST /api/auth/register-or-login
apiRouter.post('/auth/register-or-login', async (req, res) => {
  try {
    const { email, name, avatarUrl, googleId, savedAddress } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Valid email address is required',
      });
      return;
    }

    const result = await authenticateGoogleUser({
      email,
      name,
      avatarUrl,
      googleId,
      savedAddress,
    });

    const sessionId = createSession(result.user.id);
    setSessionCookie(res, sessionId);

    const userProfile = {
      id: result.user.id,
      googleId: result.user.googleId,
      name: result.user.name,
      email: result.user.email,
      avatarUrl: result.user.avatarUrl,
      isMember: true,
      joinedDate: new Date(result.user.registeredAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      phone: result.user.savedAddress?.phone || '',
      savedAddress: result.user.savedAddress || null,
      orderHistory: result.user.orderHistory || [],
    };

    res.json({
      success: true,
      isNewUser: result.isNewUser,
      sessionId,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('[API_AUTH_ERROR] Error during authentication:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Authentication processing error',
    });
  }
});

// 6. Logout: POST /api/auth/logout
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

// 7. Update saved delivery address for the active session user: POST /api/auth/update-address
apiRouter.post('/auth/update-address', (req, res) => {
  try {
    const sessionId = getSessionIdFromReq(req);
    const sessionUser = getSessionUser(sessionId);
    const { userId, savedAddress } = req.body;

    const targetUserId = sessionUser?.id || userId;
    if (!targetUserId || !savedAddress) {
      res.status(400).json({
        success: false,
        error: 'User authentication and savedAddress are required',
      });
      return;
    }

    const updated = updateUserAddress(targetUserId, savedAddress);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'User not found in database',
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: updated.id,
        googleId: updated.googleId,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
        isMember: true,
        joinedDate: new Date(updated.registeredAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        phone: updated.savedAddress?.phone || '',
        savedAddress: updated.savedAddress || null,
        orderHistory: updated.orderHistory || [],
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Fetch user details by email
apiRouter.get('/auth/user', (req, res) => {
  const email = req.query.email as string;
  if (!email) {
    res.status(400).json({ error: 'Email parameter is required' });
    return;
  }

  const users = getAllUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!found) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    success: true,
    user: {
      id: found.id,
      googleId: found.googleId,
      name: found.name,
      email: found.email,
      avatarUrl: found.avatarUrl,
      isMember: true,
      joinedDate: new Date(found.registeredAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      phone: found.savedAddress?.phone || '',
      savedAddress: found.savedAddress || null,
      orderHistory: found.orderHistory || [],
    },
  });
});
