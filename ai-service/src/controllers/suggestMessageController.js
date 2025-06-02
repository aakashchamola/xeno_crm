import { generateWithGroq } from '../utils/aiClient.js';

export async function suggestMessage(req, res) {
  const { segmentRules, campaignName } = req.body;
  if (!segmentRules || !campaignName) {
    return res.status(400).json({ error: 'Missing segmentRules or campaignName' });
  }

  const prompt = `
Suggest 3 short, catchy SMS messages for a campaign named "${campaignName}"
targeting this segment: ${JSON.stringify(segmentRules)}.
Only return a JSON array of strings, e.g. ["msg1", "msg2", "msg3"]. give straightforward, clear, 
and engaging messages that are suitable for SMS but dont give any links or redirects or anything just catchy marketing messages.
  `.trim();

  try {
    const raw = await generateWithGroq(fullPrompt, 'llama-3.3-70b-versatile');

    // Try to pull out a JSON array
    const match = raw.match(/\[.*\]/s);
    let suggestions = [];
    if (match) {
      try {
        suggestions = JSON.parse(match[0]);
      } catch {
        // fall through to fallback
      }
    }

    // Fallback if no valid array
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      suggestions = [raw.trim()];
    }

    return res.json({ suggestions });
  } catch (err) {
    console.error('suggestMessage error:', err);
    if (err.status === 503) {
      return res.status(503).json({ error: 'AI is temporarily overloaded. Please try again later.' });
    }
    return res.status(500).json({ error: 'Inference failed', details: err.message });
  }
}
