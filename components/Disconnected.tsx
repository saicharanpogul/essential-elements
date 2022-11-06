import React, { FC, MouseEventHandler, useCallback } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const Disconnected: FC = () => {
  const modalState = useWalletModal();
  const { wallet, connect } = useWallet();
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (event.defaultPrevented) {
        return;
      }

      if (!wallet) {
        modalState.setVisible(true);
      } else {
        connect().catch(() => {});
      }
    },
    [wallet, connect, modalState]
  );
  return (
    <Container marginTop={"15%"}>
      <Spacer />
      <VStack spacing={20}>
        <Heading
          color="white"
          as="h1"
          size={["sm", "xl"]}
          noOfLines={2}
          textAlign="center"
        >
          Mint your Essential Element. <br />
          Earn $ELT & endure.
        </Heading>
        <Button
          bgColor="accent"
          color="white"
          _hover={{ backgroundColor: "accent" }}
          maxW="380px"
          onClick={handleClick}
        >
          <HStack>
            <Text>Become a being</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </Container>
  );
};

export default Disconnected;
