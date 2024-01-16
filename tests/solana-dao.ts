import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaDao } from "../target/types/solana_dao";
const { SystemProgram } = anchor.web3;


describe("solana-dao", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(anchor.AnchorProvider.local());

  const LAMPORTS_PER_SOL = 1000000000;

  // Account addresses 
  const doaAdmin = anchor.web3.Keypair.generate();
  // company/user acccount
  const userAccount = anchor.web3.Keypair.generate();

  const program = anchor.workspace.SolanaDao as Program<SolanaDao>;

  //Top up all accounts that will need lamports
  before(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        doaAdmin.publicKey,
        2 * LAMPORTS_PER_SOL
      )
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        userAccount.publicKey,
        2 * LAMPORTS_PER_SOL
      )
    );

  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        authority: doaAdmin.publicKey,
        userProfile: userAccount.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([doaAdmin, userAccount])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
