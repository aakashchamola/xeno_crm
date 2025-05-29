import { generateWithGemini } from '../utils/aiClient.js';

function extractJsonArray(text) {
  text = text.replace(/```json\s*/i, '').replace(/```/g, '').trim();
  const match = text.match(/\[.*\]/s);
  if (!match) return null;
  try { return JSON.parse(match[0]); }
  catch { return null; }
}

export async function parseRules(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const fullPrompt = `
Convert this segment description to a JSON array of rule objects with keys:
  field — the field name (strictly one of "spend", "visits", "last_purchase_date", "inactive_days", "last_active"),
  op    — the operator (strictly one of ">", "<", "=", ">=", "<="),
  value — a number or ISO date string.
Only output the JSON array (no extra text).

Description: "${prompt}"
`.trim();

  try {
    const raw = await generateWithGemini('gemini-2.0-flash', fullPrompt);
    const arr = extractJsonArray(raw);
    if (!arr) {
      return res.status(422).json({ error: 'Could not parse JSON', model_output: raw });
    }
    // Normalize into your QueryBuilder format
    const ruleSet = {
      combinator: 'and',
      rules: arr.map(r => ({
        field: r.field || r.fact,
        operator: r.op || r.operator,
        value: r.value,
      })),
    };
    return res.json({ rules: ruleSet, originalPrompt: prompt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Inference failed', details: err.message });
  }
}
