import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaDao } from "../target/types/solana_dao";
import { expect } from "chai";
const { SystemProgram } = anchor.web3;


describe("solana-dao", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(anchor.AnchorProvider.local());

  const LAMPORTS_PER_SOL = 1000000000;

  let companyPda;
  let bump;
  let featurePDA;
  let memberPDA;
  let votePDA;

  // Account addresses 
  const doaAdmin = anchor.web3.Keypair.generate();
  // member account
  const memberAddress = anchor.web3.Keypair.generate();

  //company account
  const companyAddress = anchor.web3.Keypair.generate();

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
        memberAddress.publicKey,
        2 * LAMPORTS_PER_SOL
      )
    );

        await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        companyAddress.publicKey,
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

  it("Test Add company function", async () => {
    let seedString: string = "COMPANY_STATE";
    let seed: Buffer = Buffer.from(seedString);


    [companyPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(seed),
        Buffer.from(companyAddress.publicKey.toBytes()),
      ],
      program.programId
    );

    // Attempt to add member3 as member (a member)
    const companyName = "ICP";
    const aboutCompany = "We specialise in createing solution";
    try {
      await program.methods
        .addCompany(
          companyName,
          aboutCompany
        )
        .accounts({
          authority: companyAddress.publicKey,
          companyList: companyPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([companyAddress])
        .rpc();
      let companyState = await program.account.companyList.fetch(companyPda);
      expect(companyState.companyName).to.equal("ICP");
      expect(companyState.idx).to.equal(1);
      expect(companyState.lastFeat).to.equal(0);
      expect(companyState.featCount).to.equal(0);
    } catch (err) {
      console.log(err);
    }
  });

  it("Test add feature function", async () => {
        let seedString: string = "FEATURE_STATE";
    let seed: Buffer = Buffer.from(seedString);
    [featurePDA, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(seed),
        Buffer.from(companyAddress.publicKey.toBytes()),
      ],
      program.programId
    )

    const content = "Add easy docummentation features to the ICP website"; 
    const companyIdx = 1;
    const currentTimeInMs = Date.now();
    const votePeriod: number = currentTimeInMs + (1000 * 60 * 60 * 24 * 30); // plus 30 days, 1 months
    //const adjustedDateObj = new Date(adjustedTimeAsMs);
    try {
      await program.methods
        .addFeatures(
          content,
          companyIdx,
          new anchor.BN(votePeriod)
        )
        .accounts({
          authority: companyAddress.publicKey,
          companyList: companyPda,
          featureList: featurePDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([companyAddress])
        .rpc();
      let companyState = await program.account.companyList.fetch(companyPda);
      let featureListState = await program.account.featureList.fetch(featurePDA);
      expect(featureListState.content).to.equal(content);
      expect(featureListState.companyIdx).to.equal(companyState.idx);
      expect(featureListState.idx).to.equal(companyState.lastFeat - 1);
        
      } catch (error) {
      console.log(error);
      }
  })
  it("Test Add new member function", async () => {
    let seedString: string = "MEMBER_STATE";
    let seed: Buffer = Buffer.from(seedString);

    [memberPDA, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(seed),
        Buffer.from(memberAddress.publicKey.toBytes()),
      ],
      program.programId
    )
    let companyState = await program.account.companyList.fetch(companyPda);

    try {
      await program.methods
        .addMember(
          companyState.idx
        )
        .accounts({
          authority: memberAddress.publicKey,
          memberList: memberPDA,
          systemProgram: SystemProgram.programId
        })
        .signers([memberAddress])
        .rpc()
    } catch (error) {
      console.log(error)
    }

    let memberListState = await program.account.memberList.fetch(memberPDA);
    expect(memberListState.companyIdx).to.equal(companyState.idx);
    expect(memberListState.joined).to.equal(true);
  });

  it("Cast a vote as a member of a company", async () => {
        let seedString: string = "VOTE_STATE";
    let seed: Buffer = Buffer.from(seedString);

    [votePDA, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(seed),
        Buffer.from(memberAddress.publicKey.toBytes()),
      ],
      program.programId
    );

    let companyState = await program.account.companyList.fetch(companyPda);
    let featureListState = await program.account.featureList.fetch(featurePDA);

      try {
        await program.methods
          .addVoting(
            featureListState.idx,
            companyState.idx,
            1
          )
          .accounts({
            authority: memberAddress.publicKey,
            votingList: votePDA,
            systemProgram: SystemProgram.programId
          })
          .signers([memberAddress])
          .rpc();
        let votingListState = await program.account.voteList.fetch(votePDA);
        expect(votingListState.voteCheck).to.equal(true);

      } catch (error) {
        console.log(error)
      }
  });
});
