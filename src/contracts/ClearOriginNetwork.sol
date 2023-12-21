// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ClearOriginNetwork is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");
    uint256 private _nextTokenId;
    struct Company {
        address companyAddress;
        bytes32[] products;
    }

    constructor(address defaultAdmin) ERC721("ClearOriginNetwork", "CON") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    mapping(address => Company) private companies;
    address[] private companyAddressList;

    function createCompany(address _companyAddress) public {
        companies[_companyAddress] = Company(_companyAddress, new bytes32[](0));
        companyAddressList.push(_companyAddress);
    }

    function addProducts(address _companyAddress, bytes32[] memory _products) public {
        Company storage company = companies[_companyAddress];
        for (uint256 i = 0; i < _products.length; i++) {
            company.products.push(_products[i]);
        }
    }

    function addProduct(address _companyAddress, bytes32 _product) public {
        Company storage company = companies[_companyAddress];
        company.products.push(_product);
    }

    function getCompanyProducts(address _companyAddress) public view returns (bytes32[] memory) {
        return companies[_companyAddress].products;
    }

    function getCompaniesWithProduct(string memory _product) public view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < companyAddressList.length; i++) {
            if (hasProduct(companyAddressList[i], _product)) {
                count++;
            }
        }

        address[] memory result = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < companyAddressList.length; i++) {
            if (hasProduct(companyAddressList[i], _product)) {
                result[index] = companyAddressList[i];
                index++;
            }
        }

        return result;
    }

    function hasProduct(address _companyAddress, string memory _product) public view returns (bool) {
        Company storage company = companies[_companyAddress];
        for (uint256 i = 0; i < company.products.length; i++) {
            if (keccak256(abi.encodePacked(company.products[i])) == keccak256(abi.encodePacked(_product))) {
                return true;
            }
        }
        return false;
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
