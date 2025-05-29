import fetch from 'node-fetch';

const GEMINI_URL = id => 
  `https://generativelanguage.googleapis.com/v1beta/models/${id}:generateContent?key=${process.env.GEMINI_API_KEY}`;


export async function generateWithGemini(modelId, prompt) {
  const resp = await fetch(GEMINI_URL(modelId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini API error: ${err}`);
  }
  const json = await resp.json();
  const part =
    json.candidates?.[0]?.content?.parts?.[0]?.text ||
    JSON.stringify(json.candidates?.[0]);
  return part;
}
