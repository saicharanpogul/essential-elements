import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachineV2,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

const Connected: FC = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>();
  const [isMinting, setIsMinting] = useState(false);

  const metaplex = useMemo(
    () => Metaplex.make(connection).use(walletAdapterIdentity(wallet)),
    [connection, wallet]
  );
  useEffect(() => {
    if (!metaplex) return;
    metaplex
      .candyMachinesV2()
      .findByAddress({
        address: new PublicKey("6c3eVkmukPhBLt9FnQC1UbfB5r1e8YdopGLmmA1ZPYBK"),
      })
      .then((_candyMachine) => {
        // console.log(_candyMachine);
        setCandyMachine(_candyMachine);
      });
  }, [metaplex]);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      setIsMinting(true);
      if (event.defaultPrevented) return;
      if (!wallet.connected || !candyMachine) return;
      try {
        const nft = await metaplex.candyMachinesV2().mint({
          candyMachine: candyMachine,
        });
        console.log(nft);
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsMinting(false);
      }
    },
    [metaplex, wallet, candyMachine]
  );
  return (
    <>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Being.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each element is randomly generated and can be staked to receive
            <Text as="b"> $ELT</Text> Use your <Text as="b"> $ELT</Text> to
            upgrade your element and receive perks within the community!
          </Text>
        </VStack>
      </Container>
      <SimpleGrid gap={6} columns={{ sm: 2, md: 3, lg: 5 }}>
        <Box w="100%" bg="blue.500">
          <Image src="hydrogen.png" width={150} alt="" />
        </Box>
        <Box w="100%" bg="blue.500">
          <Image src="carbon.png" width={150} alt="" />
        </Box>
        <Box w="100%" bg="blue.500">
          <Image src="nitrogen.png" width={150} alt="" />
        </Box>
        <Box w="100%" bg="blue.500">
          <Image src="oxygen.png" width={150} alt="" />
        </Box>
        <Box w="100%" bg="blue.500">
          <Image src="gold.png" width={150} alt="" />
        </Box>
      </SimpleGrid>

      {/* <HStack spacing={10}>
      </HStack> */}

      <Button
        marginTop={40}
        bgColor="accent"
        color="white"
        maxW="380px"
        _hover={{ backgroundColor: "accent" }}
        onClick={handleClick}
        loadingText="Minting..."
        isLoading={isMinting}
      >
        <HStack>
          <Text>Mint being</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </>
  );
};

export default Connected;
