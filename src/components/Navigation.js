import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ANIMATION_DURATION,
  FADE_TRANSITION,
  TRANSFORM_TRANSITION
} from "../constants";

const TabNavigation = styled.nav`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 2rem;
  user-select: none;
  height: 3.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  transition: ${FADE_TRANSITION};

  @media (max-width: 768px) {
    gap: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: calc(100% - 2.25rem);
    opacity: ${(props) => (props.$hideOnMobile ? 0 : 1)};
    transition-delay: ${(props) =>
      props.$hideOnMobile
        ? "0ms"
        : props.$shouldDelay
        ? `${ANIMATION_DURATION - 75}ms`
        : "0ms"};
    pointer-events: ${(props) => (props.$hideOnMobile ? "none" : "auto")};
  }
`;

const TabButton = styled.button`
  background: none;
  border: none;
  color: ${(props) =>
    props.$isActive ? props.theme.textPrimary : props.theme.textSecondary};
  padding: 1rem;
  font-size: 1.25rem;
  cursor: pointer;
  backface-visibility: hidden;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
  transition: color ${ANIMATION_DURATION}ms ease-in-out, ${TRANSFORM_TRANSITION};

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.textPrimary};
      transform: scale(1.1);
      cursor: ${(props) =>
        props.$isActive && !props.$alwaysInteractive ? "default" : "pointer"};
    }
  }

  &:active {
    color: ${(props) => props.theme.textPrimary};
    transform: ${(props) =>
      props.$isActive && !props.$alwaysInteractive ? "scale(1)" : "scale(0.9)"};
  }
`;

const BackButton = styled(TabButton)`
  position: absolute;
  left: -0.125rem;
  top: 50%;
  margin-top: -1.75rem;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
  transition: color ${ANIMATION_DURATION}ms ease-in-out, ${TRANSFORM_TRANSITION},
    ${FADE_TRANSITION};
`;

function Navigation({
  showBackButton = false,
  onBackClick,
  onFadeOut,
  onContentFadeOut,
  isNavigating: globalIsNavigating = false
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingTab, setPendingTab] = useState(null);
  const [comingBackFromProject, setComingBackFromProject] = useState(false);

  // Detect when we're coming back from a project page
  useEffect(() => {
    // If showBackButton just changed from true to false, we're coming back from project
    if (!showBackButton) {
      // Set a brief flag for the transition delay
      setComingBackFromProject(true);

      // Use requestAnimationFrame for 300ms delay
      const targetFrames = Math.ceil(300 / 16.67); // ~18 frames at 60fps for 300ms
      let frameCount = 0;
      let animationId;

      const waitForAnimation = () => {
        frameCount++;
        if (frameCount >= targetFrames) {
          setComingBackFromProject(false);
        } else {
          animationId = requestAnimationFrame(waitForAnimation);
        }
      };

      animationId = requestAnimationFrame(waitForAnimation);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [showBackButton]);

  // Get current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/space") return "space";
    if (path === "/about") return "about";
    if (path.startsWith("/project/") || path.startsWith("/person/"))
      return "projects";
    return "projects"; // default and /projects
  };

  // Check if we're on a project detail page or person page
  const isOnProjectDetail = location.pathname.startsWith("/project/");
  const isOnPersonPage = location.pathname.startsWith("/person/");

  const activeTab = getCurrentTab();
  // Use pendingTab for immediate visual feedback, fallback to activeTab
  const displayActiveTab = pendingTab || activeTab;

  // Reset pendingTab when location changes (navigation completes)
  useEffect(() => {
    setPendingTab(null);
  }, [location.pathname]);

  // Handle tab click
  const handleTabClick = (tab) => {
    // Special case: if we're on a project detail page or person page and clicking Projects tab, allow navigation to projects list
    const isOnDetailPage =
      location.pathname.startsWith("/project/") ||
      location.pathname.startsWith("/person/");
    const clickingProjects = tab === "projects";

    // Don't navigate if already on the same tab, unless we're on detail page clicking projects
    if (activeTab === tab && !(isOnDetailPage && clickingProjects)) return;

    setPendingTab(tab); // Set immediately for visual feedback

    // Use content-specific fade-out for tab navigation (content only, navigation stays visible)
    if (onContentFadeOut) {
      onContentFadeOut(); // Trigger fade-out animation for page content only

      // Wait for fade-out animation to complete using requestAnimationFrame
      const targetFrames = Math.ceil(ANIMATION_DURATION / 16.67); // ~15 frames at 60fps for 250ms
      let frameCount = 0;

      const waitForAnimation = () => {
        frameCount++;
        if (frameCount >= targetFrames) {
          if (tab === "projects") {
            navigate("/");
          } else {
            navigate(`/${tab}`);
          }
        } else {
          requestAnimationFrame(waitForAnimation);
        }
      };

      requestAnimationFrame(waitForAnimation);
    } else {
      // Fallback for direct navigation
      if (tab === "projects") {
        navigate("/");
      } else {
        navigate(`/${tab}`);
      }
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate("/");
    }
  };

  // Hide tabs on mobile when showing back button OR during global navigation (to project pages)
  const hideTabsOnMobile = showBackButton || globalIsNavigating;

  return (
    <TabNavigation>
      <BackButton $visible={showBackButton} onClick={handleBackClick}>
        ← back
      </BackButton>
      <div></div>
      <Tabs
        $hideOnMobile={hideTabsOnMobile}
        $shouldDelay={comingBackFromProject}
      >
        <TabButton
          $isActive={displayActiveTab === "projects"}
          $alwaysInteractive={
            (isOnProjectDetail || isOnPersonPage) &&
            displayActiveTab === "projects"
          }
          onClick={() => handleTabClick("projects")}
        >
          Projects
        </TabButton>
        <TabButton
          $isActive={displayActiveTab === "space"}
          onClick={() => handleTabClick("space")}
        >
          Space
        </TabButton>
        <TabButton
          $isActive={displayActiveTab === "about"}
          onClick={() => handleTabClick("about")}
        >
          About
        </TabButton>
      </Tabs>
    </TabNavigation>
  );
}

export default Navigation;
