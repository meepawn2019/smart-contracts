import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token", () => {
  let MyToken: any;
  let myToken: any;
  let owner: any;
  let addr1: any;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    MyToken = await ethers.getContractFactory("Token");
    myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
  });

  it("should mint a token to the caller", async function () {
    await expect(myToken.connect(addr1).mint())
      .to.emit(myToken, "Transfer");
    expect(await myToken.ownerOf(1)).to.equal(addr1.address);
  });

  it("should allow owner to mint to another address", async () => {
    await myToken.mintTo(addr1.address);
    expect(await myToken.ownerOf(1)).to.equal(addr1.address);
  });
});