import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const OPENCLAW_BIN = process.platform === 'win32' ? 'openclaw' : 'openclaw';
const HOME = os.homedir();
const AGENTS_ROOT = path.join(HOME, '.openclaw', 'agents');

async function runOpenClaw(args) {
  const command = `${OPENCLAW_BIN} ${args.join(' ')}`;
  const { stdout } = await execAsync(command, {
    windowsHide: true,
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

function ago(ms) {
  if (ms == null) return 'unknown';
  if (ms < 60_000) return `${Math.max(1, Math.round(ms / 1000))}s ago`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}h ago`;
  return `${Math.round(ms / 86_400_000)}d ago`;
}

function safeNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function classifyStatus(session) {
  if (session.abortedLastRun) return 'failed';
  if (session.ageMs != null && session.ageMs < 120_000) return 'running';
  if (session.ageMs != null && session.ageMs < 900_000) return 'waiting';
  return 'idle';
}

function extractTextContent(content = []) {
  return content
    .filter((item) => item?.type === 'text' || item?.type === 'thinking')
    .map((item) => item.text || item.thinking || '')
    .join('\n')
    .trim();
}

async function readTranscript(session) {
  const transcriptPath = path.join(AGENTS_ROOT, session.agentId, 'sessions', `${session.sessionId}.jsonl`);
  const raw = await fs.readFile(transcriptPath, 'utf8');
  const events = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return { transcriptPath, events };
}

function buildCurrentTask(events) {
  const latestUser = [...events].reverse().find((event) => event.type === 'message' && event.message?.role === 'user');
  if (!latestUser) return 'No active task';
  const text = extractTextContent(latestUser.message.content);
  return text.split('\n').find(Boolean)?.slice(0, 140) || 'User task received';
}

function buildObjective(events) {
  const latestAssistant = [...events].reverse().find((event) => event.type === 'message' && event.message?.role === 'assistant');
  const text = latestAssistant ? extractTextContent(latestAssistant.message.content) : '';
  return text.split('\n').find(Boolean)?.slice(0, 180) || 'OpenClaw session activity';
}

function buildLogs(events, limit = 8) {
  return events
    .filter((event) => event.type === 'message')
    .slice(-limit)
    .map((event) => {
      const role = event.message?.role ?? event.type;
      const text = extractTextContent(event.message?.content || []);
      return `${role}: ${(text || '[tool/result event]').slice(0, 180)}`;
    });
}

function buildToolCalls(events, limit = 10) {
  const calls = [];
  for (const event of events) {
    if (event.type !== 'message' || !Array.isArray(event.message?.content)) continue;
    for (const item of event.message.content) {
      if (item?.type === 'toolCall') calls.push(item.name);
    }
  }
  return [...new Set(calls)].slice(-limit);
}

function buildOutputs(events, limit = 6) {
  return events
    .filter((event) => event.type === 'message' && event.message?.role === 'toolResult')
    .slice(-limit)
    .map((event) => extractTextContent(event.message?.content || []).slice(0, 160) || '[tool result]');
}

function buildErrors(events, limit = 6) {
  return events
    .filter((event) => event.type === 'message' && event.message?.role === 'toolResult' && event.message?.isError)
    .slice(-limit)
    .map((event) => extractTextContent(event.message?.content || []).slice(0, 200));
}

function buildActivity(agents) {
  return agents
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 12)
    .map((agent) => ({
      time: new Date(agent.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: agent.name,
      event: agent.currentTask,
      tone: agent.status === 'failed' ? 'danger' : agent.status === 'running' ? 'cyan' : agent.status === 'waiting' ? 'accent' : 'muted',
    }));
}

function buildModelUsage(sessions, providerUsage) {
  const byModel = new Map();
  for (const session of sessions) {
    const entry = byModel.get(session.model) || { model: session.model, tasks: 0, cost: 0, tokens: 0 };
    entry.tasks += 1;
    entry.tokens += safeNumber(session.totalTokens);
    byModel.set(session.model, entry);
  }

  const windows = providerUsage?.providers?.flatMap((provider) =>
    (provider.windows || []).map((window) => ({
      model: `${provider.displayName} ${window.label}`,
      tasks: 0,
      cost: window.usedPercent,
      tokens: 0,
    }))
  ) || [];

  return [...byModel.values()].map((item) => ({
    ...item,
    cost: Number((item.tokens / 100000).toFixed(2)),
  })).concat(windows);
}

function buildTasks(agents) {
  return agents.map((agent) => ({
    id: agent.id,
    agentName: agent.name,
    title: agent.currentTask,
    status: agent.status,
    updatedAt: agent.updatedAt,
    model: agent.model,
  }));
}

export async function getOpenClawSnapshot() {
  const [sessionsPayload, statusPayload] = await Promise.all([
    runOpenClaw(['sessions', '--all-agents', '--json']),
    runOpenClaw(['status', '--usage', '--json']),
  ]);

  const sessions = sessionsPayload.sessions || [];
  const agents = [];

  for (const session of sessions) {
    let transcript = { transcriptPath: null, events: [] };
    try {
      transcript = await readTranscript(session);
    } catch {
      transcript = { transcriptPath: null, events: [] };
    }

    const status = classifyStatus(session);
    const currentTask = buildCurrentTask(transcript.events);
    const objective = buildObjective(transcript.events);

    agents.push({
      id: session.sessionId,
      key: session.key,
      name: session.key,
      role: `${session.kind} session`,
      objective,
      currentTask,
      status,
      model: session.model || 'unknown',
      modelProvider: session.modelProvider || 'unknown',
      lastHeartbeat: ago(session.ageMs),
      heartbeatMs: session.ageMs ?? null,
      tokenUsage: safeNumber(session.totalTokens),
      estimatedCost: Number((safeNumber(session.totalTokens) / 100000).toFixed(2)),
      updatedAt: session.updatedAt,
      transcriptPath: transcript.transcriptPath,
      recentLogs: buildLogs(transcript.events),
      toolCalls: buildToolCalls(transcript.events),
      fileChanges: [],
      outputs: buildOutputs(transcript.events),
      errors: buildErrors(transcript.events),
    });
  }

  const active = agents.filter((agent) => agent.status === 'running').length;
  const failed = agents.filter((agent) => agent.status === 'failed').length;
  const waiting = agents.filter((agent) => agent.status === 'waiting').length;
  const totalTokens = agents.reduce((sum, agent) => sum + agent.tokenUsage, 0);
  const estimatedCost = agents.reduce((sum, agent) => sum + agent.estimatedCost, 0);
  const taskList = buildTasks(agents);

  const alerts = [
    ...(failed > 0 ? [{ severity: 'critical', title: 'Failed sessions detected', detail: `${failed} session(s) show aborted or failed state.`, owner: 'OpenClaw runtime' }] : []),
    ...(waiting > 0 ? [{ severity: 'warning', title: 'Waiting sessions', detail: `${waiting} session(s) appear idle or awaiting input.`, owner: 'Mission Control' }] : []),
    ...(statusPayload.securityAudit?.findings || []).slice(0, 4).map((finding) => ({
      severity: finding.severity === 'warn' ? 'warning' : finding.severity,
      title: finding.title,
      detail: finding.detail,
      owner: 'Security audit',
    })),
  ];

  const timeline = taskList
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 8)
    .map((task, index) => ({
      step: task.title,
      owner: task.agentName,
      status: index === 0 && task.status === 'running' ? 'active' : task.status === 'failed' ? 'pending' : 'done',
      time: new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

  return {
    generatedAt: new Date().toISOString(),
    status: {
      gateway: statusPayload.gateway,
      usage: statusPayload.usage,
      securityAudit: statusPayload.securityAudit,
      agentsMeta: statusPayload.agents,
    },
    summary: [
      { label: 'Active agents', value: active, delta: `${agents.length} total sessions`, tone: 'cyan' },
      { label: 'Queued tasks', value: waiting, delta: 'Derived from waiting sessions', tone: 'warning' },
      { label: 'Completed tasks', value: Math.max(taskList.length - failed, 0), delta: 'Session-derived tasks', tone: 'success' },
      { label: 'Failed tasks', value: failed, delta: failed ? 'Needs operator review' : 'No failures detected', tone: failed ? 'danger' : 'success' },
      { label: 'Est. token / cost', value: `${totalTokens.toLocaleString()} / $${estimatedCost.toFixed(2)}`, delta: 'Local session-derived estimate', tone: 'accent' },
      { label: 'Alerts / incidents', value: alerts.length, delta: 'Security + runtime findings', tone: alerts.some((a) => a.severity === 'critical') ? 'danger' : 'warning' },
    ],
    agents,
    tasks: taskList,
    feed: buildActivity(agents),
    alerts,
    timeline,
    usageByAgent: agents.map((agent) => ({ name: agent.name, cost: agent.estimatedCost, tokens: Math.round(agent.tokenUsage / 1000) })),
    usageByModel: buildModelUsage(sessions, statusPayload.usage),
    reliability: [
      { label: 'Reachable gateway', value: statusPayload.gateway?.reachable ? 'Yes' : 'No' },
      { label: 'Session count', value: String(agents.length) },
      { label: 'Warn findings', value: String((statusPayload.securityAudit?.summary?.warn) || 0) },
      { label: 'Critical findings', value: String((statusPayload.securityAudit?.summary?.critical) || 0) },
    ],
  };
}
