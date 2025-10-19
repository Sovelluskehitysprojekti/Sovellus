import React, { useEffect } from "react";

const Result = ({ score, total, restartGame }) => {
  useEffect(() => {
    const best = localStorage.getItem("triviaBestScore");
    if (!best || score > Number(best)) {
      localStorage.setItem("triviaBestScore", score);
    }
  }, [score]);

  const message =
    score / total > 0.8
      ? "🌟 Outstanding!"
      : score / total > 0.5
      ? "👏 Nice work!"
      : "💪 Keep practicing!";

  return (
    <div className="result-container">
      <h2>Your Score: {score} / {total}</h2>
      <p className="result-message">{message}</p>
      <button className="primary-btn" onClick={restartGame}>
        Play Again
      </button>
    </div>
  );
};

export default Result;
