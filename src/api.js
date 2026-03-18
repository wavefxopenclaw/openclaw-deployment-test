const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return response.json();
}

export const api = {
  health: () => request('/api/health'),
  dashboard: () => request('/api/dashboard'),
  agents: () => request('/api/agents'),
  agent: (id) => request(`/api/agents/${encodeURIComponent(id)}`),
  tasks: () => request('/api/tasks'),
  modelUsage: () => request('/api/model-usage'),
};

export { API_BASE };
