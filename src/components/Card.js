import styled from "styled-components";

const Card = styled.div`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 3rem ${(props) => props.theme.shadow};
  position: relative;
  padding: 1rem;
  font-size: 0;
`;

export default Card;
