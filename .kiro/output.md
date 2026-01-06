## AWS Compute Recommendation Logic

This project converts architectural decision-making into executable logic.
Based on user inputs such as traffic patterns, budget focus, team experience,
and architecture style, the system recommends one of the following:

- AWS Lambda
- Amazon ECS (Fargate)
- Amazon EC2

The recommendation logic is derived from real-world AWS trade-offs, including:
- Cost efficiency
- Scalability
- Operational overhead
- Team expertise

The logic is implemented inside `getRecommendation()` and dynamically updates
the UI as user inputs change.

This demonstrates how Kiro accelerates turning design reasoning into
production-ready code.


<!-- Output 1 -->
I'll provide a comprehensive comparison of AWS Lambda, EC2, and ECS for backend applications. Let me structure this to cover all the key trade-offs you mentioned.

## AWS Compute Services Comparison

### AWS Lambda (Serverless Functions)

**Cost**
- Pay-per-execution model (requests + compute time)
- No charges when idle
- Free tier: 1M requests/month + 400,000 GB-seconds
- Most cost-effective for sporadic or unpredictable workloads
- Can become expensive for high-volume, consistent traffic

**Scalability**
- Automatic scaling from 0 to 1000+ concurrent executions
- Near-instant scaling response
- No capacity planning required
- Built-in fault tolerance across AZs

**Operational Effort**
- Minimal - AWS manages all infrastructure
- No server patching, OS updates, or capacity management
- Focus purely on application code
- Built-in monitoring with CloudWatch

**Learning Curve**
- Low to moderate
- Requires understanding of event-driven architecture
- Need to learn Lambda-specific concepts (cold starts, execution context)
- Stateless programming model can require architectural changes

**Best Use Cases**
- API backends with variable traffic
- Event processing (S3 uploads, DynamoDB changes)
- Scheduled tasks and cron jobs
- Microservices with clear boundaries
- Real-time data processing

### Amazon EC2 (Virtual Machines)

**Cost**
- Pay for running instances regardless of utilization
- Various pricing models: On-Demand, Reserved, Spot
- Reserved instances offer 30-60% savings for predictable workloads
- Can be cost-effective for consistent, high-utilization applications

**Scalability**
- Manual or auto-scaling groups required
- Takes minutes to launch new instances
- Full control over scaling policies
- Can scale to thousands of instances

**Operational Effort**
- High - full responsibility for OS, security patches, monitoring
- Need to manage load balancers, health checks
- Backup and disaster recovery planning
- Performance tuning and capacity planning

**Learning Curve**
- Moderate to high
- Requires system administration knowledge
- Need to understand networking, security groups, storage
- Traditional server management skills apply

**Best Use Cases**
- Legacy applications requiring specific OS configurations
- Applications needing persistent local storage
- Long-running processes or background jobs
- Custom software stacks or specialized requirements
- High-performance computing workloads

### Amazon ECS (Container Orchestration)

**Cost**
- Pay for underlying EC2 instances or Fargate compute
- ECS service itself is free
- Fargate: Pay per vCPU/memory allocated
- EC2 launch type: More cost-effective for consistent workloads

**Scalability**
- Automatic scaling based on metrics
- Container-level scaling (faster than EC2, slower than Lambda)
- Can scale to thousands of containers
- Service discovery and load balancing built-in

**Operational Effort**
- Moderate - AWS manages container orchestration
- Still need to manage container images and deployments
- Less OS management with Fargate
- Built-in integration with AWS services

**Learning Curve**
- Moderate
- Requires Docker and containerization knowledge
- Understanding of ECS concepts (tasks, services, clusters)
- Networking and service mesh concepts helpful

**Best Use Cases**
- Microservices architectures
- Applications already containerized
- Need for consistent runtime environments
- Gradual migration from monoliths
- Applications requiring specific resource allocation

## Decision Matrix

| Factor | Lambda | EC2 | ECS |
|--------|--------|-----|-----|
| **Setup Time** | Minutes | Hours | Hours |
| **Maintenance** | None | High | Medium |
| **Cost (Variable Load)** | Excellent | Poor | Good |
| **Cost (Consistent Load)** | Poor | Excellent | Good |
| **Cold Start Latency** | 100ms-10s | None | Seconds |
| **Maximum Runtime** | 15 minutes | Unlimited | Unlimited |
| **State Management** | External only | Local + External | External preferred |
| **Vendor Lock-in** | High | Low | Medium |

## Recommendation Framework

**Choose Lambda when:**
- Traffic is unpredictable or sporadic
- You want zero operational overhead
- Application can be broken into small, stateless functions
- Budget is limited and you need pay-per-use pricing

**Choose EC2 when:**
- You need full control over the runtime environment
- Running legacy applications with specific requirements
- Consistent, high-volume traffic patterns
- Cost optimization through Reserved Instances is viable

**Choose ECS when:**
- You're already using containers
- Need microservices with moderate operational complexity
- Want container benefits without Kubernetes complexity
- Require predictable performance with automatic scaling

The choice often depends on your team's expertise, application architecture, and operational preferences. Many organizations use a combination of these services for different parts of their infrastructure.

<!-- Output 2 -->
I'd be happy to recommend the best AWS compute option for your specific situation, but I need to understand your context better. Let me ask a few key questions to give you the most accurate recommendation:

## Quick Assessment Questions

**Traffic Patterns:**
- What's your expected traffic volume? (requests per day/hour)
- Is traffic consistent or does it have peaks/valleys?
- Do you have seasonal spikes or unpredictable bursts?
- What's your acceptable response time/latency?

**Budget Constraints:**
- What's your monthly compute budget range?
- Are you optimizing for lowest cost or predictable costs?
- Can you commit to reserved capacity for discounts?

**Team Experience:**
- What's your team's background? (web dev, DevOps, system admin)
- Experience with containers, serverless, or traditional servers?
- How much time can you dedicate to infrastructure management?
- Preference for learning new technologies vs. using familiar tools?

## Quick Decision Tree (Based on Common Scenarios)

**If you're a startup or small team:**
- **Low/unpredictable traffic** → Lambda (pay only for what you use)
- **Consistent moderate traffic** → ECS Fargate (balance of simplicity and control)
- **High consistent traffic** → EC2 with Reserved Instances

**If you're an established company:**
- **Microservices architecture** → ECS or Lambda
- **Legacy applications** → EC2
- **Event-driven workloads** → Lambda

**If you're budget-conscious:**
- **Variable workload** → Lambda
- **Predictable workload** → EC2 Reserved Instances
- **Growing workload** → Start with Lambda, migrate to ECS/EC2 as you scale

Once you share your specific traffic, budget, and experience details, I can give you a precise recommendation with exact cost estimates and implementation guidance. What's your current situation?