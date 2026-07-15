import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("DataWeightToken", function () {
  it("Should mint a token with proof hash and URI, setting default collector", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    const tokenURI = "https://example.com/weights/1";
    const proofHash = "0xabc123";

    await dwt.mintDataWeight(otherAccount.address, tokenURI, proofHash);

    expect(await dwt.ownerOf(0)).to.equal(otherAccount.address);
    expect(await dwt.tokenURI(0)).to.equal(tokenURI);
    expect(await dwt.proofHashes(0)).to.equal(proofHash);

    // Default payment collector is the token owner (otherAccount)
    expect(await dwt.paymentCollector(0)).to.equal(otherAccount.address);
  });

  it("Should only allow owner to mint", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await expect(
      dwt.connect(otherAccount).mintDataWeight(otherAccount.address, "uri", "hash")
    ).to.be.revertedWithCustomError(dwt, "OwnableUnauthorizedAccount");
  });

  it("Should allow the token owner to change the payment collector", async function () {
    const [owner, otherAccount, collector] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await dwt.mintDataWeight(otherAccount.address, "https://example.com/weights/1", "0xabc123");

    // Change payment collector to collector.address
    await expect(dwt.connect(otherAccount).setPaymentCollector(0, collector.address))
      .to.emit(dwt, "PaymentCollectorUpdated")
      .withArgs(0, collector.address);

    expect(await dwt.paymentCollector(0)).to.equal(collector.address);
  });

  it("Should reject non-owners of the token trying to change the payment collector", async function () {
    const [owner, otherAccount, collector] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await dwt.mintDataWeight(otherAccount.address, "https://example.com/weights/1", "0xabc123");

    // Owner of the token is otherAccount. `owner` (contract owner, but not token owner) tries to change it.
    await expect(
      dwt.connect(owner).setPaymentCollector(0, collector.address)
    ).to.be.revertedWith("Not authorized");
  });
});
