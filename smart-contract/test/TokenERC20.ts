import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenERC20", function () {
  let TokenERC20: any;
  let token: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TokenERC20 = await ethers.getContractFactory("TokenERC20");
    token = await TokenERC20.deploy();
    await token.waitForDeployment();
  });

  it("should mint tokens to the caller", async function () {
    await token.connect(addr1).mint(1000);
    expect(await token.balanceOf(addr1.address)).to.equal(1000);
  });

  it("should allow owner to mint to another address", async function () {
    await token.mintTo(addr2.address, 500);
    expect(await token.balanceOf(addr2.address)).to.equal(500);
  });

  it("should allow users to transfer tokens", async function () {
    await token.connect(addr1).mint(1000);
    await token.connect(addr1).transfer(addr2.address, 300);
    expect(await token.balanceOf(addr2.address)).to.equal(300);
    expect(await token.balanceOf(addr1.address)).to.equal(700);
  });
}); 