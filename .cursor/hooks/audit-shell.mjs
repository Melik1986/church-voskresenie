#!/usr/bin/env node
import { appendAudit, readInput, writeOutput } from './lib.mjs';

const input = await readInput();
appendAudit({
  hook: 'afterShellExecution',
  command: input.command,
  duration: input.duration,
  sandbox: input.sandbox,
  output_bytes: String(input.output ?? '').length,
});
writeOutput({});
