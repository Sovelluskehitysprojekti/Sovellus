import React, { useEffect, useRef } from "react";
import SubmitScore from "./SubmitScore";

const Result = ({ score, total, restartGame, meta }) => {
  // Prevent duplicate saves in React Strict Mode (dev)
  const didSave = useRef(false);

  useEffect(() => {
    if (didSave.current) return;
    didSave.current = true;

    // Best score
    const best = Number(localStorage.getItem("triviaBestScore") || 0);
    if (score > best) localStorage.setItem("triviaBestScore", String(score));

    // Recent (keep 5)
    const raw = localStorage.getItem("triviaRecentScores");
    let recent = [];
    try {
      recent = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(recent)) recent = [];
    } catch {
      recent = [];
    }

    const entry = {
      date: new Date().toISOString(),
      score,
      total,
      difficulty: meta?.difficulty || "easy",
      groupId: meta?.groupId || "any",
      subcategoryId: meta?.subcategoryId ?? null,
    };

    // Remove identical existing entry to avoid duplicates
    const cleaned = recent.filter(
      (r) =>
        !(
          r.score === entry.score &&
          r.total === entry.total &&
          r.groupId === entry.groupId &&
          r.subcategoryId === entry.subcategoryId &&
          r.difficulty === entry.difficulty
        )
    );

    const updated = [entry, ...cleaned].slice(0, 5);
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

      {/* Leaderboard submit */}
      <SubmitScore score={score} total={total} onSubmitted={() => { /* optional toast */ }} />
    </div>
  );
};

export default Result;
