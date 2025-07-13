import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => props.theme.textPrimary};
  color: ${(props) => props.theme.background};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5em;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0;
  width: fit-content;
  will-change: transform;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.95);
    opacity: 0.75;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default Button;
