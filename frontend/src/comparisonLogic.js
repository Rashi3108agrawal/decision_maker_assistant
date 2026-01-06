// comparisonLogic.js
// AWS Compute Comparison + Dynamic Recommendation

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

// -------------------- DYNAMIC RECOMMENDATION --------------------
export const recommendationRules = [
  {
    conditions: { trafficPattern: ["low", "spiky"], architecture: ["event-driven"] },
    service: "AWS Lambda",
    reason:
      "Lambda is ideal for low or unpredictable traffic and event-driven workloads. " +
      "You only pay for execution, with minimal operational effort."
  },
  {
    conditions: { trafficPattern: ["consistent"], teamExperience: ["beginner", "intermediate"] },
    service: "Amazon ECS (Fargate)",
    reason:
      "ECS Fargate balances control and simplicity for consistent traffic and moderate experience."
  },
  {
    conditions: { trafficPattern: ["high"], budgetFocus: ["predictable"], teamExperience: ["strong-devops"] },
    service: "Amazon EC2",
    reason:
      "EC2 with Reserved Instances is cost-effective for high, predictable workloads with experienced teams."
  },
  {
    conditions: { architecture: ["microservices"] },
    service: "Amazon ECS",
    reason:
      "ECS is well-suited for microservices, offering container orchestration with manageable complexity."
  }
];

export function getRecommendation(inputs) {
  for (const rule of recommendationRules) {
    const isMatch = Object.keys(rule.conditions).every((key) => {
      const ruleValues = rule.conditions[key];
      return ruleValues.includes(inputs[key]);
    });
    if (isMatch) {
      return { service: rule.service, reason: rule.reason };
    }
  }
  // Default fallback
  return {
    service: "AWS Lambda",
    reason:
      "Lambda is a safe default, offering automatic scaling, pay-per-use cost, and minimal infrastructure management."
  };
}
