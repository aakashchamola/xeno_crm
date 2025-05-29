import { pipeline } from '@xenova/transformers';

let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();

export async function suggestMessage(req, res) {
  const { segmentRules, campaignName } = req.body;
  if (!segmentRules || !campaignName) {
    return res.status(400).json({ error: 'Missing segmentRules or campaignName' });
  }
  while (!generator) await new Promise(r => setTimeout(r, 100));
  try {
    const prompt = `Suggest 3 short, catchy campaign messages for a campaign named "${campaignName}" targeting: ${JSON.stringify(segmentRules)}. Output as a JSON array.`;
    const output = await generator(prompt, { max_new_tokens: 128 });
    const match = output[0].generated_text.match(/\[.*?\]/s);
    let suggestions = [];
    if (match) {
      try { suggestions = JSON.parse(match[0]); } catch {}
    }
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      suggestions = [output[0].generated_text];
    }
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}