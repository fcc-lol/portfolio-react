import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyles from "../components/GlobalStyles";

// Theme color definitions
const lightTheme = {
  background: "rgb(255, 255, 255)",
  cardBackground: "rgb(255, 255, 255)",
  textPrimary: "rgba(0, 0, 0, 1)",
  textSecondary: "rgba(0, 0, 0, 0.45)",
  textTertiary: "rgba(0, 0, 0, 0.7)",
  shadow: "rgba(0, 0, 0, 0.1)",
  selection: {
    background: "rgba(0, 0, 0, 1)",
    color: "rgba(255, 255, 255, 1)"
  },
  error: "#ff6b6b",
  errorBackground: "white"
};

const darkTheme = {
  background: "rgb(18, 18, 18)",
  cardBackground: "rgb(30, 30, 30)",
  textPrimary: "rgba(255, 255, 255, 1)",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  textTertiary: "rgba(255, 255, 255, 0.8)",
  shadow: "rgba(0, 0, 0, 0.3)",
  selection: {
    background: "rgba(255, 255, 255, 1)",
    color: "rgba(0, 0, 0, 1)"
  },
  error: "#ff6b6b",
  errorBackground: "rgb(40, 40, 40)"
};

// Create context
const ThemeContext = createContext();

// Function to get initial theme state
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme) {
    return JSON.parse(savedTheme);
  }
  // Check system preference
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [cachedProjects, setCachedProjects] = useState(null);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const markImageAsLoaded = (imageUrl) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  };

  const isImageLoaded = (imageUrl) => {
    return loadedImages.has(imageUrl);
  };

  const setCachedProjectsData = (projects) => {
    setCachedProjects(projects);
  };

  const getCachedProjectsData = () => {
    return cachedProjects;
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    markImageAsLoaded,
    isImageLoaded,
    setCachedProjectsData,
    getCachedProjectsData
  };

  return (
    <StyledThemeProvider theme={theme}>
      <ThemeContext.Provider value={value}>
        <GlobalStyles />
        {children}
      </ThemeContext.Provider>
    </StyledThemeProvider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
