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
      let occs = [];
      if (Array.isArray(data)) {
        occs = data.filter(m => m.status !== 'NORMAL');
      } else if (data && data.data && Array.isArray(data.data.occurrences)) {
        occs = data.data.occurrences;
      } else if (data && Array.isArray(data.occurrences)) {
        occs = data.occurrences;
      }
      globalOccurrences = occs;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: globalOccurrences.length, updatedAt: new Date().toISOString() })
      };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  // GET
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ data: { occurrences: globalOccurrences } })
  };
};
