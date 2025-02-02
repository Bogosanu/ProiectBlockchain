// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConverter {
    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }


    function getConversionRateFromUSD(uint256 amountInUSD) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price data");

        uint256 ethPrice = uint256(price);
        uint256 amountInETH = (amountInUSD * 10**18) / ethPrice;
        return amountInETH;
    }

    function getConversionRateToUSD(uint256 amountInETH) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 ethPrice = uint256(price);
        uint256 amountInUSD = (amountInETH * ethPrice) / 1e18;
        return amountInUSD;
    }

    receive() external payable {}

    fallback() external payable { }
}