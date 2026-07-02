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

    event Tokenized(uint256 indexed tokenId, address indexed owner, string proofHash, string tokenURI);

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

        emit Tokenized(tokenId, to, proofHash, tokenURI);
        return tokenId;
    }
}
