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

  it("Should initialize payment collector to token recipient and emit event on minting", async function () {
    const [owner, recipient] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    const tx = dwt.mintDataWeight(recipient.address, "uri", "hash");
    await expect(tx)
      .to.emit(dwt, "PaymentCollectorChanged")
      .withArgs(0, ethers.ZeroAddress, recipient.address);

    expect(await dwt.paymentCollectors(0)).to.equal(recipient.address);
  });

  it("Should allow the owner of the token to set a new payment collector", async function () {
    const [owner, tokenOwner, newCollector] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await dwt.mintDataWeight(tokenOwner.address, "uri", "hash");

    // The ownerOf(0) is tokenOwner. They can set the payment collector.
    const tx = dwt.connect(tokenOwner).setPaymentCollector(0, newCollector.address);

    await expect(tx)
      .to.emit(dwt, "PaymentCollectorChanged")
      .withArgs(0, tokenOwner.address, newCollector.address);

    expect(await dwt.paymentCollectors(0)).to.equal(newCollector.address);
  });

  it("Should reject setting payment collector from a non-owner of the token", async function () {
    const [owner, tokenOwner, nonOwner, newCollector] = await ethers.getSigners();

    const DataWeightToken = await ethers.getContractFactory("DataWeightToken");
    const dwt = await DataWeightToken.deploy(owner.address);

    await dwt.mintDataWeight(tokenOwner.address, "uri", "hash");

    // The contract owner (deployer) is not the ownerOf(0), so they should be rejected.
    await expect(
      dwt.connect(owner).setPaymentCollector(0, newCollector.address)
    ).to.be.revertedWithCustomError(dwt, "NotTokenOwner")
     .withArgs(owner.address, 0);

    // Any third party (nonOwner) should also be rejected.
    await expect(
      dwt.connect(nonOwner).setPaymentCollector(0, newCollector.address)
    ).to.be.revertedWithCustomError(dwt, "NotTokenOwner")
     .withArgs(nonOwner.address, 0);
  });
});
