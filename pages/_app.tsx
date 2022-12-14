import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { extendTheme } from "@chakra-ui/react";
import WalletContextProvider from "../components/WalletContextProvider";
import { WorkspaceProvider } from "../components/WorkspaceProvider";

const colors = {
  background: "#1F1F1F",
  backgroundLight: "#3C3C3C",
  backgroundAlt: "#505050",
  accent: "#2662E7",
  bodyText: "rgba(255, 255, 255, 0.75)",
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <WorkspaceProvider>
          <Component {...pageProps} />
        </WorkspaceProvider>
      </WalletContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
