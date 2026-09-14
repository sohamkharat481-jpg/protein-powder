import { app } from '../server/app.js';

export default function handler(req: any, res: any) {
  // On Vercel, when rewrites route /api/(.*) to /api or /api/index,
  // x-forwarded-uri, x-matched-path, or x-real-url contains the original client URL.
  const originalUrl = (req.headers?.['x-forwarded-uri'] ||
    req.headers?.['x-matched-path'] ||
    req.headers?.['x-real-url']) as string | undefined;

  if (
    originalUrl &&
    (req.url === '/api' ||
      req.url === '/api/' ||
      req.url === '/' ||
      req.url === '/api/index' ||
      req.url.startsWith('/api?') ||
      req.url.startsWith('/?'))
  ) {
    req.url = originalUrl;
  }

  if (typeof req.url === 'string' && req.url.startsWith('/api/index')) {
    req.url = req.url.replace('/api/index', '/api');
  }

  return app(req, res);
}

