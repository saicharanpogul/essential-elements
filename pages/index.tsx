import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Center, Spacer, Stack, useMediaQuery } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { useWallet } from "@solana/wallet-adapter-react";
import Disconnected from "../components/Disconnected";
import Connected from "../components/Connected";

const Home: NextPage = () => {
  const { connected } = useWallet();
  const [isLessThan400] = useMediaQuery("(max-width: 480px)");
  return (
    <div className={styles.container}>
      <Head>
        <title>Essential Elements</title>
        <meta
          name="description"
          content="The NFT Collection for Essential Elements"
        />
        <meta
          property="og:image"
          content="https://essential-elements.saicharanpogul.xyz/og-image.png"
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
        bgImage={connected ? "" : ["", "url(/home-background.svg)"]}
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
          <Center>{connected ? <Connected /> : <Disconnected />}</Center>
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

export default Home;
