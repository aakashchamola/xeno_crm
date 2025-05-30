/**
 * Very basic rule engine for demo: supports rules like
 * [{ field: "spend", op: ">", value: 10000 }]
 * and combinator: "and"/"or"
 */
function buildWhereClause(segmentRules) {
  if (!segmentRules || !Array.isArray(segmentRules.rules) || !segmentRules.rules.length) {
    return { clause: '1', params: [] }; // always true
  }
  const ops = { '>': '>', '<': '<', '=': '=', '>=': '>=', '<=': '<=' };
  const combinator = segmentRules.combinator === 'or' ? 'OR' : 'AND';
  const clauseParts = [];
  const params = [];
  for (const rule of segmentRules.rules) {
    if (rule.field && ops[rule.op] && rule.value !== undefined) {
      clauseParts.push(`\`${rule.field}\` ${ops[rule.op]} ?`);
      params.push(rule.value);
    }
  }
  return {
    clause: clauseParts.length ? clauseParts.join(` ${combinator} `) : '1',
    params
  };
}

async function previewSegment(req, res, next) {
  try {
    const { rules } = req.body;

    // Validate rules format (basic validation for now)
    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ error: 'Invalid rules: must be a non-empty array.' });
    }

    const { segmentRules } = req.body;
    const db = req.app.locals.db;
    const { clause, params } = buildWhereClause(segmentRules);
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM customers WHERE ${clause}`, params);
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Failed to preview segment.' });
  }
}

module.exports = { previewSegment };