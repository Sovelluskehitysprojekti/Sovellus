import React, { useState, useEffect } from "react";
import QuestionCard from "../components/QuestionCard";
import Result from "../components/Result";
import { useLocation } from "react-router-dom";

const Trivia = () => {
  const location = useLocation();
  const difficulty = location.state?.difficulty || "easy";
  const category = location.state?.category || "";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Original fetching logic with caching & retry
  const fetchQuestions = (retryCount = 0) => {
    setLoading(true);
    setError(null);

    const cacheKey = `triviaQuestions_${difficulty}_${category || "any"}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setQuestions(JSON.parse(cached));
      setLoading(false);
      return;
    }

    let url = `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${difficulty}`;
    if (category) url += `&category=${category}`;

    fetch(url)
      .then((res) => {
        if (res.status === 429) throw new Error("Rate limit hit");
        return res.json();
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(data.results));
          setQuestions(data.results);
        } else {
          setError("No questions found for this selection.");
        }
        setLoading(false);
      })
      .catch((err) => {
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
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, [difficulty, category]);

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
    fetchQuestions();
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
        <button className="primary-btn" onClick={() => fetchQuestions()}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="app-container trivia-page">
      <div className="trivia-header">
        <h3>Score: {score} / {questions.length}</h3>
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
