import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import { RouterProvider } from "react-router-dom";
import router from './router';
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { client, isDarkModeVar } from "./apollo";

function App() {

  const isDarkMode = useReactiveVar(isDarkModeVar);
  
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={isDarkMode ? darkTheme:lightTheme}>
          <GlobalStyles />
          <RouterProvider router={router} />
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
