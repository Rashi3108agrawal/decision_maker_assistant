import { getRecommendation, getComparison, fetchKiroRules, estimateCosts } from "./comparisonLogic";
import { useState, useEffect, useMemo, lazy, Suspense } from "react";
const TradeoffChart = lazy(() => import("./tradeoffChart"));

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
    : { top3: [], reasoningPath: "" };

  const costEstimates = estimateCosts({ trafficPattern, budgetFocus });

  // Dynamic metrics based on recommendation scores (scale 1-10)
  const getServiceMetrics = (serviceName) => {
    const baseMetrics = {
      "AWS Lambda": { name: "Lambda", cost: 8, scalability: 9, ops: 9 },
      "Amazon EC2": { name: "EC2", cost: 6, scalability: 7, ops: 4 },
      "Amazon ECS": { name: "ECS", cost: 7, scalability: 8, ops: 6 }
    };
    return baseMetrics[serviceName] || { name: serviceName, cost: 5, scalability: 5, ops: 5 };
  };

  // Hover state for interactive effects
  const [hoveredService, setHoveredService] = useState(null);

  const serviceColors = {
    lambda: "#d0f0fd",
    ec2: "#ffe5b4",
    ecs: "#e0d0fd"
  };

  // Collapsible state
  const [openSections, setOpenSections] = useState({});
  const [kiroDemoMode, setKiroDemoMode] = useState(false);
  const [matchedRules, setMatchedRules] = useState([]);

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

  // Calculate matched rules for demo mode
  useEffect(() => {
    if (kiroRules.length > 0) {
      const inputs = { trafficPattern, budgetFocus, teamExperience, architecture };
      const matched = kiroRules.filter(rule => {
        let matchScore = 0;
        Object.keys(rule.conditions).forEach(key => {
          if (rule.conditions[key].includes(inputs[key])) matchScore++;
        });
        return matchScore > 0;
      });
      setMatchedRules(matched);
    }
  }, [trafficPattern, budgetFocus, teamExperience, architecture, kiroRules]);

  return (
    <div style={{
      padding: "30px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          padding: "40px",
          textAlign: "center"
        }}>
          <h1 style={{ margin: "0 0 15px 0", fontSize: "3em", fontWeight: "300" }}>AWS Compute Decision Assistant</h1>
          <p style={{ fontSize: "1.2em", opacity: 0.9, margin: 0 }}>
            Choose the perfect AWS compute service for your backend needs with AI-powered recommendations
          </p>
        </div>

        <div style={{ padding: "40px" }}>
          {/* User Inputs */}
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ color: "#333", marginBottom: "25px", fontSize: "1.5em", textAlign: "center" }}>Your Requirements</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px"
            }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "8px", color: "#555" }}>
                  Traffic Pattern:
                </label>
                <select
                  value={trafficPattern}
                  onChange={(e) => handleInputChange(setTrafficPattern)(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1em",
                    transition: "border-color 0.3s ease",
                    background: "#fff"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="low">Low</option>
                  <option value="spiky">Spiky</option>
                  <option value="consistent">Consistent</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "8px", color: "#555" }}>
                  Budget Focus:
                </label>
                <select
                  value={budgetFocus}
                  onChange={(e) => handleInputChange(setBudgetFocus)(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1em",
                    transition: "border-color 0.3s ease",
                    background: "#fff"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="lowest">Lowest Cost</option>
                  <option value="predictable">Predictable Cost</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "8px", color: "#555" }}>
                  Team Experience:
                </label>
                <select
                  value={teamExperience}
                  onChange={(e) => handleInputChange(setTeamExperience)(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1em",
                    transition: "border-color 0.3s ease",
                    background: "#fff"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="strong-devops">Strong DevOps</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "8px", color: "#555" }}>
                  Architecture Style:
                </label>
                <select
                  value={architecture}
                  onChange={(e) => handleInputChange(setArchitecture)(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1em",
                    transition: "border-color 0.3s ease",
                    background: "#fff"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="event-driven">Event-driven</option>
                  <option value="microservices">Microservices</option>
                  <option value="monolith">Monolith</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cost Estimation */}
          <div style={{ marginBottom: "40px", padding: "20px", background: "#f8f9fa", borderRadius: "10px" }}>
            <h3 style={{ color: "#333", marginBottom: "15px", textAlign: "center" }}>Estimated Monthly Costs</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px"
            }}>
              {Object.entries(costEstimates).map(([service, cost]) => (
                <div key={service} style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{service.toUpperCase()}</h4>
                  <p style={{ fontSize: "1.2em", fontWeight: "bold", color: "#28a745", margin: 0 }}>
                    ${cost}/month
                  </p>
                  <p style={{ fontSize: "0.8em", color: "#666", margin: "5px 0 0 0" }}>
                    Based on {trafficPattern} traffic
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.8em", color: "#666", textAlign: "center", marginTop: "15px" }}>
              * Estimates are simplified and for demonstration purposes. Actual costs may vary.
            </p>
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

      {/* Service Cards with Radar Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "25px",
        }}
      >
        {Object.keys(data).map((service) => {
          const serviceName = service === "lambda" ? "AWS Lambda" : service === "ec2" ? "Amazon EC2" : service === "ecs" ? "Amazon ECS" : "AWS Fargate";
          const rec = recommendation?.top3?.find(rec => rec.service === serviceName);
          const isRecommended = !!rec;
          const confidence = rec?.confidence || 0;
          const rank = isRecommended ? recommendation.top3.findIndex(r => r.service === serviceName) + 1 : null;
          const isHovered = hoveredService === service;

          return (
            <div
              key={service}
              className="card"
              style={{
                border: "2px solid #e0e0e0",
                padding: "20px",
                backgroundColor: isRecommended
                  ? `rgba(76, 175, 80, ${0.1 + (3 - rank) * 0.1})`
                  : serviceColors[service],
                boxShadow: isRecommended ? `0 0 15px rgba(76, 175, 80, ${0.3 + (3 - rank) * 0.1})` : "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                borderRadius: "10px",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={() => setHoveredService(service)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {isRecommended && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8em",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                >
                  #{rank} Recommended
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h2 style={{ margin: 0, color: "#333", fontSize: "1.5em" }}>{service.toUpperCase()}</h2>
                <div style={{
                  fontSize: "1em",
                  color: confidence > 0 ? "#28a745" : "#6c757d",
                  fontWeight: "bold",
                  background: confidence > 0 ? "#d4edda" : "#f8f9fa",
                  padding: "5px 10px",
                  borderRadius: "20px"
                }}>
                  {confidence}% Confidence
                </div>
              </div>

              {/* Mini Radar Chart */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <Suspense fallback={<div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
                  <TradeoffChart metrics={getServiceMetrics(serviceName)} isHovered={isHovered} />
                </Suspense>
              </div>

              {/* Collapsible Sections */}
              {Object.keys(data[service]).map((section) => {
                const key = `${service}-${section}`;
                return (
                  <div key={key} style={{ marginBottom: "10px" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1em",
                        fontWeight: "bold",
                        color: "#007bff",
                        textAlign: "left",
                        padding: "5px 0"
                      }}
                      onClick={() => toggleSection(service, section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                      {openSections[key] ? " ▼" : " ▶"}
                    </button>
                    {openSections[key] && (
                      <ul style={{ marginLeft: "20px", color: "#555" }}>
                        {data[service][section].map((item, index) => (
                          <li key={index} style={{ marginBottom: "5px" }}>{item}</li>
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
      </div>
    </div>
  );
}

export default App;
