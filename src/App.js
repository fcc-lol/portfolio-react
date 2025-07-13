import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProjectsPage from "./pages/Projects";
import ProjectPage from "./pages/Project";
import SpacePage from "./pages/Space";
import AboutPage from "./pages/About";

function App() {
  return (
    <StyleSheetManager
      shouldForwardProp={(prop, defaultValidatorFn) => {
        // Don't forward our custom props
        if (
          prop === "loaded" ||
          prop === "shouldAnimate" ||
          prop === "wasLoadedBefore"
        )
          return false;
        // Use emotion's isPropValid for other props
        return isPropValid(prop);
      }}
    >
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
    </StyleSheetManager>
  );
}

export default App;
