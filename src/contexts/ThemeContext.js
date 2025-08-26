import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyles from "../components/GlobalStyles";

// Theme color definitions
const lightTheme = {
  background: "rgb(255, 255, 255)",
  cardBackground: "rgb(255, 255, 255)",
  textPrimary: "rgba(0, 0, 0, 1)",
  textSecondary: "rgba(0, 0, 0, 0.45)",
  textTertiary: "rgba(0, 0, 0, 0.25)",
  shadow: "rgba(0, 0, 0, 0.1)",
  border: "rgba(0, 0, 0, 0.1)",
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
  textTertiary: "rgba(255, 255, 255, 0.4)",
  shadow: "rgba(0, 0, 0, 0.3)",
  border: "rgba(255, 255, 255, 0.2)",
  selection: {
    background: "rgba(255, 255, 255, 1)",
    color: "rgba(0, 0, 0, 1)"
  },
  error: "#ff6b6b",
  errorBackground: "rgb(40, 40, 40)"
};

// Create context
const ThemeContext = createContext();

// Function to get system theme preference
const getSystemTheme = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getSystemTheme);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [cachedProjects, setCachedProjects] = useState(null);
  const cachedFilteredProjectsRef = useRef(new Map());

  // Listen for changes to system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const markImageAsLoaded = useCallback((imageUrl) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  const isImageLoaded = useCallback(
    (imageUrl) => {
      return loadedImages.has(imageUrl);
    },
    [loadedImages]
  );

  const setCachedProjectsData = useCallback((projects) => {
    setCachedProjects(projects);
  }, []);

  const getCachedProjectsData = useCallback(() => {
    return cachedProjects;
  }, [cachedProjects]);

  const setCachedFilteredProjectsData = useCallback((cacheKey, projects) => {
    cachedFilteredProjectsRef.current = new Map(cachedFilteredProjectsRef.current).set(cacheKey, projects);
  }, []);

  const getCachedFilteredProjectsData = useCallback((cacheKey) => {
    return cachedFilteredProjectsRef.current.get(cacheKey) || null;
  }, []);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    markImageAsLoaded,
    isImageLoaded,
    setCachedProjectsData,
    getCachedProjectsData,
    setCachedFilteredProjectsData,
    getCachedFilteredProjectsData
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
