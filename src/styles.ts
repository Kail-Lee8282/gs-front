import { createGlobalStyle, DefaultTheme } from "styled-components";
import { reset } from "styled-reset";

export const lightTheme: DefaultTheme = {
  privateColor: "#eae1d8",
  fontColor: "#000",
  backgroundColor: "#fff",
  borderColor: "#bdc3c7",
  focusColor: "green",
};

export const darkTheme: DefaultTheme = {
  privateColor: "#353b48",
  fontColor: "#f5f6fa",
  backgroundColor: "#2f3640",
  borderColor: "#dcdde1",
  focusColor: "green",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}

      *{
        user-select: none;
  }

  body{
    font-size: 14px;
    box-sizing: border-box;
    font-family: 'Open Sans', sans-serif;
    color:${(props) => props.theme.fontColor};
    background-color: ${(props) => props.theme.privateColor};
  }

  a{
    text-decoration: none;
    color:inherit;
  }

  input{
    all:unset;
    box-sizing: border-box;
  }

button{
  all:unset;
}
`;
