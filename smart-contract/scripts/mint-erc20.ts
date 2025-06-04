import { ethers } from "hardhat";
import { TokenERC20 } from "../typechain-types";

async function main() {
  const contractAddress = "0xEf30389B78C17303dffc144Eb45De839f7F8C49f";
  const recipient = "0x93Bc46ce2A30aC28b87FcD765a986Ec1125f8239";
  const amount = ethers.parseUnits("1000", 18);

  const TokenERC20 = await ethers.getContractFactory("TokenERC20");
  const token = (await TokenERC20.attach(contractAddress)) as TokenERC20;
  const tx = await token.connect(await ethers.getSigner(recipient)).mint(amount);
  await tx.wait();
  console.log(`Minted ${amount} tokens to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});