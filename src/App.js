import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import { Page, Container } from "./components/Layout";
import ProjectsPage from "./pages/Projects";
import ProjectPage from "./pages/Project";
import PersonProjectsPage from "./pages/PersonProjects";
import SpacePage from "./pages/Space";
import AboutPage from "./pages/About";
import { ANIMATION_DURATION } from "./constants";

// Root layout component that includes ScrollRestoration and Navigation
function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);

  // Reset navigation state and show page when route changes
  useEffect(() => {
    setIsNavigating(false);
    setPageVisible(true); // Start as true, let pages control their own fade-in
  }, [location.pathname]);

  const handleFadeOut = () => {
    setPageVisible(false);
    setIsNavigating(true);
  };

  const handleBackClick = () => {
    setPageVisible(false);
    setIsNavigating(true);
    // Wait for fade-out animation to complete before navigating
    setTimeout(() => {
      navigate(-1); // Go back to previous page
    }, ANIMATION_DURATION);
  };

  // Determine if we should show the back button
  const showBackButton =
    location.pathname.startsWith("/project/") ||
    location.pathname.startsWith("/person/");

  return (
    <Page>
      <Container>
        <Navigation
          showBackButton={showBackButton}
          onBackClick={handleBackClick}
          onFadeOut={handleFadeOut}
          isNavigating={isNavigating}
        />
        <Outlet
          context={{
            isNavigating,
            setIsNavigating,
            handleBackClick,
            pageVisible,
            handleFadeOut
          }}
        />
        <ScrollRestoration
          getKey={(location, matches) => {
            // Use location.pathname + location.search as the key
            return location.pathname + location.search;
          }}
        />
      </Container>
    </Page>
  );
}

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProjectsPage />
      },
      {
        path: "/projects",
        element: <ProjectsPage />
      },
      {
        path: "/space",
        element: <SpacePage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },
      {
        path: "/project/:projectId",
        element: <ProjectPage />
      },
      {
        path: "/person/:personName",
        element: <PersonProjectsPage />
      }
    ]
  }
]);

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
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export default App;
