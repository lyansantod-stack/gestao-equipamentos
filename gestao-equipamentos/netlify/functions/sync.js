const { getStore, connectLambda } = require('@netlify/blobs');

const DEFAULT_USERS = [
  { id: 'usr-master', name: 'Controlador Master', username: 'master', pass: '123456', role: 'MASTER', allowedTech: 'all' },
  { id: 'usr-joao', name: 'Técnico João', username: 'joao', pass: 'joao123', role: 'TECH', allowedTech: 'Técnico João' },
  { id: 'usr-caue', name: 'Técnico Cauê', username: 'caue', pass: 'caue123', role: 'TECH', allowedTech: 'Técnico Cauê' },
  { id: 'usr-anderson', name: 'Técnico Anderson', username: 'anderson', pass: 'anderson123', role: 'TECH', allowedTech: 'Técnico Anderson' },
  { id: 'usr-otavio', name: 'Técnico Otávio', username: 'otavio', pass: 'otavio123', role: 'TECH', allowedTech: 'Técnico Otávio' },
  { id: 'usr-antonio', name: 'Técnico Antônio', username: 'antonio', pass: 'antonio123', role: 'TECH', allowedTech: 'Técnico Antônio' },
  { id: 'usr-francisco', name: 'Técnico Francisco', username: 'francisco', pass: 'francisco123', role: 'TECH', allowedTech: 'Técnico Francisco' },
  { id: 'usr-bruno', name: 'Técnico Bruno', username: 'bruno', pass: 'bruno123', role: 'TECH', allowedTech: 'Técnico Bruno' }
];

const KEY = 'fleet-state';

async function loadStore(store) {
  const state = { occurrences: [], users: DEFAULT_USERS, history: [] };
  const saved = await store.get(KEY, { type: 'json', consistency: 'strong' });
  if (saved) {
    if (Array.isArray(saved.occurrences)) state.occurrences = saved.occurrences;
    if (Array.isArray(saved.users) && saved.users.length > 0) state.users = saved.users;
    if (Array.isArray(saved.history)) state.history = saved.history;
  }
  return state;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    connectLambda(event);
    const store = getStore({ name: 'gestao-equipamentos', consistency: 'strong' });

    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const data = body.data || body;
      const state = await loadStore(store);

      // Ocorrências: merge individual (updatedAt mais recente vence)
      if (Array.isArray(data.changes)) {
        const map = new Map(state.occurrences.map(o => [o.id, o]));
        data.changes.forEach(c => {
          if (!c || !c.id) return;
          const existing = map.get(c.id);
          if (existing && (existing.updatedAt || '') > (c.updatedAt || '')) return;
          if (c.status === 'NORMAL') map.delete(c.id);
          else map.set(c.id, c);
        });
        state.occurrences = Array.from(map.values());
      }

      // Histórico: união por id
      if (Array.isArray(data.historyAdd) && data.historyAdd.length) {
        const ids = new Set(state.history.map(h => h.id));
        data.historyAdd.forEach(h => { if (h && h.id && !ids.has(h.id)) state.history.push(h); });
        state.history.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        state.history = state.history.slice(0, 1000);
      }

      if (Array.isArray(data.users) && data.users.length > 0) state.users = data.users;

      await store.setJSON(KEY, state);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: state }) };
    }

    const state = await loadStore(store);
    return { statusCode: 200, headers, body: JSON.stringify({ data: state }) };
  } catch (err) {
    console.error('sync error', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
