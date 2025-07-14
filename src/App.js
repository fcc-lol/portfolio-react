import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet
} from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProjectsPage from "./pages/Projects";
import ProjectPage from "./pages/Project";
import SpacePage from "./pages/Space";
import AboutPage from "./pages/About";

// Root layout component that includes ScrollRestoration
function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration
        getKey={(location, matches) => {
          // Use location.pathname + location.search as the key
          return location.pathname + location.search;
        }}
      />
    </>
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
