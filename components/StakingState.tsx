import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import React, { useCallback, useEffect, useState } from "react";
import { getStakeAccount } from "../utils/accounts";
import { PROGRAM_ID, STAKE_MINT } from "../utils/constants";
import {
  createInitializeStakeAccountInstruction,
  createRedeemInstruction,
  createStakingInstruction,
  createUnstakeInstruction,
} from "../utils/instructions";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

interface StakingStateProps {
  isStaked: boolean;
  daysStaked: number;
  totalEarned: number;
  claimable: number;
  nftData: any;
  refresh: boolean;
  setStaking: (bool: boolean) => void;
}

const StakingState: React.FC<StakingStateProps> = ({
  isStaked,
  nftData,
  setStaking,
  refresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [unstakingLoading, setUnstakingLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(isStaked);
  const [daysStaked, setDaysStaked] = useState(0);
  const [claimable, setClaimable] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [nftTokenAccount, setNftTokenAccount] = useState<PublicKey>();
  const walletAdapter = useWallet();
  const { connection } = useConnection();

  const checkStakingStatus = useCallback(async () => {
    if (!walletAdapter.publicKey || !nftTokenAccount) {
      console.log(
        "Not checking status...",
        walletAdapter.publicKey,
        nftTokenAccount
      );
      return;
    }
    try {
      console.log("Checking status...");
      const account = await getStakeAccount(
        connection,
        walletAdapter.publicKey,
        nftTokenAccount
      );
      const days = Math.floor(
        (new Date().getTime() -
          new Date(account.lastStakeRedeem.toNumber() * 1000).getTime()) /
          86400000
      );
      setDaysStaked(days);
      setTotalEarned(
        (((new Date().getTime() -
          new Date(account.stakeStartTime.toNumber() * 1000).getTime()) *
          100) /
          LAMPORTS_PER_SOL) *
          10000
      );
      setClaimable(
        (((new Date().getTime() -
          new Date(account.lastStakeRedeem.toNumber() * 1000).getTime()) *
          100) /
          LAMPORTS_PER_SOL) *
          10000
      );
      console.log("days:", days);
      console.log("stake account:", account);
      console.log("stakeState:", account.stakeState);
      console.log(
        "lastStakeRedeem:",
        new Date(account.lastStakeRedeem.toNumber() * 1000)
      );
      console.log(
        "stakeStartTime:",
        new Date(account.stakeStartTime.toNumber() * 1000)
      );
      console.log("tokenAccount:", account.tokenAccount?.toBase58());
      console.log("userPubkey:", account.userPubkey?.toBase58());
      console.log("isInitialized:", account.isInitialized);
      setIsStaking(account.stakeState === 0);
      setStaking(account.stakeState === 0);
    } catch (error) {
      console.log("error:", error);
    }
  }, [connection, nftTokenAccount, walletAdapter]);

  useEffect(() => {
    checkStakingStatus();
    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address));
    }
  }, [walletAdapter, connection, nftData]);

  useEffect(() => {}, [nftTokenAccount]);

  const sendAndConfirmTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        const signature = await walletAdapter.sendTransaction(
          transaction,
          connection
        );
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction(
          {
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature,
          },
          "finalized"
        );
        await checkStakingStatus();
      } catch (error) {
        console.log(error);
      }
    },
    [walletAdapter, connection]
  );

  const handleStake = useCallback(async () => {
    try {
      setLoading(true);
      if (
        !walletAdapter.connected ||
        !walletAdapter.publicKey ||
        !nftTokenAccount
      ) {
        alert("Please connect your wallet");
        return;
      }

      const [stakeAccount] = PublicKey.findProgramAddressSync(
        [walletAdapter.publicKey.toBuffer(), nftTokenAccount.toBuffer()],
        PROGRAM_ID
      );

      const tx = new Transaction();
      const account = await connection.getAccountInfo(stakeAccount);
      if (!account) {
        tx.add(
          createInitializeStakeAccountInstruction(
            walletAdapter.publicKey,
            nftTokenAccount,
            PROGRAM_ID
          )
        );
      }

      const stakeInstruction = createStakingInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        PROGRAM_ID,
        nftData.mint.address,
        nftData.edition.address,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID
      );

      tx.add(stakeInstruction);
      await sendAndConfirmTransaction(tx);
    } catch (error) {
      console.log("staking error:", error);
    } finally {
      setLoading(false);
    }
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  const handleClaim = useCallback(async () => {
    try {
      setLoading(true);
      if (
        !walletAdapter.connected ||
        !walletAdapter.publicKey ||
        !nftTokenAccount
      ) {
        alert("Please connect your wallet");
        return;
      }

      const userStakeATA = await getAssociatedTokenAddress(
        STAKE_MINT,
        walletAdapter.publicKey
      );
      const account = await connection.getAccountInfo(userStakeATA);
      const tx = new Transaction();

      if (!account) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            walletAdapter.publicKey,
            userStakeATA,
            walletAdapter.publicKey,
            STAKE_MINT
          )
        );
      }

      tx.add(
        createRedeemInstruction(
          walletAdapter.publicKey,
          nftTokenAccount,
          PROGRAM_ID,
          STAKE_MINT,
          userStakeATA,
          TOKEN_PROGRAM_ID
        )
      );

      await sendAndConfirmTransaction(tx);
    } catch (error) {
      console.log("claim error:", error);
    } finally {
      setLoading(false);
    }
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  const handleUnstake = useCallback(async () => {
    try {
      setUnstakingLoading(true);
      if (
        !walletAdapter.connected ||
        !walletAdapter.publicKey ||
        !nftTokenAccount
      ) {
        alert("Please connect your wallet");
        return;
      }

      const userStakeATA = await getAssociatedTokenAddress(
        STAKE_MINT,
        walletAdapter.publicKey
      );
      const account = await connection.getAccountInfo(userStakeATA);
      const tx = new Transaction();
      if (!account) {
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        );
      }
      tx.add(
        createUnstakeInstruction(
          walletAdapter.publicKey,
          nftTokenAccount,
          PROGRAM_ID,
          nftData.address,
          nftData.edition.address,
          STAKE_MINT,
          userStakeATA,
          TOKEN_PROGRAM_ID,
          METADATA_PROGRAM_ID
        )
      );
      await sendAndConfirmTransaction(tx);
    } catch (error) {
      console.log("unstake error:", error);
    } finally {
      setUnstakingLoading(false);
    }
  }, [walletAdapter, connection, nftData, nftTokenAccount]);
  return (
    <Box
      backgroundColor={"backgroundLight"}
      // height={200}
      width={240}
      borderRadius={8}
      padding={4}
    >
      <Flex
        justifyContent={"center"}
        alignItems="center"
        flexDirection="column"
      >
        <Text
          color="bodyText"
          as="b"
          textTransform={"uppercase"}
          fontSize="sm"
          backgroundColor={"backgroundAlt"}
          padding={1}
          paddingX={2}
          borderRadius={12}
        >
          {isStaking ? `Staking ${daysStaked} Days` : "Ready to stake"}
        </Text>
        <Heading color="white" marginTop={5} textAlign="center">
          {isStaking ? `${totalEarned.toFixed(2)} $ELT` : "0 $ELT"}
        </Heading>
        <Text color="bodyText" as="b" fontSize="sm">
          {isStaking
            ? `${claimable.toFixed(4)} $ELT claimable`
            : "earn $ELT by staking"}
        </Text>
        <Button
          marginTop={2}
          onClick={isStaking ? handleClaim : handleStake}
          isLoading={loading}
          loadingText={"Loading.."}
          width={120}
        >
          {isStaking ? "Claim $ELT" : "Stake Element"}
        </Button>
        {isStaking ? (
          <Button
            marginTop={2}
            onClick={handleUnstake}
            isLoading={unstakingLoading}
            loadingText={"Loading..."}
            width={120}
          >
            Unstake
          </Button>
        ) : null}
      </Flex>
    </Box>
  );
};

export default StakingState;
