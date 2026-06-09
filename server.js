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

    // ✅ SAFE PARSE
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