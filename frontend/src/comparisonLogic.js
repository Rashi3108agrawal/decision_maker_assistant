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
    },
    fargate: {
      cost: [
        "Pay for vCPU and memory per second",
        "No EC2 instance costs"
      ],
      scalability: [
        "Automatic scaling via ECS"
      ],
      operationalEffort: [
        "Low – serverless containers"
      ],
      learningCurve: [
        "Moderate"
      ],
      bestUseCases: [
        "Containerized microservices",
        "Variable workloads without EC2 management"
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

// -------------------- COST ESTIMATION --------------------
// Mock AWS pricing formulas (simplified for demo)
export function estimateCosts(inputs) {
  const { trafficPattern, budgetFocus } = inputs;
  const baseRequests = trafficPattern === "low" ? 100000 : trafficPattern === "spiky" ? 500000 : trafficPattern === "consistent" ? 1000000 : 2000000;
  const computeTime = trafficPattern === "high" ? 200 : 100; // GB-s per month

  const lambdaCost = (baseRequests * 0.0000002) + (computeTime * 0.00001667); // $0.20 per 1M requests + $0.00001667 per GB-s
  const ec2Cost = budgetFocus === "lowest" ? 50 : 100; // Mock monthly cost
  const ecsCost = budgetFocus === "lowest" ? 60 : 120; // Mock monthly cost
  const fargateCost = (baseRequests * 0.00000025) + (computeTime * 0.00001417); // Approximate Fargate pricing

  return {
    lambda: Math.round(lambdaCost * 100) / 100,
    ec2: ec2Cost,
    ecs: ecsCost,
    fargate: Math.round(fargateCost * 100) / 100
  };
}

// -------------------- RECOMMENDATION LOGIC --------------------
export function getRecommendation(inputs, kiroRules = [], selectedServices = ['lambda', 'ec2', 'ecs', 'fargate']) {
  if (!Array.isArray(kiroRules) || kiroRules.length === 0) {
    return {
      top3: [],
      reasoningPath: ""
    };
  }

  const scores = { lambda: 0, ec2: 0, ecs: 0, fargate: 0 };
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
      : rule.service.toLowerCase().includes("fargate")
      ? "fargate"
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
    ecs: "Amazon ECS",
    fargate: "AWS Fargate"
  };

  // Calculate total possible score (number of rules)
  const totalPossible = kiroRules.length;
  const maxScore = Math.max(...Object.values(scores));

  // Create top3 with confidence, filtered by selected services
  const top3 = Object.keys(scores)
    .filter(key => selectedServices.includes(key))
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
