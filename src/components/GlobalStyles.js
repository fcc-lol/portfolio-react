import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.textPrimary};
  }

  ::selection {
    background: ${(props) => props.theme.selection.background};
    color: ${(props) => props.theme.selection.color};
  }
`;

export default GlobalStyles;
