import { web3 } from "@project-serum/anchor";
import * as anchor from "@coral-xyz/anchor";


export const initialize = (program, authority, userProfile, systemProgram, connection) => {
  if (program) {
    (async () => {
      try {

        const tx = await program.methods
          .initialize()
          .accounts({
            authority: authority,
            userProfile: userProfile,
            systemProgram: systemProgram
          })
          .signers([authority, userProfile])
          .rpc();
        console.log(tx)
      } catch (error) { console.log(error) }
    })();
  }
};

//companyList == companyPDA
//featureList == proposalPDA

export const addFeatures = (program, authority, companyList, featureList, systemProgram, title, content, votePeriod ) => {
  if (program) {
    (async () => {
      try {
        const tx = await program.methods
          .addFeatures(
            title,
            companyList,
            votePeriod,
            content
          )
          .accounts({
            authority,
            companyList,
            featureList,
            systemProgram,
          })
          .rpc();
      } catch (error) { console.log(error) }
    })();
  }
};

export const addVoting = (program, authority, votingList, companyList, featureList, systemProgram, memberList, featureIdx, vote) => {
  if (program) {
    (async () => {
      try {
        const tx = await program.methods
          .addVoting( featureIdx, companyList, featureList, vote)
          .accounts({
            authority,
            votingList,
            companyList,
            featureList,
            memberList,
            systemProgram,
          })
          .rpc();
      } catch (error) { console.log(error) }
    })();
  }
};

export const addCompany = (program, authority, systemProgram, companyList, companyName, companyImageUrl, about, contractAddress, symbol, websites, terms, network, decimals, quorum, category
) => {
  if (program) {
    (async () => {
      try {
        const tx = await program.methods
          .addCompany(companyName, companyImageUrl, about, contractAddress, symbol, websites, terms, network, decimals, quorum, category)
          .accounts({
            authority,
            companyList,
            systemProgram,
          })
          .rpc();
        return tx;
      } catch (error) { console.log(error) }
    })();
  }
};

export const addMember = (program, companyList, authority, memberList, systemProgram,) => {
  if (program) {
    (async () => {
      try {
        const tx = await program.methods
          .addMember( companyList)
          .accounts({
            authority,
            memberList,
            companyList,
            systemProgram,
          })
          .rpc();
        return tx;
      } catch (error) { console.log(error) }
    })();
  }
};

export const getAllCompany = (program) => {
  if (program) {
    (async () => {
      try {
        const tx = await program.account.companyList.all();
        return tx;
      } catch (error) {
        
      }
    })
  }
}

export const getAllProposal = (program) => {
  if (program) {
    (async () => {
      try {
        const tx = await program.account.featureList.all();
        return tx;
      } catch (error) {
        
      }
    })
  }
}

export const createPDA = (program, seed, wallet) => {
  if (program) {
    (async () => {
      try {
        const [dataPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from(seed), Buffer.from(wallet.publicKey.toBytes())],
              program.programId
          );
          return dataPda
      } catch (error) {
        console.log(error)
      }
    })
  }
}


