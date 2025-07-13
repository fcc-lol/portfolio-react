import styled from "styled-components";

export const Header = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
  line-height: 1.25;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }
`;

export const Subheader = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
  line-height: 1.25;
`;

export const LargeText = styled.p`
  font-size: 2rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.25;
`;

export const MediumText = styled.p`
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.25;
  color: rgba(0, 0, 0, 1);
`;

export const SmallText = styled.p`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.5);
`;

export const TextContent = styled.div`
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ::selection {
    background: rgba(0, 0, 0, 1);
    color: rgba(255, 255, 255, 1);
  }

  @media (max-width: 1024px) {
    gap: 0rem;
    padding: 0 1rem;
  }
`;
