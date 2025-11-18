import React, { useEffect, useMemo, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import Result from "../components/Result";
import { useLocation, useNavigate } from "react-router-dom";
import { getGroupById } from "../utils/categoryGroups";
import QuickSwitchModal from "../components/QuickSwitchModal";
import { ensureToken, requestNewToken, resetToken } from "../utils/opentdbToken";


function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Trivia = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // initial from router
  const startDifficulty = location.state?.difficulty || "easy";
  const startGroupId = location.state?.groupId || "any";
  const startSubcat = location.state?.subcategoryId || null;


  const [difficulty, setDifficulty] = useState(startDifficulty);
  const [groupId, setGroupId] = useState(startGroupId);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(startSubcat);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickSwitch, setShowQuickSwitch] = useState(false);

 
  const categoryTryList = useMemo(() => {
    if (selectedSubcategoryId) return [selectedSubcategoryId];
    const group = getGroupById(groupId);
    if (!group || groupId === "any") return [];
    return shuffle(group.categoryIds);
  }, [groupId, selectedSubcategoryId]);

  
  const fetchQuestions = async (forceFresh = false, retryCount = 0) => {
    setLoading(true);
    setError(null);

    const cacheKeyBase =
      selectedSubcategoryId
        ? `trivia_cat_${selectedSubcategoryId}_diff_${difficulty}`
        : `trivia_group_${groupId}_diff_${difficulty}`;

    const useCache = !forceFresh;
    const cached = localStorage.getItem(cacheKeyBase);

    if (useCache && cached) {
      setQuestions(shuffle(JSON.parse(cached)));
      setLoading(false);
      return;
    }

    const fetchWithToken = async (categoryId, token, tokenRetryDepth = 0, rateLimitDepth = 0) => {
      let url = `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${difficulty}`;
      if (categoryId) url += `&category=${categoryId}`;
      if (token) url += `&token=${token}`;

      const res = await fetch(url);
      if (res.status === 429) {
        if (rateLimitDepth < 3) {
          await new Promise((r) => setTimeout(r, 5000));
          return fetchWithToken(categoryId, token, tokenRetryDepth, rateLimitDepth + 1);
        }
        throw new Error("Rate limit hit");
      }

      const data = await res.json();
      // 0 ok, 1 no results, 2 invalid params, 3 token missing/invalid, 4 token exhausted
      if (data?.response_code === 3) {
        if (tokenRetryDepth < 1) {
          const newToken = await requestNewToken();
          if (newToken) return fetchWithToken(categoryId, newToken, tokenRetryDepth + 1, rateLimitDepth);
        }
      }
      if (data?.response_code === 4) {
        if (tokenRetryDepth < 2) {
          const reset = await resetToken();
          if (reset) return fetchWithToken(categoryId, reset, tokenRetryDepth + 1, rateLimitDepth);
        }
      }
      return data;
    };

    try {
      let data = null;
      const token = await ensureToken();

      if (selectedSubcategoryId) {
        data = await fetchWithToken(selectedSubcategoryId, token);
      } else if (groupId !== "any" && categoryTryList.length) {
        for (const catId of categoryTryList) {
          data = await fetchWithToken(catId, token);
          if (data?.results?.length) break;
          data = null;
        }
      } else {
        data = await fetchWithToken(null, token);
      }

      if (data?.results && data.results.length > 0) {
        localStorage.setItem(cacheKeyBase, JSON.stringify(data.results)); // store raw
        setQuestions(shuffle(data.results)); // show shuffled
      } else if (cached) {
        setQuestions(shuffle(JSON.parse(cached)));
      } else {
        setError("No questions found for this selection.");
      }

      setLoading(false);
    } catch (err) {
      if (err.message === "Rate limit hit" && retryCount < 3) {
        setTimeout(() => fetchQuestions(forceFresh, retryCount + 1), 5000);
        return;
      }
      setError(
        err.message === "Rate limit hit"
          ? "Too many requests. Please wait and try again."
          : "Failed to fetch questions."
      );
      setLoading(false);
    }
  };

  // load when settings change
  useEffect(() => {
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    fetchQuestions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, groupId, selectedSubcategoryId]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prev) => prev + 1);
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else setShowResult(true);
  };

  // Restart = fetch fresh (bypass cache)
  const restartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
    fetchQuestions(true);
  };

  const applyQuickSwitch = ({ groupId: g, difficulty: d, subcategoryId: s }) => {
    setGroupId(g);
    setDifficulty(d);
    setSelectedSubcategoryId(s ?? null);
    setShowQuickSwitch(false);
  };

  if (loading)
    return (
      <div className="app-container loading-container">
        <h2>Loading questions...</h2>
      </div>
    );

  if (error)
    return (
      <div className="app-container loading-container">
        <h2>Error: {error}</h2>
        <button className="primary-btn" onClick={() => fetchQuestions(true)}>Retry</button>
      </div>
    );

  return (
    <div className="app-container trivia-page">
      <div className="trivia-toolbar">
        <div className="trivia-meta">
          <span><strong>Topic:</strong> {getGroupById(groupId).name}{selectedSubcategoryId ? " • specific" : ""}</span>
          <span><strong>Difficulty:</strong> {difficulty}</span>
        </div>
        <div className="toolbar-actions">
          <button className="ghost-btn" onClick={() => setShowQuickSwitch(true)}>Change topic…</button>
          <button className="ghost-btn" onClick={restartGame}>Restart</button>
          <button className="ghost-btn" onClick={() => navigate("/")}>Back to menu</button>
        </div>
      </div>

      <div className="trivia-header">
        <h3>Score: {score} / {questions.length}</h3>
      </div>

      {showResult ? (
        <Result
          score={score}
          total={questions.length}
          restartGame={restartGame}
          meta={{ difficulty, groupId, subcategoryId: selectedSubcategoryId }}
        />
      ) : (
        <QuestionCard question={questions[currentIndex]} handleAnswer={handleAnswer} />
      )}

      <QuickSwitchModal
        open={showQuickSwitch}
        onClose={() => setShowQuickSwitch(false)}
        onApply={applyQuickSwitch}
        initialGroupId={groupId}
        initialSubcategoryId={selectedSubcategoryId}
        initialDifficulty={difficulty}
      />
    </div>
  );
};

export default Trivia;

