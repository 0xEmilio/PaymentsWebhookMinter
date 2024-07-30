// blockchain.js

/*
    This script is triggered when a webhook indicates a successful payment,
    auto-minting an NFT on the target chain. Amoy for this demo.
*/

// Import required modules
const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

// Polygon Amoy RPC setup
const web3 = new Web3('https://rpc.ankr.com/polygon_amoy');

/** Contract and Metadata setup */
// Dictionary mapping contract addresses to their ABIs
const contractDictionary = {
    "0xb460aB1e26D7aEe449873edDbf7ef590d8865c70": {
        targetContractAddress: "0xAA03C7a9eac2A2CAee8749906a61628505040545",
        targetMintFnABI: [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "uri",
                        "type": "string"
                    }
                ],
                "name": "safeMint",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    }
};

// Static URI for all mints
const nftURI = "https://ipfs.io/ipfs/QmexVXAmUYVPv6uiRjWgA751uvoLzTBEfYS8uMWZHxoBLW";

/**
 * Function to resolve the contract address to the actual address and ABI
 * @param {string} inputAddress - The input contract address
 * @returns {Object} - The contract information
 */
const resolveContractAddress = (inputAddress) => {
    const contractInfo = contractDictionary[inputAddress];
    if (!contractInfo) {
        throw new Error('Provided contract address not found in dictionary');
    }
    return contractInfo;
};

/**
 * Function to mint an NFT
 * @param {string} contractAddress - The address of the contract
 * @param {string} receiverWallet - The wallet address of the receiver
 * @returns {Promise<string>} - The transaction hash of the minting transaction
 */
const safeMintNFT = async (contractAddress, receiverWallet) => {
    const { targetContractAddress, targetMintFnABI } = resolveContractAddress(contractAddress);

    const contract = new web3.eth.Contract(targetMintFnABI, targetContractAddress);

    try {
        // Set up the sender account
        const senderAccount = web3.eth.accounts.privateKeyToAccount(process.env.DEV_WALLET_KEY);
        web3.eth.accounts.wallet.add(senderAccount);
        web3.eth.defaultAccount = senderAccount.address;

        // Get the transaction count for the sender account
        const nonce = await web3.eth.getTransactionCount(senderAccount.address);

        // Prepare the transaction data
        const txData = contract.methods.safeMint(receiverWallet, nftURI).encodeABI();

        // Estimate gas limit and gas price
        const gasLimit = Math.ceil(await web3.eth.estimateGas({
            from: senderAccount.address,
            to: targetContractAddress,
            data: txData
        }) * 1.1);
        
        const gasPrice = Math.ceil((await web3.eth.getGasPrice()) * 1.1);

        // Create the transaction object
        const txObject = {
            from: senderAccount.address,
            to: targetContractAddress,
            data: txData,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce
        };

        console.log("Transaction Object:", txObject);

        // Sign and send the transaction
        const signedTx = await senderAccount.signTransaction(txObject);
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        return txReceipt.transactionHash;
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
};

module.exports = { safeMintNFT };
