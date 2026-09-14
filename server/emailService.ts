import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface UserRegistrationInfo {
  name: string;
  email: string;
  registeredAt: string;
  authMethod: string;
}

const LOG_FILE = path.resolve(process.cwd(), 'data', 'email_notifications.json');

export function getRecipientEmail(): string {
  return process.env.FOUNDER_NOTIFICATION || 'prashantgaikwad658@gmail.com';
}

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'prashantgaikwad658@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  return { host, port, secure, user, pass };
}

function appendNotificationLog(logEntry: any) {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let logs: any[] = [];
    if (fs.existsSync(LOG_FILE)) {
      try {
        logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
      } catch {
        logs = [];
      }
    }
    logs.push(logEntry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[EMAIL_LOG_ERROR] Failed to save email log to file:', err);
  }
}

export function getNotificationLogs(): any[] {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    }
  } catch {
    // fallback
  }
  return [];
}

export async function sendNewUserRegistrationEmail(user: UserRegistrationInfo): Promise<{
  success: boolean;
  message: string;
  deliveredVia: 'smtp' | 'skipped' | 'audit_log';
  details?: any;
}> {
  const recipient = getRecipientEmail();
  const subject = 'New User Registration \u2013 CoreFuel';
  
  const formattedDate = new Date(user.registeredAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const textContent = `
========================================
NEW USER REGISTRATION \u2013 COREFUEL
========================================

A new athlete has registered on CoreFuel Nutrition.

User Details:
----------------------------------------
\u2022 User Name:                  ${user.name}
\u2022 User Email:                 ${user.email}
\u2022 Sign-in Method:             ${user.authMethod || 'CoreFuel Account'}
\u2022 Registration Date and Time: ${formattedDate} (${user.registeredAt})

----------------------------------------
CoreFuel Nutrition Automated Authentication Notification System
Recipient: ${recipient}
========================================
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New User Registration \u2013 CoreFuel</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07080a; color: #e8e9ec;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #0d1017; border: 1px solid #222630; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
    
    <!-- Gradient Top Bar -->
    <div style="background: linear-gradient(90deg, #00d2ff, #ff7700); height: 5px;"></div>
    
    <!-- Header -->
    <div style="padding: 24px 28px; border-bottom: 1px solid #1a1e27; background-color: #0b0d13;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 11px; font-weight: 700; color: #00d2ff; letter-spacing: 1.5px; text-transform: uppercase;">
          CoreFuel Nutrition Platform
        </span>
        <span style="font-size: 10px; color: #5a606d; font-family: monospace;">
          AUTH-ALERT
        </span>
      </div>
      <h1 style="margin: 8px 0 0 0; font-size: 21px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
        New User Registration \u2013 CoreFuel
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #8c93a0;">
        Founder Alert: A new athlete has completed account registration.
      </p>
    </div>

    <!-- Content Table -->
    <div style="padding: 28px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #12151e; border: 1px solid #1f2430; border-radius: 10px; overflow: hidden;">
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #8c93a0; border-bottom: 1px solid #1f2430; width: 38%;">User Name</td>
          <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #ffffff; border-bottom: 1px solid #1f2430;">${user.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #8c93a0; border-bottom: 1px solid #1f2430;">User Email</td>
          <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #00d2ff; border-bottom: 1px solid #1f2430;">
            <a href="mailto:${user.email}" style="color: #00d2ff; text-decoration: none;">${user.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #8c93a0; border-bottom: 1px solid #1f2430;">Sign-in Method</td>
          <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #00d2ff; border-bottom: 1px solid #1f2430;">
            <span style="display: inline-block; padding: 2px 8px; background-color: rgba(0, 210, 255, 0.1); border: 1px solid rgba(0, 210, 255, 0.3); border-radius: 4px;">
              ${user.authMethod || 'CoreFuel Account'}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #8c93a0;">Registration Date and Time</td>
          <td style="padding: 12px 16px; font-size: 13px; font-weight: 500; color: #ffffff;">
            ${formattedDate}<br>
            <span style="font-size: 11px; color: #6b7280; font-family: monospace;">${user.registeredAt}</span>
          </td>
        </tr>
      </table>

      <div style="background: linear-gradient(135deg, rgba(0, 210, 255, 0.05), rgba(255, 119, 0, 0.05)); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: 10px; padding: 14px 18px;">
        <span style="display: block; font-size: 12px; color: #00d2ff; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
          Permanent Record Committed
        </span>
        <span style="font-size: 12px; color: #a1a8b5; line-height: 1.5;">
          This athlete profile is permanently saved in the CoreFuel customer directory. Subsequent logins by this athlete will NOT trigger repeat founder alerts.
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 28px; background-color: #080a0e; border-top: 1px solid #1a1e27; font-size: 11px; color: #5a606d; text-align: center;">
      CoreFuel Nutrition Automated Authentication Service &bull; Delivered to ${recipient}
    </div>
  </div>
</body>
</html>
`.trim();

  const { host, port, secure, user: smtpUser, pass: smtpPass } = getSmtpConfig();

  const logRecord = {
    id: `notif_${Date.now()}`,
    recipient,
    subject,
    userEmail: user.email,
    userName: user.name,
    timestamp: new Date().toISOString(),
    authMethod: user.authMethod || 'CoreFuel Account',
    status: 'pending',
    provider: 'unconfigured',
  };

  // If SMTP password is not configured yet, gracefully skip sending the email
  if (!smtpPass) {
    console.log(
      `[NOTIFICATION_NOTICE] SMTP_PASS is not configured. Gracefully skipping email dispatch to founder (${recipient}) for new user: ${user.email}`
    );
    logRecord.status = 'skipped_no_smtp_pass';
    logRecord.provider = 'skipped';
    appendNotificationLog(logRecord);

    return {
      success: true,
      deliveredVia: 'skipped',
      message: 'SMTP_PASS not configured yet; email dispatch gracefully skipped',
      details: { recipient, timestamp: logRecord.timestamp },
    };
  }

  // When SMTP_PASS is configured, deliver via nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"CoreFuel Auth" <${smtpUser}>`,
      to: recipient,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log('[SMTP_DELIVERY_SUCCESS] Registration email sent to', recipient, 'MessageId:', info.messageId);
    logRecord.status = 'sent';
    logRecord.provider = 'smtp';
    appendNotificationLog(logRecord);

    return {
      success: true,
      deliveredVia: 'smtp',
      message: 'Notification email successfully delivered via SMTP to founder',
      details: { messageId: info.messageId, recipient },
    };
  } catch (smtpErr: any) {
    console.warn(
      `[SMTP_DELIVERY_NOTICE] SMTP delivery failed (${smtpErr.message}). Gracefully skipped to protect user authentication.`
    );
    logRecord.status = `smtp_delivery_failed: ${smtpErr.message}`;
    logRecord.provider = 'smtp';
    appendNotificationLog(logRecord);

    return {
      success: true,
      deliveredVia: 'skipped',
      message: `Notification processed (SMTP notice: ${smtpErr.message})`,
      details: { recipient, timestamp: logRecord.timestamp },
    };
  }
}
