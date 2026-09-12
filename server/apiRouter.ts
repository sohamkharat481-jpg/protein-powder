import express from 'express';
import { authenticateGoogleUser, getAllUsers, updateUserAddress } from './userService';
import { getRecipientEmail, getSmtpConfig, getNotificationLogs } from './emailService';

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '10mb' }));

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

// Google Authentication: New User Registration or Existing User Login
apiRouter.post('/auth/register-or-login', async (req, res) => {
  try {
    const { email, name, avatarUrl, googleId, savedAddress } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email address is required for Google authentication',
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

    res.json(result);
  } catch (err: any) {
    console.error('[API_AUTH_ERROR] Error during authentication:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Authentication processing error',
    });
  }
});

// Update saved delivery address for an existing user
apiRouter.post('/auth/update-address', (req, res) => {
  try {
    const { userId, savedAddress } = req.body;
    if (!userId || !savedAddress) {
      res.status(400).json({
        success: false,
        error: 'userId and savedAddress are required',
      });
      return;
    }

    const updated = updateUserAddress(userId, savedAddress);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'User not found in database',
      });
      return;
    }

    res.json({
      success: true,
      user: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Fetch current user details by email
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

  res.json({ success: true, user: found });
});
