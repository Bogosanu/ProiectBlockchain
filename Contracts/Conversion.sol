// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConverter {
    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);

        // Check if price feed returns a valid response
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed");
    }

    function getConversionRateFromUSD(uint256 amountInUSD) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price data");

        uint8 decimals = priceFeed.decimals();
        uint256 ethPrice = uint256(price);
        return (amountInUSD * (10 ** decimals)) / ethPrice;
    }

    function getConversionRateToUSD(uint256 amountInETH) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price data");

        uint8 decimals = priceFeed.decimals();
        uint256 ethPrice = uint256(price);
        return (amountInETH * ethPrice) / (10 ** decimals);
    }

    receive() external payable {}

    fallback() external payable {}
}
