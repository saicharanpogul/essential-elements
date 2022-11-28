import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import * as borsh from "@project-serum/borsh";

const userStakeAccountLayout = borsh.struct([
  borsh.bool("isInitialized"),
  borsh.publicKey("tokenAccount"),
  borsh.i64("stakeStartTime"),
  borsh.i64("lastStakeRedeem"),
  borsh.publicKey("userPubkey"),
  borsh.u8("stakeState"),
]);

export const getStakeAccount = async (
  connection: Connection,
  user: PublicKey,
  tokenAccount: PublicKey
): Promise<any> => {
  try {
    const [accountPubkey] = PublicKey.findProgramAddressSync(
      [user.toBuffer(), tokenAccount.toBuffer()],
      PROGRAM_ID
    );
    const account = await connection.getAccountInfo(accountPubkey);
    if (!account) throw new Error("No account found");
    return userStakeAccountLayout.decode(account.data);
  } catch (error) {
    throw error;
  }
};
