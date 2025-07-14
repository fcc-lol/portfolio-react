import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack } from "../components/Layout";
import { ProjectSkeleton, Error } from "../components/States";
import {
  Header,
  MediumText,
  HeaderTextContent
} from "../components/Typography";
import { useTheme } from "../contexts/ThemeContext";
import { FADE_TRANSITION } from "../constants";

const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const MediaCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  position: relative;
  ${(props) => props.$aspectRatio && `aspect-ratio: ${props.$aspectRatio};`}
  min-height: 200px;

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
`;

const HeaderCard = styled(Card)`
  min-height: 10rem;
`;

const MediaContainer = styled.div`
  width: 100%;
  position: relative;
`;

const FadeInImage = styled.img`
  width: 100%;
  object-fit: cover;
  display: block;
  opacity: ${(props) => {
    // If image was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const FadeInVideo = styled.video`
  width: 100%;
  object-fit: cover;
  display: block;
  opacity: ${(props) => {
    // If video was loaded before, start with opacity 1 immediately
    if (props.wasLoadedBefore) return 1;
    // Otherwise use the loaded state
    return props.loaded ? 1 : 0;
  }};
  transition: ${(props) => (props.shouldAnimate ? FADE_TRANSITION : "none")};
`;

const HiddenImage = styled.img`
  display: none;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LinkButton = styled.a`
  display: inline-block;
  color: ${(props) => props.theme.textSecondary};
  text-decoration: underline;
  font-weight: normal;
  transition: all 0.2s ease-in-out;
  font-size: 1.125rem;

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.textPrimary};
    }
  }

  &:active {
    transform: scale(0.9);
  }
`;

// Helper function to determine if a URL is a video
const isVideoFile = (url) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

function MediaItem({ mediaItem, projectName, index }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();

  // Handle both old format (string) and new format (object)
  const mediaUrl = typeof mediaItem === "string" ? mediaItem : mediaItem.url;
  const isVideo = isVideoFile(mediaUrl);

  // Check if media was already loaded in this session immediately
  const wasLoadedBefore = mediaUrl ? isImageLoaded(mediaUrl) : false;

  // Always start as false to trigger fade-in animation on page load
  const [loaded, setLoaded] = useState(!mediaUrl);
  const imageRef = useRef(null);

  useEffect(() => {
    if (mediaUrl && !isVideo) {
      // If media was already loaded before, trigger fade-in immediately
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
        markImageAsLoaded(mediaUrl);
      }
    } else if (mediaUrl && isVideo) {
      // For videos, handle fade-in similarly
      if (wasLoadedBefore) {
        setTimeout(() => setLoaded(true), 50);
      }
    }
  }, [mediaUrl, wasLoadedBefore, markImageAsLoaded, isVideo]);

  const handleMediaLoad = () => {
    setLoaded(true);

    // Mark this media as loaded in the global state
    if (mediaUrl) {
      markImageAsLoaded(mediaUrl);
    }
  };

  if (isVideo) {
    return (
      <MediaContainer>
        <FadeInVideo
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          loaded={loaded}
          shouldAnimate={!!mediaUrl}
          wasLoadedBefore={wasLoadedBefore}
          onLoadedData={handleMediaLoad}
        />
      </MediaContainer>
    );
  }

  return (
    <MediaContainer>
      <HiddenImage
        ref={imageRef}
        src={mediaUrl}
        onLoad={handleMediaLoad}
        alt=""
      />
      <FadeInImage
        src={mediaUrl}
        alt={`${projectName} - ${index + 1}`}
        loaded={loaded}
        shouldAnimate={!!mediaUrl}
        wasLoadedBefore={wasLoadedBefore}
      />
    </MediaContainer>
  );
}

function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageVisible, setPageVisible] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `https://portfolio-api.fcc.lol/projects/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Trigger fade-in animation when component mounts and loading is complete
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure smooth fade-in
      const timer = setTimeout(() => {
        setPageVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Handle back button click with fade-out animation
  const handleBackClick = () => {
    setPageVisible(false);
    navigate("/");
  };

  if (loading) {
    return (
      <Page>
        <Container>
          <Navigation showBackButton={true} onBackClick={handleBackClick} />
          <ProjectSkeleton mediaItems={project?.media} />
        </Container>
      </Page>
    );
  }

  if (error || !project) {
    return (
      <Page>
        <Container>
          <Navigation showBackButton={true} onBackClick={handleBackClick} />
          <FadeInWrapper visible={pageVisible}>
            <Error>Error: {error || "Project not found"}</Error>
          </FadeInWrapper>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Navigation showBackButton={true} onBackClick={handleBackClick} />
        <FadeInWrapper visible={pageVisible}>
          <VStack>
            <HeaderCard $isDarkMode={isDarkMode}>
              <HeaderTextContent>
                <Header>{project.name}</Header>
                <MediumText>{project.description}</MediumText>
                {project.links && project.links.length > 0 && (
                  <LinksContainer>
                    {project.links.map((link, index) => (
                      <LinkButton
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </LinkButton>
                    ))}
                  </LinksContainer>
                )}
              </HeaderTextContent>
            </HeaderCard>

            {project.media && (
              <VStack>
                {project.media.map((mediaItem, index) => {
                  // Calculate aspect ratio for the card
                  const aspectRatio =
                    typeof mediaItem === "object" && mediaItem.dimensions
                      ? mediaItem.dimensions.width / mediaItem.dimensions.height
                      : null;

                  return (
                    <MediaCard
                      key={index}
                      $isDarkMode={isDarkMode}
                      $aspectRatio={aspectRatio}
                    >
                      <MediaItem
                        mediaItem={mediaItem}
                        projectName={project.name}
                        index={index}
                      />
                    </MediaCard>
                  );
                })}
              </VStack>
            )}
          </VStack>
        </FadeInWrapper>
      </Container>
    </Page>
  );
}

export default ProjectPage;
