// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DataWeightToken
 * @dev Tokenizes AI training data and model weights with embedded provenance hashes.
 */
contract DataWeightToken is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from Token ID to Proof Packet Hash (Forensic Hash)
    mapping(uint256 => string) public proofPacketHashes;

    // Mapping from Token ID to Payment Collector Address
    mapping(uint256 => address) public paymentCollectors;

    event Tokenized(uint256 indexed tokenId, address indexed owner, string proofHash, string tokenURI);

    event PaymentCollectorChanged(uint256 indexed tokenId, address indexed oldCollector, address indexed newCollector);

    // Custom error for payment collector authorization
    error NotTokenOwner(address caller, uint256 tokenId);

    constructor(address initialOwner) ERC721("DataWeightToken", "DWT") Ownable(initialOwner) {}

    /**
     * @dev Mints a new token representing a validated AI asset.
     * @param to The address that will own the minted token.
     * @param tokenURI The metadata URI (e.g., IPFS link to weight metadata).
     * @param proofHash The LexTrinity generated Proof Packet Hash.
     */
    function mintDataWeight(address to, string memory tokenURI, string memory proofHash) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        proofPacketHashes[tokenId] = proofHash;

        // Initialize payment collector to the recipient
        paymentCollectors[tokenId] = to;
        emit PaymentCollectorChanged(tokenId, address(0), to);

        emit Tokenized(tokenId, to, proofHash, tokenURI);
        return tokenId;
    }

    /**
     * @dev Sets/updates the payment collector address for a given token.
     * @param tokenId The ID of the token.
     * @param paymentCollector The address of the new payment collector.
     */
    function setPaymentCollector(uint256 tokenId, address paymentCollector) public {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner(msg.sender, tokenId);
        }
        address oldCollector = paymentCollectors[tokenId];
        paymentCollectors[tokenId] = paymentCollector;
        emit PaymentCollectorChanged(tokenId, oldCollector, paymentCollector);
    }
}
