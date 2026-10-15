import React from "react";
import styled from "styled-components";

const Card = styled.article`
  display: flex;
  flex-direction: row;
  background: #000000;
  border-radius: 1.25rem;
  overflow: hidden;
  margin-bottom: 1.5rem;

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

const Artwork = styled.img`
  width: 9rem;
  height: 9rem;
  object-fit: cover;
  flex-shrink: 0;
  display: block;

  @media (max-width: 560px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }
`;

const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem;
  padding: 1rem 1.25rem;
`;

const EventTitle = styled.h2`
  margin: 0;
  color: #f0ece3;
  font-weight: 600;
  font-size: clamp(0.9375rem, 2.5vw, 1.125rem);
  line-height: 1.3;
`;

const EventDate = styled.p`
  margin: 0;
  color: #f0ece3;
  font-weight: 600;
  font-size: clamp(0.875rem, 2.2vw, 1rem);
  line-height: 1.3;
`;

const Wordmark = styled.a`
  display: inline-block;
  width: fit-content;
  margin-top: 0.25rem;
  font-family: "DM Mono", monospace;
  font-weight: 300;
  color: #f0ece3;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

function FriendsAndFamilyShowBanner() {
  return (
    <Card>
      <Artwork
        src="https://static.fcc.lol/art-show-square-dark.gif"
        alt="FCC Friends and Family Show collage artwork"
        loading="lazy"
      />
      <TextBlock>
        <EventTitle>FCC Friends and Family Show</EventTitle>
        <EventDate>Nov 14–15</EventDate>
        <Wordmark href="/">fcc.lol</Wordmark>
      </TextBlock>
    </Card>
  );
}

export default FriendsAndFamilyShowBanner;
