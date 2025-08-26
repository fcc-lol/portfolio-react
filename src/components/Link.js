import styled from "styled-components";
import { ANIMATION_DURATION, TRANSFORM_TRANSITION } from "../constants";

export const Link = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  color: ${(props) => props.theme.textSecondary};
  text-decoration: underline;
  font-weight: normal;
  transition: color ${ANIMATION_DURATION}ms ease-in-out, ${TRANSFORM_TRANSITION};
  font-size: 1.125rem;
  cursor: pointer;
  user-select: none;
  text-decoration: ${(props) => (props.noUnderline ? "none" : "underline")};

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.textPrimary};
    }
  }

  &:active {
    color: ${(props) => props.theme.textPrimary};
    transform: scale(0.9);
  }
`;
