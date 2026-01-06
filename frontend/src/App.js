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
    architecture,
  });

  const serviceColors = {
    lambda: "#d0f0fd",
    ec2: "#ffe5b4",
    ecs: "#e0d0fd",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AWS Compute Decision Assistant</h1>
      <p>
        This tool helps backend developers choose the right AWS compute service
        based on traffic, budget, team experience, and architecture needs.
      </p>

      {/* User Inputs */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Your Requirements</h3>

        <label>
          Traffic Pattern:
          <select
            value={trafficPattern}
            onChange={(e) => setTrafficPattern(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="spiky">Spiky</option>
            <option value="consistent">Consistent</option>
            <option value="high">High</option>
          </select>
        </label>
        <br />

        <label>
          Budget Focus:
          <select
            value={budgetFocus}
            onChange={(e) => setBudgetFocus(e.target.value)}
          >
            <option value="lowest">Lowest Cost</option>
            <option value="predictable">Predictable Cost</option>
          </select>
        </label>
        <br />

        <label>
          Team Experience:
          <select
            value={teamExperience}
            onChange={(e) => setTeamExperience(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="strong-devops">Strong DevOps</option>
          </select>
        </label>
        <br />

        <label>
          Architecture Style:
          <select
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
          >
            <option value="event-driven">Event-driven</option>
            <option value="microservices">Microservices</option>
            <option value="monolith">Monolith</option>
          </select>
        </label>
      </div>

      {/* Recommendation */}
      <div
        style={{
          background: "#f0f8ff",
          padding: "15px",
          marginBottom: "20px",
          borderLeft: "5px solid #4CAF50",
        }}
      >
        <h2>Recommendation</h2>
        <p>
          <strong>{recommendation.service}</strong>
        </p>
        <p>{recommendation.reason}</p>
      </div>

      {/* Service Comparison Cards */}
      {Object.keys(data).map((service) => {
        const isRecommended = recommendation.service
          .toLowerCase()
          .includes(service);
        return (
          <div
            key={service}
            className="card"
            style={{
              border: "1px solid #ccc",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: isRecommended
                ? "#d1f7d6"
                : serviceColors[service],
              boxShadow: isRecommended ? "0 0 10px #4CAF50" : "none",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            <h2>{service.toUpperCase()}</h2>

            {isRecommended && (
              <div
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  display: "inline-block",
                  marginBottom: "10px",
                  fontSize: "0.9em",
                }}
              >
                Recommended: {recommendation.reason}
              </div>
            )}

            <Section title="Cost" items={data[service].cost} />
            <Section title="Scalability" items={data[service].scalability} />
            <Section
              title="Operational Effort"
              items={data[service].operationalEffort}
            />
            <Section title="Learning Curve" items={data[service].learningCurve} />
            <Section title="Best Use Cases" items={data[service].bestUseCases} />
          </div>
        );
      })}
    </div>
  );
}

// Section component
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
