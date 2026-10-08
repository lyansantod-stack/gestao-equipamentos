let globalOccurrences = [
  {
    id: "EQP-42-6",
    status: "MANUTENCAO",
    issue: "Manutenção ocorrera no dia 09/10/2026, alinhado com o Leandro e o Cauê - Sistema não comunica no portal",
    reporter: "Técnico Cauê",
    reportedAt: new Date().toISOString(),
    actionStage: "TECNICO_AGENDADO",
    actionNote: "Manutenção alinhada para 09/10/2026 com Leandro e Cauê.",
    lastActionAt: new Date().toISOString(),
    lastUpdatedBy: "Técnico Cauê"
  },
  {
    id: "EQP-411-92",
    status: "DESMOBILIZACAO",
    issue: "Equipamento será desmobilizado no dia 13/10/2026.",
    reporter: "Técnico Anderson",
    reportedAt: new Date().toISOString(),
    actionStage: "DESMOBILIZACAO_AGENDADA",
    actionNote: "Equipamento será desmobilizado no dia 13/10/2026. Retorno à fábrica.",
    lastActionAt: new Date().toISOString(),
    lastUpdatedBy: "Técnico Anderson"
  }
];

let globalUsers = [
  { id: 'usr-master', name: 'Controlador Master', username: 'master', pass: '123456', role: 'MASTER', allowedTech: 'all' },
  { id: 'usr-joao', name: 'Técnico João', username: 'joao', pass: 'joao123', role: 'TECH', allowedTech: 'Técnico João' },
  { id: 'usr-caue', name: 'Técnico Cauê', username: 'caue', pass: 'caue123', role: 'TECH', allowedTech: 'Técnico Cauê' },
  { id: 'usr-anderson', name: 'Técnico Anderson', username: 'anderson', pass: 'anderson123', role: 'TECH', allowedTech: 'Técnico Anderson' },
  { id: 'usr-otavio', name: 'Técnico Otávio', username: 'otavio', pass: 'otavio123', role: 'TECH', allowedTech: 'Técnico Otávio' },
  { id: 'usr-antonio', name: 'Técnico Antônio', username: 'antonio', pass: 'antonio123', role: 'TECH', allowedTech: 'Técnico Antônio' },
  { id: 'usr-francisco', name: 'Técnico Francisco', username: 'francisco', pass: 'francisco123', role: 'TECH', allowedTech: 'Técnico Francisco' },
  { id: 'usr-bruno', name: 'Técnico Bruno', username: 'bruno', pass: 'bruno123', role: 'TECH', allowedTech: 'Técnico Bruno' }
];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
    try {
      const data = JSON.parse(event.body);
      if (Array.isArray(data)) {
        globalOccurrences = data.filter(m => m.status !== 'NORMAL');
      } else if (data && data.data) {
        if (Array.isArray(data.data.occurrences)) globalOccurrences = data.data.occurrences;
        if (Array.isArray(data.data.users)) globalUsers = data.data.users;
      } else if (data) {
        if (Array.isArray(data.occurrences)) globalOccurrences = data.occurrences;
        if (Array.isArray(data.users)) globalUsers = data.users;
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, occurrencesCount: globalOccurrences.length, usersCount: globalUsers.length, updatedAt: new Date().toISOString() })
      };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  // GET
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ data: { occurrences: globalOccurrences, users: globalUsers } })
  };
};
