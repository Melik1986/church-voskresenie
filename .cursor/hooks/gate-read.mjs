#!/usr/bin/env node
import { appendAudit, findSecretHits, isSensitivePath, readInput, writeOutput } from './lib.mjs';

const input = await readInput();
const filePath = String(input.file_path ?? '');
const content = String(input.content ?? '');
const pathHit = isSensitivePath(filePath);
const contentHits = findSecretHits(content, 'high');
const skipContent = /[/\\]\.cursor[/\\]hooks[/\\]/.test(filePath);

appendAudit({
  hook: 'beforeReadFile',
  file_path: filePath,
  pathHit,
  contentHits,
});

if (pathHit) {
  writeOutput({
    permission: 'deny',
    user_message: `Blocked read of sensitive path: ${filePath}`,
  });
  process.exit(0);
}

if (!skipContent && contentHits.length > 0) {
  writeOutput({
    permission: 'deny',
    user_message: `Blocked read: secret patterns (${contentHits.join(', ')}) in ${filePath}`,
  });
  process.exit(0);
}

writeOutput({ permission: 'allow' });
