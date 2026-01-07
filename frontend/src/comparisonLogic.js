// -------------------- COMPARISON DATA --------------------
export function getComparison() {
  return {
    lambda: {
      cost: [
        "Pay-per-execution (requests + compute time)",
        "Free tier: 1M requests/month",
        "Cost-effective for spiky workloads"
      ],
      scalability: [
        "Automatic scaling",
        "Near-instant scale-up"
      ],
      operationalEffort: [
        "No server management",
        "Fully managed by AWS"
      ],
      learningCurve: [
        "Low to moderate"
      ],
      bestUseCases: [
        "Event-driven APIs",
        "Variable traffic"
      ]
    },
    ec2: {
      cost: [
        "Pay for running instances",
        "Best for constant workloads"
      ],
      scalability: [
        "Manual / Auto Scaling Groups"
      ],
      operationalEffort: [
        "High – OS & infra management"
      ],
      learningCurve: [
        "High"
      ],
      bestUseCases: [
        "Legacy apps",
        "Long-running services"
      ]
    },
    ecs: {
      cost: [
        "Pay for containers / Fargate"
      ],
      scalability: [
        "Container-level scaling"
      ],
      operationalEffort: [
        "Moderate – container management"
      ],
      learningCurve: [
        "Moderate"
      ],
      bestUseCases: [
        "Microservices"
      ]
    }
  };
}

// -------------------- FETCH KIRO RULES --------------------
export async function fetchKiroRules() {
  try {
    const res = await fetch("/kiroRules.json");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Failed to load Kiro rules", e);
    return [];
  }
}

// -------------------- RECOMMENDATION LOGIC --------------------
export function getRecommendation(inputs, kiroRules = []) {
  if (!Array.isArray(kiroRules) || kiroRules.length === 0) {
    return {
      top3: [],
      reasoningPath: ""
    };
  }

  const scores = { lambda: 0, ec2: 0, ecs: 0 };
  const reasoningPath = [];

  kiroRules.forEach((rule) => {
    let matchScore = 0;

    Object.keys(rule.conditions || {}).forEach((key) => {
      if (rule.conditions[key].includes(inputs[key])) {
        matchScore += 1;
      }
    });

    const serviceKey = rule.service.toLowerCase().includes("lambda")
      ? "lambda"
      : rule.service.toLowerCase().includes("ec2")
      ? "ec2"
      : "ecs";

    scores[serviceKey] += matchScore;

    if (matchScore > 0) {
      reasoningPath.push(
        `${rule.service} matched ${matchScore} condition(s)`
      );
    }
  });

  const serviceNames = {
    lambda: "AWS Lambda",
    ec2: "Amazon EC2",
    ecs: "Amazon ECS"
  };

  // Calculate total possible score (number of rules)
  const totalPossible = kiroRules.length;
  const maxScore = Math.max(...Object.values(scores));

  // Create top3 with confidence
  const top3 = Object.keys(scores)
    .map(key => ({
      service: serviceNames[key],
      score: scores[key],
      confidence: maxScore > 0 ? Math.round((scores[key] / maxScore) * 100) : 0
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    top3,
    reasoningPath: reasoningPath.join(" | ")
  };
}
