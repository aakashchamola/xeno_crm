import { pipeline } from '@xenova/transformers';
let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();
export async function autoTag(req, res) {
  const { campaignName, message } = req.body;
  if (!campaignName || !message) return res.status(400).json({ error: 'Missing campaignName or message' });
  while (!generator) await new Promise(r => setTimeout(r, 100));
  try {
    const prompt = `Given the campaign name "${campaignName}" and message "${message}", suggest 2-3 intent tags as a JSON array of strings.`;
    const output = await generator(prompt, { max_new_tokens: 64 });
    const match = output[0].generated_text.match(/\[.*?\]/s);
    let tags = [];
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed) && parsed.every(x => typeof x === 'string')) {
          tags = parsed;
        }
      } catch {}
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      tags = output[0].generated_text
        .split(/,|\n/)
        .map(s => s.replace(/[\[\]"]/g, '').trim())
        .filter(Boolean)
        .slice(0, 3);
      if (tags.length === 0) tags = ['promotion'];
    }
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}