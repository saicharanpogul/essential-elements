import { FC } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Connected: FC = () => {
  return (
    <VStack spacing={[20, 10]} bg="background">
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
      >
        <HStack>
          <Text>Mint being</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  );
};

export default Connected;
