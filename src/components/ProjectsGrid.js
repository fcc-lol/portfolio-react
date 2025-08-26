import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";
import styled from "styled-components";
import { useNavigate, useOutletContext } from "react-router-dom";
import Card from "./Card";
import { VStack } from "./Layout";
import { Error, ProjectsSkeleton } from "./States";
import { useTheme } from "../contexts/ThemeContext";
import { FadeInWrapper } from "./AnimationHelpers";
import {
  ANIMATION_DURATION,
  FADE_TRANSITION,
  TRANSFORM_TRANSITION
} from "../constants";

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
    border: 2px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 1;
    border-radius: 1.5rem;
    opacity: ${(props) => (props.$isDarkMode || !props.$imageLoaded ? 0 : 1)};
    transition: ${FADE_TRANSITION};
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

function ProjectImage({ imageUrl, onLoad, ...props }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Calculate wasLoadedBefore once on mount to avoid infinite loops
  const wasLoadedBefore = useRef(imageUrl ? isImageLoaded(imageUrl) : false);

  // Start loaded=true if no image URL OR if it was loaded before, otherwise wait for load event
  const [loaded, setLoaded] = useState(!imageUrl || wasLoadedBefore.current);
  const imageRef = useRef(null);

  // Notify parent immediately if there's no image or image was loaded before
  useEffect(() => {
    if ((!imageUrl || wasLoadedBefore.current) && onLoad) {
      onLoad(true);
    }
  }, [imageUrl, onLoad]); // Now safe because onLoad is stable

  const handleImageLoad = () => {
    setLoaded(true);

    // Mark this image as loaded in the global state
    if (imageUrl) {
      markImageAsLoaded(imageUrl);
    }

    // Notify parent component
    if (onLoad) {
      onLoad(true);
    }
  };

  const handleImageError = () => {
    // Don't show broken images
    setLoaded(false);
  };

  return (
    <ImageContainer>
      {imageUrl && (
        <HiddenImage
          ref={imageRef}
          src={imageUrl}
          onLoad={handleImageLoad}
          onError={handleImageError}
          alt=""
        />
      )}
      <Image
        $imageurl={imageUrl}
        loaded={loaded}
        shouldAnimate={!!imageUrl}
        wasLoadedBefore={wasLoadedBefore.current}
        {...props}
      />
    </ImageContainer>
  );
}

