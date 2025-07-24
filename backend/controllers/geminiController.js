require("dotenv").config();
const axios = require("axios");

exports.sendToGemini = async (req, res) => {
  const { message, topic } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Please send a valid message." });
  }

  const systemPrompts = {
    resume: "You are an expert frontend resume coach.",
    interview: "You are a senior frontend engineer giving interview tips.",
    general: "You are a helpful tech career mentor.",
  };
  const system = systemPrompts[topic] || systemPrompts.general;

  const contents = [
    { role: "user", parts: [{ text: `${system}\n${message}` }] }
  ];

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const { data } = await axios.post(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("❌ Gemini/Flash Error:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ error: "Gemini request failed. Check server logs for details." });
  }
};