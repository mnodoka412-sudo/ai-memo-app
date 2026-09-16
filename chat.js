export default async function handler(req, res) {
  // POSTリクエスト以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Vercelのサーバー内（環境変数）に隠したAPIキーを安全に呼び出す
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const promptText = "以下のメモについて、要約やアドバイス、感想などを優しく答えてください。\n\nメモ内容: " + message;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiReply });
    } else {
      return res.status(500).json({ error: 'Failed to generate response from Gemini API.' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Communication error with AI.' });
  }
}