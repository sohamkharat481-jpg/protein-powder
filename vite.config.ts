import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// LINT.IfChange(aistudio_media_plugin)
function aistudioMediaPlugin(): Plugin {
  return {
    name: 'vite-plugin-aistudio-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/api/upload-photo') || req.url.startsWith('/api/product-photos-status') || req.url.startsWith('/api/auth/'))) {
          if (req.method === 'POST' && req.url.startsWith('/api/auth/register-or-login')) {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const payload = JSON.parse(body);
                const { authenticateGoogleUser } = await import('./server/userService');
                const result = await authenticateGoogleUser(payload);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
          if (req.method === 'POST' && req.url.startsWith('/api/upload-photo')) {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try {
                const { variant, dataUrl } = JSON.parse(body);
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const imagesDir = path.resolve(__dirname, 'public', 'images');
                if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
                
                const targetName = variant === 'orange' ? 'Corefuel 3.jpeg' : 'Corefuel 2.jpeg';
                const aliasName = variant === 'orange' ? 'corefuel_orange.jpeg' : 'corefuel_unflavoured.jpeg';
                fs.writeFileSync(path.join(imagesDir, targetName), buffer);
                fs.writeFileSync(path.join(imagesDir, aliasName), buffer);
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, filename: targetName }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          if (req.method === 'GET' && req.url.startsWith('/api/product-photos-status')) {
            const imagesDir = path.resolve(__dirname, 'public', 'images');
            const hasOrange = fs.existsSync(path.join(imagesDir, 'Corefuel 3.jpeg')) || fs.existsSync(path.join(imagesDir, 'corefuel_orange.jpeg'));
            const hasUnflavoured = fs.existsSync(path.join(imagesDir, 'Corefuel 2.jpeg')) || fs.existsSync(path.join(imagesDir, 'corefuel_unflavoured.jpeg'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ hasOrange, hasUnflavoured }));
            return;
          }
        }

        // Dedicated resolver for uploaded product photos (handles URL-encoded spaces and names)
        if (req.url && (req.url.includes('Corefuel') || req.url.includes('corefuel_orange') || req.url.includes('corefuel_unflavoured'))) {
          try {
            const rawPath = req.url.split('?')[0].split('#')[0];
            const decoded = decodeURIComponent(rawPath).replace(/^\/images\//, '').replace(/^\//, '');
            const imagesDir = path.resolve(__dirname, 'public', 'images');
            const filePath = path.join(imagesDir, decoded);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              res.setHeader('Content-Type', 'image/jpeg');
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            // fallthrough
          }
        }

        if (req.url && req.url.startsWith('/assets/aistudio/')) {
          const rawPath = req.url.split('?')[0].split('#')[0];
          try {
            const decodedPath = decodeURIComponent(rawPath);
            const relativePath = decodedPath.replace(/^\//, '');
            const aistudioDir = path.resolve(
              __dirname,
              'public',
              'assets',
              'aistudio',
            );
            const filePath = path.resolve(__dirname, 'public', relativePath);
            if (
              filePath.startsWith(aistudioDir + path.sep) &&
              fs.existsSync(filePath) &&
              fs.statSync(filePath).isFile()
            ) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.bmp': 'image/bmp',
                '.ico': 'image/x-icon',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.ogv': 'video/ogg',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.ogg': 'audio/ogg',
                '.pdf': 'application/pdf',
              };
              res.setHeader(
                'Content-Type',
                mimeMap[ext] || 'application/octet-stream',
              );
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            // Fall through if URI decoding or file access fails
          }
        }
        next();
      });
    },
  };
}
// LINT.ThenChange(//depot/google3/java/com/google/alkali/boq/makersuite/applet_dev_service/templates/initializers/react_theme/vite.config.ts:aistudio_media_plugin)

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aistudioMediaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
