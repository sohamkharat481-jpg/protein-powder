import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from './apiRouter.js';

export function createExpressApp(): express.Express {
  const app = express();

  // Standard middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Root status endpoints for both '/' and '/api'
  app.get('/api', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CoreFuel Nutrition API',
      timestamp: new Date().toISOString(),
      endpoints: [
        '/api/health',
        '/api/auth/me',
        '/api/auth/login',
        '/api/auth/logout',
        '/api/auth/update-address',
      ],
    });
  });

  // Mount API router on BOTH '/api' and root ('/')
  // This guarantees routing matches whether Vercel preserves '/api/...' or strips '/api'
  app.use('/api', apiRouter);
  app.use(apiRouter);

  // API 404 JSON Fallback
  app.use((req, res, next) => {
    const isApi =
      req.url.startsWith('/api') ||
      req.originalUrl?.startsWith('/api') ||
      req.path.startsWith('/auth') ||
      req.path.startsWith('/health') ||
      req.headers.accept?.includes('application/json');

    if (isApi) {
      return res.status(404).json({
        success: false,
        error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
      });
    }
    next();
  });

  // Global Error Handler - always return JSON for API errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[EXPRESS_ERROR_HANDLER]', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}

export const app = createExpressApp();
export default app;
