Sure, here's a revised version of the README:

---

# Super Simple Cross-Chain Webhookifier

## Run:

### Local Environment
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the webhook server:
   ```bash
   node webhook.js
   ```
3. Expose the local server to the internet:
   
   tip: You can use [ngrok](https://ngrok.com/) for locally testing webhooks, enabling it on port 3000 is seen below. 

   ```bash
   ngrok http 3000
   ```

### Crossmint Setup
1. Create or import a new collection using the Crossmint developer console.
2. Set up webhooks in the Crossmint console, using the `<path>/webhook` path. You will need to listen to `purchase.succeeded` 


### Blockchain Configuration
1. Update the `.env` file with your private key and `sha256`.
2. Update the associated <constract:ABI> mappings in `blockchain.js`

## Considerations
1. **Wallet Address**: We mint to the `walletAddress` specified in the webhook. Custodial users might face issues exporting tokens.
2. **Error Handling**: Proper handlers are not set up here. Ensure robust handling and reliability are implemented.
3. **Webhook Downtime**: If the webhook goes down during purchases, manual backfill from Crossmint's end will be necessary.
4. **Escrow**: Escrow should be disabled.

## Additional Information
I have included a Solidity file that can be deployed and used for testing purposes. You can compile/deploy using RemixIDE or Hardhat.

---