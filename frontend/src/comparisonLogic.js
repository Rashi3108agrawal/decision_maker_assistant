// comparisonLogic.js
// AWS Compute Comparison + Weighted Dynamic Recommendation

export function getComparison() {
  return {
    lambda: {
      cost: [
        "Pay-per-execution (requests + compute time)",
        "Free tier: 1M requests/month + 400,000 GB-seconds",
        "Cost-effective for sporadic workloads, can be expensive for high-volume"
      ],
      scalability: [
        "Automatic scaling from 0 to 1000+ concurrent executions",
        "Near-instant scaling response",
        "Built-in fault tolerance across AZs"
      ],
      operationalEffort: [
        "Minimal - AWS manages all infrastructure",
        "No server patching or OS updates",
        "Focus purely on application code"
      ],
      learningCurve: [
        "Low to moderate",
        "Requires understanding of event-driven architecture",
        "Stateless programming model may require architectural changes"
      ],
      bestUseCases: [
        "API backends with variable traffic",
        "Event processing (S3, DynamoDB, etc.)",
        "Scheduled tasks and cron jobs",
        "Microservices with clear boundaries"
      ]
    },
    ec2: {
      cost: [
        "Pay for running instances regardless of utilization",
        "On-Demand, Reserved, Spot options",
        "Cost-effective for consistent, high-utilization applications"
      ],
      scalability: [
        "Manual or auto-scaling groups required",
        "Takes minutes to launch new instances",
        "Can scale to thousands of instances"
      ],
      operationalEffort: [
        "High - full responsibility for OS, security patches, monitoring",
        "Need to manage load balancers, health checks",
        "Backup and disaster recovery planning"
      ],
      learningCurve: [
        "Moderate to high",
        "Requires system administration knowledge",
        "Networking, security groups, storage management"
      ],
      bestUseCases: [
        "Legacy applications requiring specific OS configurations",
        "Applications needing persistent local storage",
        "Long-running processes or background jobs",
        "High-performance computing workloads"
      ]
    },
    ecs: {
      cost: [
        "Pay for underlying EC2 instances or Fargate compute",
        "ECS service itself is free",
        "Fargate: pay per vCPU/memory allocated"
      ],
      scalability: [
        "Automatic scaling based on metrics",
        "Container-level scaling",
        "Can scale to thousands of containers",
        "Service discovery and load balancing built-in"
      ],
      operationalEffort: [
        "Moderate - AWS manages container orchestration",
        "Still need to manage container images and deployments",
        "Less OS management with Fargate"
      ],
      learningCurve: [
        "Moderate",
        "Requires Docker and containerization knowledge",
        "Understanding ECS tasks, services, clusters"
      ],
      bestUseCases: [
        "Microservices architectures",
        "Applications already containerized",
        "Consistent runtime environments",
        "Gradual migration from monoliths"
      ]
    }
  };
}

// -------------------- WEIGHTED RECOMMENDATION --------------------
const serviceWeights = {
  lambda: 0,
  ec2: 0,
  ecs: 0
};

export function getRecommendation(inputs) {
  // Reset weights
  for (let key in serviceWeights) serviceWeights[key] = 0;

  // Assign weights based on input
  const { trafficPattern, budgetFocus, teamExperience, architecture } = inputs;

  // Traffic pattern
  if (["low", "spiky"].includes(trafficPattern)) serviceWeights.lambda += 2;
  if (trafficPattern === "consistent") serviceWeights.ecs += 2;
  if (trafficPattern === "high") serviceWeights.ec2 += 2;

  // Budget
  if (budgetFocus === "lowest") serviceWeights.lambda += 1;
  if (budgetFocus === "predictable") serviceWeights.ec2 += 1;

  // Team experience
  if (["beginner", "intermediate"].includes(teamExperience)) serviceWeights.lambda += 1;
  if (teamExperience === "strong-devops") serviceWeights.ec2 += 1;

  // Architecture
  if (architecture === "event-driven") serviceWeights.lambda += 2;
  if (architecture === "microservices") serviceWeights.ecs += 2;
  if (architecture === "monolith") serviceWeights.ec2 += 1;

  // Determine recommendation
  const maxWeight = Math.max(...Object.values(serviceWeights));
  const recommendedService = Object.keys(serviceWeights).find(
    (key) => serviceWeights[key] === maxWeight
  );

  // Reasoning path
  const reasoningPath = Object.entries(serviceWeights)
    .map(([service, weight]) => `${service.toUpperCase()}: ${weight}`)
    .join(" | ");

  // Human-readable service name
  const serviceNames = {
    lambda: "AWS Lambda",
    ec2: "Amazon EC2",
    ecs: "Amazon ECS"
  };

  return {
    service: serviceNames[recommendedService],
    reason: `Based on weighted analysis: ${reasoningPath}`
  };
}
