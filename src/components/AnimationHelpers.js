import styled from "styled-components";
import { FADE_TRANSITION } from "../constants";

export const FadeInWrapper = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: ${FADE_TRANSITION};
`;
