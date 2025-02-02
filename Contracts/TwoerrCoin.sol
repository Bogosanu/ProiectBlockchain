// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TwoerrCoin is ERC20 {
    address public owner;

    constructor(address[] memory initialHolders) ERC20("TwoerrCoin", "TWC") {
        owner = msg.sender;

        uint256 initialSupply = 10000 * 10**decimals();
        uint256 amountPerHolder = initialSupply / initialHolders.length;

        for (uint i = 0; i < initialHolders.length; i++) {
            _mint(initialHolders[i], amountPerHolder);
        }
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(to, amount);
    }
}
