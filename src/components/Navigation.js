import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FADE_TRANSITION_MS } from "../constants";

const TabNavigation = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-top: 0.25rem;
  margin-bottom: 2.5rem;
  user-select: none;
  height: 3.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    display: flex;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    ${(props) => props.$hideOnMobile && "display: none;"}
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
  transition: all 0.2s ease-in-out;
  backface-visibility: hidden;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.textPrimary};
      transform: scale(1.1);
    }
  }

  &:active {
    color: ${(props) => props.theme.textPrimary};
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const BackButton = styled(TabButton)`
  padding: 1rem 0;
`;

function Navigation({ showBackButton = false, onBackClick, onFadeOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  // Get current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/space") return "space";
    if (path === "/about") return "about";
    if (path.startsWith("/project/")) return "projects";
    return "projects"; // default and /projects
  };

  const activeTab = getCurrentTab();
  // Use pendingTab for immediate visual feedback, fallback to activeTab
  const displayActiveTab = pendingTab || activeTab;

  // Reset pendingTab when location changes (navigation completes)
  useEffect(() => {
    setPendingTab(null);
  }, [location.pathname]);

  // Handle tab click
  const handleTabClick = (tab) => {
    // Don't navigate if already navigating or if already on the same tab
    if (isNavigating || activeTab === tab) return;

    setIsNavigating(true);
    setPendingTab(tab); // Set immediately for visual feedback

    // Trigger fade-out if callback is provided
    if (onFadeOut) {
      onFadeOut();
    }

    // Wait for fade-out animation to complete before navigating
    setTimeout(() => {
      if (tab === "projects") {
        navigate("/");
      } else {
        navigate(`/${tab}`);
      }
      setIsNavigating(false);
    }, FADE_TRANSITION_MS);
  };

  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate("/");
    }
  };

  return (
    <TabNavigation>
      <div>
        {showBackButton && (
          <BackButton onClick={handleBackClick}>← back</BackButton>
        )}
      </div>
      <Tabs $hideOnMobile={showBackButton}>
        <TabButton
          $isActive={displayActiveTab === "projects"}
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
