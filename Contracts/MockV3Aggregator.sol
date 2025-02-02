// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockV3Aggregator is AggregatorV3Interface {
    uint8 private _decimals;
    int256 private _latestAnswer;

    constructor(uint8 decimals_, int256 initialAnswer) {
        _decimals = decimals_;
        _latestAnswer = initialAnswer;
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return "Mock Chainlink Aggregator";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function latestRoundData()
    external
    view
    override
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
    {
        return (0, _latestAnswer, 0, 0, 0);
    }

    function updateAnswer(int256 newAnswer) external {
        _latestAnswer = newAnswer;
    }

    // **📌 Fix: Implement missing function getRoundData(uint80)**
    function getRoundData(uint80 roundId)
    external
    view
    override
    returns (
        uint80,
        int256,
        uint256,
        uint256,
        uint80
    )
    {
        return (roundId, _latestAnswer, 0, 0, 0);
    }
}
