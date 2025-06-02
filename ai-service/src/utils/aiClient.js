import fetch from 'node-fetch';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateWithGroq(prompt, model) {
  const resp = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: model ||'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const json = await resp.json();
  return json.choices?.[0]?.message?.content?.trim() || JSON.stringify(json);
}
