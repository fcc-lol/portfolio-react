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
import FilteredProjectsPage from "./pages/FilteredProjects";
import SpacePage from "./pages/Space";
import AboutPage from "./pages/About";
import NewsletterContactBanner from "./components/NewsletterContactBanner";
import { ANIMATION_DURATION } from "./constants";

// Root layout component that includes ScrollRestoration and Navigation
function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false); // Separate state for content-only fades
  const [hasInternalNavigation, setHasInternalNavigation] = useState(false);

  // Reset navigation state and show page when route changes
  useEffect(() => {
    setIsNavigating(false);
    setPageVisible(true); // Start as true, let pages control their own fade-in
    setContentVisible(true); // Content visible by default
  }, [location.pathname]);

  const handleFadeOut = () => {
    setPageVisible(false);
    setIsNavigating(true);
    setHasInternalNavigation(true); // Mark that we've navigated internally
  };

  const handleContentFadeOut = () => {
    setContentVisible(false);
    setHasInternalNavigation(true); // Mark that we've navigated internally
  };

  const handleProjectNavigation = () => {
    setContentVisible(false);
    setIsNavigating(true); // Hide navigation tabs during transition for project navigation
    setHasInternalNavigation(true); // Mark that we've navigated internally
  };

  const handleBackClick = () => {
    // Use the same fade-out pattern as all other navigation
    handleFadeOut();
    // Wait for fade-out animation to complete before navigating
    const targetFrames = Math.ceil(ANIMATION_DURATION / 16.67); // Calculate frames needed for ANIMATION_DURATION
    let frameCount = 0;

    const waitForAnimation = () => {
      frameCount++;
      if (frameCount >= targetFrames) {
        // Check if we've had any internal navigation in this session
        // If not, it means the user came directly to this page (new tab, direct link, etc.)
        if (!hasInternalNavigation) {
          // No internal navigation history, go to Projects page
          navigate("/");
        } else {
          // We have internal navigation history, go back to previous page
          navigate(-1);
        }
      } else {
        requestAnimationFrame(waitForAnimation);
      }
    };

    requestAnimationFrame(waitForAnimation);
  };

  // Determine if we should show the back button
  const showBackButton =
    location.pathname.startsWith("/project/") ||
    location.pathname.startsWith("/person/") ||
    location.pathname.startsWith("/tag/");

  return (
    <Page>
      <Container>
        <NewsletterContactBanner />
        <Navigation
          showBackButton={showBackButton}
          onBackClick={handleBackClick}
          onFadeOut={handleFadeOut}
          onContentFadeOut={handleContentFadeOut}
          isNavigating={isNavigating}
        />
        <Outlet
          context={{
            isNavigating,
            setIsNavigating,
            handleBackClick,
            pageVisible,
            contentVisible,
            handleFadeOut,
            handleContentFadeOut,
            handleProjectNavigation
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
        element: <FilteredProjectsPage type="person" />
      },
      {
        path: "/tag/:tagName",
        element: <FilteredProjectsPage type="tag" />
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
