import express from 'express';
import cors from 'cors';
import { getCachedSnapshot, getCacheState, warmSnapshot } from './cache.js';

const app = express();
const port = process.env.PORT || 8787;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin not allowed: ${origin}`));
  },
}));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const snapshot = await getCachedSnapshot({ allowStale: true });
    res.json({ ok: true, generatedAt: snapshot.generatedAt, cache: getCacheState() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message, cache: getCacheState() });
  }
});

app.get('/api/dashboard', async (_req, res) => {
  try {
    const snapshot = await getCachedSnapshot({ allowStale: true });
    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ error: error.message, cache: getCacheState() });
  }
});

app.get('/api/agents', async (_req, res) => {
  try {
    const snapshot = await getCachedSnapshot({ allowStale: true });
    res.json(snapshot.agents);
  } catch (error) {
    res.status(500).json({ error: error.message, cache: getCacheState() });
  }
});

app.get('/api/agents/:id', async (req, res) => {
  try {
    const snapshot = await getCachedSnapshot({ allowStale: true });
    const agent = snapshot.agents.find((item) => item.id === req.params.id || item.key === req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent/session not found' });
    }
    return res.json(agent);
  } catch (error) {
    return res.status(500).json({ error: error.message, cache: getCacheState() });
  }
});

app.get('/api/tasks', async (_req, res) => {
  try {
    const snapshot = await getCachedSnapshot({ allowStale: true });
    res.json(snapshot.tasks);
  } catch (error) {
    res.status(500).json({ error: error.message, cache: getCacheState() });
  }
});

app.get('/api/model-usage', async (_req, res) => {
  try {
    const snapshot = await getCachedSnapshot({ allowStale: true });
    res.json(snapshot.usageByModel);
  } catch (error) {
    res.status(500).json({ error: error.message, cache: getCacheState() });
  }
});

app.listen(port, async () => {
  console.log(`OpenClaw Mission Control API listening on http://localhost:${port}`);
  await warmSnapshot();
  console.log('OpenClaw Mission Control API cache warmed');
});
