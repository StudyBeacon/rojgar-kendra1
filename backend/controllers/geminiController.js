require("dotenv").config();
const axios = require("axios");

// Helper to polish and trim long paragraphs into bullets or steps
function enhanceReply(reply) {
  // If reply is really short, prompt for more
  if (!reply || reply.length < 50) {
    return `🤖 ${reply}\n\n👉 Need more details?`;
  }

  // Split numbered lists into separate lines if needed
  if (/\d+\.\s/.test(reply)) {
    reply = reply
      .split(/\r?\n/)
      .map(line => (line.match(/^\d+\.\s/) ? `• ${line.replace(/^\d+\.\s/, '')}` : line))
      .join('\n');
  }

  // Add closing emoji and invite follow-up
  return `🤖 ${reply.trim()}\n\n✨ Let me know if you’d like more examples!`;
}

exports.sendToGemini = async (req, res) => {
  const { message, topic } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Please send a valid message.' });
  }

  // System prompts specify both expertise and style
  const systemPrompts = {
    resume: 'You are an expert frontend resume coach who replies like a friendly mentor. Use bullet points, numbered steps, and emojis. Keep it concise.',
    interview: 'You are a senior frontend engineer giving interview tips like a supportive mentor. Use short lists, examples, and occasional emojis.',
    general: 'You are a helpful tech career mentor. Answer in a few bullet points or steps, add emojis, and avoid long paragraphs.',
  };
  const system = systemPrompts[topic] || systemPrompts.general;

  // Build structured prompt
  const contents = [
    { role: 'system', parts: [{ text: system }] },
    {
      role: 'user',
      parts: [{
        text: `Please answer in short bullet points or numbered steps. Add emojis where helpful. Avoid long paragraphs.\n\nUser’s question:\n${message}`,
      }],
    },
  ];

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const { data } = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const reply = enhanceReply(rawReply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('❌ Gemini Error:', err.response?.data || err.message);
    return res
      .status(500)
      .json({ error: 'Gemini request failed. Check server logs for details.' });
  }
};