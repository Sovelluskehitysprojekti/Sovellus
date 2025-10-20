import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const correctMessages = ["Good job!", "Well done!", "Nice work!", "👍 Correct!"];
const wrongMessages = ["Oops, try next one!", "Don't worry!", "Keep going!", "😅 Wrong, next one!"];

const HIGHLIGHT_DURATION = 1800; // 1.8s for highlight & feedback

const QuestionCard = ({ question, handleAnswer }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!question) return;
    const shuffled = [...question.incorrect_answers, question.correct_answer].sort(
      () => Math.random() - 0.5
    );
    setAnswers(shuffled);
    setSelectedAnswer(null);
    setFeedback("");
    setShowFeedback(false);
  }, [question]);

  const clickAnswer = (answer) => {
    if (selectedAnswer) return; // prevent double-click
    setSelectedAnswer(answer);

    const isCorrect = answer === question.correct_answer;
    const pool = isCorrect ? correctMessages : wrongMessages;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    setFeedback(msg);
    setShowFeedback(true);

    setTimeout(() => {
      handleAnswer(isCorrect);
      setSelectedAnswer(null);
      setFeedback("");
      setShowFeedback(false);
    }, HIGHLIGHT_DURATION);
  };

  if (!question) return null;

  return (
    <div className="question-card">
      <h2 style={{ color: "#111" }}>{decodeHTML(question.question)}</h2>

      <div className="answers-grid">
        {answers.map((answer, idx) => {
          let className = "answer-btn";
          if (selectedAnswer) {
            if (answer === question.correct_answer) className += " correct";
            else if (answer === selectedAnswer && answer !== question.correct_answer)
              className += " wrong";
          }
          return (
            <button
              key={idx}
              onClick={() => clickAnswer(answer)}
              className={className}
              disabled={!!selectedAnswer}
            >
              {decodeHTML(answer)}
            </button>
          );
        })}
      </div>

      {feedback && <p className={`feedback ${showFeedback ? "show" : ""}`}>{feedback}</p>}

      
    </div>
  );
};

export default QuestionCard;
