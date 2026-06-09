const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ GROQ CONFIG (FREE AI)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ AI ANALYSIS ROUTE
app.post("/analyze", async (req, res) => {
  try {
    const { name, experience } = req.body;

    const prompt = `
You are an AI career analyst.

Analyze the candidate below and respond STRICTLY in JSON.

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
      model: "llama3-70b-8192", // ✅ FIXED MODEL (working)
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const text = response.choices[0].message.content;

    console.log("AI RAW RESPONSE:", text);

    // ✅ SAFE JSON EXTRACTION
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    res.json({
      name,
      ...parsed
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      error: "AI processing failed",
      details: error.message // ✅ helps debugging
    });
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});