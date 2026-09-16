---
name: agent-hooks
description: Project Cursor hooks for security gates, secret scanning, and agent observability. Use when changing .cursor/hooks.json, hook scripts, lefthook vs Cursor hooks, or wiring Aikido/1Password/telemetry.
---

# Agent hooks (church-voskresenie)

## Layers

| Layer | Path | Role |
|---|---|---|
| Cursor hooks | `.cursor/hooks.json` + `.cursor/hooks/*.mjs` | Gate agent loop (cloud + local) |
| Git hooks | `lefthook.yml` | Human/CI pre-commit |
| Skills | `.cursor/skills/*` | Guidance only — not enforcement |

## Active hooks

- `beforeShellExecution` → `gate-shell.mjs` (`failClosed`): block env/token dumps, `.env` cats; ask on force-push main / Auth headers
- `beforeReadFile` / `beforeTabFileRead` → `gate-read.mjs` (`failClosed`): deny `.env*`, `*.pem`, key files; high-confidence secret material in content
- `afterFileEdit` / `afterTabFileEdit` → `scan-edit.mjs`: secret findings + optional `aikido-local-scanner`
- `afterShellExecution` → `audit-shell.mjs`: JSONL audit
- `stop` → `audit-stop.mjs`: optional `AGENT_TELEMETRY_URL` POST; follow-up if findings remain

## Env knobs

| Var | Effect |
|---|---|
| `AGENT_TELEMETRY_URL` | POST stop summaries (observability) |
| `CURSOR_REQUIRE_OP_MOUNT=1` | Deny risky shell unless `OP_ENV_MOUNT` or `OP_SESSION` set (1Password) |
| `CURSOR_SKIP_AIKIDO_HOOK=1` | Skip aikido CLI on edits |

## State (gitignored)

`.cursor/hooks/state/audit.jsonl`, `findings.json`

## Rules

- Cloud agents: command hooks only; no `sessionStart`/`MCP` hooks here on purpose.
- Do not put live secrets in hooks tests — use fake high-entropy placeholders carefully (patterns match real shapes).
- After changing hooks: chmod not required for `node …mjs`; keep scripts valid JSON-out on stdout.
