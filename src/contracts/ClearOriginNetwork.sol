// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ClearOriginNetwork is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl, ERC721Enumerable {
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");
    uint256 private _nextTokenId;

    struct Company {
        bytes32 companyName;
        address companyAddress;
        bytes32[] products;
        bool isValue;
    }

    struct DeliveryItem {
        bytes32 name;
        uint8 numberOfItems;
    }


    constructor(address defaultAdmin) ERC721("ClearOriginNetwork", "CON") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    mapping(address => Company) private companies;


    mapping(uint256 => DeliveryItem[]) private tokenIdDeliveryItemsMapping;


    address[] private  companyAddresses;

    function addCompany(bytes32 _companyName, address _companyAddress, bytes32[] memory _companyProducts) public
    {
        require(companies[_companyAddress].isValue == false, 'Wallet address is already assigned');

        companies[_companyAddress] = Company(
            _companyName,
            _companyAddress,
            _companyProducts,
            true
        );

        companyAddresses.push(_companyAddress);
    }

    function getCompany(address companyAddress) public view returns (bytes32, bytes32[] memory){
        require(companies[companyAddress].isValue == true, 'No Company with the requested wallet address');

        Company memory company = companies[companyAddress];
        return (company.companyName, company.products);
    }


    function getCompanies() public view returns (bytes32[] memory, address[] memory, bytes32[][] memory)
    {

        bytes32[] memory companyNamesR = new bytes32[](companyAddresses.length);
        address[] memory companyAddressesR = new address[](companyAddresses.length);
        bytes32[][] memory productsArrayR = new bytes32[][](companyAddresses.length);

        for (uint256 i = 0; i < companyAddresses.length; i++) {
            Company memory company = companies[companyAddresses[i]];
            companyNamesR[i] = company.companyName;
            companyAddressesR[i] = company.companyAddress;
            productsArrayR[i] = company.products;
        }

        return (companyNamesR, companyAddressesR, productsArrayR);
    }


    function getDelivery(uint256 tokenId) public view returns (bytes32[] memory, uint8[] memory)
    {

        DeliveryItem[] memory deliveryItems = tokenIdDeliveryItemsMapping[tokenId];

        bytes32[] memory deliveryProductsR = new bytes32[](deliveryItems.length);
        uint8[] memory numberOfItemsR = new uint8[](deliveryItems.length);

        for (uint256 i = 0; i < deliveryItems.length; i++) {
            DeliveryItem memory deliveryItem = deliveryItems[i];
            deliveryProductsR[i] = deliveryItem.name;
            numberOfItemsR[i] = deliveryItem.numberOfItems;
        }

        return (deliveryProductsR, numberOfItemsR);
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
        for (uint256 i = 0; i < companyAddresses.length; i++) {
            if (hasProduct(companyAddresses[i], _product)) {
                count++;
            }
        }

        address[] memory result = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < companyAddresses.length; i++) {
            if (hasProduct(companyAddresses[i], _product)) {
                result[index] = companyAddresses[i];
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

    function safeMint(bytes32[] memory _deliveryProducts, uint8[] memory numberOfItems) public {
        uint256 tokenId = _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        for (uint256 i = 0; i < _deliveryProducts.length; i++) {
            tokenIdDeliveryItemsMapping[tokenId].push(DeliveryItem(_deliveryProducts[i], numberOfItems[i]));
        }

        //        _setTokenURI(tokenId, uri);
    }

// Function to transfer NFT from one address to another --> Make a delivery with products
    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Token not owned by the address");

        safeTransferFrom(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Enumerable)
    returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
