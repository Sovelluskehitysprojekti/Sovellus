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

  const fetchQuestions = () => {
    setLoading(true);
    setError(false);
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setQuestions(data.results);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(prev => prev + 1);
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else setShowResult(true);
  };

  const restartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
    setQuestions([]);
    fetchQuestions();
  };

  if (loading) {
    return <div className="app-container loading-container">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="app-container loading-container">
        Failed to fetch questions.
        <button onClick={fetchQuestions} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer", borderRadius: "8px", border: "none", background: "#4d88ff", color: "#fff" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="trivia-score">Score: {score} / {questions.length}</div>
      {showResult ? (
        <Result score={score} total={questions.length} restartGame={restartGame} />
      ) : (
        <QuestionCard question={questions[currentIndex]} handleAnswer={handleAnswer} />
      )}
    </div>
  );
};

export default Trivia;
