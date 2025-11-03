import React from "react";
import SubmitScore from "./SubmitScore";

const EndlessResult = ({ score, restartEndless }) => {
  const message =
    score >= 20 ? "🔥 Incredible streak!"
    : score >= 10 ? "🌟 Great run!"
    : score >= 5  ? "👏 Nice effort!"
    : "💪 Keep going, you’ll get there!";

  return (
    <div className="result-container">
      <h2>Your streak: {score}</h2>
      <p className="result-message">{message}</p>

      <button className="primary-btn" onClick={restartEndless}>
        Try again
      </button>

      {/* Submit to endless leaderboard */}
      <SubmitScore score={score} />
    </div>
  );
};

export default EndlessResult;
