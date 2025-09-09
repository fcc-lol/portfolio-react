import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import { HeaderTextContent, Subheader } from "../components/Typography";
import ProfilePicture from "../components/ProfilePicture";
import ProjectsGrid from "../components/ProjectsGrid";
import { useTheme } from "../contexts/ThemeContext";

const HeaderCard = styled(Card)`
  min-height: ${(props) => (props.$type === "person" ? "6rem" : "4rem")};
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
  const { pageVisible, contentVisible } = useOutletContext();
  const params = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Start fade-in after a short delay to ensure proper animation
  useEffect(() => {
    const targetFrames = Math.ceil(50 / 16.67); // ~3 frames for 50ms
    let frameCount = 0;

    const waitForDelay = () => {
      frameCount++;
      if (frameCount >= targetFrames) {
        setDataLoaded(true);
      } else {
        requestAnimationFrame(waitForDelay);
      }
    };

    requestAnimationFrame(waitForDelay);
  }, []);

  // Get the parameter based on type - memoized to prevent unnecessary recalculations
  const paramName = useMemo(() => {
    return type === "person" ? params.personName : params.tagName;
  }, [type, params.personName, params.tagName]);

  // For person projects, capitalize the name for display
  const displayName = useMemo(() => {
    return type === "person" && paramName
      ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
      : paramName;
  }, [type, paramName]);

  // API endpoint based on type
  const apiEndpoint = useMemo(() => {
    return `https://portfolio-api.fcc.lol/projects/${type}/${paramName}`;
  }, [type, paramName]);

  // Document title based on type
  const documentTitle = useMemo(() => {
    return type === "person"
      ? `FCC Studio – Projects with ${displayName}`
      : `FCC Studio – Projects with #${paramName}`;
  }, [type, displayName, paramName]);

  // Header component - different for person vs tag
  const headerComponent = useMemo(() => {
    return type === "person" ? (
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
  }, [type, isDarkMode, displayName, paramName]);

  // No results message based on type
  const noResultsMessage = useMemo(() => {
    return type === "person"
      ? `No projects found for ${displayName}.`
      : `No projects found with the tag #${paramName}.`;
  }, [type, displayName, paramName]);

  // Combine both pageVisible and contentVisible (for different fade-out types) with dataLoaded (for fade-in timing)
  const combinedPageVisible = pageVisible && dataLoaded;
  const combinedContentVisible = contentVisible && dataLoaded;

  return (
    <ProjectsGrid
      apiEndpoint={apiEndpoint}
      headerComponent={headerComponent}
      documentTitle={documentTitle}
      noResultsMessage={noResultsMessage}
      pageVisible={combinedPageVisible}
      contentVisible={combinedContentVisible}
    />
  );
}

export default FilteredProjectsPage;
