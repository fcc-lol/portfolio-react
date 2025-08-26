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
  min-height: ${props => props.$type === 'person' ? '6rem' : '4rem'};
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

function FilteredProjectsPage({ type }) {
  const { isDarkMode } = useTheme();
  const params = useParams();
  // Navigation hooks available if needed for future navigation functionality
  // const navigate = useNavigate();
  // const { handleFadeOut } = useOutletContext();

  // Get the parameter based on type
  const paramName = type === 'person' ? params.personName : params.tagName;
  
  // For person projects, capitalize the name for display
  const displayName = type === 'person' && paramName
    ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
    : paramName;

  // API endpoint based on type
  const apiEndpoint = `https://portfolio-api.fcc.lol/projects/${type}/${paramName}`;

  // Document title based on type
  const documentTitle = type === 'person' 
    ? `FCC Studio – Projects with ${displayName}`
    : `FCC Studio – Projects with #${paramName}`;

  // Header component - different for person vs tag
  const headerComponent = type === 'person' ? (
    <HeaderCard $isDarkMode={isDarkMode} $type={type}>
      <HeaderTextContentWithProfilePicture>
        <ProfilePicture alt={displayName} name={displayName} size="medium" />
        <Title>Projects with {displayName}</Title>
      </HeaderTextContentWithProfilePicture>
    </HeaderCard>
  ) : (
    <HeaderCard $isDarkMode={isDarkMode} $type={type}>
      <HeaderTextContent>
        <Title>Projects with #{paramName}</Title>
      </HeaderTextContent>
    </HeaderCard>
  );

  // No results message based on type
  const noResultsMessage = type === 'person'
    ? `No projects found for ${displayName}.`
    : `No projects found with the tag #${paramName}.`;

  return (
    <ProjectsGrid
      apiEndpoint={apiEndpoint}
      headerComponent={headerComponent}
      documentTitle={documentTitle}
      noResultsMessage={noResultsMessage}
    />
  );
}

export default FilteredProjectsPage;
