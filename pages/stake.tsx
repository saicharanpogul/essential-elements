import { ArrowBackIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import StakingState from "../components/StakingState";
import { getStakeAccount } from "../utils/accounts";
import { createStakingInstruction } from "../utils/instructions";
import styles from "../styles/Home.module.css";

interface StakeProps {
  mint: PublicKey;
  imageSrc: string;
}

const Stake: NextPage<StakeProps> = ({ imageSrc }) => {
  const router = useRouter();
  const { mint: mintPubkey } = router.query;
  const [mint, setMint] = useState<PublicKey>();
  const [isStaked, setIsStaked] = useState(false);
  const [level, setLevel] = useState(1);
  const [nftData, setNftData] = useState<any>();
  const [refresh, setRefresh] = useState(false);
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");
  const { connection } = useConnection();
  const walletAdapter = useWallet();

  useEffect(() => {
    setMint(new PublicKey(mintPubkey!.toString()));
  }, [mintPubkey, router.query]);

  const getNftData = async () => {
    if (!mint) {
      return;
    }
    const mx = Metaplex.make(connection).use(
      walletAdapterIdentity(walletAdapter)
    );
    try {
      mx.nfts()
        .findByMint({ mintAddress: mint as PublicKey })
        .then((nft) => {
          console.log("nft data on stake page:", nft);
          setNftData(nft);
        });
    } catch (error) {
      console.log("error getting nft:", error);
    }
  };

  useEffect(() => {
    getNftData();
  }, [connection, mint, walletAdapter]);

  const setStaking = (bool: boolean) => {
    setIsStaked(bool);
  };

  return (
    <MainLayout title={`Essential Elements`} ogImage={imageSrc}>
      <Box padding={10}>
        <Heading color="white">Level up your element</Heading>
        <Text
          color="bodyText"
          fontSize="xl"
          textAlign="left"
          width={isLessThan768 ? "100%" : "60%"}
          marginTop={5}
        >
          Stake your element to earn 10 $ELT per day to get access to a
          randomized loot box full of upgrades for your element.
        </Text>
        <Flex
          flexDirection={isLessThan768 ? "column" : "row"}
          alignItems={isLessThan768 ? "center" : "initial"}
        >
          <Box marginTop={10}>
            <Flex
              width={200}
              height={240}
              backgroundColor="accent"
              borderRadius={8}
              flexDirection="column"
              justifyContent="space-between"
              alignItems={"center"}
              marginBottom={4}
            >
              <img
                src={imageSrc ?? ""}
                alt=""
                width={200}
                height={200}
                loading="lazy"
                style={{ flex: 1 }}
              />
              <Flex flex={1} justifyContent="center" alignItems={"center"}>
                <Text
                  color="white"
                  as="b"
                  fontSize="l"
                  textAlign={"center"}
                  textTransform={"uppercase"}
                >
                  {isStaked ? "Staking" : "Ready to Stake"}
                </Text>
              </Flex>
            </Flex>
            <Flex alignItems={"center"}>
              <Text
                as="b"
                color="white"
                fontSize="3xl"
                textTransform={"uppercase"}
              >
                Level {level}
              </Text>
              <RepeatIcon
                marginLeft={5}
                height={6}
                width={6}
                color="white"
                className={refresh ? styles.rotate : ""}
                onClick={() => {
                  setRefresh(true);
                  setTimeout(() => {
                    getNftData().then(() => {
                      setRefresh(false);
                    });
                  }, 1000);
                }}
              />
            </Flex>
          </Box>
          <Box marginTop={10} marginStart={isLessThan768 ? "" : 20}>
            <StakingState
              isStaked={isStaked}
              daysStaked={3}
              totalEarned={213}
              claimable={20}
              nftData={nftData}
              setStaking={setStaking}
              refresh={refresh}
            />
          </Box>
        </Flex>
      </Box>
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

Stake.getInitialProps = async ({ query }: any) => {
  const { mint, imageSrc } = query;

  if (!mint || !imageSrc) throw { error: "no mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey, imageSrc: imageSrc };
  } catch {
    throw { error: "invalid mint" };
  }
};

export default Stake;
