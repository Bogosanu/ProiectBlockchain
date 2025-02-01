// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Client {
    address public twoerrContract;
    address public client;
    struct ClientInfo{
        string name;
        string contactInfo;
        uint[] serviceIds; 
    }

    
    event ClientRegistered(address client, string name, string contactInfo);
    
    mapping(address => ClientInfo) public clients;

    constructor(address _client) {
        twoerrContract = msg.sender;
        client = _client;
    }

    function placeOrder(uint _serviceId) public payable {
        clients[msg.sender].serviceIds.push(_serviceId);
    }

    function registerClient(string memory _name, string memory _contactInfo) public {
        require(bytes(clients[msg.sender].name).length == 0, "Client already registered");
        clients[msg.sender] = ClientInfo({
            name: _name,
            contactInfo: _contactInfo,
            serviceIds: new uint[](0)
        });

        emit ClientRegistered(msg.sender, _name, _contactInfo);
    }
}