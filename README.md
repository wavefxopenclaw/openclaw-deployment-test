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

## Use the deployed Vercel app with real data

Yes — but the deployed frontend needs a reachable API endpoint. Vercel cannot directly read your local OpenClaw CLI or transcript files.

### Recommended setup

1. Run the local API on your machine:

```bash
npm run dev:api
```

2. Expose that API securely with a tunnel or reverse proxy, for example:
- Cloudflare Tunnel
- Tailscale Funnel
- ngrok
- your own HTTPS reverse proxy

3. Set the frontend's API base URL in Vercel:

- Environment variable: `VITE_API_BASE_URL`
- Example value: `https://your-openclaw-api.example.com`

4. Allow the Vercel origin on the API server:

- Environment variable: `ALLOWED_ORIGINS`
- Example: `https://openclaw-deployment-test.vercel.app`

### Example local API startup with allowed Vercel origin

PowerShell:

```powershell
$env:ALLOWED_ORIGINS="https://openclaw-deployment-test.vercel.app"
npm run dev:api
```

### What this gives you

- Vercel-hosted frontend
- real OpenClaw data fetched from your machine
- no hardcoded mock dashboard state

### Important caveat

The backend still runs where OpenClaw runs. Vercel is hosting the UI, not your local OpenClaw runtime.

## Build front end

```bash
npm run build
```

## Companion startup with the gateway

The local gateway launcher now also triggers a companion bootstrap script before the gateway process starts.

Files:

- `scripts/start-openclaw-companions.ps1`
- `scripts/start-mission-control-api.ps1`
- `scripts/start-cloudflare-tunnel.ps1`

Current behavior:

- when the gateway launcher runs, it starts the Mission Control API automatically if port `8787` is not already listening
- it also attempts to start Cloudflare **only if** a named tunnel config exists at `C:\Users\dev\.cloudflared\config.yml`
- if you are still using a quick tunnel (`cloudflared tunnel --url http://localhost:8787`), auto-start is intentionally skipped so the Vercel API URL does not silently rotate and break the dashboard

### Important tunnel note

Your current public API URL is using a quick tunnel style flow. That is not stable enough for hands-off restart automation because the URL can change.

To fully automate gateway + API + Cloudflare together, switch to a **named Cloudflare tunnel** with a fixed hostname. Once `config.yml` exists, the gateway bootstrap script will automatically launch it.

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
