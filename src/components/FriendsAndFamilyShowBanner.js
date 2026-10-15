import React from "react";
import styled from "styled-components";

const Card = styled.article`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: #121212;
  border-radius: 1.25rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

// Fluid square sizing instead of a breakpoint — keeps the image-next-to-text
// lock-up at every width by shrinking the thumbnail down to ~4rem on
// narrow screens rather than stacking it above the text.
const Artwork = styled.img`
  width: clamp(4rem, 22vw, 9rem);
  height: clamp(4rem, 22vw, 9rem);
  object-fit: cover;
  flex-shrink: 0;
  display: block;
`;

const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(0.1875rem, 1vw, 0.375rem);
  padding: clamp(0.625rem, 3vw, 1rem) clamp(0.75rem, 4vw, 1.25rem);
`;

const EventTitle = styled.h2`
  margin: 0;
  color: #f0ece3;
  font-weight: 600;
  font-size: clamp(0.75rem, 3.2vw, 1.125rem);
  line-height: 1.3;
`;

const EventDate = styled.p`
  margin: 0;
  color: #f0ece3;
  font-weight: 600;
  font-size: clamp(0.6875rem, 2.8vw, 1rem);
  line-height: 1.3;
`;

const Wordmark = styled.a`
  display: inline-block;
  width: fit-content;
  margin-top: 0.25rem;
  font-family: "DM Mono", monospace;
  font-weight: 300;
  color: #f0ece3;
  font-size: clamp(0.625rem, 2.2vw, 0.875rem);
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
