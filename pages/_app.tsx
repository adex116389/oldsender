import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import FileProvider from "../context/fileContext";

const theme = extendTheme({
  fonts: {
    heading: `"didot, serif`,
    body: `"didot, serif`,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <FileProvider>
        <Component {...pageProps} />
      </FileProvider>
    </ChakraProvider>
  );
}

export default MyApp;
