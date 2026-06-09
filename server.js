const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ GROQ CONFIG
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ AI ANALYSIS WITH SCORING
app.post("/analyze", async (req, res) => {
  try {
    const { name, experience } = req.body;

    const prompt = `
You are an AI recruiter assistant.

Analyze the candidate below and return structured JSON.

Name: ${name}
Experience: ${experience}

IMPORTANT:
- Score must be from 0 to 100
- Be realistic and consistent
- Provide concise results

Return ONLY JSON in this format:
{
  "experience_level": "Junior | Mid-Level | Senior",
  "score": 0,
  "skills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "recommended_roles": ["role1", "role2", "role3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const text = response.choices[0].message.content;

    console.log("✅ AI RAW:", text);

    // ✅ Extract valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Return FULL structured response
    res.json({
      name,
      ...parsed
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    res.status(500).json({
      error: "AI processing failed",
      details: error.message
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});