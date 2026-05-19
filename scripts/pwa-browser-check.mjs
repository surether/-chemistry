import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const targetUrl = process.argv[2] ?? 'http://127.0.0.1:4173/-chemistry/';
const chromeCandidates = [
  process.env.CHROME_BIN,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);

const chromePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));

if (!chromePath) {
  throw new Error('Chrome or Edge executable was not found for browser validation.');
}

if (typeof WebSocket === 'undefined') {
  throw new Error('This Node runtime does not expose WebSocket for DevTools validation.');
}

const remotePort = 9222 + Math.floor(Math.random() * 1000);
const userDataDir = path.join(os.tmpdir(), `chemistry-dragon-pwa-${Date.now()}`);
const browser = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1366,768',
  '--force-device-scale-factor=1',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-background-networking',
  `--user-data-dir=${userDataDir}`,
  `--remote-debugging-port=${remotePort}`,
  targetUrl
]);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, attempts = 40) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      lastError = error;
    }

    await delay(250);
  }

  throw lastError ?? new Error(`Unable to fetch ${url}`);
}

function connectDevtools(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const issues = [];

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
      return;
    }

    if (message.method === 'Runtime.exceptionThrown') {
      issues.push(message.params.exceptionDetails?.text ?? 'Runtime exception');
    }

    if (message.method === 'Log.entryAdded' && ['error', 'violation'].includes(message.params.entry.level)) {
      issues.push(message.params.entry.text);
    }
  });

  const opened = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  const send = async (method, params = {}) => {
    await opened;
    const id = nextId;
    nextId += 1;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
  };

  const close = () => socket.close();

  return { send, issues, close };
}

async function main() {
  const pages = await fetchJson(`http://127.0.0.1:${remotePort}/json/list`);
  const page = pages.find((entry) => entry.type === 'page') ?? pages[0];
  const client = connectDevtools(page.webSocketDebuggerUrl);

  try {
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Log.enable');
    await client.send('Page.navigate', { url: targetUrl });
    await delay(1000);

    async function evaluate(expression) {
      const result = await client.send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true
      });

      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text);
      }

      return result.result.value;
    }

    async function waitFor(predicateExpression, label, timeout = 8000) {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (await evaluate(predicateExpression)) {
          return;
        }
        await delay(200);
      }
      const snapshot = await evaluate(`JSON.stringify({
        href: location.href,
        title: document.title,
        body: document.body.innerText.slice(0, 500)
      })`);
      throw new Error(`Timed out waiting for ${label}: ${snapshot}`);
    }

    async function clickByText(text) {
      const clicked = await evaluate(`(() => {
        const button = [...document.querySelectorAll('button')].find((item) => item.textContent.includes(${JSON.stringify(text)}));
        if (!button) return false;
        button.click();
        return true;
      })()`);

      if (!clicked) {
        throw new Error(`Button not found: ${text}`);
      }
    }

    await waitFor("document.body.innerText.includes('케미술사: 드래곤의 분자식')", 'start screen');
    await clickByText('게임 시작');
    await waitFor("document.body.innerText.includes('게임 상세 설명')", 'guide screen');
    await clickByText('바로 게임 시작');
    await waitFor("document.body.innerText.includes('드래곤 체력')", 'game screen');
    await waitFor("document.body.innerText.includes('주문 카드')", 'spell cards');
    await waitFor("document.body.innerText.includes('선택한 주문')", 'selected spell panel');
    await waitFor("document.body.innerText.includes('분자식은 원자의 종류와 개수를 기호로 나타낸 것입니다.')", 'molecule analysis');

    const beforeDraw = await evaluate('document.body.innerText');
    await clickByText('큐브 뽑기');
    await waitFor(`document.body.innerText !== ${JSON.stringify(beforeDraw)}`, 'draw feedback');

    const title = await evaluate('document.title');
    const hasManifest = await evaluate("Boolean(document.querySelector('link[rel=\"manifest\"]'))");
    const hasServiceWorkerSupport = await evaluate("'serviceWorker' in navigator");

    if (client.issues.length > 0) {
      throw new Error(`Browser console issues: ${client.issues.join(' | ')}`);
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          title,
          hasManifest,
          hasServiceWorkerSupport,
          checked: ['start', 'guide', 'game', 'molecule-analysis', 'draw-cube']
        },
        null,
        2
      )
    );
  } finally {
    client.close();
  }
}

try {
  await main();
} finally {
  try {
    browser.kill();
    await Promise.race([
      new Promise((resolve) => browser.once('exit', resolve)),
      delay(1500)
    ]);
  } catch {
    // Browser cleanup should not hide the validation result.
  }

  try {
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
  } catch {
    // Chrome may keep a profile lock briefly after exit on Windows.
  }
}
