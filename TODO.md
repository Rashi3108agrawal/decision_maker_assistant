# TODO: Hackathon Improvements for AWS Compute Decision Assistant

## 1. Enhanced User Experience (Priority 1)
- [x] Add real-time cost estimation in comparisonLogic.js (mock AWS pricing formulas)
- [x] Upgrade TradeoffChart.js to use D3.js for interactive radar charts with hover tooltips
- [x] Add user feedback loop (rating/comment form) in App.js, storing in localStorage

## 2. Expanded Service Coverage (Priority 2)
- [ ] Add AWS Fargate as new service option in comparisonLogic.js
- [ ] Update kiroRules.json with Fargate rules for containerized workloads

## 3. Strengthen Kiro Integration (Priority 1)
- [ ] Add "How Kiro Works" collapsible section in App.js showing matched rules and reasoning path
- [ ] Enhance AI explanations in server/index.js (more detailed prompts, bullet points)
- [ ] Add Kiro demo mode toggle in App.js for step-by-step rule application with code snippets

## 4. Technical Robustness (Priority 2)
- [ ] Create unit tests for comparisonLogic.js using Jest (new file: frontend/src/comparisonLogic.test.js)
- [ ] Add performance optimizations: Memoize getRecommendation in comparisonLogic.js, lazy load charts in App.js
- [ ] Add input validation and security in server/index.js for /api/kiroExplain endpoint

## 5. Documentation and Submission Prep (Priority 1)
- [ ] Update README.md with screenshots placeholders, architecture diagram, setup guide, Kiro Integration section
- [ ] Create blog-post-draft.md with outline, problem/solution, Kiro demo, screenshot placeholders

## Followup Steps
- [ ] Run tests and verify app functionality
- [ ] Test on different devices for responsiveness
- [ ] Ensure /.kiro directory is in repo and not gitignored
- [ ] Deploy to GitHub Pages or AWS Amplify for demo
