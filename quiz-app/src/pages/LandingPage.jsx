import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    // Load categories
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));

    // Load best score
    const storedBest = localStorage.getItem("triviaBestScore");
    if (storedBest) setBestScore(Number(storedBest));
  }, []);

  const handleStart = () => {
    navigate("/trivia", { state: { difficulty, category } });
  };

  return (
    <div className="app-container landing-page">
      <h1>🎯 Trivia Quest</h1>
      <p>Challenge your mind and climb the scoreboard!</p>

      <div className="selectors">
        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Category:
          {loadingCategories ? (
            <span>Loading...</span>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Any Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      <button className="primary-btn" onClick={handleStart}>
        Start Game
      </button>

      <div className="scoreboard">
        <h3>🏆 Best Score: {bestScore}</h3>
      </div>
    </div>
  );
};

export default LandingPage;
