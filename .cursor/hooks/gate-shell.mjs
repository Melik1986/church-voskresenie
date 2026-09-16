#!/usr/bin/env node
import { appendAudit, opMountOk, readInput, shellRisk, writeOutput } from './lib.mjs';

const input = await readInput();
const command = String(input.command ?? '');
const risk = shellRisk(command);

appendAudit({ hook: 'beforeShellExecution', command, risk });

if (!opMountOk() && risk) {
  writeOutput({
    permission: 'deny',
    user_message: 'Shell blocked: set OP_ENV_MOUNT / OP_SESSION (1Password) or unset CURSOR_REQUIRE_OP_MOUNT.',
    agent_message:
      'CURSOR_REQUIRE_OP_MOUNT=1 is set but 1Password env mount is missing. Mount secrets via 1Password Environments, then retry.',
  });
  process.exit(0);
}

if (risk === 'env-dump' || risk === 'read-secret-file' || risk === 'echo-secret') {
  writeOutput({
    permission: 'deny',
    user_message: `Blocked secret-exposing shell (${risk}).`,
    agent_message: `Denied command due to secret risk (${risk}). Use a secrets manager; do not print tokens/.env/keys.`,
  });
  process.exit(0);
}

if (risk === 'force-push-main') {
  writeOutput({
    permission: 'ask',
    user_message: 'Force-push to main/master requires confirmation.',
    agent_message: 'Force-push to main/master needs explicit user approval.',
  });
  process.exit(0);
}

if (risk === 'auth-header') {
  writeOutput({
    permission: 'ask',
    user_message: 'Command sends Authorization header — confirm no live secrets.',
    agent_message: 'Authorization header detected. Prefer token from env/secret manager, never hardcode.',
  });
  process.exit(0);
}

writeOutput({ permission: 'allow' });
