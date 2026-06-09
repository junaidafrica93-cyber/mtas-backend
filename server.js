const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ AI Analyze Route
app.post("/analyze", async (req, res) => {
  try {
    const { name, experience } = req.body;

    const prompt = `
You are an AI career analyst.

Analyze the candidate below and respond STRICTLY in JSON only.

Name: ${name}
Experience: ${experience}

Return JSON ONLY in this format:
{
  "experience_level": "Junior | Mid-Level | Senior",
  "skills": ["skill1", "skill2", "skill3"],
  "recommended_roles": ["role1", "role2", "role3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.choices[0].message.content;

    // ✅ Safe JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    res.json({
      name,
      ...parsed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});