import {
  Box,
  Center,
  Spacer,
  Stack,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import Head from "next/head";
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import NavBar from "./NavBar";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
};

const MainLayout: React.FC<Props> = ({
  children,
  title,
  description,
  ogImage,
}) => {
  const { connected } = useWallet();
  const [isLessThan400] = useMediaQuery("(max-width: 480px)");
  return (
    <div className={styles.container}>
      <Head>
        <title>{title ? title : "Essential Elements"}</title>
        <meta
          name="description"
          content={
            description
              ? description
              : "The NFT Collection for Essential Elements"
          }
        />
        <meta
          property="og:image"
          content={
            ogImage
              ? ogImage
              : "https://essential-elements.saicharanpogul.xyz/og-image.png"
          }
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Box
        w="full"
        h={
          connected
            ? isLessThan400
              ? "calc(200vh)"
              : "calc(100vh)"
            : "calc(100vh)"
        }
        background={"background"}
        bgImage={
          connected
            ? ""
            : [
                "",
                "linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(/home-background.svg)",
              ]
        }
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      >
        <Stack
          w="full"
          h={
            connected
              ? isLessThan400
                ? "calc(200vh)"
                : "calc(100vh)"
              : "calc(100vh)"
          }
          justify="center"
        >
          <NavBar />
          <Spacer />
          <VStack spacing={[20, 10]}>{children}</VStack>
          <Spacer />
          <Center>
            <Box color="white">
              <a
                href="https://twitter.com/_buildspace"
                target="_blank"
                rel="noopener noreferrer"
              >
                built with @_buildspace
              </a>
            </Box>
          </Center>
          <Spacer />
        </Stack>
      </Box>
    </div>
  );
};

export default MainLayout;
