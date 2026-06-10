const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ In-memory storage (temporary)
// NOTE: Replace with database later (MongoDB)
let userAnswers = [];

// ✅ Job data (later from DB or external APIs)
const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp",
    match: 82,
    location: "Cape Town",
    type: "Remote"
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Webify",
    match: 76,
    location: "Johannesburg",
    type: "Hybrid"
  }
];

// ✅ HEALTH CHECK (important for Render)
app.get("/", (req, res) => {
  res.send("JobMetrix Backend is running 🚀");
});

// ✅ GET Jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// ✅ POST Screening Answers
app.post("/api/answers", (req, res) => {
  const { jobId, answers } = req.body;

  if (!jobId || !answers) {
    return res.status(400).json({
      error: "Missing jobId or answers"
    });
  }

  const entry = {
    jobId,
    answers,
    date: new Date()
  };

  userAnswers.push(entry);

  console.log("✅ Saved answers:", entry);

  res.json({
    message: "Answers saved successfully",
    data: entry
  });
});

// ✅ GET Answers (for testing/debugging)
app.get("/api/answers", (req, res) => {
  res.json(userAnswers);
});

// ✅ START SERVER (RENDER SAFE)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});