import { pipeline } from '@xenova/transformers';
let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();
export async function suggestSendTime(req, res) {
  const { campaignName } = req.body;
  if (!campaignName) return res.status(400).json({ error: 'Missing campaignName' });
  while (!generator) await new Promise(r => setTimeout(r, 100));
  try {
    const prompt = `Suggest the best send time (as an ISO 8601 string) for a campaign named "${campaignName}".`;
    const output = await generator(prompt, { max_new_tokens: 32 });
    // Try to extract a date/time string
    const match = output[0].generated_text.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
    let suggestedTime = match ? match[0] : null;
    if (!suggestedTime) {
      // fallback: now + 1 hour
      suggestedTime = new Date(Date.now() + 3600000).toISOString();
    }
    res.json({ suggestedTime });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}