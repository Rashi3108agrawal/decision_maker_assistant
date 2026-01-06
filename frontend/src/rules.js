// rules.js

export const recommendationRules = [
  {
    conditions: { trafficPattern: ["low", "spiky"], architecture: ["event-driven"] },
    service: "AWS Lambda",
    reason:
      "Lambda is ideal for low or unpredictable traffic and event-driven workloads. " +
      "You only pay for execution, and it requires minimal operational effort."
  },
  {
    conditions: { trafficPattern: ["consistent"], teamExperience: ["beginner", "intermediate"] },
    service: "Amazon ECS (Fargate)",
    reason:
      "ECS Fargate is perfect for consistent traffic with moderate operational complexity. " +
      "It avoids server management and supports microservices architectures."
  },
  {
    conditions: { trafficPattern: ["high"], budgetFocus: ["predictable"], teamExperience: ["strong-devops"] },
    service: "Amazon EC2",
    reason:
      "EC2 with Reserved Instances is cost-effective for high, predictable workloads " +
      "when you have the expertise to manage infrastructure."
  },
  {
    conditions: { architecture: ["microservices"] },
    service: "Amazon ECS",
    reason:
      "ECS is well-suited for microservices architectures, offering container orchestration " +
      "with manageable operational complexity."
  }
];
