import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rendererFiles = collectFiles(path.join(root, 'src'), ['.ts', '.tsx']);

function collectFiles(dir, extensions) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath, extensions);
    }

    return extensions.includes(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of rendererFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  assert(!source.includes("from 'node:fs'"), `${relative} imports node:fs`);
  assert(!source.includes('from "node:fs"'), `${relative} imports node:fs`);
  assert(!source.includes("from 'node:path'"), `${relative} imports node:path`);
  assert(!source.includes('from "node:path"'), `${relative} imports node:path`);
  assert(!source.includes("from 'electron'"), `${relative} imports electron`);
  assert(!source.includes('from "electron"'), `${relative} imports electron`);
}

const executableAndConfigFiles = [
  ...collectFiles(path.join(root, 'src'), ['.ts', '.tsx', '.css']),
  ...collectFiles(path.join(root, 'electron'), ['.ts']),
  path.join(root, 'vite.config.ts'),
  path.join(root, 'vite.config.mjs'),
  path.join(root, 'package.json')
];

const allProjectText = executableAndConfigFiles
  .filter((file) => fs.existsSync(file))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');

assert(
  !/analytics|telemetry|trackingId|tracking-id|trackEvent|gtag|mixpanel|posthog|segment\.com/i.test(allProjectText),
  'Forbidden analytics/telemetry/tracking implementation pattern found'
);
assert(!/api[_-]?key\s*[:=]/i.test(allProjectText), 'Possible API key storage pattern found');

console.log('static-check ok');
