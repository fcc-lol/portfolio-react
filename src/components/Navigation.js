import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const TabNavigation = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 1.5rem;
  user-select: none;
  height: 3.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const TabButton = styled.button`
  background: none;
  border: none;
  color: ${(props) =>
    props.$isActive ? "rgba(0,0,0, 1)" : "rgba(0,0,0, 0.45)"};
  padding: 1rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  backface-visibility: hidden;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      color: rgba(0, 0, 0, 1);
      transform: scale(1.1);
    }
  }

  &:active {
    color: rgba(0, 0, 0, 1);
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
      <div></div>
    </TabNavigation>
  );
}

export default Navigation;
