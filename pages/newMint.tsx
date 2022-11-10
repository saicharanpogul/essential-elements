import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";
import { Button, Text, HStack, Heading } from "@chakra-ui/react";
import { MouseEventHandler, useCallback } from "react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import MainLayout from "../components/MainLayout";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

interface NewMint {
  mint: PublicKey | null;
}

const NewMint: NextPage<NewMint> = ({ mint }) => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [metadata, setMetadata] = useState<any>(null);
  const router = useRouter();
  const metaplex = useMemo(() => Metaplex.make(connection), []);
  useEffect(() => {
    if (!mint) return;
    metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mint) })
      .then(async (nft) => {
        const res = await fetch(nft.uri);
        const json = await res.json();
        setMetadata(json);
      })
      .catch((error) => console.error(error));
  }, []);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
    []
  );
  if (!mint) {
    return (
      <MainLayout title="Essential Elements | No Mint">
        <Text color="white">NO MINT</Text>
      </MainLayout>
    );
  }
  return (
    <MainLayout
      title={`Essential Elements | ${metadata?.name}`}
      description={metadata?.description}
      ogImage={metadata?.image}
    >
      <Heading color="white" as="h1" size="xl" textAlign="center">
        A essential element of life has been minted! 🎉
      </Heading>

      <Text color="bodyText" fontSize="xl" textAlign="center">
        Congratulations, you minted a essential element of life.
        <br /> Time to state your element to earn rewards and endure.
      </Text>
      <Image
        src={metadata?.image ?? ""}
        alt=""
        width={200}
        height={200}
        loading="lazy"
      />
      <Button
        bgColor="accent"
        color="white"
        maxWidth="380px"
        onClick={handleClick}
        _hover={{ backgroundColor: "accent" }}
      >
        <HStack>
          <Text>stake my buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
      <Button
        bgColor="transparent"
        color="white"
        maxWidth="380px"
        onClick={() => router.replace("/")}
        _hover={{ backgroundColor: "transparent" }}
      >
        <HStack>
          <ArrowBackIcon />
          <Text>Back</Text>
        </HStack>
      </Button>
    </MainLayout>
  );
};

NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query;
  if (!mint) return { mint: null };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey };
  } catch {
    return { mint: null };
  }
};

export default NewMint;
