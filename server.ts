import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/apiRouter';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and cookies
  app.use(express.json());
  app.use(cookieParser());

  // Mount API routes FIRST
  app.use('/api', apiRouter);
  app.get(['/auth/google/callback', '/auth/google/callback/'], (req, res) => {
    res.redirect(`/api/auth/google/callback?${new URLSearchParams(req.query as any).toString()}`);
  });

  // Serve static images directly from public/images
  app.use('/images', express.static(path.resolve(process.cwd(), 'public', 'images')));

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CoreFuel Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CoreFuel server:', err);
  process.exit(1);
});
