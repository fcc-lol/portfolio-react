import React from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.textPrimary};
  padding: 0.75rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  backface-visibility: hidden;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.1);
      background: ${(props) => props.theme.shadow};
    }
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Circle = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: ${(props) => props.theme.textPrimary};
  transition: all 0.2s ease-in-out;
  opacity: 0.25;
`;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton theme={theme} onClick={toggleTheme}>
      <Circle theme={theme} />
    </ToggleButton>
  );
}

export default ThemeToggle;
