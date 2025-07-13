import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack } from "../components/Layout";
import { Loading, Error } from "../components/States";
import { Header, MediumText, TextContent } from "../components/Typography";
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

  img,
  video {
    width: 100%;
    object-fit: cover;
    display: block;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const LinkButton = styled.a`
  display: inline-block;
  color: ${(props) => props.theme.textSecondary};
  text-decoration: underline;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.textPrimary};
  }
`;

// Helper function to determine if a URL is a video
const isVideoFile = (url) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

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
          <Loading />
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
          <Card>
            <TextContent>
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
            </TextContent>
          </Card>

          {project.media && (
            <VStack>
              {project.media.map((mediaUrl, index) => (
                <MediaCard key={index} $isDarkMode={isDarkMode}>
                  {isVideoFile(mediaUrl) ? (
                    <video src={mediaUrl} autoPlay muted loop playsInline />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={`${project.name} - ${index + 1}`}
                    />
                  )}
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
