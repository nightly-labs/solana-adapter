import { useState } from 'react'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { Connection, PublicKey, SystemProgram, Transaction as SolanaTx } from '@solana/web3.js'
import './App.css'
import { NightlyWalletAdapter } from '@nightlylabs/solana-adapter'

const NightlySolana = new NightlyWalletAdapter()
const connection = new Connection('https://api.devnet.solana.com')
function App() {
  const [pk, setPk] = useState<PublicKey | null>(null)
  return (
    <div className='App'>
      <header className='App-header'>
        <Typography>
          {pk ? `Hello, ${pk.toString()}` : 'Hello, stranger'}
        </Typography>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            await NightlySolana.connect(() => {
              console.log('Trigger disconnect Solana')
              setPk(null)
            }).then(() => {
              setPk(NightlySolana.publicKey)
            })
          }}
        >
          Connect Solana
        </Button>{' '}
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!pk) return

            const ix = SystemProgram.transfer({
              fromPubkey: pk,
              lamports: 1_000_000,
              toPubkey: new PublicKey('147oKbjwGDHEthw7sRKNrzYiRiGqYksk1ravTMFkpAnv'),
            })
            const tx = new SolanaTx().add(ix).add(ix).add(ix).add(ix).add(ix)
            const a = await connection.getRecentBlockhash()
            tx.recentBlockhash = a.blockhash
            tx.feePayer = pk
            const signedTx = await NightlySolana.signTransaction(tx)
            const id = await connection.sendRawTransaction(signedTx.serialize())
            console.log(id)
          }}
        >
          Send test 0.0001 SOL
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!pk) return

            const ix = SystemProgram.transfer({
              fromPubkey: pk,
              lamports: 1_000_000,
              toPubkey: new PublicKey('147oKbjwGDHEthw7sRKNrzYiRiGqYksk1ravTMFkpAnv'),
            })
            const tx = new SolanaTx().add(ix).add(ix)
            const tx2 = new SolanaTx().add(ix).add(ix).add(ix).add(ix)
            const a = await connection.getRecentBlockhash()
            tx.recentBlockhash = a.blockhash
            tx.feePayer = pk
            tx2.recentBlockhash = a.blockhash
            tx2.feePayer = pk
            const signedTxs = await NightlySolana.signAllTransactions([tx, tx2])
            for (const signedTx of signedTxs) {
              const id = await connection.sendRawTransaction(signedTx.serialize())

              console.log(id)
            }
          }}
        >
          Sign all and send 0.0001 SOL
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            await NightlySolana.disconnect()
          }}
        >
          Disconnect Solana
        </Button>
      </header>
    </div>
  )
}

export default App