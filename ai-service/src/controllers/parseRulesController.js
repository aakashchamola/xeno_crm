import { pipeline } from '@xenova/transformers';

let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();

function extractJsonArray(text) {
  const match = text.match(/\[.*?\]/s);
  if (!match) return null;
  try {
    const arr = JSON.parse(match[0]);
    // Ensure it's an array of objects with field/op/value
    if (Array.isArray(arr) && arr.every(r => r.field && r.op && r.value !== undefined)) {
      return arr;
    }
    return null;
  } catch {
    return null;
  }
}

export async function parseRules(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  while (!generator) await new Promise(r => setTimeout(r, 100));

  const fullPrompt = `Convert this segment description to JSON rules: "${prompt}". Output only a JSON array of rule objects like: [{"field":"last_purchase_date","op":"<","value":"2023-12-01"},{"field":"spend","op":">","value":5000}]`;

  try {
    const output = await generator(fullPrompt, { max_new_tokens: 128 });
    const rules = extractJsonArray(output[0].generated_text);
    if (!rules) {
      return res.status(422).json({ error: 'Could not extract rules from model output', model_output: output[0].generated_text });
    }
    res.json({ rules, original: prompt });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}