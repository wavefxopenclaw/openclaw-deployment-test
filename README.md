# OpenClaw Mission Control

A polished front-end prototype for observing and managing OpenClaw agents in real time.

## What this is

This app is designed as a mission-control style AI operations console with:

- fleet-level agent visibility
- live activity feed
- alerts and incidents panel
- task timeline / execution trace
- cost and usage observability
- human override controls
- agent drill-down with logs, tool calls, files, outputs, and errors

Right now it runs on mock data, but the code is organized so real OpenClaw telemetry can be wired in later.

## Stack

- React
- Vite
- Tailwind CSS
- Recharts
- lucide-react

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Build

```bash
npm run build
npm run preview
```

## Architecture

- `src/App.jsx` — main mission control shell and dashboard layout
- `src/data.js` — mock telemetry and sample agent/task data
- `src/styles.css` — global styles and Tailwind entrypoint
- `tailwind.config.js` — theme tokens for mission-control styling

## Where to connect real data later

The mock data in `src/data.js` can be replaced with adapters for:

- OpenClaw agent/session state
- task queue and execution traces
- tool-call logs
- file mutation events
- model/provider usage and spend metrics
- GitHub activity and workflow events
- Vercel deploy events
- alerting / policy violations / unsafe action signals

A clean next step would be to split the app into these data layers:

- `adapters/openclaw.js` for agent/task/session data
- `adapters/github.js` for repo + workflow telemetry
- `adapters/vercel.js` for deploy/build events
- `adapters/usage.js` for cost/token aggregation

## Suggested real-time wiring approach

For a production version, expose a backend or event gateway that streams updates over:

- WebSocket or Server-Sent Events for live agent activity
- REST endpoints for historical queries and drill-down panels
- periodic snapshots for cost/reliability metrics

## Product intent

This UI is built around five ideas:

1. centralized control plane
2. real-time observability
3. guardrails and alerting
4. human oversight and intervention
5. operational trust at fleet scale
