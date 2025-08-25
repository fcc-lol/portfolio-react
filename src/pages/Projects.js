import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { useNavigate, useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import { Error, ProjectsSkeleton } from "../components/States";
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

const Title = styled.h2`
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

  // Check if image was already loaded in this session immediately (memoized to prevent re-calculations)
  const wasLoadedBefore = useMemo(() => {
    return imageUrl ? isImageLoaded(imageUrl) : false;
  }, [imageUrl, isImageLoaded]);

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!imageUrl);

  // Notify parent immediately if there's no image
  useEffect(() => {
    if (!imageUrl && onLoad) {
      onLoad(true);
    }
  }, [imageUrl, onLoad]);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageUrl) {
      // Wait for skeleton fade-out to complete before starting image fade-in
      const skeletonFadeOutDelay = ANIMATION_DURATION;
      const additionalDelay = wasLoadedBefore ? 50 : 100; // Slightly faster for cached images
      const totalDelay = skeletonFadeOutDelay + additionalDelay;

      setTimeout(() => {
        setLoaded(true);
        if (onLoad) {
          onLoad(true);
        }
      }, totalDelay);
    }
  }, [imageUrl, wasLoadedBefore, onLoad]);

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

function ProjectsPage() {
  const { isDarkMode, setCachedProjectsData, getCachedProjectsData } =
    useTheme();
  const navigate = useNavigate();
  const { pageVisible, contentVisible, handleContentFadeOut } =
    useOutletContext();

  // Try to get cached projects first
  const cachedProjects = getCachedProjectsData();

  const [projects, setProjects] = useState(cachedProjects || []);
  const [loading, setLoading] = useState(!cachedProjects);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    // Update browser title
    document.title = "FCC Studio – Projects";
  }, []);

  useEffect(() => {
    // If we already have cached data, don't fetch again
    if (cachedProjects) {
      // Start fade-in after a short delay to ensure proper animation
      setTimeout(() => {
        setDataLoaded(true);
      }, 50);
      return;
    }

    // Start fetching immediately
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://portfolio-api.fcc.lol/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
        setCachedProjectsData(data); // Cache the data
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

    fetchProjects();
  }, [cachedProjects, setCachedProjectsData]);

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

    // Find the project data to pass along for prefilling
    const projectData = projects.find((p) => p.id === projectId);

    // Regular click behavior - use same fade-out system as tab navigation
    const startTime = performance.now();

    handleContentFadeOut(); // Same as tab navigation - triggers contentVisible = false
    const fadeCallTime = performance.now() - startTime;

    // Use requestAnimationFrame for more reliable timing that works around main thread blocking
    const targetFrames = Math.ceil(ANIMATION_DURATION / 16.67); // ~15 frames at 60fps for 250ms
    let frameCount = 0;

    const waitForAnimation = () => {
      frameCount++;
      const elapsed = performance.now() - startTime;

      if (frameCount >= targetFrames || elapsed >= ANIMATION_DURATION) {
        // Pass project data via router state for immediate display
        navigate(`/project/${projectId}`, {
          state: {
            prefillData: projectData || null // Pass all available project data
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
      project.primaryImage.url ||
      (project.media && project.media.length > 0 ? project.media[0].url : null)
    );
  };

  const handleImageLoad = (projectId) => {
    setLoadedImages((prev) => ({
      ...prev,
      [projectId]: true
    }));
  };

  // Combine both pageVisible and contentVisible (for different fade-out types) with dataLoaded (for fade-in timing)
  const visible = pageVisible && contentVisible && dataLoaded;

  const renderContent = () => {
    if (loading) {
      return (
        <FadeInWrapper visible={pageVisible && contentVisible}>
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
                onLoad={() => handleImageLoad(project.id)}
              />
              <Content visible={dataLoaded}>
                <Title>{project.name}</Title>
                <Description>{project.description}</Description>
              </Content>
            </Project>
          ))}
        </Grid>
      </FadeInWrapper>
    );
  };

  return <>{renderContent()}</>;
}

export default ProjectsPage;
