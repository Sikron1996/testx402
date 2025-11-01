import { config } from "dotenv";
import express from "express";
import { paymentMiddleware, Resource } from "x402-express";
config();

const facilitatorUrl = process.env.FACILITATOR_URL as Resource;
const payTo = process.env.ADDRESS as `0x${string}`;

if (!facilitatorUrl || !payTo) {
  process.exit(1);
}


const NFT_CONFIG = {
  PRICE_PER_NFT: "5", 
  NETWORK: "base",
  USDC_ADDRESS: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
  NFT_CONTRACT_ADDRESS: "0xYourERC1155ContractAddress" as `0x${string}`,
};

const app = express();
app.use(express.json()); 

app.use(
  paymentMiddleware(
    payTo,
    {

      "POST /nft/purchase": {
        price: NFT_CONFIG.PRICE_PER_NFT,
        network: NFT_CONFIG.NETWORK,
      },
      
      "POST /nft/batch-purchase": {
        price: (req: any) => {
          const quantity = parseInt(req.body?.quantity || "1");
          const totalPriceUSD = parseInt(NFT_CONFIG.PRICE_PER_NFT) * quantity;
     
          const totalPriceUSDC = (totalPriceUSD * 1000000).toString();
          
          return {
            amount: totalPriceUSDC,
            asset: {
              address: NFT_CONFIG.USDC_ADDRESS,
              decimals: 6,
              eip712: {
                name: "USDC",
                version: "1",
              },
            },
          };
        },
        network: NFT_CONFIG.NETWORK,
      },
      
 
      "GET /premium/content": {
        price: NFT_CONFIG.PRICE_PER_NFT,
        network: NFT_CONFIG.NETWORK,
      },
      
     
      "GET /nft/utilities/*": {
        price: NFT_CONFIG.PRICE_PER_NFT,
        network: NFT_CONFIG.NETWORK,
      },
    },
    {
      url: facilitatorUrl,
    },
  ),
);


app.post("/nft/purchase", (req, res) => {
  res.send({
    success: true,
    transaction: {
      nftPrice: NFT_CONFIG.PRICE_PER_NFT,
      currency: "USDC",
      recipientAddress: payTo,
      transactionHash: "0xxxxxx",
      nftId: generateNFTId(),
      nftContract: NFT_CONFIG.NFT_CONTRACT_ADDRESS,
      tokenStandard: "ERC-1155",
      timestamp: new Date().toISOString(),
    },
  });
});

// Batch NFT purchase endpoint
app.post("/nft/batch-purchase", (req, res) => {
  const quantity = parseInt(req.body?.quantity) || 1;
  
  // Validate quantity
  if (quantity < 1 ) {
    return res.status(400).json({
      success: false,
      error: `Invalid quantity. Must be 1`
    });
  }
  
  const totalPrice = (parseInt(NFT_CONFIG.PRICE_PER_NFT) * quantity).toString();
  
  res.json({
    success: true,
    transaction: {
      nftQuantity: quantity,
      totalPrice: totalPrice,
      currency: "USDC",
      recipientAddress: payTo,
      transactionHash: "0xxxxxx",
      nftContract: NFT_CONFIG.NFT_CONTRACT_ADDRESS,
      tokenStandard: "ERC-1155",
      nftIds: generateBatchNFTIds(quantity),
      timestamp: new Date().toISOString(),
    },
  });
});


app.get("/payment/verify/:txHash", (req, res) => {
  const { txHash } = req.params;
  
  res.send({
    paymentStatus: "confirmed",
    transaction: {
      hash: txHash,
      status: "success",
      blockConfirmations: 15,
      amount: NFT_CONFIG.PRICE_PER_NFT,
      currency: "USDC",
      fromAddress: "0xxxxxx",
      toAddress: payTo,
    },
    nftEligibility: true,
  });
});


app.get("/nft/metadata/:tokenId", (req, res) => {
  const { tokenId } = req.params;
  
  res.send({
    tokenId: tokenId,
    name: `X402 CITIZENS NFT #${tokenId}`,
    description: "An exclusive X402 CITIZENS NFT granting access to premium utilities and content",
    image: "https://x402-citizens.com/nfts/image.jpg",
    attributes: [
      {
        trait_type: "Tier",
        value: "Citizen"
      },
      {
        trait_type: "Utility Access",
        value: "Premium"
      },
      {
        trait_type: "Token Standard",
        value: "ERC-1155"
      }
    ],
    external_url: "https://x402-citizens.com",
  });
});


app.get("/premium/content", (req, res) => {
  res.send({
    content: "Exclusive content for X402 CITIZENS NFT holders",
    accessGranted: true,
    features: [
      "Premium utilities",
      "Exclusive community access",
      "Special rewards",
      "Governance rights"
    ],
    paymentDetails: {
      amount: NFT_CONFIG.PRICE_PER_NFT,
      currency: "USDC",
      transactionId: "0xxxxxx",
    },
  });
});


app.get("/nft/utilities/:utilityId", (req, res) => {
  const { utilityId } = req.params;
  
  res.send({
    utilityId: utilityId,
    name: "Premium Utility Access",
    description: "Access to exclusive X402 CITIZENS utilities",
    benefits: [
      "Staking rewards",
      "Governance voting",
      "Fee discounts",
      "Early access to new features"
    ],
    accessLevel: "premium",
  });
});


app.get("/wallet/:address/balance", (req, res) => {
  const { address } = req.params;
  
  res.send({
    address: address,
    balances: {
      USDC: "150.25",// example USDC balance
      ETH: "2.5", // example ETH balance
    },
    nftCount: 3,
    eligibleForPurchase: true,
  });
});


app.get("/transactions/:address", (req, res) => {
  const { address } = req.params;
  
  res.send({
    address: address,
    transactions: [
      {
        hash: "0xxxxxx",
        type: "NFT_PURCHASE",
        amount: NFT_CONFIG.PRICE_PER_NFT,
        currency: "USDC",
        timestamp: new Date().toISOString(),
        status: "confirmed"
      },
      {
        hash: "0xxxxxy",
        type: "NFT_BATCH_PURCHASE",
        amount: "15", 
        currency: "USDC", 
        timestamp: new Date().toISOString(),
        status: "confirmed"
      }
    ],
    totalSpent: "20",
    nftsOwned: 4,
  });
});


function generateNFTId(): string {
  return `X402CITIZEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}


function generateBatchNFTIds(quantity: number): string[] {
  const baseId = Date.now();
  return Array.from({ length: quantity }, (_, index) => 
    `X402CITIZEN-${baseId}-${index}`
  );
}

app.listen(5020, () => {
  console.log(`X402 CITIZENS NFT Server listening at http://localhost:${5020}`);
  console.log(`NFT Price: ${NFT_CONFIG.PRICE_PER_NFT} USDC`);
  console.log(`Network: ${NFT_CONFIG.NETWORK}`);
  console.log(`Payment Address: ${payTo}`);
});