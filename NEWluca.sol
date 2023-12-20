pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract LucaNFTContract is ERC721, Ownable {
    uint256 public mintPrice = 0.00 ether;
    uint256 public maxSupply;
    uint256 public totalSupply;
    bool public isMintEnabled;
    mapping(address => uint256) public mintedWallets; // How many vallets have been minted by a wallet

    constructor() ERC721("LucaNFT", "LUCA") {
        maxSupply = 10000;
        isMintEnabled = false;
    }

    function mint() external payable {
        require(isMintEnabled, "Minting is not enabled");
        require(mintedWallets[msg.sender] < 2d, "You can only mint 2 NFTs per wallet");
    }
}


