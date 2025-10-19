import React, { useEffect } from "react";

const Result = ({ score, total, restartGame, meta }) => {
  useEffect(() => {
    // Best score
    const best = localStorage.getItem("triviaBestScore");
    if (!best || score > Number(best)) {
      localStorage.setItem("triviaBestScore", score);
    }

    // Recent scores (keep last 5)
    const recentRaw = localStorage.getItem("triviaRecentScores");
    let recent = [];
    try {
      recent = recentRaw ? JSON.parse(recentRaw) : [];
    } catch {
      recent = [];
    }

    const entry = {
      date: new Date().toISOString(),
      score,
      total,
      difficulty: meta?.difficulty || "easy",
      groupId: meta?.groupId || "any",
      subcategoryId: meta?.subcategoryId || null,
    };

    const updated = [entry, ...recent].slice(0, 5);
    localStorage.setItem("triviaRecentScores", JSON.stringify(updated));
  }, [score, total, meta]);

  const ratio = total ? score / total : 0;
  const message =
    ratio > 0.8 ? "🌟 Outstanding!"
    : ratio > 0.5 ? "👏 Nice work!"
    : "💪 Keep practicing!";

  return (
    <div className="result-container">
      <h2>Your Score: {score} / {total}</h2>
      <p className="result-message">{message}</p>
      <button className="primary-btn" onClick={restartGame}>Play Again</button>
    </div>
  );
};

export default Result;
