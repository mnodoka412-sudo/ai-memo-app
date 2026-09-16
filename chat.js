export default async function handler(req, res) {
  // POSTリクエスト以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required and must be a valid string.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const promptText = `以下のメモについて、要約やアドバイス、感想などを優しく答えてください。\n\nメモ内容: ${message}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // オプショナルチェーニングを使用して安全にレスポンスを取得
    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (response.ok && aiReply) {
      return res.status(200).json({ reply: aiReply });
    } else {
      console.error('Gemini API Error:', data);
      return res.status(500).json({ error: data?.error?.message || 'Failed to generate response from Gemini API.' });
    }

  } catch (error) {
    console.error('Communication error:', error);
    return res.status(500).json({ error: 'Communication error with AI.' });
  }
}