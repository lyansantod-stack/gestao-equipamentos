const PERSISTENT_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a12188216a2f77';

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

async function loadStore() {
  const store = { occurrences: [], users: DEFAULT_USERS, history: [] };
  try {
    const res = await fetch(PERSISTENT_URL, { cache: 'no-store' });
    if (res.ok) {
      const obj = await res.json();
      if (obj && obj.data) {
        if (Array.isArray(obj.data.occurrences)) store.occurrences = obj.data.occurrences;
        if (Array.isArray(obj.data.users) && obj.data.users.length > 0) store.users = obj.data.users;
        if (Array.isArray(obj.data.history)) store.history = obj.data.history;
      }
    }
  } catch (e) {
    console.warn('Persistent GET warning:', e);
  }
  return store;
}

async function saveStore(store) {
  await fetch(PERSISTENT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'gestao_br_fleet_v10_prod', data: store })
  });
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

  if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
    try {
      const body = JSON.parse(event.body || '{}');
      const data = body.data || body;
      const store = await loadStore();

      // 1) Merge occurrence changes individually (newest updatedAt wins)
      if (Array.isArray(data.changes)) {
        const map = new Map(store.occurrences.map(o => [o.id, o]));
        data.changes.forEach(c => {
          if (!c || !c.id) return;
          const existing = map.get(c.id);
          if (existing && (existing.updatedAt || '') > (c.updatedAt || '')) return;
          if (c.status === 'NORMAL') map.delete(c.id);
          else map.set(c.id, c);
        });
        store.occurrences = Array.from(map.values());
      }

      // 2) Merge history (union by id, newest first, max 500)
      if (Array.isArray(data.historyAdd) && data.historyAdd.length) {
        const ids = new Set(store.history.map(h => h.id));
        data.historyAdd.forEach(h => { if (h && h.id && !ids.has(h.id)) store.history.push(h); });
        store.history.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        store.history = store.history.slice(0, 500);
      }

      // 3) Users only replaced when explicitly sent
      if (Array.isArray(data.users) && data.users.length > 0) store.users = data.users;

      await saveStore(store);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: store }) };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  const store = await loadStore();
  return { statusCode: 200, headers, body: JSON.stringify({ data: store }) };
};
