// webhook.js

// Import required modules
const express = require('express');
const { safeMintNFT } = require('./blockchain');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    const event = req.body;

    // Log the received event
    console.log('Received event:', event);

    // Take action based on the event type
    switch (event.type) {
        case 'purchase.succeeded':
            // Log specific event handling
            console.log('Minting + Delivering NFT cross-chain');

            try {
                // Attempt to mint the NFT
                const txHash = await safeMintNFT(event.contractAddress, event.walletAddress);
                console.log('Mint successful, transaction hash:', txHash);
            } catch (error) {
                console.error('Mint failed:', error);
            }
            break;

        default:
            // Log unsupported event types
            console.log(`Unsupported event type ${event.type}`);
            return res.status(400).send(`Unsupported event type ${event.type}`);
    }

    // Respond to the webhook request
    res.status(200).send('Payment event successfully handled.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
