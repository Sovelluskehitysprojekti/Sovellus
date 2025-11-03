import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import EndlessResult from "../components/EndlessResult";
import { ensureToken, requestNewToken, resetToken } from "../utils/opentdbToken";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const EndlessTrivia = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty || "easy";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const fetchQuestions = async (retryCount = 0) => {
    setLoading(true);
    setError("");

    const token = await ensureToken();

    const fetchWithToken = async (tokenValue, tokenRetryDepth = 0, rateLimitDepth = 0) => {
      let url = `https://opentdb.com/api.php?amount=15&type=multiple&difficulty=${difficulty}`;
      if (tokenValue) url += `&token=${tokenValue}`;

      const res = await fetch(url);
      if (res.status === 429) {
        if (rateLimitDepth < 3) {
          await new Promise((r) => setTimeout(r, 5000));
          return fetchWithToken(tokenValue, tokenRetryDepth, rateLimitDepth + 1);
        }
        throw new Error("Rate limit hit");
      }
      const data = await res.json();

      if (data.response_code === 3 && tokenRetryDepth < 1) {
        const newToken = await requestNewToken();
        if (newToken) return fetchWithToken(newToken, tokenRetryDepth + 1, rateLimitDepth);
      }
      if (data.response_code === 4 && tokenRetryDepth < 2) {
        const reset = await resetToken();
        if (reset) return fetchWithToken(reset, tokenRetryDepth + 1, rateLimitDepth);
      }
      return data;
    };

    try {
      const data = await fetchWithToken(token);
      if (data?.results && data.results.length > 0) {
        setQuestions(shuffle(data.results));
        setCurrentIndex(0);
        setLoading(false);
      } else {
        setError("No questions found for endless mode.");
        setLoading(false);
      }
    } catch (err) {
      if (err.message === "Rate limit hit" && retryCount < 3) {
        setTimeout(() => fetchQuestions(retryCount + 1), 5000);
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

  // initial fetch
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // timer effect
  useEffect(() => {
    if (gameOver || loading) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [gameOver, loading]);

  const handleAnswer = (isCorrect) => {
    if (gameOver) return;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTimeLeft((prev) => prev + 10); // +10s per correct answer

      const next = currentIndex + 1;
      if (next < questions.length) {
        setCurrentIndex(next);
      } else {
        // end of batch, fetch another while keeping streak & timer
        fetchQuestions();
      }
    } else {
      setGameOver(true);
    }
  };

  const restartEndless = () => {
    setScore(0);
    setGameOver(false);
    setTimeLeft(60);
    fetchQuestions(true);
  };

  if (loading && !gameOver) {
    return (
      <div className="app-container loading-container">
        <h2>Loading endless mode…</h2>
      </div>
    );
  }

  if (error && !gameOver) {
    return (
      <div className="app-container loading-container">
        <h2>Error: {error}</h2>
        <button className="primary-btn" onClick={() => fetchQuestions(true)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app-container trivia-page">
      <div className="trivia-toolbar">
        <div className="trivia-meta">
          <span><strong>Mode:</strong> Endless</span>
        </div>
        <div className="toolbar-actions">
          <button className="ghost-btn" onClick={restartEndless}>Restart</button>
          <button className="ghost-btn" onClick={() => navigate("/")}>Back to menu</button>
        </div>
      </div>

      {/* Time + streak */}
      <div className="trivia-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Streak: {score}</span>
        <span>Time left: {formatTime(timeLeft)}</span>
      </div>

      {gameOver ? (
        <EndlessResult score={score} restartEndless={restartEndless} />
      ) : (
        <QuestionCard question={questions[currentIndex]} handleAnswer={handleAnswer} />
      )}
    </div>
  );
};

export default EndlessTrivia;
