import React, { useContext } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { initialize } from '../utils/callInstructions';
import * as anchor from "@coral-xyz/anchor";
import { LayoutContext } from "./Layout";




const Header = () => {
    let { wallet, connection, program } = useContext(LayoutContext);
    const { SystemProgram } = anchor.web3;
      const userAccount = anchor.web3.Keypair.generate();
    

    return (
        <nav className="flex justify-end items-center px-16 py-4 bg-black">
            <button
                style={{
                    color: "white",
                    margin: "2em",
                    backgroundColor: "#4e44ce",
                    padding: "0.6em",
                    borderRadius: "0.5em"
                }}
                onClick={() => initialize(program, wallet.publicKey, userAccount.publicKey, SystemProgram.programId)}>
                Initiatlize
            </button>
          <WalletMultiButton />
        </nav>
    )
}

export default Header;