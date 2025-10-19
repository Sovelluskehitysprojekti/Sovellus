import React, { useEffect, useRef } from "react";

const Result = ({ score, total, restartGame, meta }) => {
  // Prevent duplicate saves (e.g., React Strict Mode double-invoking effects in dev)
  const didSave = useRef(false);

  useEffect(() => {
    if (didSave.current) return;
    didSave.current = true;

    // Update best score
    const best = Number(localStorage.getItem("triviaBestScore") || 0);
    if (score > best) {
      localStorage.setItem("triviaBestScore", String(score));
    }

    // Append to "recent" (keep max 5)
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

    // De-dup: remove identical existing entry (same score/total/topic/difficulty/subcategory)
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
    ratio > 0.8 ? "🌟 Outstanding!" :
    ratio > 0.5 ? "👏 Nice work!" :
    "💪 Keep practicing!";

  return (
    <div className="result-container">
      <h2>Your Score: {score} / {total}</h2>
      <p className="result-message">{message}</p>
      <button className="primary-btn" onClick={restartGame}>Play Again</button>
    </div>
  );
};

export default Result;
