import React, { useState, useEffect } from "react";

// UI Components
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl ${className}`}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input {...props} className="border px-3 py-2 rounded-xl w-full" />
);

// Match styling
const getMatchColor = (match) => {
  if (match >= 80) return "text-green-600";
  if (match >= 70) return "text-yellow-500";
  return "text-gray-400";
};

const getProgressColor = (match) => {
  if (match >= 80) return "bg-green-500";
  if (match >= 70) return "bg-yellow-500";
  return "bg-gray-300";
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [step, setStep] = useState("dashboard");
  const [answers, setAnswers] = useState({});

  // ✅ Fetch from LIVE backend
  useEffect(() => {
    fetch("https://mtas-backend.onrender.com/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Questions
  const screeningQuestions = [
    { id: 1, question: "Do you have experience with this role?" },
    { id: 2, question: "Do you meet the required qualifications?" },
    { id: 3, question: "Are you able to work in the specified location?" }
  ];

  // ✅ Evaluation logic
  const evaluateMatch = () => {
    const yesCount = Object.values(answers).filter((a) => a === "yes").length;
    const score = (yesCount / screeningQuestions.length) * 100;
    return score >= 70 ? "good" : "bad";
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-6">JobMetrix</h1>
        <nav className="space-y-4">
          <p className="text-blue-600 font-semibold">🏠 Dashboard</p>
          <p>💼 My Matches</p>
          <p>📄 My CV</p>
          <p>📊 Insights</p>
          <p>⚙️ Settings</p>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex">

        <div className="flex-1 flex flex-col">

          {/* Top Bar */}
          <div className="flex justify-between items-center bg-white p-4 shadow">
            <Input placeholder="Search jobs..." />
            <div>🔔 👤</div>
          </div>

          {/* Header */}
          <div className="p-6">
            <h2 className="text-2xl font-bold">Welcome Back, Junaid</h2>
            <p className="text-gray-600">Preferred Role: Software Engineer</p>
          </div>

          {/* Jobs */}
          <div className="grid grid-cols-3 gap-6 px-6">
            {jobs
              .filter((job) => job.match >= 70)
              .map((job) => (
                <Card
                  key={job.id}
                  className="p-4 cursor-pointer hover:shadow-lg"
                  onClick={() => {
                    setSelectedJob(job);
                    setStep("dashboard");
                    setAnswers({});
                  }}
                >
                  <CardContent>

                    {/* Header */}
                    <div className="flex justify-between">
                      <h3 className="font-bold">{job.company}</h3>
                      <span className={`font-bold ${getMatchColor(job.match)}`}>
                        {job.match}% Match
                      </span>
                    </div>

                    <p className="text-lg">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Matched based on your skills and preferred role
                    </p>

                    <p className="text-sm text-gray-500">
                      {job.location} • {job.type}
                    </p>

                    {/* Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded mt-3">
                      <div
                        className={`${getProgressColor(job.match)} h-2`}
                        style={{ width: `${job.match}%` }}
                      ></div>
                    </div>

                    <Button className="mt-4 w-full">View Job</Button>

                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Insights */}
        <div className="w-80 bg-white p-6 hidden lg:block">
          <h3 className="text-lg font-bold mb-2">📊 Profile Strength</h3>
          <div className="bg-gray-200 h-3 rounded">
            <div className="bg-blue-500 h-3" style={{ width: "85%" }}></div>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            Improve your match by adding more skills
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedJob && step === "dashboard" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-1/2">

            <div className="flex justify-between">
              <Button onClick={() => setSelectedJob(null)}>← Back</Button>
              <Button
                className="bg-gray-200 text-black"
                onClick={() => {
                  setSelectedJob(null);
                  setStep("dashboard");
                }}
              >
                🏠 Home
              </Button>
            </div>

            <h2 className="text-xl font-bold mt-4">
              {selectedJob.title}
            </h2>
            <p>{selectedJob.company}</p>
            <p className={getMatchColor(selectedJob.match)}>
              Match: {selectedJob.match}%
            </p>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => setSelectedJob(null)}>Back</Button>
              <Button onClick={() => setStep("screening")}>Proceed</Button>
            </div>

          </div>
        </div>
      )}

      {/* Screening */}
      {step === "screening" && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-1/2">

            <div className="flex justify-between mb-4">
              <Button onClick={() => setStep("dashboard")}>← Back</Button>
              <Button
                className="bg-gray-200 text-black"
                onClick={() => {
                  setStep("dashboard");
                  setSelectedJob(null);
                }}
              >
                🏠 Home
              </Button>
            </div>

            <h2 className="text-xl font-bold mb-4">
              Screening Questions
            </h2>

            {screeningQuestions.map((q) => (
              <div key={q.id} className="mb-4">
                <p>{q.question}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() =>
                      setAnswers({ ...answers, [q.id]: "yes" })
                    }
                  >
                    Yes
                  </Button>
                  <Button
                    className="bg-red-500"
                    onClick={() =>
                      setAnswers({ ...answers, [q.id]: "no" })
                    }
                  >
                    No
                  </Button>
                </div>
              </div>
            ))}

            <Button
              className="w-full mt-4"
              onClick={() => {
                fetch("https://mtas-backend.onrender.com/api/answers", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    jobId: selectedJob.id,
                    answers: answers
                  })
                })
                  .then(() => setStep("result"))
                  .catch((err) => console.error(err));
              }}
            >
              Submit
            </Button>

          </div>
        </div>
      )}

      {/* Result */}
      {step === "result" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-1/2">

            <h2 className="text-xl font-bold">Evaluation Result</h2>

            {evaluateMatch() === "good" ? (
              <p className="text-green-600 font-semibold">
                ✅ You are a strong match!
              </p>
            ) : (
              <p className="text-red-500 font-semibold">
                ⚠️ Not the best fit
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Button className="w-full">Download ATS CV</Button>
              <Button className="w-full">Go to Job</Button>
              <Button
                className="w-full bg-gray-200 text-black"
                onClick={() => {
                  setStep("dashboard");
                  setSelectedJob(null);
                }}
              >
                Back to Dashboard
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}