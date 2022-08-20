import { useState } from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction as SolanaTx,
} from "@solana/web3.js";
import "./App.css";
import { NightlyWalletAdapter } from "@nightlylabs/solana-adapter";
import { sign } from "tweetnacl";
import bs58 from "bs58";

const NightlySolana = new NightlyWalletAdapter();
const connection = new Connection("https://api.devnet.solana.com");
function App() {
  const [pk, setPk] = useState<PublicKey | null>(null);
  return (
    <div className="App">
      <header className="App-header">
        <Typography>
          {pk ? `Hello, ${pk.toString()}` : "Hello, stranger"}
        </Typography>
        <Button
          variant="contained"
          style={{ margin: 10 }}
          onClick={async () => {
            await NightlySolana.connect().then(() => {
              setPk(NightlySolana.publicKey);
            });
          }}
        >
          Connect Solana
        </Button>{" "}
        <Button
          variant="contained"
          style={{ margin: 10 }}
          onClick={async () => {
            if (!pk) return;

            const ix = SystemProgram.transfer({
              fromPubkey: pk,
              lamports: 1_000_000,
              toPubkey: new PublicKey(
                "147oKbjwGDHEthw7sRKNrzYiRiGqYksk1ravTMFkpAnv"
              ),
            });
            const tx = new SolanaTx().add(ix).add(ix).add(ix).add(ix).add(ix);
            const a = await connection.getRecentBlockhash();
            tx.recentBlockhash = a.blockhash;
            tx.feePayer = pk;
            const signedTx = await NightlySolana.signTransaction(tx);
            const id = await connection.sendRawTransaction(
              signedTx.serialize()
            );
            console.log(id);
          }}
        >
          Send test 0.0001 SOL
        </Button>
        <Button
          variant="contained"
          style={{ margin: 10 }}
          onClick={async () => {
            if (!pk) return;

            const ix = SystemProgram.transfer({
              fromPubkey: pk,
              lamports: 1_000_000,
              toPubkey: new PublicKey(
                "147oKbjwGDHEthw7sRKNrzYiRiGqYksk1ravTMFkpAnv"
              ),
            });
            const tx = new SolanaTx().add(ix).add(ix);
            const tx2 = new SolanaTx().add(ix).add(ix).add(ix).add(ix);
            const a = await connection.getRecentBlockhash();
            tx.recentBlockhash = a.blockhash;
            tx.feePayer = pk;
            tx2.recentBlockhash = a.blockhash;
            tx2.feePayer = pk;
            const signedTxs = await NightlySolana.signAllTransactions([
              tx,
              tx2,
            ]);
            for (const signedTx of signedTxs) {
              const id = await connection.sendRawTransaction(
                signedTx.serialize()
              );

              console.log(id);
            }
          }}
        >
          Sign all and send 0.0001 SOL
        </Button>
        <Button
          variant="contained"
          style={{ margin: 10 }}
          onClick={async () => {
            try {
              if (!pk) {
                return;
              }

              const message = new TextEncoder().encode("I like turtles");
              const signature = await NightlySolana.signMessage(message);

              console.log(signature, new TextDecoder().decode(signature))
              // Verify that the bytes were signed using the private key that matches the known public key
              if (!sign.detached.verify(message, signature, pk.toBytes()))
                throw new Error("Invalid signature!");

              alert(`Message signature: ${bs58.encode(signature)}`);
            } catch (error: any) {
              alert(`Signing failed: ${error?.message}`);
            }
          }}
        >
          Sign message
        </Button>
        <Button
          variant="contained"
          style={{ margin: 10 }}
          onClick={async () => {
            await NightlySolana.disconnect();
            setPk(null);
          }}
        >
          Disconnect Solana
        </Button>
      </header>
    </div>
  );
}

export default App;
