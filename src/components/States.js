import styled, { keyframes } from "styled-components";
import Card from "./Card";

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

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SkeletonCard = styled(Card)`
  padding: 0;
  height: 20rem;
  overflow: hidden;
  position: relative;
  background: ${(props) => props.theme.cardBackground};
`;

export const ProjectsSkeleton = () => {
  return (
    <SkeletonGrid>
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </SkeletonGrid>
  );
};

export const Error = styled.div`
  text-align: center;
  color: ${(props) => props.theme.error};
  background: ${(props) => props.theme.errorBackground};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 2rem;
`;
