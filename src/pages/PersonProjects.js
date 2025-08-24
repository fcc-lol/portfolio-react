import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Card from "../components/Card";
import { VStack } from "../components/Layout";
import { Error, ProjectsSkeleton } from "../components/States";
import { HeaderTextContent, Subheader } from "../components/Typography";
import ProfilePicture from "../components/ProfilePicture";
import { useTheme } from "../contexts/ThemeContext";
import {
  ANIMATION_DURATION,
  FADE_TRANSITION,
  TRANSFORM_TRANSITION
} from "../constants";

const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const HeaderCard = styled(Card)`
  min-height: 6rem;
`;

const HeaderTextContentWithProfilePicture = styled(HeaderTextContent)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled(Subheader)`
  margin: 0 0 0.125rem 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  user-select: none;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Project = styled(Card)`
  backface-visibility: hidden;
  will-change: transform;
  padding: 0;
  cursor: pointer;
  transition: ${TRANSFORM_TRANSITION};
  font-size: unset;
  position: relative;
  height: 20rem;
  user-select: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: ${(props) =>
      props.$isDarkMode ? "none" : "2px solid rgba(0, 0, 0, 0.1)"};
    pointer-events: none;
    z-index: 1;
    border-radius: 1.5rem;
  }

  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);

      @media (max-width: 1024px) {
        transform: scale(1.025);
      }
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Image = styled.div.attrs((props) => ({
  "data-image-url": props.$imageurl
}))`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$imageurl ? `url(${props.$imageurl})` : props.theme.cardBackground};
  background-size: cover;
  background-position: center;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const HiddenImage = styled.img`
  display: none;
`;

const Content = styled.div`
  padding: 1.5rem;
  line-height: 1.375;
  position: absolute;
  z-index: 1;
  bottom: -0.25rem;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const ProjectTitle = styled.h2`
  margin: 0 0 0.2rem 0;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.375), 0 2px 12px rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.625);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 2px 12px rgba(0, 0, 0, 1);
  margin: 0;
`;

function ProjectImage({ imageUrl, ...props }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Check if image was already loaded in this session immediately (memoized to prevent re-calculations)
  const wasLoadedBefore = useMemo(() => {
    return imageUrl ? isImageLoaded(imageUrl) : false;
  }, [imageUrl, isImageLoaded]);

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!imageUrl);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageUrl) {
      // Wait for skeleton fade-out to complete before starting image fade-in
      const skeletonFadeOutDelay = ANIMATION_DURATION;
      const additionalDelay = wasLoadedBefore ? 50 : 100; // Slightly faster for cached images
      const totalDelay = skeletonFadeOutDelay + additionalDelay;

      setTimeout(() => setLoaded(true), totalDelay);
    }
  }, [imageUrl, wasLoadedBefore]);

  const handleImageLoad = () => {
    setLoaded(true);

    // Mark this image as loaded in the global state
    if (imageUrl) {
      markImageAsLoaded(imageUrl);
    }
  };

  return (
    <ImageContainer>
      {imageUrl && (
        <HiddenImage
          ref={imageRef}
          src={imageUrl}
          onLoad={handleImageLoad}
          alt=""
        />
      )}
      <Image
        $imageurl={imageUrl}
        loaded={loaded}
        shouldAnimate={!!imageUrl}
        wasLoadedBefore={wasLoadedBefore}
        {...props}
      />
    </ImageContainer>
  );
}

function PersonProjectsPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { pageVisible, contentVisible, handleFadeOut } = useOutletContext();
  const { personName } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Capitalize person name for display
  const displayName = personName
    ? personName.charAt(0).toUpperCase() + personName.slice(1)
    : "";

  useEffect(() => {
    // Update browser title
    document.title = `FCC Studio – Projects with ${displayName}`;
  }, [displayName]);

  useEffect(() => {
    // Reset state when person changes
    setProjects([]);
    setLoading(true);
    setError(null);
    setDataLoaded(false);

    const fetchPersonProjects = async () => {
      try {
        const response = await fetch(
          `https://portfolio-api.fcc.lol/projects/person/${personName}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch projects for ${displayName}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        // Start fade-in after data is loaded
        setTimeout(() => {
          setDataLoaded(true);
        }, 50);
      }
    };

    if (personName) {
      fetchPersonProjects();
    }
  }, [personName, displayName]);

  // Handle project click with fade-out animation
  const handleProjectClick = (projectId, event) => {
    // Check if command/ctrl key was pressed (for opening in new tab)
    if (event.metaKey || event.ctrlKey) {
      // Open in new tab for command/ctrl+click
      event.preventDefault();
      const projectUrl = `${window.location.origin}/project/${projectId}`;
      window.open(projectUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Regular click behavior - navigate with fade-out animation
    handleFadeOut(); // This triggers pageVisible = false and setIsNavigating = true
    // Wait for fade-out animation to complete before navigating
    setTimeout(() => {
      navigate(`/project/${projectId}`);
    }, ANIMATION_DURATION);
  };

  const getPrimaryImage = (project) => {
    return (
      project.primaryImage?.url ||
      (project.media && project.media.length > 0 ? project.media[0].url : null)
    );
  };

  // Combine both pageVisible and contentVisible (for different fade-out types) with dataLoaded (for fade-in timing)
  const visible = pageVisible && contentVisible && dataLoaded;

  // Reusable header component to eliminate duplication
  const renderHeader = () => (
    <HeaderCard $isDarkMode={isDarkMode}>
      <HeaderTextContentWithProfilePicture>
        <ProfilePicture alt={displayName} name={displayName} size="medium" />
        <Title>Projects with {displayName}</Title>
      </HeaderTextContentWithProfilePicture>
    </HeaderCard>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <FadeInWrapper visible={false}>
          <VStack>
            {renderHeader()}
            <ProjectsSkeleton />
          </VStack>
        </FadeInWrapper>
      );
    }

    if (error) {
      return (
        <FadeInWrapper visible={visible}>
          <VStack>
            {renderHeader()}
            <Error>Error: {error}</Error>
          </VStack>
        </FadeInWrapper>
      );
    }

    return (
      <FadeInWrapper visible={visible}>
        <VStack>
          {renderHeader()}

          {projects.length > 0 ? (
            <Grid>
              {projects.map((project) => (
                <Project
                  key={project.id}
                  onClick={(event) => handleProjectClick(project.id, event)}
                  $isDarkMode={isDarkMode}
                >
                  <ProjectImage imageUrl={getPrimaryImage(project)} />
                  <Content visible={visible}>
                    <ProjectTitle>{project.name}</ProjectTitle>
                    <Description>{project.description}</Description>
                  </Content>
                </Project>
              ))}
            </Grid>
          ) : (
            <Card $isDarkMode={isDarkMode}>
              <p>No projects found for {displayName}.</p>
            </Card>
          )}
        </VStack>
      </FadeInWrapper>
    );
  };

  return <>{renderContent()}</>;
}

export default PersonProjectsPage;
