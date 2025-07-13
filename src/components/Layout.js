import styled from "styled-components";

export const Page = styled.div`
  padding: 1.25rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    padding: 1rem 0 0 0;
    margin-bottom: 3rem;
  }
`;

export const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    padding: 0 3rem;
  }
`;

export const VStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (max-width: 1024px) {
    gap: 2rem;
  }
`;

export const HStack = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
