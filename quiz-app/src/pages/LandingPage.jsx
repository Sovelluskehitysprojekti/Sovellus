import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAllGroups, getGroupById } from "../utils/categoryGroups";
import LeaderboardTop10 from "../components/LeaderboardTop10";

// Relative time like "2h ago"
function timeAgo(iso) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(then).toLocaleDateString("en-GB");
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [groupId, setGroupId] = useState("any");
  const [bestScore, setBestScore] = useState(0);

  const [showSpecifics, setShowSpecifics] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState("");
  const [recentScores, setRecentScores] = useState([]);

  const groups = useMemo(() => listAllGroups(), []);
  const currentGroup = useMemo(() => getGroupById(groupId), [groupId]);
  const hasSpecifics = !!(currentGroup?.specifics && currentGroup.specifics.length > 0);

  useEffect(() => {
    const storedBest = localStorage.getItem("triviaBestScore");
    if (storedBest) setBestScore(Number(storedBest));

    try {
      const raw = localStorage.getItem("triviaRecentScores");
      const parsed = raw ? JSON.parse(raw) : [];
      // dedupe and clamp to 5
      const seen = new Set();
      const deduped = [];
      for (const r of parsed) {
        const key = [r.score, r.total, r.groupId, r.subcategoryId ?? "null", r.difficulty, r.date].join("|");
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(r);
        }
        if (deduped.length >= 5) break;
      }
      localStorage.setItem("triviaRecentScores", JSON.stringify(deduped));
      setRecentScores(deduped);
    } catch {
      setRecentScores([]);
    }
  }, []);

  useEffect(() => {
    setSubcategoryId("");
    setShowSpecifics(false);
  }, [groupId]);

  const handleStart = () => {
    navigate("/trivia", {
      state: {
        difficulty,
        groupId,
        subcategoryId: hasSpecifics && showSpecifics && subcategoryId ? Number(subcategoryId) : null,
      },
    });
  };

  const topicName = (gid) => getGroupById(gid)?.name || "Any Topic";

  return (
    <div className="app-container landing-page">
      <h1>🎯 Trivia Quest</h1>
      <p>Pick a topic and difficulty — go broad, or drill into something specific.</p>

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

      {groupId !== "any" && hasSpecifics && (
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

      {/* Best / Recent */}
      <div className="scoreboard" style={{ width: "100%", textAlign: "left", marginTop: "1.25rem" }}>
        <h3>🏆 Best Score: {bestScore}</h3>

        {recentScores.length > 0 && (
          <div className="recent-wrap">
            <div className="recent-header">Recent</div>
            <ul className="recent-list">
              {recentScores.map((r, i) => (
                <li className="recent-item" key={i}>
                  <span className="recent-time">{timeAgo(r.date)}</span>
                  <span className="recent-score">{r.score}/{r.total}</span>
                  <span className="recent-badge topic">{topicName(r.groupId)}</span>
                  <span className="recent-badge diff">{r.difficulty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Global leaderboard */}
      <LeaderboardTop10 />
    </div>
  );
};

export default LandingPage;
