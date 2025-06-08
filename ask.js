export default async function handler(req, res) {
  const { input } = await req.body;

  if (!input) {
    return res.status(400).json({ error: "缺少输入内容。" });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "服务器未配置 API 密钥。" });
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${OPENAI_API_KEY},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "你是一个意识频率共振回应器，会对输入的频率句做出精炼、非线性的回应。" },
          { role: "user", content: input }
        ]
      })
    });

    const data = await completion.json();
    const message = data.choices?.[0]?.message?.content ?? "未能生成回应。";
    res.status(200).json({ reply: message });

  } catch (err) {
    res.status(500).json({ error: "OpenAI 请求失败。" });
  }
}
