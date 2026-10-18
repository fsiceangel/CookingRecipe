import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, sep } from 'node:path';
import { generateCatalog, readCatalog, projectRoot } from './scripts/content';

function recipeContent(includePrivate: boolean): Plugin {
  return {
    name: 'recipe-content',
    async buildStart() { await generateCatalog(); },
    configureServer(server) {
      // Private content is served from memory on loopback only, never written to public/.
      if (includePrivate) server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split('?')[0];
        if (pathname !== '/data/catalog.json' && pathname !== `${server.config.base}data/catalog.json`) return next();
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress ?? '')) {
          response.statusCode = 403;
          response.end('Local access only');
          return;
        }
        try {
          const catalog = await readCatalog(projectRoot, { includePrivate: true });
          response.setHeader('Content-Type', 'application/json');
          response.setHeader('Cache-Control', 'no-store');
          response.end(JSON.stringify(catalog));
        } catch (error) { next(error); }
      });
      const contentRoot = resolve(server.config.root, 'content');
      server.watcher.add(contentRoot);
      let pending: ReturnType<typeof setTimeout>;
      server.watcher.on('all', (_event, file) => {
        if (!resolve(file).startsWith(contentRoot + sep)) return;
        clearTimeout(pending);
        pending = setTimeout(() => {
          void generateCatalog().then(() => server.ws.send({ type: 'full-reload' })).catch(error => {
            server.config.logger.error(String(error));
            server.ws.send({ type: 'error', err: { message: String(error), stack: '', plugin: 'recipe-content' } });
          });
        }, 100);
      });
      server.httpServer?.once('close', () => clearTimeout(pending));
    },
  };
}

export default defineConfig(({ command, mode }) => ({
  base: '/',
  plugins: [recipeContent(command === 'serve' && mode === 'private'), react()],
  server: { host: '127.0.0.1', fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/content/private/**'] } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules[/\\](react|react-dom|scheduler)[/\\]/.test(id)) return 'react';
          if (id.includes('/@mui/') || id.includes('/@emotion/')) return 'material';
        },
      },
    },
  },
}));
