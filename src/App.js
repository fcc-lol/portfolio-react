import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

const Page = styled.div`
  padding: 1.25rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    padding: 1rem 0 0 0;
    margin-bottom: 3rem;
  }
`;

const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    padding: 0 3rem;
  }
`;

const TabNavigation = styled.nav`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  user-select: none;
  gap: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    gap: 1rem;
  }
`;

const TabButton = styled.button`
  background: none;
  border: none;
  color: ${(props) =>
    props.$isActive ? "rgba(0,0,0, 1)" : "rgba(0,0,0, 0.5)"};
  padding: 1rem;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backface-visibility: hidden;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      color: rgba(0, 0, 0, 1);
      transform: scale(1.1);
    }
  }

  &:active {
    color: rgba(0, 0, 0, 1);
    transform: scale(0.9);
  }
`;

const Card = styled.div`
  background: rgb(255, 255, 255);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 3rem rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 1rem;
  font-size: 0;
`;

const TextContent = styled.div`
  padding: 0 1.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;

  ::selection {
    background: rgba(0, 0, 0, 1);
    color: rgba(255, 255, 255, 1);
  }

  @media (max-width: 1024px) {
    gap: 0rem;
  }
`;

const Header = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
  line-height: 1.25;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }
`;

const Subheader = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
  line-height: 1.25;
`;

const LargeText = styled.p`
  font-size: 2rem;
  font-weight: normal;
  margin: 1rem 0;
  line-height: 1.25;
`;

const Text = styled.p`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 1rem 0;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.5);
`;

const Projects = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProjectCard = styled(Card)`
  backface-visibility: hidden;
  will-change: transform;
  background: #000000;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: unset;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ProjectImage = styled.div.attrs((props) => ({
  "data-image-url": props.imageurl
}))`
  height: 20rem;
  background: ${(props) =>
    props.imageurl ? `url(${props.imageurl})` : "#f0f0f0"};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
  line-height: 1.5;
  position: absolute;
  z-index: 1;
  bottom: -0.25rem;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
`;

const ProjectTitle = styled.h2`
  margin: 0 0 0.25rem 0;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  font-weight: bold;
`;

const ProjectDescription = styled.p`
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
  margin: 0;
`;

const Loading = styled.div`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const Error = styled.div`
  text-align: center;
  color: #ff6b6b;
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 2rem;
`;

const TabContent = styled.div``;

const VStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (max-width: 1024px) {
    gap: 2rem;
  }
`;

const HStack = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

function AppContent() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/space") return "space";
    if (path === "/about") return "about";
    return "projects"; // default and /projects
  };

  const activeTab = getCurrentTab();

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

  // Handle tab click
  const handleTabClick = (tab) => {
    if (tab === "projects") {
      navigate("/");
    } else {
      navigate(`/${tab}`);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <Loading>Loading...</Loading>;
    }

    if (error) {
      return <Error>Error: {error}</Error>;
    }

    switch (activeTab) {
      case "projects":
        return (
          <Projects>
            {projects.map((project) => (
              <ProjectCard key={project.id}>
                <ProjectImage imageurl={getPrimaryImage(project)} />
                <ProjectContent>
                  <ProjectTitle>{project.name}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                </ProjectContent>
              </ProjectCard>
            ))}
          </Projects>
        );
      case "space":
        return (
          <TabContent>
            <VStack>
              <Card style={{ padding: "0" }}>
                <img
                  src="https://static.fcc.lol/studio-photos/IMG_8796.jpeg"
                  alt="1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Card>
              <Card style={{ padding: "0" }}>
                <img
                  src="https://static.fcc.lol/studio-photos/IMG_8806.jpeg"
                  alt="1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Card>
              <Card style={{ padding: "0" }}>
                <img
                  src="https://static.fcc.lol/studio-photos/IMG_8813.jpeg"
                  alt="1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Card>
            </VStack>
          </TabContent>
        );
      case "about":
        return (
          <TabContent>
            <VStack>
              <Card>
                <TextContent>
                  <Header>
                    We are a technology and art collective that makes fun
                    software and hardware.
                  </Header>
                  <LargeText>We think computing should be fun.</LargeText>
                </TextContent>
              </Card>
              <HStack>
                <Card>
                  <TextContent>
                    <Subheader>Zach</Subheader>
                    <Text>
                      I’m a curious tinkerer, who learns by doing. I like to
                      work on projects that present opportunities to think
                      strategically and execute nimbly.
                    </Text>
                  </TextContent>
                </Card>
                <Card>
                  <TextContent>
                    <Subheader>Dan</Subheader>
                    <Text>
                      I'm a guy that likes design and code. More to come.
                    </Text>
                  </TextContent>
                </Card>
                <Card>
                  <TextContent>
                    <Subheader>Leo</Subheader>
                    <Text>
                      I’m a designer, engineer, and artist. I believe design and
                      technology should encourage community, equal opportunity,
                      and social progress.
                    </Text>
                  </TextContent>
                </Card>
              </HStack>
            </VStack>
          </TabContent>
        );
      default:
        return null;
    }
  };

  return (
    <Page>
      <Container>
        <TabNavigation>
          <TabButton
            $isActive={activeTab === "projects"}
            onClick={() => handleTabClick("projects")}
          >
            Projects
          </TabButton>
          <TabButton
            $isActive={activeTab === "space"}
            onClick={() => handleTabClick("space")}
          >
            Space
          </TabButton>
          <TabButton
            $isActive={activeTab === "about"}
            onClick={() => handleTabClick("about")}
          >
            About
          </TabButton>
        </TabNavigation>
        {renderTabContent()}
      </Container>
    </Page>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/projects" element={<AppContent />} />
        <Route path="/space" element={<AppContent />} />
        <Route path="/about" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
