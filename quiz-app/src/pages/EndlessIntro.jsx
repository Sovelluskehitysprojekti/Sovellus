import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EndlessIntro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || "easy";

  const handleStart = () => {
    navigate("/endless/play", {
      state: { difficulty },
    });
  };

  return (
    <div className="app-container landing-page">
      <h1>🔁 Endless Mode</h1>
      <p>
        Try to build the longest streak you can. Questions come from any category.
      </p>

      <div
        style={{
          background: "#f8fafc",
          borderRadius: 16,
          padding: "18px 20px",
          maxWidth: 600,
          width: "100%",
          textAlign: "left",
          marginBottom: "1.5rem",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: 8, color: "#1e3a8a" }}>📜 Rules</h3>
        <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: "#374151" }}>
          <li>You start with <strong>60 seconds</strong>.</li>
          <li>Each correct answer adds <strong>+10 seconds</strong> to the timer.</li>
          <li>If you answer <strong>wrong</strong> or the timer hits <strong>0</strong>, the run ends.</li>
          <li>Your score is your <strong>correct streak</strong>.</li>
          <li>Endless mode uses questions from <strong>all categories</strong>.</li>
          <li>Submit your best streak to the <strong>public leaderboard</strong>.</li>
        </ul>
      </div>

      <button className="primary-btn" onClick={handleStart}>
        Start Endless Mode
      </button>

      <button
        className="ghost-btn"
        style={{ marginTop: "0.75rem" }}
        onClick={() => navigate("/")}
      >
        Back to menu
      </button>
    </div>
  );
};

export default EndlessIntro;
