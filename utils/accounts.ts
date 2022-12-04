import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import * as borsh from "@project-serum/borsh";
import { Program } from "@project-serum/anchor";
import { AnchorNftStaking } from "./anchor_nft_staking";

const userStakeAccountLayout = borsh.struct([
  borsh.bool("isInitialized"),
  borsh.publicKey("tokenAccount"),
  borsh.i64("stakeStartTime"),
  borsh.i64("lastStakeRedeem"),
  borsh.publicKey("userPubkey"),
  borsh.u8("stakeState"),
]);

export const getStakeAccount = async (
  // connection: Connection,
  user: PublicKey,
  tokenAccount: PublicKey,
  program: Program<AnchorNftStaking>
): Promise<any> => {
  try {
    const [accountPubkey] = PublicKey.findProgramAddressSync(
      [user.toBuffer(), tokenAccount.toBuffer()],
      program.programId
    );
    // const account = await connection.getAccountInfo(accountPubkey);
    // if (!account) throw new Error("No account found");
    // return userStakeAccountLayout.decode(account.data);
    const account = await program.account.userStakeInfo.fetch(accountPubkey);
    return account;
  } catch (error) {
    throw error;
  }
};
