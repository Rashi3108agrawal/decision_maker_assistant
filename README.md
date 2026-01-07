# AWS Compute Decision Assistant

This tool helps users compare AWS Lambda, EC2, ECS, and Fargate by explaining trade-offs instead of giving a single answer. It uses AI-powered reasoning to provide personalized recommendations based on your specific requirements.

## Features

- **Interactive Comparison**: Compare AWS compute services with real-time cost estimates
- **AI-Powered Recommendations**: Kiro-driven logic for intelligent service matching
- **Visual Trade-off Analysis**: D3.js radar charts showing cost, scalability, and operational effort
- **Transparent Reasoning**: See how rules are applied with step-by-step explanations
- **User Feedback Loop**: Rate recommendations to improve future suggestions

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Node.js API   │    │   Kiro Rules    │
│                 │    │                 │    │                 │
│ - User Inputs   │◄──►│ - AI Explanations│◄──►│ - Decision Logic │
│ - Cost Estimates│    │ - Rule Processing│    │ - Recommendations│
│ - Visual Charts │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Setup Guide

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd decision_maker_assistant
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start the React app
   cd frontend
   npm start

   # Terminal 2: Start the Node.js server
   cd ../server
   node index.js
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Kiro Integration

This project demonstrates how Kiro accelerates development by providing structured reasoning for complex decision-making.

### How Kiro Works

Kiro rules are defined in JSON format, matching user inputs to service recommendations:

```json
{
  "conditions": {
    "trafficPattern": ["spiky"],
    "budgetFocus": ["lowest"],
    "teamExperience": ["beginner", "intermediate"],
    "architecture": ["event-driven"]
  },
  "service": "AWS Lambda",
  "reason": "Perfect match for spiky traffic with pay-per-execution pricing..."
}
```

### Code Example

The recommendation logic processes rules dynamically:

```javascript
export function getRecommendation(inputs, kiroRules = []) {
  const scores = { lambda: 0, ec2: 0, ecs: 0, fargate: 0 };

  kiroRules.forEach((rule) => {
    let matchScore = 0;
    Object.keys(rule.conditions).forEach((key) => {
      if (rule.conditions[key].includes(inputs[key])) matchScore++;
    });

    const serviceKey = rule.service.toLowerCase().includes("lambda") ? "lambda" :
                      rule.service.toLowerCase().includes("ec2") ? "ec2" :
                      rule.service.toLowerCase().includes("fargate") ? "fargate" : "ecs";

    scores[serviceKey] += matchScore;
  });

  // Return top 3 recommendations with confidence scores
  return { top3, reasoningPath };
}
```

### Kiro Prompts Used

See `.kiro/prompts.md` and `.kiro/output.md` for the prompts that generated the decision rules.

## Screenshots

### Main Interface
![Main Interface](screenshots/main-interface.png)
*User selects requirements and sees cost estimates*

### Recommendation Results
![Recommendations](screenshots/recommendations.png)
*AI-powered recommendations with confidence scores*

### Trade-off Visualization
![Radar Chart](screenshots/radar-chart.png)
*Interactive D3.js charts showing service comparisons*

## Built Using

- **React** - Frontend framework
- **D3.js** - Data visualization
- **Node.js/Express** - Backend API
- **Kiro** - AI-powered reasoning engine
