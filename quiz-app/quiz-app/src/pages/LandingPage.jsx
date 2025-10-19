import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAllGroups, getGroupById } from "../utils/categoryGroups";

const LandingPage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [groupId, setGroupId] = useState("any");
  const [bestScore, setBestScore] = useState(0);
  const [recentScores, setRecentScores] = useState([]);

  // "More specific?" toggle + chosen subcategory
  const [showSpecifics, setShowSpecifics] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState("");

  useEffect(() => {
    const storedBest = localStorage.getItem("triviaBestScore");
    if (storedBest) setBestScore(Number(storedBest));

    const recent = localStorage.getItem("triviaRecentScores");
    if (recent) {
      try {
        setRecentScores(JSON.parse(recent));
      } catch {
        setRecentScores([]);
      }
    }
  }, []);

  // Reset specifics when switching group
  useEffect(() => {
    setSubcategoryId("");
    setShowSpecifics(false);
  }, [groupId]);

  const groups = useMemo(() => listAllGroups(), []);
  const currentGroup = useMemo(() => getGroupById(groupId), [groupId]);

  const handleStart = () => {
    navigate("/trivia", {
      state: {
        difficulty,
        groupId,
        subcategoryId: showSpecifics && subcategoryId ? Number(subcategoryId) : null,
      },
    });
  };

  return (
    <div className="app-container landing-page">
      <h1>🎯 Trivia Quest</h1>
      <p>Pick a topic and difficulty — go broad or get specific.</p>

      <div className="selectors">
        <label>
          Topic:
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </label>

        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      {/* Only show specifics control if this group actually has specifics */}
      {groupId !== "any" && currentGroup.specifics.length > 0 && (
        <div className="specifics-wrap">
          <button
            className="secondary-btn"
            type="button"
            onClick={() => setShowSpecifics((s) => !s)}
          >
            {showSpecifics ? "Hide specifics" : "Want something more specific?"}
          </button>

          {showSpecifics && (
            <label className="specifics-select">
              Subcategory:
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
              >
                <option value="">— Select —</option>
                {currentGroup.specifics.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      <button className="primary-btn" onClick={handleStart}>Start Game</button>

      <div className="scoreboard">
        <h3>🏆 Best Score: {bestScore}</h3>

        {/* Recent scores (last 5) */}
        {recentScores.length > 0 && (
          <div style={{ marginTop: 10, textAlign: "left" }}>
            <strong>Recent:</strong>
            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
              {recentScores.slice(0, 5).map((r, i) => {
                const gName = getGroupById(r.groupId)?.name || "Any";
                const when = new Date(r.date).toLocaleDateString();
                return (
                  <li key={`${r.date}-${i}`}>
                    {when}: {r.score}/{r.total} · {gName} · {r.difficulty}
                    {r.subcategoryId ? ` · Sub ${r.subcategoryId}` : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
