import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import { Error } from "../components/States";
import { FadeInWrapper } from "../components/AnimationHelpers";
import { useTheme } from "../contexts/ThemeContext";
import {
  API_URL,
  FADE_TRANSITION,
  TRANSFORM_TRANSITION
} from "../constants";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  user-select: none;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AppCard = styled(Card)`
  padding: 2rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: unset;
  backface-visibility: hidden;
  will-change: transform;
  transition: ${TRANSFORM_TRANSITION}, ${FADE_TRANSITION};

  @media (max-width: 1024px) {
    flex-direction: row;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem;
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

const IconWrapper = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 25%;
  margin-bottom: 1.25rem;
  flex-shrink: 0;
  box-shadow: ${(props) =>
    props.$isDarkMode ? `0 0.5rem 3rem ${props.theme.shadow}` : "none"};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(0, 0, 0, 0.05);
    border-radius: 25%;
    pointer-events: none;
    opacity: ${(props) => (props.$isDarkMode ? 0 : 1)};
    z-index: 1;
  }

  @media (max-width: 1024px) {
    margin-bottom: 0;
  }
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 25%;
  object-fit: cover;
  display: block;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;

const IconPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25%;
  background: ${(props) => props.theme.border};
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  user-select: none;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.textPrimary};
`;

const Description = styled.p`
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.375;
  color: ${(props) => props.theme.textSecondary};
`;

function AppsPage() {
  const { pageVisible, contentVisible } = useOutletContext();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    document.title = "FCC Studio – Apps";
  }, []);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch(`${API_URL}/apps`);
        if (!response.ok) {
          throw new Error("Failed to fetch apps");
        }
        const data = await response.json();
        setApps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);

        const targetFrames = Math.ceil(50 / 16.67);
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
      }
    };

    fetchApps();
  }, []);

  const visible = pageVisible && contentVisible && dataLoaded;

  if (error) {
    return (
      <FadeInWrapper visible={visible}>
        <Error>Error: {error}</Error>
      </FadeInWrapper>
    );
  }

  if (loading) {
    return null;
  }

  return (
    <FadeInWrapper visible={visible}>
      <Grid>
        {apps.map((app) => (
          <AppCard
            as="a"
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppIcon src={app.iconUrl} alt={`${app.name} icon`} name={app.name} />
            <Text>
              <Name>{app.name}</Name>
              <Description>{app.description}</Description>
            </Text>
          </AppCard>
        ))}
      </Grid>
    </FadeInWrapper>
  );
}

function AppIcon({ src, alt, name }) {
  const { isDarkMode } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const showPlaceholder = !src || failed;

  return (
    <IconWrapper $isDarkMode={isDarkMode}>
      {showPlaceholder ? (
        <IconPlaceholder>{name?.charAt(0) || "?"}</IconPlaceholder>
      ) : (
        <Icon
          src={src}
          alt={alt}
          $loaded={loaded}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </IconWrapper>
  );
}

export default AppsPage;
