// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "lib/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ClearOriginNetwork is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");
    uint256 private _nextTokenId;

    struct Company {
        bytes32 companyName;
        address companyAddress;
        bytes32[] products;
    }

    Company[] public companies;


    // Allowed Products: {1x43483: ["Uhr", ""]

    constructor(address defaultAdmin) ERC721("ClearOriginNetwork", "CON") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    function safeMint(address to, string memory uri) public onlyRole(COMPANY_ROLE) returns (uint256){
        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        _safeMint(to, id);
        _setTokenURI(id, uri);

        return id;
    }

    // Function to transfer NFT from one address to another --> Make a delivery with products
    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Token not owned by the address");

        safeTransferFrom(from, to, tokenId);
    }

    // Function to get the array of addresse

    function createCompany(bytes32 _companyName, address _companyAddress, bytes32[] memory _companyProducts) public {
        companies.push(
            Company(
              _companyName,
              _companyAddress,
              _companyProducts
            )
        );
    }

    function getCompany(uint _index) public view returns(bytes32 companyName, address companyAddress,bytes32[] memory products ){
        Company storage company = companies[_index];
        return (company.companyName, company.companyAddress,company.products);
    }
    function getCompanies() public view returns(Company[] memory comp)
    {
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
