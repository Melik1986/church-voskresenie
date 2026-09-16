import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();
export const STATE_DIR = join(ROOT, '.cursor/hooks/state');
export const AUDIT_PATH = join(STATE_DIR, 'audit.jsonl');
export const FINDINGS_PATH = join(STATE_DIR, 'findings.json');

/** @returns {Promise<Record<string, unknown>>} */
export async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

/** @param {unknown} value */
export function writeOutput(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

export function ensureStateDir() {
  mkdirSync(STATE_DIR, { recursive: true });
}

/** @param {Record<string, unknown>} entry */
export function appendAudit(entry) {
  ensureStateDir();
  appendFileSync(AUDIT_PATH, `${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`);
}

/** @returns {string[]} */
export function readFindings() {
  try {
    return JSON.parse(readFileSync(FINDINGS_PATH, 'utf8'));
  } catch {
    return [];
  }
}

/** @param {string} message */
export function addFinding(message) {
  ensureStateDir();
  const next = [...new Set([...readFindings(), message])];
  writeFileSync(FINDINGS_PATH, JSON.stringify(next, null, 2));
}

export function clearFindings() {
  ensureStateDir();
  writeFileSync(FINDINGS_PATH, '[]\n');
}

/** High-confidence material — block reads / flag edits. */
const HIGH_SECRET_PATTERNS = [
  { id: 'aws-key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'private-key', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { id: 'github-pat', re: /\bghp_[A-Za-z0-9]{36,}\b/ },
  { id: 'github-fine', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { id: 'vercel-claim', re: /\bvcn_[A-Za-z0-9]{20,}\b/ },
  { id: 'stripe-live', re: /\bsk_live_[A-Za-z0-9]{16,}\b/ },
];

/** Softer signals — edit findings only (avoid blocking docs/hooks source). */
const SOFT_SECRET_PATTERNS = [
  { id: 'openai-key', re: /\bsk-[a-zA-Z0-9]{32,}\b/ },
  { id: 'assigned-secret', re: /(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{12,}['"]/i },
];

/** @param {string} text @param {'high' | 'all'} [level] */
export function findSecretHits(text, level = 'all') {
  if (!text) return [];
  const list = level === 'high' ? HIGH_SECRET_PATTERNS : [...HIGH_SECRET_PATTERNS, ...SOFT_SECRET_PATTERNS];
  return list.filter((p) => p.re.test(text)).map((p) => p.id);
}

const SENSITIVE_PATH =
  /(?:^|[/\\])(?:\.env(?:\..+)?|\.vercel(?:[/\\].*)?|.*\.(?:pem|p12|pfx|key)|id_rsa|id_ed25519|credentials\.json|secrets?\.(?:json|ya?ml|toml))$/i;

/** @param {string} filePath */
export function isSensitivePath(filePath) {
  return SENSITIVE_PATH.test(filePath.replaceAll('\\', '/'));
}

/** @param {string} command */
export function shellRisk(command) {
  const c = command.trim();
  if (/(?:^|[;&|]\s*)(?:printenv|env)\b/.test(c) && /token|secret|password|key/i.test(c)) {
    return 'env-dump';
  }
  if (/\b(?:cat|type|Get-Content)\b[^\n]*\.(?:env|pem|key)\b/i.test(c)) return 'read-secret-file';
  if (/\becho\b[^\n]*\$(?:\{)?(?:VERCEL_TOKEN|AWS_|GITHUB_TOKEN|OPENAI_API_KEY)/i.test(c)) {
    return 'echo-secret';
  }
  if (/\b(?:curl|wget)\b[^\n]*(?:Authorization:|Bearer\s+\$)/i.test(c)) return 'auth-header';
  if (/\bgit\s+push\b[^\n]*--force(?:-with-lease)?\b/i.test(c) && /\bmain\b|\bmaster\b/.test(c)) {
    return 'force-push-main';
  }
  return null;
}

export function opMountOk() {
  if (process.env.CURSOR_REQUIRE_OP_MOUNT !== '1') return true;
  const mount = process.env.OP_ENV_MOUNT || process.env.OP_SESSION;
  return Boolean(mount);
}

export { dirname };
