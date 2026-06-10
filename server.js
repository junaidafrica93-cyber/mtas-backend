const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.post("/analyze", async (req, res) => {
  try {
    const { name, experience } = req.body;

    const prompt = `
You are an AI recruitment engine.

Analyze the candidate:

Name: ${name}
Experience: ${experience}

Return JSON ONLY:

{
  "experience_level": "...",
  "score": 0,
  "skills": ["..."],
  "roles": [
    { "title": "Role 1", "match": 85 },
    { "title": "Role 2", "match": 60 },
    { "title": "Role 3", "match": 78 }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.choices[0].message.content;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ ONLY KEEP STRONG MATCHES
    parsed.roles = parsed.roles.filter(r => r.match >= 70);

    res.json({
      name,
      ...parsed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});