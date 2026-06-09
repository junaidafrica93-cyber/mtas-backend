const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors()); // 🔥 CRITICAL (fixes your "Failed to fetch")
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ AI ROUTE
app.post("/analyze", async (req, res) => {
  try {

    const { name, experience } = req.body;

    // ✅ SIMPLE AI LOGIC (mock response for now)
    // (We’ll plug real OpenAI after this works)

    const skills = [];
    const roles = [];

    if (experience.toLowerCase().includes("recruit")) {
      skills.push("Talent Acquisition", "Stakeholder Management");
      roles.push("Talent Partner", "Recruitment Manager");
    }

    if (experience.toLowerCase().includes("hr")) {
      skills.push("HR Management", "Employee Relations");
      roles.push("HR Manager", "HR Business Partner");
    }

    // ✅ DEFAULT IF NOTHING MATCHES
    if (skills.length === 0) {
      skills.push("Communication", "Problem Solving");
      roles.push("General Associate");
    }

    res.json({
      name: name,
      experience_level: "Mid-Level",
      skills: skills,
      recommended_roles: roles
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
``
