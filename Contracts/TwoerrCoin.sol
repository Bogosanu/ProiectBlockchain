// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TwoerrCoin is ERC20 {
    address public owner;

    constructor() ERC20("TwoerrCoin", "FVC") {
        owner = msg.sender;
        _mint(msg.sender, 1000000 * 10**decimals()); // Mint 1 million tokens to the owner
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(to, amount);
    }
}
