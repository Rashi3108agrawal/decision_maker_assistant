import { getComparison, getRecommendation } from "./comparisonLogic";
import { useState } from "react";

function App() {
  const data = getComparison();
  const [trafficPattern, setTrafficPattern] = useState("spiky");
const [budgetFocus, setBudgetFocus] = useState("lowest");
const [teamExperience, setTeamExperience] = useState("beginner");
const [architecture, setArchitecture] = useState("event-driven");

  const recommendation = getRecommendation({
  trafficPattern,
  budgetFocus,
  teamExperience,
  architecture
});


  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AWS Compute Decision Assistant</h1>
      <p>
  This tool helps backend developers choose the right AWS compute service
  based on traffic, budget, team experience, and architecture needs.
</p>

      <div style={{ marginBottom: "20px" }}>
  <h3>Your Requirements</h3>

<label>
  Traffic Pattern:
  <select value={trafficPattern} onChange={e => setTrafficPattern(e.target.value)}>
    <option value="low">Low</option>
    <option value="spiky">Spiky</option>
    <option value="consistent">Consistent</option>
    <option value="high">High</option>
  </select>
</label>
<br />

<label>
  Budget Focus:
  <select value={budgetFocus} onChange={e => setBudgetFocus(e.target.value)}>
    <option value="lowest">Lowest Cost</option>
    <option value="predictable">Predictable Cost</option>
  </select>
</label>
<br />

<label>
  Team Experience:
  <select value={teamExperience} onChange={e => setTeamExperience(e.target.value)}>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="strong-devops">Strong DevOps</option>
  </select>
</label>
<br />

<label>
  Architecture Style:
  <select value={architecture} onChange={e => setArchitecture(e.target.value)}>
    <option value="event-driven">Event-driven</option>
    <option value="microservices">Microservices</option>
    <option value="monolith">Monolith</option>
  </select>
</label>
</div>
<div style={{ background: "#f0f8ff", padding: "15px", marginBottom: "20px" }}>
  <h2>Recommendation</h2>
  <p><strong>{recommendation.service}</strong></p>
  <p>{recommendation.reason}</p>
</div>

      {Object.keys(data).map((service) => (
        <div
          key={service}
          style={{
            border: "1px solid #ccc",
            marginBottom: "20px",
            padding: "15px"
          }}
        >
          <h2>{service.toUpperCase()}</h2>

          <Section title="Cost" items={data[service].cost} />
          <Section title="Scalability" items={data[service].scalability} />
          <Section title="Operational Effort" items={data[service].operationalEffort} />
          <Section title="Learning Curve" items={data[service].learningCurve} />
          <Section title="Best Use Cases" items={data[service].bestUseCases} />
        </div>
      ))}
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>{title}:</strong>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
