import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const QuestionCard = ({ question, handleAnswer }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!question) return;
    const shuffled = [...question.incorrect_answers, question.correct_answer].sort(
      () => Math.random() - 0.5
    );
    setAnswers(shuffled);
  }, [question]);

  if (!question) return null;

  return (
    <div className="question-card">
      <h2>{decodeHTML(question.question)}</h2>
      <div className="answers-grid">
        {answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(answer === question.correct_answer)}
            className="answer-btn"
          >
            {decodeHTML(answer)}
          </button>
        ))}
      </div>
      <button className="secondary-btn" onClick={() => navigate("/")}>
        Back to Menu
      </button>
    </div>
  );
};

export default QuestionCard;
