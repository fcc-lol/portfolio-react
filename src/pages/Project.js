import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container, VStack } from "../components/Layout";
import { Loading, Error } from "../components/States";
import { Header, MediumText, TextContent } from "../components/Typography";

const MediaCard = styled(Card)`
  padding: 0;
  overflow: hidden;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

function ProjectPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();

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
          <Loading>Loading...</Loading>
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
            </TextContent>
          </Card>

          {project.media && project.media.length > 1 && (
            <VStack>
              {project.media.map((mediaUrl, index) => (
                <MediaCard key={index}>
                  <img src={mediaUrl} alt={`${project.name} - ${index + 1}`} />
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
