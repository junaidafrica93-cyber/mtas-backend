const express = require("express");
const cors = require("cors");

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ analyze route
app.post("/analyze", (req, res) => {
  const { name, experience } = req.body;

  let skills = [];
  let roles = [];

  if (experience.toLowerCase().includes("recruit")) {
    skills.push("Talent Acquisition", "Stakeholder Management");
    roles.push("Talent Partner", "Recruitment Manager");
  }

  if (experience.toLowerCase().includes("hr")) {
    skills.push("HR Management", "Employee Relations");
    roles.push("HR Manager", "HR Business Partner");
  }

  if (skills.length === 0) {
    skills.push("Communication", "Problem Solving");
    roles.push("General Associate");
  }

  res.json({
    name,
    experience_level: "Mid-Level",
    skills,
    recommended_roles: roles
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});