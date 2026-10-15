import React from "react";
import styled from "styled-components";

const BannerWrapper = styled.div`
  width: 100%;
  background: #000000;
  box-sizing: border-box;
`;

const Inner = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 0.875rem 1.25rem 1.125rem;

  @media (min-width: 768px) {
    padding: 0.875rem 3rem 1.125rem;
  }
`;

const Divider = styled.div`
  border-top: 1px solid rgba(240, 236, 227, 0.3);
  margin-bottom: 0.875rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }
`;

const EventInfo = styled.div`
  color: #f0ece3;
  line-height: 1.3;
`;

const EventTitle = styled.div`
  font-weight: 600;
  font-size: clamp(0.875rem, 2.5vw, 1.0625rem);
`;

const EventDate = styled.div`
  font-weight: 600;
  font-size: clamp(0.875rem, 2.5vw, 1.0625rem);
`;

const Wordmark = styled.a`
  font-family: "DM Mono", monospace;
  font-weight: 300;
  color: #f0ece3;
  font-size: 0.9375rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

function FriendsAndFamilyShowBanner() {
  return (
    <BannerWrapper>
      <Inner>
        <Divider />
        <Content>
          <EventInfo>
            <EventTitle>FCC Friends and Family Show</EventTitle>
            <EventDate>Nov 14–15</EventDate>
          </EventInfo>
          <Wordmark href="/">fcc.lol</Wordmark>
        </Content>
      </Inner>
    </BannerWrapper>
  );
}

export default FriendsAndFamilyShowBanner;
