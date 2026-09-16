#!/usr/bin/env node
import {
  appendAudit,
  clearFindings,
  readFindings,
  readInput,
  writeOutput,
} from './lib.mjs';

const input = await readInput();
const status = String(input.status ?? 'completed');
const findings = readFindings();

appendAudit({
  hook: 'stop',
  status,
  conversation_id: input.conversation_id,
  findings,
});

await postTelemetry(input, findings);

/** @type {{ followup_message?: string }} */
const out = {};
if (status === 'completed' && findings.length > 0 && Number(input.loop_count ?? 0) < 2) {
  out.followup_message =
    `Security findings from hooks:\n- ${findings.join('\n- ')}\n` +
    'Remove secrets from the working tree, rotate if needed, then continue.';
  clearFindings();
}

writeOutput(out);

/**
 * @param {Record<string, unknown>} payload
 * @param {string[]} findings
 */
async function postTelemetry(payload, findings) {
  const url = process.env.AGENT_TELEMETRY_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        source: 'church-voskresenie-cursor-hooks',
        conversation_id: payload.conversation_id,
        generation_id: payload.generation_id,
        model: payload.model,
        status: payload.status,
        findings,
        ts: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Observability must not break the agent loop.
  }
}
