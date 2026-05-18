import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const allowedDataFiles = new Set([
  'schedule.json',
  'meal.json',
  'calendar.json',
  'dday.json',
  'progress.json',
  'tasks.json',
  'links.json',
  'memo.json',
  'settings.json'
]);

function localDataDevServer() {
  return {
    name: 'local-data-dev-server',
    configureServer(server) {
      server.middlewares.use('/local-data', (req, res, next) => {
        const fileName = decodeURIComponent((req.url ?? '').replace(/^\/+/, ''));

        if (!allowedDataFiles.has(fileName)) {
          next();
          return;
        }

        const filePath = path.join(process.cwd(), 'local-data', fileName);
        fs.readFile(filePath, 'utf8', (error, content) => {
          if (error) {
            res.statusCode = 404;
            res.end('Not found');
            return;
          }

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(content);
        });
      });
    }
  };
}

export default defineConfig({
  base: '/-chemistry/',
  plugins: [react(), localDataDevServer()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
