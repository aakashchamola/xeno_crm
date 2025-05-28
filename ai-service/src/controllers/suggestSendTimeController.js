import { pipeline } from '@xenova/transformers';

let generator;
(async () => {
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
})();

export async function suggestSendTime(req, res) {
  const { segmentRules } = req.body;
  if (!segmentRules) return res.status(400).json({ error: 'Missing segmentRules' });
  while (!generator) await new Promise(r => setTimeout(r, 100));
  try {
    const prompt = `Given the segment rules: ${JSON.stringify(segmentRules)}, suggest the best time to send a marketing campaign. Respond with a simple string like "Tuesday 10am" or "Weekends at 6pm".`;
    const output = await generator(prompt, { max_new_tokens: 32 });
    res.json({ suggestedTime: output[0].generated_text.trim() });
  } catch (err) {
    res.status(500).json({ error: 'LLM inference failed', details: err.message });
  }
}