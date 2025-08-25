import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { HeaderTextContent, Subheader } from "../components/Typography";
import ProfilePicture from "../components/ProfilePicture";
import ProjectsGrid from "../components/ProjectsGrid";
import { useTheme } from "../contexts/ThemeContext";
// import { useOutletContext, useNavigate } from "react-router-dom";
// import { ANIMATION_DURATION } from "../constants";

const HeaderCard = styled(Card)`
  min-height: 6rem;
`;

const HeaderTextContentWithProfilePicture = styled(HeaderTextContent)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled(Subheader)`
  margin: 0 0 0.125rem 0;
`;

function PersonProjectsPage() {
  const { isDarkMode } = useTheme();
  const { personName } = useParams();
  // Navigation hooks available if needed for future navigation functionality
  // const navigate = useNavigate();
  // const { handleFadeOut } = useOutletContext();

  // Capitalize person name for display
  const displayName = personName
    ? personName.charAt(0).toUpperCase() + personName.slice(1)
    : "";

  // API endpoint for person projects
  const apiEndpoint = `https://portfolio-api.fcc.lol/projects/person/${personName}`;

  // Document title
  const documentTitle = `FCC Studio – Projects with ${displayName}`;

  // Header component with ProfilePicture
  const headerComponent = (
    <HeaderCard $isDarkMode={isDarkMode}>
      <HeaderTextContentWithProfilePicture>
        <ProfilePicture alt={displayName} name={displayName} size="medium" />
        <Title>Projects with {displayName}</Title>
      </HeaderTextContentWithProfilePicture>
    </HeaderCard>
  );

  // No results message
  const noResultsMessage = `No projects found for ${displayName}.`;

  return (
    <ProjectsGrid
      apiEndpoint={apiEndpoint}
      headerComponent={headerComponent}
      documentTitle={documentTitle}
      noResultsMessage={noResultsMessage}
    />
  );
}

export default PersonProjectsPage;
