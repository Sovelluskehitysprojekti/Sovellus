import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Trivia from "./pages/Trivia";
import ErrorBoundary from "./ErrorBoundary";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trivia" element={<Trivia />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
