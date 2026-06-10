const API_URL = "https://mtas-backend.onrender.com";

// ✅ MAIN ANALYZE BUTTON
async function analyzeCV() {
  const name = document.getElementById("name").value;
  const experience = document.getElementById("experience").value;

  // Show loading
  document.getElementById("results").innerHTML = "⚡ Analyzing...";

  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, experience })
    });

    const data = await res.json();

    displayResults(data);

  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML =
      "❌ Error connecting to AI";
  }
}

// ✅ DISPLAY MAIN RESULTS
function displayResults(data) {
  const rolesHTML = data.roles.map(role => `
    <div class="job-card">
      <h4>${role.title}</h4>
      <p>Match: ${role.match}% ✅</p>
      <button onclick="selectRole('${role.title}')">
        View Details
      </button>
    </div>
  `).join("");

  document.getElementById("results").innerHTML = `
    <h2>🚀 JOBMETRIX Results</h2>

    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Experience Level:</strong> ${data.experience_level}</p>

    <p><strong>Score:</strong> ${data.score}/100</p>

    <h3>Skills</h3>
    <ul>
      ${data.skills.map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h3>Strengths</h3>
    <ul>
      ${data.strengths.map(s => `<li>${s}</li>`).join("")}
    </ul>

    <h3>Areas to Improve</h3>
    <ul>
      ${data.gaps.map(g => `<li>${g}</li>`).join("")}
    </ul>

    <h3>💼 Recommended Roles (≥70% Match)</h3>
    ${rolesHTML}
  `;
}

// ✅ USER SELECTS A ROLE
async function selectRole(role) {
  const experience = document.getElementById("experience").value;

  document.getElementById("results").innerHTML = "🔍 Loading role details...";

  try {
    const res = await fetch(`${API_URL}/role-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role, experience })
    });

    const data = await res.json();

    document.getElementById("results").innerHTML = `
      <h2>${role}</h2>

      <p><strong>Role Summary:</strong></p>
      <p>${data.role_summary}</p>

      <p><strong>Match Score:</strong> ${data.match_percentage}%</p>

      <p><strong>Missing Skills:</strong></p>
      <ul>
        ${data.missing_skills.map(s => `<li>${s}</li>`).join("")}
      </ul>

      <button onclick="startScreening('${role}')">
        Start Screening
      </button>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML =
      "❌ Error loading role details";
  }
}

// ✅ START SCREENING QUESTIONS
async function startScreening(role) {
  document.getElementById("results").innerHTML = "🧠 Generating questions...";

  try {
    const res = await fetch(`${API_URL}/screening-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role })
    });

    const data = await res.json();

    const questionsHTML = data.questions.map((q, i) => `
      <div>
        <p>${q}</p>
        <textarea id="answer${i}" placeholder="Your answer..."></textarea>
      </div>
    `).join("");

    document.getElementById("results").innerHTML = `
      <h2>Screening Questions</h2>
      ${questionsHTML}

      <button onclick="submitAnswers('${role}', ${data.questions.length})">
        Submit Answers
      </button>
    `;

  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML =
      "❌ Error generating questions";
  }
}

// ✅ SUBMIT SCREENING ANSWERS
async function submitAnswers(role, count) {
  let answers = [];

  for (let i = 0; i < count; i++) {
    const value = document.getElementById(`answer${i}`).value;
    answers.push(value);
  }

  document.getElementById("results").innerHTML = "⚡ Evaluating...";

  try {
    const res = await fetch(`${API_URL}/evaluate-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role, answers })
    });

    const data = await res.json();

    document.getElementById("results").innerHTML = `
      <h2>Evaluation Result</h2>

      <p><strong>Fit Score:</strong> ${data.fit_score}/100</p>
      <p><strong>Decision:</strong> ${data.decision}</p>

      <p><strong>Feedback:</strong></p>
      <p>${data.feedback}</p>

      <button onclick="generateCV()">
        Generate Updated CV
      </button>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML =
      "❌ Error evaluating answers";
  }
}

// ✅ GENERATE ATS CV
async function generateCV() {
  const name = document.getElementById("name").value;
  const experience = document.getElementById("experience").value;

  document.getElementById("results").innerHTML = "📄 Generating CV...";

  try {
    const res = await fetch(`${API_URL}/generate-cv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, experience })
    });

    const data = await res.json();

    document.getElementById("results").innerHTML = `
      <h2>Your ATS CV</h2>

      <pre>${data.cv}</pre>

      <button onclick="downloadCV(\`${data.cv}\`)">
        Download CV
      </button>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML =
      "❌ Error generating CV";
  }
}

// ✅ DOWNLOAD CV
function downloadCV(text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Updated_CV.txt";
  a.click();
}