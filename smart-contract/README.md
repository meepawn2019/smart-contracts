# Smart Contract Project

This project contains ERC20 and ERC721 token contracts using OpenZeppelin and Hardhat.

## Prerequisites

- Node.js & pnpm
- Hardhat (`pnpm add -D hardhat`)
- OpenZeppelin Contracts (`pnpm add @openzeppelin/contracts`)

## Compile Contracts

```
npx hardhat compile
```

## Run Tests

```
npx hardhat test
```

## Deploy to Testnet

1. Configure your network in `hardhat.config.ts` (e.g., Sepolia, Goerli).
2. Deploy ERC20:
   ```
   npx hardhat run scripts/deploy-erc20.ts --network sepolia
   ```
3. Deploy ERC721:
   ```
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

## Mint Tokens

- **ERC20:**
  - Use the script `scripts/mint-erc20.ts` to mint tokens to your wallet.
  - Edit the script to set your contract address, recipient, and amount.
  - Run:
    ```
    npx hardhat run scripts/mint-erc20.ts --network sepolia
    ```

## Verify Contract on Etherscan

1. Get an Etherscan API key.
2. Run:
   ```
   npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
   ```

## Security

- **Never share your private key.**
- Use environment variables for sensitive data.

## Additional Information

- The contract is deployed to the Sepolia testnet.
- The contract address of the ERC20 token is `0xEf30389B78C17303dffc144Eb45De839f7F8C49f`.
