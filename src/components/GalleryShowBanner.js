import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FADE_TRANSITION } from "../constants";

const Container = styled.div`
  background: ${(props) => props.theme.textPrimary};
  border-radius: 1.5rem;
  padding: 1.5rem;
  text-align: center;
  transition: ${FADE_TRANSITION};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const TopSection = styled.div`
  position: relative;
  width: 320px;
  height: 180px;
  margin-top: 0.5rem;
  transform: rotate(-3deg);
`;

const Title = styled.h2`
  font-size: 35px;
  font-weight: 600;
  font-family: "DM Mono", monospace !important;
  position: absolute;
  top: 0px;
  left: 2px;
  background: ${(props) => props.theme.background};
  padding: 10px 0;
  border-radius: 0.75rem;
  margin: 0;
  width: 100%;
`;

const Description = styled.div`
  position: absolute;
  color: ${(props) => props.theme.cardBackground};
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 1px;
  font-family: "DM Mono", monospace !important;
  font-weight: 500;
  font-size: 2rem;
  top: 80px;
  left: 20px;
  letter-spacing: -1px;

  ::selection {
    background: ${(props) => props.theme.cardBackground};
    color: ${(props) => props.theme.textPrimary};
  }
`;

const DescriptionLink = styled.a`
  color: ${(props) => props.theme.cardBackground};
  display: flex;
  text-decoration: none;
  font-family: "DM Mono", monospace;
  width: 100%;
  text-align: left;
  height: 42px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  &:active {
    opacity: 0.5;
  }
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.cardBackground};
  text-decoration: none;
  font-weight: normal;
  transition: color 250ms ease-in-out, transform 150ms ease-in-out;
  font-size: 1.125rem;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  margin-top: 1rem;
  margin-bottom: 0.25rem;

  ::selection {
    background: ${(props) => props.theme.cardBackground};
    color: ${(props) => props.theme.textPrimary};
  }

  @media (hover: hover) {
    &:hover {
      color: rgb(145, 145, 145);
    }
  }

  &:active {
    color: #cccccc;
    transform: scale(0.9);
  }
`;

function GalleryShowBanner() {
  const handleShare = async () => {
    const shareData = {
      title: "FCC Gallery Show",
      text: "November 8-9, 2025 · 618 E 9th St, New York",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <Container>
      <TopSection>
        <Title>gallery show</Title>
        <Description>
          <DescriptionLink
            href="https://static.fcc.lol/nov-2025-gallery-show/FCC%20Gallery%20Show.ics"
            target="_blank"
            rel="noopener noreferrer"
          >
            nov 8-9
          </DescriptionLink>
          <DescriptionLink
            href="https://maps.app.goo.gl/63RYi2aC9412xXcf9"
            target="_blank"
            rel="noopener noreferrer"
          >
            618 e 9th st
          </DescriptionLink>
        </Description>
      </TopSection>
      <ShareButton onClick={handleShare}>
        <FontAwesomeIcon icon={faShare} />
        Share
      </ShareButton>
    </Container>
  );
}

export default GalleryShowBanner;
