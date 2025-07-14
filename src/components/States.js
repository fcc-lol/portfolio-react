import styled, { keyframes } from "styled-components";
import Card from "./Card";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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

const ProjectSkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  animation: ${fadeIn} 0.3s ease-in-out;

  @media (max-width: 1024px) {
    gap: 2rem;
  }
`;

const ProjectInfoSkeleton = styled(Card)`
  background: ${(props) => props.theme.cardBackground};
  min-height: 10rem;
`;

const ProjectMediaSkeleton = styled(Card)`
  padding: 0;
  height: ${(props) => props.height || "24rem"};
  overflow: hidden;
  position: relative;
  background: ${(props) => props.theme.cardBackground};
`;

export const ProjectSkeleton = ({ mediaItems }) => {
  // Don't render skeleton if no media items or if items don't have dimensions
  if (!mediaItems || mediaItems.length === 0) {
    return null;
  }

  return (
    <ProjectSkeletonContainer>
      <ProjectInfoSkeleton />
      {mediaItems.map((item, index) => {
        // Only render skeleton if item has dimensions
        if (!item.dimensions) {
          return null;
        }

        // Calculate aspect ratio and height
        const aspectRatio = item.dimensions.width / item.dimensions.height;

        // Calculate height based on container width
        // Using CSS calc for responsive height based on aspect ratio
        const paddingTop = `${100 / aspectRatio}%`;

        return (
          <ProjectMediaSkeleton
            key={item.id || index}
            style={{
              height: "auto",
              aspectRatio: aspectRatio,
              minHeight: "200px"
            }}
          >
            <div
              style={{
                width: "100%",
                paddingTop: paddingTop,
                position: "relative"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              />
            </div>
          </ProjectMediaSkeleton>
        );
      })}
    </ProjectSkeletonContainer>
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
