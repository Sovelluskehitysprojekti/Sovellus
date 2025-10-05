import React from "react";

const Result = ({ score, total, restartGame }) => {
  return (
    <div className="result-container">
      <h2>Your Score: {score} / {total}</h2>
      <button onClick={restartGame}>Play Again</button>
    </div>
  );
};

export default Result;
