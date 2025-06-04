import { ethers } from "hardhat";

async function main() {
  const TokenERC20 = await ethers.getContractFactory("TokenERC20");
  const token = await TokenERC20.deploy();
  await token.waitForDeployment();
  console.log("TokenERC20 deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 