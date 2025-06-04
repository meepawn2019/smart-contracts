### Overview

This project is a simple implementation of a tokenized NFT marketplace.

### Tech Stack

- Solidity
- Hardhat
- OpenZeppelin
- React
- Next.js
- Tailwind CSS
- TypeScript
- Rust

### Installation and Setup

#### Prerequisites

- Node.js & pnpm
- Rust & Cargo
- Redis
- Etherscan API key
- Infura project key

#### Setup

1. Clone the repository
2. Create a `.env` file in the frontend directory and add the following variables:
   - `INFURA_PROJECT_KEY`: Your Infura project key
   - `REACT_APP_API_URL`: Your backend API URL. It should be something like `http://localhost:8000`
3. Run frontend: `cd frontend && pnpm install && pnpm dev`
4. Create a `.env` file in the backend directory and add the following variables:
   - `ETHERSCAN_API_KEY`: Your Etherscan API key
   - `REDIS_URL`: Your Redis URL. It should be something like `redis://localhost:6379`
5. Open another terminal and run backend: `cd backend && cargo run`

The smart contract is deployed on Sepolia testnet at address: 0xEf30389B78C17303dffc144Eb45De839f7F8C49f. In case you want to deploy it yourself, please checkout the smart-contract directory readme(smart-contract/README.md)

### Usage

1. Start the development server
2. Open the browser and navigate to http://localhost:5173

### Assumptions & Notes

- I'm using Infura to get the Sepolia testnet RPC URL and Etherscan for API calls.
- I'm using Redis to store gas and current block number.
- I'm using Hardhat for smart contract deployment and testing since it's beginner friendly.
- I have support from AI to help writing and studying solidity for the smart contract. But the deployment and testing is done manually.

### Limitations

- Redis cache is not fully tested.
- Haven't dockerize application yet.
- Haven't add database to store user information, transaction history, etc.
