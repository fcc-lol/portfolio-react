import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProjectsPage from "./pages/Projects";
import ProjectPage from "./pages/Project";
import SpacePage from "./pages/Space";
import AboutPage from "./pages/About";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/space" element={<SpacePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
