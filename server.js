const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ GROQ CONFIG
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ MAIN ANALYSIS (CV → JOB MATCHING)
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
  "experience_level": "Junior | Mid-Level | Senior",
  "score": 0,
  "skills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
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

    // ✅ FILTER ONLY 70%+ MATCH
    parsed.roles = parsed.roles.filter(r => r.match >= 70);

    res.json({
      name,
      ...parsed
    });

  } catch (err) {
    console.error("ERROR /analyze:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});


// ✅ ROLE BREAKDOWN
app.post("/role-details", async (req, res) => {
  try {
    const { role, experience } = req.body;

    const prompt = `
Explain the role: ${role}

Then compare it to this experience:
${experience}

Return JSON:
{
  "role_summary": "...",
  "match_percentage": 0,
  "missing_skills": ["skill1", "skill2"]
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.choices[0].message.content;

    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);

    res.json(parsed);

  } catch (err) {
    console.error("ERROR /role-details:", err);
    res.status(500).json({ error: "Role analysis failed" });
  }
});


// ✅ SCREENING QUESTIONS
app.post("/screening-questions", async (req, res) => {
  try {
    const { role } = req.body;

    const prompt = `
Generate 3 screening questions for ${role}.

Return JSON:
{
  "questions": ["Q1", "Q2", "Q3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const parsed = JSON.parse(
      response.choices[0].message.content.match(/\{[\s\S]*\}/)[0]
    );

    res.json(parsed);

  } catch (err) {
    console.error("ERROR /screening:", err);
    res.status(500).json({ error: "Question generation failed" });
  }
});


// ✅ EVALUATE ANSWERS
app.post("/evaluate-answers", async (req, res) => {
  try {
    const { role, answers } = req.body;

    const prompt = `
Evaluate candidate answers for the role: ${role}

Answers:
${answers.join("\n")}

Return JSON:
{
  "fit_score": 0,
  "decision": "Good Fit | Not Fit",
  "feedback": "..."
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const parsed = JSON.parse(
      response.choices[0].message.content.match(/\{[\s\S]*\}/)[0]
    );

    res.json(parsed);

  } catch (err) {
    console.error("ERROR /evaluate:", err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});


// ✅ GENERATE CV
app.post("/generate-cv", async (req, res) => {
  try {
    const { name, experience } = req.body;

    const prompt = `
Create a professional ATS-friendly CV.

Name: ${name}
Experience: ${experience}

Return plain text CV.
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      cv: response.choices[0].message.content
    });

  } catch (err) {
    console.error("ERROR /cv:", err);
    res.status(500).json({ error: "CV generation failed" });
  }
});


// ✅ SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});