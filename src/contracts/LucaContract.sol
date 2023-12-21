// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken is ERC721, ERC721Burnable,ERC721URIStorage,AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    constructor(address defaultAdmin) ERC721("MyToken", "MTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        // _grantRole(MINTER_ROLE, defaultAdmin);
    }

    function safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function addMinter(address newMinter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, newMinter);
    }

    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Token not owned by the address");

        safeTransferFrom(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
