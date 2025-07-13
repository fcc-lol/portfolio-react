import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const TabNavigation = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-top: 0.25rem;
  margin-bottom: 2.5rem;
  user-select: none;
  height: 3.5rem;

  @media (max-width: 1024px) {
    margin-bottom: 1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: 1024px) {
    gap: 1rem;
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
`;

const BackButton = styled(TabButton)``;

function Navigation({ showBackButton = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/space") return "space";
    if (path === "/about") return "about";
    if (path.startsWith("/project/")) return "projects";
    return "projects"; // default and /projects
  };

  const activeTab = getCurrentTab();

  // Handle tab click
  const handleTabClick = (tab) => {
    if (tab === "projects") {
      navigate("/");
    } else {
      navigate(`/${tab}`);
    }
  };

  return (
    <TabNavigation>
      <div>
        {showBackButton && (
          <BackButton onClick={() => navigate("/")}>← back</BackButton>
        )}
      </div>
      <Tabs>
        <TabButton
          $isActive={activeTab === "projects"}
          onClick={() => handleTabClick("projects")}
        >
          Projects
        </TabButton>
        <TabButton
          $isActive={activeTab === "space"}
          onClick={() => handleTabClick("space")}
        >
          Space
        </TabButton>
        <TabButton
          $isActive={activeTab === "about"}
          onClick={() => handleTabClick("about")}
        >
          About
        </TabButton>
      </Tabs>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ThemeToggle />
      </div>
    </TabNavigation>
  );
}

export default Navigation;
