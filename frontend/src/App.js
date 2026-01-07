import { getRecommendation, getComparison, fetchKiroRules } from "./comparisonLogic";
import { useState, useEffect } from "react";

function App() {
  const data = getComparison();

  const [trafficPattern, setTrafficPattern] = useState("spiky");
  const [budgetFocus, setBudgetFocus] = useState("lowest");
  const [teamExperience, setTeamExperience] = useState("beginner");
  const [architecture, setArchitecture] = useState("event-driven");
  const [kiroRules, setKiroRules] = useState([]);
  const [aiExplanation, setAiExplanation] = useState("");

  useEffect(() => {
    fetchKiroRules().then(setKiroRules);
  }, []);

  const recommendation = kiroRules.length
    ? getRecommendation({ trafficPattern, budgetFocus, teamExperience, architecture }, kiroRules)
    : getRecommendation({ trafficPattern, budgetFocus, teamExperience, architecture }, kiroRules);

  const serviceColors = {
    lambda: "#d0f0fd",
    ec2: "#ffe5b4",
    ecs: "#e0d0fd"
  };

  // Collapsible state
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (service, section) => {
    setOpenSections((prev) => ({
      ...prev,
      [`${service}-${section}`]: !prev[`${service}-${section}`]
    }));
  };
  // Updates an input value and clears previous AI explanation
const handleInputChange = (setter) => (value) => {
  setter(value);
  setAiExplanation(""); // reset AI explanation
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
  <select value={trafficPattern} onChange={(e) => handleInputChange(setTrafficPattern)(e.target.value)}>
    <option value="low">Low</option>
    <option value="spiky">Spiky</option>
    <option value="consistent">Consistent</option>
    <option value="high">High</option>
  </select>
</label>

<label>
  Budget Focus:
  <select value={budgetFocus} onChange={(e) => handleInputChange(setBudgetFocus)(e.target.value)}>
    <option value="lowest">Lowest Cost</option>
    <option value="predictable">Predictable Cost</option>
  </select>
</label>

<label>
  Team Experience:
  <select value={teamExperience} onChange={(e) => handleInputChange(setTeamExperience)(e.target.value)}>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="strong-devops">Strong DevOps</option>
  </select>
</label>

<label>
  Architecture Style:
  <select value={architecture} onChange={(e) => handleInputChange(setArchitecture)(e.target.value)}>
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
    transition: "all 0.5s"
  }}
>
<button
  onClick={async () => {
    const response = await fetch("http://localhost:5000/api/kiroExplain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: { trafficPattern, budgetFocus, teamExperience, architecture }
      })
    });

    const data = await response.json();
    setAiExplanation(data.explanation);
  }}
>
  Explain My Recommendation (AI)
</button>

{aiExplanation && (
  <div
    style={{
      background: "#fff8dc",
      padding: "15px",
      marginTop: "20px",
      borderLeft: "5px solid #ff9800"
    }}
  >
    <h3>AI Explanation (Kiro-powered)</h3>
    <p style={{ whiteSpace: "pre-line" }}>{aiExplanation}</p>
  </div>
)}


  <h2>Recommendation</h2>
  <p>
    <strong>{recommendation?.service || "Loading..."}</strong>

  </p>
  <p style={{ fontStyle: "italic" }}>{recommendation.reason}</p>
  <p style={{ fontSize: "0.8em", color: "#555" }}>
    <strong>Reasoning path:</strong> {recommendation?.reasoningPath || "Evaluating rules..."}

  </p>
</div>

      {/* Service Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
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
                    transition: "all 0.5s ease",
                  }}
                >
                  Recommended: {recommendation.reason}
                </div>
              )}

              {/* Collapsible Sections */}
              {Object.keys(data[service]).map((section) => {
                const key = `${service}-${section}`;
                return (
                  <div key={key} style={{ marginBottom: "10px" }}>
                    <strong
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSection(service, section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                      {openSections[key] ? " ▼" : " ▶"}
                    </strong>
                    {openSections[key] && (
                      <ul>
                        {data[service][section].map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Simple fadeIn animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
          }
        `}
      </style>
    </div>
  );
}

export default App;
