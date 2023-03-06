import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    privateColor: string;
    fontColor: string;
    backgroundColor: string;
    borderColor: string;
    focusColor: string;
  }
}
