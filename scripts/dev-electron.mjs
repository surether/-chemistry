import { spawn } from 'node:child_process';
import http from 'node:http';
import process from 'node:process';
import path from 'node:path';

const cli = (...segments) => path.join(process.cwd(), 'node_modules', ...segments);
const nodeCli = (scriptPath, args) => [process.execPath, [scriptPath, ...args]];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', windowsHide: false, ...options });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function waitForServer(url, retries = 80) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on('error', () => {
        if (remaining <= 0) {
          reject(new Error(`Vite server did not start: ${url}`));
          return;
        }
        setTimeout(() => attempt(remaining - 1), 250);
      });
    };

    attempt(retries);
  });
}

const [tscCommand, tscArgs] = nodeCli(cli('typescript', 'bin', 'tsc'), ['-p', 'electron/tsconfig.json']);
await run(tscCommand, tscArgs);

const [viteCommand, viteArgs] = nodeCli(cli('vite', 'bin', 'vite.js'), [
  '--config',
  'vite.config.mjs',
  '--host',
  '127.0.0.1',
  '--port',
  '5173'
]);
const vite = spawn(viteCommand, viteArgs, { stdio: 'inherit', windowsHide: false });

process.on('exit', () => vite.kill());
process.on('SIGINT', () => {
  vite.kill();
  process.exit(130);
});

await waitForServer('http://127.0.0.1:5173');

const [electronCommand, electronArgs] = nodeCli(cli('electron', 'cli.js'), ['.']);
const electron = spawn(electronCommand, electronArgs, {
  stdio: 'inherit',
  windowsHide: false,
  env: {
    ...process.env,
    VITE_DEV_SERVER_URL: 'http://127.0.0.1:5173'
  }
});

electron.on('exit', (code) => {
  vite.kill();
  process.exit(code ?? 0);
});
