import { pipeline } from '@xenova/transformers';
let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();
export async function lookalike(req, res) {
  const { segmentRules } = req.body;
  if (!segmentRules) return res.status(400).json({ error: 'Missing segmentRules' });
  while (!generator) await new Promise(r => setTimeout(r, 100));
  try {
    const prompt = `Given these segment rules: ${JSON.stringify(segmentRules)}, suggest a lookalike segment as a JSON array of rules.`;
    const output = await generator(prompt, { max_new_tokens: 128 });
    const match = output[0].generated_text.match(/\[.*?\]/s);
    let lookalike = [];
    if (match) {
      try { lookalike = JSON.parse(match[0]); } catch {}
    }
    res.json({ lookalike });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}