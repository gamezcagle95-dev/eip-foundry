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
    expect(await dwt.proofPacketHashes(0)).to.equal(proofHash);
    expect(await dwt.paymentCollectors(0)).to.equal(otherAccount.address);
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
    const [owner, otherAccount, newCollector] = await ethers.getSigners();
    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await dwt.mintDataWeight(otherAccount.address, "https://example.com/weights/1", "0xabc123");

    await expect(dwt.connect(otherAccount).setPaymentCollector(0, newCollector.address))
      .to.emit(dwt, "PaymentCollectorChanged")
      .withArgs(0, otherAccount.address, newCollector.address);

    expect(await dwt.paymentCollectors(0)).to.equal(newCollector.address);
  });

  it("Should reject non-owners of the token trying to change the payment collector", async function () {
    const [owner, tokenOwner, nonOwner, newCollector] = await ethers.getSigners();
    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await dwt.mintDataWeight(tokenOwner.address, "uri", "hash");

    await expect(
      dwt.connect(owner).setPaymentCollector(0, newCollector.address)
    ).to.be.revertedWithCustomError(dwt, "NotTokenOwner")
     .withArgs(owner.address, 0);

    await expect(
      dwt.connect(nonOwner).setPaymentCollector(0, newCollector.address)
    ).to.be.revertedWithCustomError(dwt, "NotTokenOwner")
     .withArgs(nonOwner.address, 0);
  });
});
