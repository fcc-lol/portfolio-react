import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Card from "../components/Card";
import { Page, Container } from "../components/Layout";
import { Loading, Error } from "../components/States";
import { useTheme } from "../contexts/ThemeContext";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

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

const Image = styled.div.attrs((props) => ({
  "data-image-url": props.imageurl
}))`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.imageurl ? `url(${props.imageurl})` : props.theme.cardBackground};
  background-size: cover;
  background-position: center;
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
  margin: 0 0 0.5rem 0;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  font-weight: bold;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
  margin: 0;
`;

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://portfolio-api.fcc.lol/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getPrimaryImage = (project) => {
    return (
      project.primaryImage ||
      (project.media && project.media.length > 0 ? project.media[0] : null)
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error>Error: {error}</Error>;
    }

    return (
      <Grid>
        {projects.map((project) => (
          <Project
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
            $isDarkMode={isDarkMode}
          >
            <Image imageurl={getPrimaryImage(project)} />
            <Content>
              <Title>{project.name}</Title>
              <Description>{project.description}</Description>
            </Content>
          </Project>
        ))}
      </Grid>
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
