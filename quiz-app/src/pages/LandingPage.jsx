import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container landing-page">
      <h1>Trivia Quest!</h1>
      <p>Test your knowledge across multiple categories!</p>
      <button onClick={() => navigate("/trivia")}>Start Game</button>

      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%", marginTop: "50px", gap: "20px" }}>
        <div style={{ flex: 1, minWidth: "120px", textAlign: "left", color: "#ff6b6b" }}>
          <h3>Leaderboard</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Player1 - 100</li>
            <li>Player2 - 80</li>
            <li>Player3 - 60</li>
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: "120px", textAlign: "right", color: "#4ade80" }}>
          <h3>Your Scores</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Last Game - 7/10</li>
            <li>Best Score - 9/10</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
