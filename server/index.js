const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Load rules once at server start
const kiroRulesPath = path.join(__dirname, "kiroRules.json");
let kiroRules = [];
try {
  kiroRules = JSON.parse(fs.readFileSync(kiroRulesPath));
} catch (err) {
  console.error("Error reading kiroRules.json:", err);
}

// API endpoint
app.post("/api/kiroExplain", (req, res) => {
  const { inputs } = req.body;
  const explanation = generateKiroExplanation(inputs);
  res.json({ explanation });
});

// Dynamic explanation based on rules
function generateKiroExplanation(inputs) {
  const { trafficPattern, budgetFocus, teamExperience, architecture } = inputs;
  let explanation = `Based on your selected inputs:\n\n`;

  kiroRules.forEach((rule) => {
    let matchPoints = 0;
    Object.keys(rule.conditions).forEach((key) => {
      if (rule.conditions[key].includes(inputs[key])) matchPoints++;
    });
    if (matchPoints > 0) {
      explanation += `- ${rule.service}: +${matchPoints} matching condition(s) (${rule.reason})\n`;
    }
  });

  // Find top match
  const scores = { lambda: 0, ec2: 0, ecs: 0 };
  kiroRules.forEach((rule) => {
    let matchScore = 0;
    Object.keys(rule.conditions).forEach((key) => {
      if (rule.conditions[key].includes(inputs[key])) matchScore++;
    });
    const key = rule.service.toLowerCase().includes("lambda")
      ? "lambda"
      : rule.service.toLowerCase().includes("ec2")
      ? "ec2"
      : "ecs";
    scores[key] += matchScore;
  });
  const maxScore = Math.max(...Object.values(scores));
  const topService = Object.keys(scores).find((k) => scores[k] === maxScore);

  explanation += `\nRecommended service: ${topService.toUpperCase()}`;

  return explanation;
}

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
