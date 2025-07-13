import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
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

const MediaCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  position: relative;

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

  @media (max-width: 768px) {
    min-height: 8rem;
  }
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
  transition: ${(props) =>
    props.shouldAnimate ? "opacity 0.5s ease-in-out" : "none"};
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
  transition: ${(props) =>
    props.shouldAnimate ? "opacity 0.5s ease-in-out" : "none"};
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

function MediaItem({ mediaUrl, projectName, index }) {
  const { markImageAsLoaded, isImageLoaded } = useTheme();
  const isVideo = isVideoFile(mediaUrl);

  // Check if media was already loaded in this session immediately
  const wasLoadedBefore = mediaUrl ? isImageLoaded(mediaUrl) : false;

  const [loaded, setLoaded] = useState(wasLoadedBefore || !mediaUrl);
  const [shouldAnimate, setShouldAnimate] = useState(
    !wasLoadedBefore && mediaUrl
  );

  useEffect(() => {
    if (mediaUrl) {
      // If we've seen this media before in this session, don't animate
      if (isImageLoaded(mediaUrl)) {
        setLoaded(true);
        setShouldAnimate(false);
        return;
      }
    }
  }, [mediaUrl, isImageLoaded]);

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
          shouldAnimate={shouldAnimate}
          wasLoadedBefore={wasLoadedBefore}
          onLoadedData={handleMediaLoad}
        />
      </MediaContainer>
    );
  }

  return (
    <MediaContainer>
      <HiddenImage src={mediaUrl} onLoad={handleMediaLoad} alt="" />
      <FadeInImage
        src={mediaUrl}
        alt={`${projectName} - ${index + 1}`}
        loaded={loaded}
        shouldAnimate={shouldAnimate}
        wasLoadedBefore={wasLoadedBefore}
      />
    </MediaContainer>
  );
}

function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
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

  if (loading) {
    return (
      <Page>
        <Container>
          <Navigation />
          <ProjectSkeleton />
        </Container>
      </Page>
    );
  }

  if (error || !project) {
    return (
      <Page>
        <Container>
          <Navigation showBackButton={true} />
          <Error>Error: {error || "Project not found"}</Error>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Navigation showBackButton={true} />

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
              {project.media.map((mediaUrl, index) => (
                <MediaCard key={index} $isDarkMode={isDarkMode}>
                  <MediaItem
                    mediaUrl={mediaUrl}
                    projectName={project.name}
                    index={index}
                  />
                </MediaCard>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Page>
  );
}

export default ProjectPage;
