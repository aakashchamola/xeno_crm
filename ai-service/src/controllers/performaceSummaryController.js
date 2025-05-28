import { pipeline } from '@xenova/transformers';

let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();

export async function performanceSummary(req, res) {
  const { stats } = req.body;
  if (!stats) return res.status(400).json({ error: 'Missing stats' });
  while (!generator) await new Promise(r => setTimeout(r, 100));
  try {
    const prompt = `Summarize this campaign performance for a business user: ${JSON.stringify(stats)}.`;
    const output = await generator(prompt, { max_new_tokens: 64 });
    res.json({ summary: output[0].generated_text.trim() });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}