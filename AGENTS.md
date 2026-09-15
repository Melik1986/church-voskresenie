<!-- intent-skills:start -->
# TanStack Intent - before editing files, run the matching guidance command.
tanstackIntent:
  - id: "get-tsconfig#get-tsconfig"
    run: "npx @tanstack/intent@latest load get-tsconfig#get-tsconfig"
    for: "Find, parse, and query tsconfig.json files — extends resolution, file matching, path alias resolution. Use when reading tsconfig.json, checking if a file belongs to a tsconfig, resolving TypeScript path aliases, or working with tsconfig extends chains."
<!-- intent-skills:end -->

# Agent guidance

- Cursor project rules: `.cursor/rules/`
- Cursor project skills: `.cursor/skills/`
- Astro docs: **Astro Docs MCP** (`.cursor/mcp.json` → `https://mcp.docs.astro.build/mcp`)
- Other stack (Tailwind / GSAP / Lenis / TS / ESLint): Context7 MCP
- Only Intent skill from deps: `get-tsconfig`
- Do not invent church copy, design tokens, or Impressum content
