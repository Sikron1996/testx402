# X402 CITIZENS NFT Backend Service

A backend service implementing x402 payment protocol for X402 CITIZENS NFT purchases.

## Overview

This Express.js server provides NFT purchase endpoints protected by x402 payment protocol, requiring USDC payments on Base network to access premium features and NFT minting capabilities.

## Features

- **x402 Protocol Integration**: Full implementation of x402 payment middleware
- **NFT Purchase Endpoints**: Single and batch NFT purchase with dynamic pricing
- **ERC-1155 Support**: Optimized for ERC-1155 token standard
- **Payment Verification**: Transaction status and payment confirmation
- **Premium Content**: Protected routes for NFT holders

## API Endpoints

### Protected Routes (Require x402 Payment)
- `POST /nft/purchase` - Purchase single NFT (5 USDC)
- `POST /nft/batch-purchase` - Purchase multiple NFTs (dynamic pricing)
- `GET /premium/content` - Access premium content
- `GET /nft/utilities/*` - NFT holder utilities

### Public Routes
- `GET /payment/verify/:txHash` - Verify payment status
- `GET /nft/metadata/:tokenId` - NFT metadata
- `GET /wallet/:address/balance` - Wallet balance check

## Configuration

Environment variables required:
- `FACILITATOR_URL`: x402 Facilitator service URL
- `ADDRESS`: USDC receiving address