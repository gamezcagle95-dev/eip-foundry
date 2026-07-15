// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DataWeightToken
 * @dev Tokenizes AI training data and model weights with embedded provenance hashes and designated payment collectors.
 */
contract DataWeightToken is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from Token ID to Proof Hash (Asset Provenance Hash)
    mapping(uint256 => string) public proofHashes;

    // Mapping from Token ID to designated Payment Collector address
    mapping(uint256 => address) public paymentCollector;

    event Tokenized(uint256 indexed tokenId, address indexed owner, string proofHash, string tokenURI);
    event PaymentCollectorUpdated(uint256 indexed tokenId, address indexed collector);

    constructor(address initialOwner) ERC721("DataWeightToken", "DWT") Ownable(initialOwner) {}

    /**
     * @dev Mints a new token representing a validated AI asset.
     * @param to The address that will own the minted token.
     * @param tokenURI The metadata URI (e.g., IPFS link to weight metadata).
     * @param proofHash The generated Proof Hash.
     */
    function mintDataWeight(address to, string memory tokenURI, string memory proofHash) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        proofHashes[tokenId] = proofHash;

        // By default, the payment collector is the token owner
        paymentCollector[tokenId] = to;

        emit Tokenized(tokenId, to, proofHash, tokenURI);
        emit PaymentCollectorUpdated(tokenId, to);
        return tokenId;
    }

    /**
     * @dev Sets a designated payment collector for a specific Token ID.
     * Only the token owner can change the payment collector.
     * @param tokenId The ID of the token.
     * @param newCollector The address of the new payment collector.
     */
    function setPaymentCollector(uint256 tokenId, address newCollector) external {
        require(ownerOf(tokenId) == msg.sender, "Not authorized");
        paymentCollector[tokenId] = newCollector;
        emit PaymentCollectorUpdated(tokenId, newCollector);
    }
}
