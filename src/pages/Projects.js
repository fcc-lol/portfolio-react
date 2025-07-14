import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container } from "../components/Layout";
import { Error, ProjectsSkeleton } from "../components/States";
import { useTheme } from "../contexts/ThemeContext";
import { FADE_TRANSITION } from "../constants";

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
  transition: all 0.2s ease-in-out;
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
  opacity: ${(props) => {
    // If image was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
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
`;

const Title = styled.h2`
  margin: 0 0 0.2rem 0;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0.25rem 0.2rem rgba(0, 0, 0, 0.2);
  font-size: 1.5rem;
  font-weight: bold;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.2);
  margin: 0;
`;

function ProjectImage({ imageUrl, ...props }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Check if image was already loaded in this session immediately
  const wasLoadedBefore = imageUrl ? isImageLoaded(imageUrl) : false;

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!imageUrl);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageUrl) {
      // If image was already loaded before, trigger fade-in immediately
      if (wasLoadedBefore) {
        // Small delay to ensure fade-in effect is visible
        setTimeout(() => setLoaded(true), 50);
        return;
      }

      // Check if it's already loaded in the DOM
      if (
        imageRef.current &&
        imageRef.current.complete &&
        imageRef.current.naturalWidth > 0
      ) {
        setLoaded(true);
        markImageAsLoaded(imageUrl);
      }
    }
  }, [imageUrl, wasLoadedBefore, markImageAsLoaded]);

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

function ProjectsPage() {
  const { isDarkMode, setCachedProjectsData, getCachedProjectsData } =
    useTheme();
  const navigate = useNavigate();

  // Try to get cached projects first
  const cachedProjects = getCachedProjectsData();

  const [projects, setProjects] = useState(cachedProjects || []);
  const [loading, setLoading] = useState(!cachedProjects);
  const [error, setError] = useState(null);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // If we already have cached data, don't fetch again
    if (cachedProjects) {
      // Show content immediately if we have cached data
      setContentVisible(true);
      return;
    }

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
      }
    };

    fetchProjects();
  }, [cachedProjects, setCachedProjectsData]);

  // Trigger fade-in animation when content loads
  useEffect(() => {
    if (!loading && !cachedProjects) {
      // Small delay to ensure smooth fade-in
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, cachedProjects]);

  // Handle project click with fade-out animation
  const handleProjectClick = (projectId) => {
    setContentVisible(false);
    navigate(`/project/${projectId}`);
  };

  const getPrimaryImage = (project) => {
    return (
      project.primaryImage.url ||
      (project.media && project.media.length > 0 ? project.media[0].url : null)
    );
  };

  const renderContent = () => {
    if (loading) {
      return <ProjectsSkeleton />;
    }

    if (error) {
      return <Error>Error: {error}</Error>;
    }

    return (
      <FadeInWrapper visible={contentVisible}>
        <Grid>
          {projects.map((project) => (
            <Project
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              $isDarkMode={isDarkMode}
            >
              <ProjectImage imageUrl={getPrimaryImage(project)} />
              <Content>
                <Title>{project.name}</Title>
                <Description>{project.description}</Description>
              </Content>
            </Project>
          ))}
        </Grid>
      </FadeInWrapper>
    );
  };

  return (
    <Page>
      <Container>
        <Navigation />
        {renderContent()}
      </Container>
    </Page>
  );
}

export default ProjectsPage;
