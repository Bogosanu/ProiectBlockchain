// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Provider {
    address public twoerr; 
    address public owner;

    struct ProviderInfo {
        string name;
        string contactInfo;
        uint[] serviceIds; 
    }

    mapping(address => ProviderInfo) public providers;

    event ProviderRegistered(address provider, string name, string contactInfo);

    constructor(address _owner) {
        twoerr = msg.sender;
        owner = _owner;
    }
    

    function registerProvider(string memory _name, string memory _contactInfo) public {
        require(bytes(providers[msg.sender].name).length == 0, "Provider already registered");
        providers[msg.sender] = ProviderInfo({
            name: _name,
            contactInfo: _contactInfo,
            serviceIds: new uint[](0)
        });

        emit ProviderRegistered(msg.sender, _name, _contactInfo);
    }

    function createService(address _provider,uint _serviceID) public {
        require(bytes(providers[_provider].name).length > 0, "Provider not registered");
        providers[_provider].serviceIds.push(_serviceID);
    }

    function getProviderServices(address _provider) public view returns (uint[] memory) {
        return providers[_provider].serviceIds;
    }
}