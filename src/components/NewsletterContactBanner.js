import React from "react";
import styled from "styled-components";
import { Link } from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faNewspaper } from "@fortawesome/free-solid-svg-icons";
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
  gap: 1rem;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-top: 0;
  }

  ::selection {
    background: ${(props) => props.theme.cardBackground}!important;
    color: ${(props) => props.theme.textPrimary}!important;
  }
`;

const Title = styled.div`
  color: ${(props) => props.theme.cardBackground};
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 0.5rem;
  font-family: "DM Mono", monospace !important;
  font-weight: 500;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: -1px;
`;

const BannerLinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
`;

const BannerLink = styled(Link)`
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

function NewsletterContactBanner() {
  return (
    <Container>
      <Title>thanks for joining the gallery show!</Title>
      <BannerLinksContainer>
        <BannerLink
          href="https://forms.gle/J8rMgwjYFKZNyqnE9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faNewspaper} />
          join newsletter
        </BannerLink>
        <BannerLink href="mailto:studio@fcc.lol">
          <FontAwesomeIcon icon={faEnvelope} />
          email us
        </BannerLink>
      </BannerLinksContainer>
    </Container>
  );
}

export default NewsletterContactBanner;
