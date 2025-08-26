import styled from "styled-components";

export const Header = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid ${(props) => props.theme.border};
  line-height: 1.25;
  color: ${(props) => props.theme.textPrimary};

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }
`;

export const Subheader = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
  line-height: 1.25;
  color: ${(props) => props.theme.textPrimary};
`;

export const LargeText = styled.p`
  font-size: 2rem;
  line-height: 1.375;
  font-weight: normal;
  margin: 0;
  color: ${(props) => props.theme.textPrimary};

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }
`;

export const MediumText = styled.p`
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.25;
  color: ${(props) => props.theme.textPrimary};
`;

export const SmallText = styled.p`
  font-size: 1.125rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.375;
  color: ${(props) => props.theme.textSecondary};
`;

export const HeaderTextContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TextContent = styled.div`
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`;
