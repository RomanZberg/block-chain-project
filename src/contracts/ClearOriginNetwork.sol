// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ClearOriginNetwork is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");
    uint256 private _nextTokenId;
    address[] public companies;
    // Allowed Products: {1x43483: ["Uhr", ""]

    constructor(address defaultAdmin) ERC721("ClearOriginNetwork", "CON") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    function safeMint(address to, string memory uri) public onlyRole(COMPANY_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }


    // Function to transfer NFT from one address to another --> Make a delivery with products
    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Token not owned by the address");

        safeTransferFrom(from, to, tokenId);
    }

    // Function to add a new company to the network
    function addCompany(address _newCompany) public onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(COMPANY_ROLE, _newCompany);
        companies.push(_newCompany);
    }

    // Function to get the array of addresses
    function getCompanies() public onlyRole(DEFAULT_ADMIN_ROLE) view returns (address[] memory)  {
        return companies;
    }




    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)public view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
