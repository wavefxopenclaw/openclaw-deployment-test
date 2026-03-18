export const summary = [
  { label: 'Active agents', value: 12, delta: '+3 vs last hour', tone: 'cyan' },
  { label: 'Queued tasks', value: 27, delta: '4 high-priority', tone: 'warning' },
  { label: 'Completed tasks', value: 184, delta: '96.8% success', tone: 'success' },
  { label: 'Failed tasks', value: 6, delta: '2 require review', tone: 'danger' },
  { label: 'Est. token / cost', value: '1.82M / $43.17', delta: 'Today across fleet', tone: 'accent' },
  { label: 'Alerts / incidents', value: 5, delta: '1 critical, 2 warnings', tone: 'danger' },
];

export const agents = [
  {
    id: 'agt-001',
    name: 'Deploy Shepherd',
    role: 'Release orchestration',
    objective: 'Ship the latest customer-facing web surfaces safely.',
    task: 'Validating Vercel production deploy for mission-control-ui',
    status: 'running',
    model: 'gpt-5.4',
    heartbeat: '12s ago',
    tokens: '184k',
    cost: '$6.42',
    logs: ['Fetched build metadata', 'Ran smoke tests', 'Waiting for production healthcheck'],
    tools: ['vercel deploy', 'git push', 'web_fetch'],
    files: ['src/App.jsx', 'README.md', 'vercel.json'],
    outputs: ['Preview URL', 'Deployment report', 'Smoke test summary'],
    errors: ['Transient timeout on first deploy attempt'],
  },
  {
    id: 'agt-002',
    name: 'Repo Sentinel',
    role: 'GitHub and CI observability',
    objective: 'Track repo state, PR drift, and workflow health.',
    task: 'Correlating failed checks across 3 repositories',
    status: 'blocked',
    model: 'claude-sonnet',
    heartbeat: '48s ago',
    tokens: '96k',
    cost: '$3.11',
    logs: ['Loaded GitHub workflow runs', 'Diffed failing steps', 'Awaiting maintainer instruction'],
    tools: ['github api', 'exec', 'memory_search'],
    files: ['.github/workflows/deploy.yml'],
    outputs: ['Failure cluster summary', 'Suggested remediation plan'],
    errors: ['Missing repository secret: VERCEL_TOKEN'],
  },
  {
    id: 'agt-003',
    name: 'Fleet Analyst',
    role: 'Cost and reliability analytics',
    objective: 'Surface spend anomalies and degraded success rates.',
    task: 'Computing model-level spend attribution for last 24h',
    status: 'running',
    model: 'o3-mini',
    heartbeat: '5s ago',
    tokens: '220k',
    cost: '$4.88',
    logs: ['Rolled up telemetry by provider', 'Calculated failure outliers', 'Prepared alert candidates'],
    tools: ['sheets', 'web_fetch', 'read'],
    files: ['data/telemetry.json'],
    outputs: ['Cost heatmap', 'Success-rate regression notes'],
    errors: [],
  },
  {
    id: 'agt-004',
    name: 'Support Triage',
    role: 'Human escalation support',
    objective: 'Classify incoming incidents and draft safe responses.',
    task: 'Waiting for approval on risky automation request',
    status: 'waiting',
    model: 'gpt-4.1-mini',
    heartbeat: '2m ago',
    tokens: '44k',
    cost: '$0.92',
    logs: ['Classified issue severity: medium', 'Flagged action for human review'],
    tools: ['memory_search', 'sessions_send'],
    files: ['memory/2026-03-18.md'],
    outputs: ['Escalation draft'],
    errors: [],
  },
];

export const feed = [
  { time: '14:56:12', agent: 'Deploy Shepherd', event: 'Production smoke test entered canary verification.', tone: 'cyan' },
  { time: '14:55:47', agent: 'Repo Sentinel', event: 'Detected repeated retries on workflow deploy-web.yml.', tone: 'warning' },
  { time: '14:55:02', agent: 'Fleet Analyst', event: 'Spend anomaly raised for gpt-5.4 tasks in the last hour.', tone: 'danger' },
  { time: '14:54:18', agent: 'Support Triage', event: 'Paused outbound response pending human sign-off.', tone: 'muted' },
  { time: '14:53:41', agent: 'OpenClaw Gateway', event: 'Heartbeat scheduler healthy across all sessions.', tone: 'success' },
];

export const alerts = [
  { severity: 'critical', title: 'High spend spike', detail: 'Token burn +38% on deploy-related tasks over 30m.', owner: 'Fleet Analyst' },
  { severity: 'warning', title: 'Stuck workflow', detail: 'Repo Sentinel blocked on missing secret for 14m.', owner: 'Repo Sentinel' },
  { severity: 'warning', title: 'Retry storm', detail: 'Deploy Shepherd retried smoke tests 3 times.', owner: 'Deploy Shepherd' },
  { severity: 'info', title: 'Manual approval requested', detail: 'Support Triage is awaiting operator review.', owner: 'Support Triage' },
];

export const timeline = [
  { step: 'Task queued', owner: 'Operator', status: 'done', time: '14:31' },
  { step: 'Planner assigned agent', owner: 'Mission router', status: 'done', time: '14:32' },
  { step: 'Code change generated', owner: 'Deploy Shepherd', status: 'done', time: '14:37' },
  { step: 'Validation + tests', owner: 'Repo Sentinel', status: 'active', time: '14:42' },
  { step: 'Human approval window', owner: 'Operator', status: 'pending', time: '14:48' },
  { step: 'Production deployment', owner: 'Deploy Shepherd', status: 'pending', time: '14:52' },
];

export const usage = [
  { name: 'Deploy Shepherd', cost: 6.42, tokens: 184 },
  { name: 'Repo Sentinel', cost: 3.11, tokens: 96 },
  { name: 'Fleet Analyst', cost: 4.88, tokens: 220 },
  { name: 'Support Triage', cost: 0.92, tokens: 44 },
];

export const modelUsage = [
  { model: 'gpt-5.4', tasks: 62, cost: 18.9 },
  { model: 'claude-sonnet', tasks: 21, cost: 7.2 },
  { model: 'o3-mini', tasks: 38, cost: 9.5 },
  { model: 'gpt-4.1-mini', tasks: 54, cost: 4.1 },
];

export const reliability = [
  { label: 'Success rate', value: '96.8%' },
  { label: 'Avg. completion', value: '6m 14s' },
  { label: 'Failure rate', value: '3.2%' },
  { label: 'Alerts / 24h', value: '17' },
];
