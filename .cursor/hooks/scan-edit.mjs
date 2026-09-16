#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { addFinding, appendAudit, findSecretHits, readInput, writeOutput } from './lib.mjs';

const input = await readInput();
const filePath = String(input.file_path ?? '');
const edits = Array.isArray(input.edits) ? input.edits : [];
const blobs = edits.map((e) => String(e?.new_string ?? e?.new_line ?? '')).join('\n');
const hits = findSecretHits(blobs);

appendAudit({ hook: 'afterFileEdit', file_path: filePath, hits });

if (hits.length > 0) {
  addFinding(`Secret patterns in ${filePath}: ${hits.join(', ')}`);
}

runAikido(filePath);
writeOutput({});

/** @param {string} path */
function runAikido(path) {
  if (!path || process.env.CURSOR_SKIP_AIKIDO_HOOK === '1') return;
  const bin = spawnSync('sh', ['-c', 'command -v aikido-local-scanner'], { encoding: 'utf8' });
  if (bin.status !== 0) return;
  spawnSync('aikido-local-scanner', ['scan', path], {
    encoding: 'utf8',
    timeout: 45_000,
  });
}