function ProjectsGrid({
  apiEndpoint,
  headerComponent,
  documentTitle,
  noResultsMessage
}) {
  const {
    isDarkMode,
    setCachedFilteredProjectsData,
    getCachedFilteredProjectsData
  } = useTheme();
  const navigate = useNavigate();
  const { pageVisible, contentVisible, handleFadeOut } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  useEffect(() => {
    // Update browser title
    document.title = documentTitle;
  }, [documentTitle]);

  useEffect(() => {
    // Start skeleton fade-in with consistent 50ms delay if we need to show loading state
    if (loading) {
      const targetFrames = Math.ceil(50 / 16.67); // ~3 frames for 50ms
      let frameCount = 0;

      const waitForDelay = () => {
        frameCount++;
        if (frameCount >= targetFrames) {
          setSkeletonVisible(true);
        } else {
          requestAnimationFrame(waitForDelay);
        }
      };

      requestAnimationFrame(waitForDelay);
    }
  }, [loading]);

  useEffect(() => {
    // Reset state when apiEndpoint changes
    setError(null);
    setDataLoaded(false);
    setLoadedImages({});
    setSkeletonVisible(false);

    // Get cached data for this endpoint
    const cachedData = getCachedFilteredProjectsData(apiEndpoint);

    if (cachedData) {
      // We have cached data - use it immediately
      setProjects(cachedData);
      setLoading(false);

      // Start fade-in after a short delay to ensure proper animation
      const targetFrames = Math.ceil(50 / 16.67); // ~3 frames for 50ms
      let frameCount = 0;

      const waitForDelay = () => {
        frameCount++;
        if (frameCount >= targetFrames) {
          setDataLoaded(true);
        } else {
          requestAnimationFrame(waitForDelay);
        }
      };

      requestAnimationFrame(waitForDelay);
      return;
    }

    // No cached data - need to fetch
    setProjects([]);
    setLoading(true);

    const fetchProjects = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch projects`);
        }
        const data = await response.json();
        setProjects(data);
        setCachedFilteredProjectsData(apiEndpoint, data); // Cache the data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        // Start fade-in after data is loaded
        const targetFrames = Math.ceil(50 / 16.67); // ~3 frames for 50ms
        let frameCount = 0;

        const waitForDelay = () => {
          frameCount++;
          if (frameCount >= targetFrames) {
            setDataLoaded(true);
          } else {
            requestAnimationFrame(waitForDelay);
          }
        };

        requestAnimationFrame(waitForDelay);
      }
    };

    if (apiEndpoint) {
      fetchProjects();
    }
  }, [
    apiEndpoint,
    getCachedFilteredProjectsData,
    setCachedFilteredProjectsData
  ]);

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

    // Find the project data to pass as prefill
    const projectData = projects.find((p) => p.id === projectId) || null;

    // Regular click behavior - navigate with fade-out animation
    handleFadeOut(); // This triggers pageVisible = false and setIsNavigating = true
    // Wait for fade-out animation to complete before navigating
    const targetFrames = Math.ceil(ANIMATION_DURATION / 16.67); // Calculate frames needed for ANIMATION_DURATION
    let frameCount = 0;

    const waitForAnimation = () => {
      frameCount++;
      if (frameCount >= targetFrames) {
        // Pass project data via router state for immediate display
        navigate(`/project/${projectId}`, {
          state: {
            prefillData: projectData
          }
        });
      } else {
        requestAnimationFrame(waitForAnimation);
      }
    };

    requestAnimationFrame(waitForAnimation);
  };

  const getPrimaryImage = (project) => {
    return (
      project.primaryImage?.url ||
      (project.media && project.media.length > 0 ? project.media[0].url : null)
    );
  };

  const handleImageLoad = useCallback((projectId) => {
    setLoadedImages((prev) => ({
      ...prev,
      [projectId]: true
    }));
  }, []);

  // Create stable onLoad functions for each project to prevent infinite loops
  const onLoadFunctions = useMemo(() => {
    const functions = {};
    projects.forEach((project) => {
      functions[project.id] = () => handleImageLoad(project.id);
    });
    return functions;
  }, [projects, handleImageLoad]);

  // Combine both pageVisible and contentVisible (for different fade-out types) with dataLoaded (for fade-in timing)
  const visible = pageVisible && contentVisible && dataLoaded;

  const renderContent = () => {
    if (loading) {
      return (
        <FadeInWrapper
          visible={pageVisible && contentVisible && skeletonVisible}
        >
          <ProjectsSkeleton />
        </FadeInWrapper>
      );
    }

    if (error) {
      return (
        <FadeInWrapper visible={visible}>
          <Error>Error: {error}</Error>
        </FadeInWrapper>
      );
    }

    return (
      <FadeInWrapper visible={visible}>
        {projects.length > 0 ? (
          <Grid>
            {projects.map((project) => (
              <Project
                key={project.id}
                onClick={(event) => handleProjectClick(project.id, event)}
                $isDarkMode={isDarkMode}
                $imageLoaded={loadedImages[project.id] || false}
              >
                <ProjectImage
                  imageUrl={getPrimaryImage(project)}
                  onLoad={onLoadFunctions[project.id]}
                />
                <Content visible={dataLoaded}>
                  <ProjectTitle>{project.name}</ProjectTitle>
                  <Description>{project.description}</Description>
                </Content>
              </Project>
            ))}
          </Grid>
        ) : (
          <Card $isDarkMode={isDarkMode}>
            <p>{noResultsMessage}</p>
          </Card>
        )}
      </FadeInWrapper>
    );
  };

  return (
    <VStack>
      <FadeInWrapper visible={pageVisible && contentVisible}>
        {headerComponent}
      </FadeInWrapper>
      {renderContent()}
    </VStack>
  );
}

export default ProjectsGrid;
