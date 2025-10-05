import React, { useEffect, useState } from "react";

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const QuestionCard = ({ question, handleAnswer }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!question) return;
    const shuffled = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
    setAnswers(shuffled);
  }, [question]);

  const rainbowColors = ["#ff4d4d", "#ffb84d", "#4dff88", "#4d88ff", "#b84dff"];

  if (!question) return null;

  return (
    <div className="question-card">
      <h2>{decodeHTML(question.question)}</h2>
      {answers.map((answer, idx) => (
        <button key={idx} onClick={() => handleAnswer(answer === question.correct_answer)} style={{ backgroundColor: rainbowColors[idx % rainbowColors.length] }}>
          {decodeHTML(answer)}
        </button>
      ))}
    </div>
  );
};

export default QuestionCard;
