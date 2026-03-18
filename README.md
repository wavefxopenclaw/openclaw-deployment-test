# OpenClaw Mission Control

A polished mission-control style front end for observing and managing OpenClaw agents in real time.

## What changed

This is no longer just a mock dashboard.

A local API layer now exposes real OpenClaw data for:

- agent/session state
- transcript-derived recent logs
- session-derived tasks
- model/provider usage
- gateway + security status

The UI consumes that API instead of importing hardcoded dashboard data.

## Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Express
- OpenClaw CLI + local session transcript files

## Architecture

### Front end

- `src/App.jsx` — mission control shell and live dashboard
- `src/styles.css` — global styles and Tailwind entrypoint

### API layer

- `server/index.js` — Express API server
- `server/openclaw.js` — OpenClaw adapter that reads local CLI JSON + transcript files

## Data sources used

The API currently pulls from real local OpenClaw surfaces:

- `openclaw sessions --all-agents --json`
- `openclaw status --usage --json`
- `~/.openclaw/agents/*/sessions/*.jsonl`

That gives the dashboard access to:

- live sessions
- token usage totals
- model names / providers
- gateway reachability
- security findings
- recent transcript activity
- transcript-derived tool calls and outputs

## API endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/agents`
- `GET /api/agents/:id`
- `GET /api/tasks`
- `GET /api/model-usage`

## Run locally

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm run dev:api
```

In another terminal, start the UI:

```bash
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:8787`.

## Build front end

```bash
npm run build
```

## Notes on current behavior

The API uses real OpenClaw data, but some dashboard views are still derived rather than first-class runtime primitives:

- task status is inferred from recent session/transcript activity
- cost is estimated locally from token totals
- file changes are not yet fully parsed from tool-call arguments
- override controls are still UI-only

## Good next steps

To make this a fuller production control plane, wire in:

- direct OpenClaw session/event streaming over WebSocket or SSE
- explicit task queue telemetry
- tool-call schemas with structured file diff extraction
- operator actions mapped to pause/resume/cancel/retry endpoints
- GitHub and Vercel event adapters
- durable metrics storage for trend charts over time
