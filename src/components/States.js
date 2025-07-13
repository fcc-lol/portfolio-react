import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

  &::before {
    content: "";
    width: 2.5rem;
    height: 2.5rem;
    border: 0.25rem solid transparent;
    border-top: 0.25rem solid ${(props) => props.theme.textPrimary};
    border-left: 0.25rem solid ${(props) => props.theme.textPrimary};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const Error = styled.div`
  text-align: center;
  color: ${(props) => props.theme.error};
  background: ${(props) => props.theme.errorBackground};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 2rem;
`;
