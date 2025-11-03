import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Trivia from "./pages/Trivia";
import EndlessIntro from "./pages/EndlessIntro";
import EndlessTrivia from "./pages/EndlessTrivia";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trivia" element={<Trivia />} />
        {/* Endless mode intro page */}
        <Route path="/endless" element={<EndlessIntro />} />
        {/* Actual endless gameplay */}
        <Route path="/endless/play" element={<EndlessTrivia />} />
      </Routes>
    </Router>
  );
}

export default App;
