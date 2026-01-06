export function getComparison() {
  return {
    lambda: {
  cost: [
    "Pay-per-execution model (requests + compute time)",
    "No charges when idle",
    "Free tier available",
    "Cost-effective for sporadic or unpredictable workloads",
    "Can be expensive for high-volume consistent traffic"
  ],
  scalability: [
    "Automatic scaling from zero to thousands of concurrent executions",
    "Near-instant scaling",
    "No capacity planning required",
    "Built-in fault tolerance across availability zones"
  ],
  operationalEffort: [
    "No server management required",
    "No OS patching or infrastructure maintenance",
    "Focus only on application code",
    "Built-in monitoring with CloudWatch"
  ],
  learningCurve: [
    "Low to moderate learning curve",
    "Requires understanding event-driven architecture",
    "Needs awareness of cold starts and execution limits",
    "Stateless programming model"
  ],
  bestUseCases: [
    "API backends with variable traffic",
    "Event-driven processing",
    "Scheduled tasks and cron jobs",
    "Microservices with clear boundaries"
  ]
},
ec2: {
  cost: [
    "Pay for instances while they are running",
    "Multiple pricing models: On-Demand, Reserved, Spot",
    "Reserved instances reduce cost for predictable workloads",
    "Cost-effective for consistent high utilization"
  ],
  scalability: [
    "Manual or auto-scaling groups required",
    "Slower scaling compared to Lambda",
    "Full control over scaling policies"
  ],
  operationalEffort: [
    "High operational responsibility",
    "Manage OS, security patches, and updates",
    "Need load balancers, monitoring, backups"
  ],
  learningCurve: [
    "Moderate to high",
    "Requires system administration knowledge",
    "Understanding of networking and security groups"
  ],
  bestUseCases: [
    "Legacy applications",
    "Long-running processes",
    "Applications needing full OS control",
    "High-performance workloads"
  ]
},
ecs: {
  cost: [
    "Pay for underlying compute resources",
    "ECS service itself is free",
    "Fargate pricing based on vCPU and memory",
    "Cost-effective for containerized workloads"
  ],
  scalability: [
    "Automatic scaling based on metrics",
    "Faster than EC2, slower than Lambda",
    "Scales at container level"
  ],
  operationalEffort: [
    "Moderate operational overhead",
    "AWS manages container orchestration",
    "Still need to manage container images"
  ],
  learningCurve: [
    "Moderate",
    "Requires Docker and container knowledge",
    "Understanding ECS concepts like tasks and services"
  ],
  bestUseCases: [
    "Microservices architectures",
    "Containerized applications",
    "Gradual migration from monoliths",
    "Applications needing consistent runtime environments"
  ]
}

  };
}
export function getRecommendation({
  trafficPattern,
  budgetFocus,
  teamExperience,
  architecture
}) {
  // SERVERLESS FIRST CASE
  if (
    (trafficPattern === "low" || trafficPattern === "spiky") &&
    architecture === "event-driven"
  ) {
    return {
      service: "AWS Lambda",
      reason:
        "Lambda is ideal for low or unpredictable traffic and event-driven workloads. " +
        "You only pay when the function runs, with almost zero operational overhead."
    };
  }

  // STARTUP / SMALL TEAM CASE
  if (
    trafficPattern === "consistent" &&
    teamExperience !== "strong-devops"
  ) {
    return {
      service: "Amazon ECS (Fargate)",
      reason:
        "ECS Fargate provides a good balance between control and simplicity. " +
        "It avoids server management while handling consistent traffic efficiently."
    };
  }

  // COST-OPTIMIZED, PREDICTABLE WORKLOAD
  if (
    trafficPattern === "high" &&
    budgetFocus === "predictable" &&
    teamExperience === "strong-devops"
  ) {
    return {
      service: "Amazon EC2",
      reason:
        "EC2 with Reserved Instances is cost-effective for high, predictable workloads " +
        "when you have the expertise to manage infrastructure."
    };
  }

  // MICROSERVICES CASE
  if (architecture === "microservices") {
    return {
      service: "Amazon ECS",
      reason:
        "ECS is well-suited for microservices architectures, offering container orchestration " +
        "with manageable operational complexity."
    };
  }

  // DEFAULT SAFE RECOMMENDATION
  return {
    service: "AWS Lambda",
    reason:
      "Lambda is a safe default for most teams starting out, offering automatic scaling, " +
      "low cost for variable workloads, and minimal infrastructure management."
  };
}
