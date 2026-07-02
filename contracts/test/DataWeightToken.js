import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("DataWeightToken", function () {
  it("Should mint a token with proof hash and URI", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    const tokenURI = "https://example.com/weights/1";
    const proofHash = "0xabc123";

    await dwt.mintDataWeight(otherAccount.address, tokenURI, proofHash);

    expect(await dwt.ownerOf(0)).to.equal(otherAccount.address);
    expect(await dwt.tokenURI(0)).to.equal(tokenURI);
    expect(await dwt.proofPacketHashes(0)).to.equal(proofHash);
  });

  it("Should only allow owner to mint", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await expect(
      dwt.connect(otherAccount).mintDataWeight(otherAccount.address, "uri", "hash")
    ).to.be.revertedWithCustomError(dwt, "OwnableUnauthorizedAccount");
  });
});
