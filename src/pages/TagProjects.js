import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { HeaderTextContent, Subheader } from "../components/Typography";
import ProjectsGrid from "../components/ProjectsGrid";
import { useTheme } from "../contexts/ThemeContext";

const HeaderCard = styled(Card)`
  min-height: 4rem;
`;

const Title = styled(Subheader)`
  margin: 0 0 0.125rem 0;
`;

function TagProjectsPage() {
  const { isDarkMode } = useTheme();
  const { tagName } = useParams();

  // API endpoint for tag projects
  const apiEndpoint = `https://portfolio-api.fcc.lol/projects/tag/${tagName}`;

  // Document title
  const documentTitle = `FCC Studio – #${tagName} Projects`;

  // Header component with tag display
  const headerComponent = (
    <HeaderCard $isDarkMode={isDarkMode}>
      <HeaderTextContent>
        <Title>Projects with #{tagName}</Title>
      </HeaderTextContent>
    </HeaderCard>
  );

  // No results message
  const noResultsMessage = `No projects found with the tag #${tagName}.`;

  return (
    <ProjectsGrid
      apiEndpoint={apiEndpoint}
      headerComponent={headerComponent}
      documentTitle={documentTitle}
      noResultsMessage={noResultsMessage}
    />
  );
}

export default TagProjectsPage;
