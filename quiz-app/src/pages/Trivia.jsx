import React, { useState, useEffect } from "react";
import QuestionCard from "../components/QuestionCard";
import Result from "../components/Result";

const Trivia = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuestions = (retryCount = 0) => {
    setLoading(true);
    setError(false);

    // 1️⃣ Try to load from cache first
    const cached = localStorage.getItem("triviaQuestions");
    if (cached) {
      console.log("Loaded trivia questions from cache.");
      setQuestions(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch from API if no cache
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((res) => {
        if (res.status === 429) throw new Error("Rate limit hit");
        return res.json();
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          localStorage.setItem("triviaQuestions", JSON.stringify(data.results));
          setQuestions(data.results);
        } else {
          setError("No questions found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        // Automatic retry for rate limiting
        if (err.message === "Rate limit hit" && retryCount < 3) {
          console.warn("Rate limit hit. Retrying in 5 seconds...");
          setTimeout(() => fetchQuestions(retryCount + 1), 5000);
          return;
        }

        if (err.message === "Rate limit hit") {
          setError("Too many requests. Please wait a few seconds and retry.");
        } else {
          setError("Failed to fetch questions.");
        }

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prev) => prev + 1);
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else setShowResult(true);
  };

  const restartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
    setQuestions([]);
    localStorage.removeItem("triviaQuestions"); // clear cached questions
    fetchQuestions();
  };

  // 🧩 Loading state
  if (loading) {
    return (
      <div className="app-container loading-container">
        Loading questions...
      </div>
    );
  }

  // 🧩 Error state
  if (error) {
    return (
      <div className="app-container loading-container">
        <div style={{ marginBottom: "16px" }}>{error}</div>
        <button
          onClick={() => fetchQuestions()}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            background: "#4d88ff",
            color: "#fff",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // 🧩 Trivia content
  return (
    <div className="app-container">
      <div className="trivia-score">
        Score: {score} / {questions.length}
      </div>
      {showResult ? (
        <Result
          score={score}
          total={questions.length}
          restartGame={restartGame}
        />
      ) : (
        <QuestionCard
          question={questions[currentIndex]}
          handleAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default Trivia;
