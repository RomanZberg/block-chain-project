// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ClearOriginNetwork is ERC721,  ERC721Burnable, AccessControl, ERC721Enumerable {
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");
    uint256 private _nextTokenId;

    // Company Objekt. In diesem Objekt werden die Daten der Unternehmen gespeichert, welche durch uns auf der Blockchain verifiziert werden.
    struct Company {
        bytes32 companyName;
        address companyAddress;
        bytes32[] products;
        bool isValue;
    }
    // DeliveryItem Objekt. In diesem Objekt werden die Produkte gespeichert inklusive der Anzahl.
    struct DeliveryItem {
        bytes32 name;
        uint8 numberOfItems;
    }

    address[] private admins;

    // Konstruktur der Contract Klasse. Wir als Deployer geben uns die Admin Rolle.
    constructor(address defaultAdmin) ERC721("ClearOriginNetwork", "CON") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        admins.push(defaultAdmin);
    }

    mapping(address => Company) private companies;

    mapping(uint256 => DeliveryItem[]) private tokenIdDeliveryItemsMapping;

    address[] private  companyAddresses;

    // Funktion um sämtliche Admins zu bekommen.
    function getAdmins() public view returns (address[] memory){
        return admins;
    }

    // Nachdem ein Unternehmen von uns verifiziert wurde, bekommt es zu die Company Rolle um zu minten
    // Die Funktin darf nur von einem Admin aufgerufen werden.
    function addCompany(bytes32 _companyName, address _companyAddress, bytes32[] memory _companyProducts)
    public onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(companies[_companyAddress].isValue == false, 'Wallet address is already assigned');

        companies[_companyAddress] = Company(
            _companyName,
            _companyAddress,
            _companyProducts,
            true
        );

        _grantRole(COMPANY_ROLE, _companyAddress);

        companyAddresses.push(_companyAddress);
    }

    // Funktion um die Daten eines Unternehmens zu bekommen.
    function getCompany(address companyAddress) public view returns (bytes32, bytes32[] memory){
        require(companies[companyAddress].isValue == true, 'No Company with the requested wallet address');

        Company memory company = companies[companyAddress];
        return (company.companyName, company.products);
    }

    // Funktion um die Daten aller Unternehmen zu bekommen.
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

    // Funktion um die Daten einer Lieferung zu bekommen.
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

    // Funktion um die Daten aller Lieferungen zu bekommen.
    function addProducts(address _companyAddress, bytes32[] memory _products) public {
        Company storage company = companies[_companyAddress];
        for (uint256 i = 0; i < _products.length; i++) {
            company.products.push(_products[i]);
        }
    }

    // Funktion um ein Produkt zu einem Unternehmen hinzuzufügen.
    function addProduct(address _companyAddress, bytes32 _product) public {
        Company storage company = companies[_companyAddress];
        company.products.push(_product);
    }

    // Diese Funktion gibt alle Produkte eines Unternehmens zurück, welches es minten darf
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

    // Funktion um ein NFT zu minten. Die Funktion darf nur von einem Unternehmen aufgerufen werden, nachdem es von uns überprüft hinzugefügt wurde.
    // Um die Funktion aufzurufen, braucht es die Company Rolle.
    function safeMint(bytes32[] memory _deliveryProducts, uint8[] memory numberOfItems) public onlyRole(COMPANY_ROLE) {
        uint256 tokenId = _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        for (uint256 i = 0; i < _deliveryProducts.length; i++) {
            tokenIdDeliveryItemsMapping[tokenId].push(DeliveryItem(_deliveryProducts[i], numberOfItems[i]));
        }
    }

    // Diese Funktion transferiert ein NFT von einem Unternehmen zu einem anderen. Also eine Lieferung.
    // Es erfordert, dass es das NFT auch in Besitz hat.
    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Token not owned by the address");

        safeTransferFrom(from, to, tokenId);
    }

    // Die folgenden Funktionen sind Überschreibungen, die von Solidity benötigt werden.
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

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
