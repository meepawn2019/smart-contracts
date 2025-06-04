import { ethers } from "hardhat";
import { TokenERC20 } from "../typechain-types";

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0xEf30389B78C17303dffc144Eb45De839f7F8C49f";
  // Replace with your wallet address (or use the deployer)
  const recipient = "0x93Bc46ce2A30aC28b87FcD765a986Ec1125f8239";
  // Amount to mint (e.g., 1000 tokens, adjust decimals if needed)
  const amount = ethers.parseUnits("1000", 18);

  const TokenERC20 = await ethers.getContractFactory("TokenERC20");
  const token = (await TokenERC20.attach(contractAddress)) as TokenERC20;
  // Use the signer that will mint (e.g., the deployer or recipient)
  const tx = await token.connect(await ethers.getSigner(recipient)).mint(amount);
  await tx.wait();
  console.log(`Minted ${amount} tokens to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});