// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Provider.sol";
import "./Client.sol";


contract Twoerr {
    struct Service {
        uint id;
        address payable provider;
        string title;
        string description;
        uint price;
        bool isActive;
    }

    struct Order {
        uint id;
        uint serviceId;
        address payable client;
        address payable provider;
        uint price;
        bool isCompleted;
    }

    struct Review {
        uint orderId;
        uint rating;
        string comment;
    }

    uint public serviceCounter;
    uint public orderCounter;

    mapping(uint => Service) public services;
    mapping(uint => Order) public orders;
    mapping(uint => Review) public reviews;

    Provider public providerContract;
    Client public clientContract;

    event ServiceCreated(uint id, address provider, string title, uint price);
    event OrderPlaced(uint id, uint serviceId, address client, uint amount);
    event OrderCompleted(uint id);
    event ReviewLeft(uint orderId, uint rating, string comment);

    constructor(address _provider, address _client){
        providerContract = Provider(_provider);
        clientContract = Client(_client);
    }

    modifier onlyOwner(address _provider) {    
    (string memory name, ) = providerContract.providers(_provider);
    require(bytes(name).length != 0, "Provider not registered");
    _;
    }

    function createService(string memory _title, string memory _description, uint _price) public onlyOwner(msg.sender) {
        serviceCounter++;
        services[serviceCounter] = Service({
            id: serviceCounter,
            provider: payable(msg.sender),
            title: _title,
            description: _description,
            price: _price,
            isActive: true
        });

        providerContract.createService(msg.sender, serviceCounter);
        emit ServiceCreated(serviceCounter, msg.sender, _title, _price);
    }

    

    function placeOrder(uint _serviceId) public payable {
        Service memory service = services[_serviceId];
        require(service.isActive, "Service is not active");
        require(msg.value != service.price, "Insufficient payment");

        orderCounter++;
        orders[orderCounter] = Order({
            id: orderCounter,
            serviceId: _serviceId,
            client: payable(msg.sender),
            provider: service.provider,
            price: msg.value,
            isCompleted: false
        });

        emit OrderPlaced(orderCounter, _serviceId, msg.sender, msg.value);
    }

    function completeOrder(uint _orderId) public {
        Order storage order = orders[_orderId];
        require(msg.sender == order.provider, "Only the provider can complete the order");
        require(!order.isCompleted, "Order is already completed");

        order.isCompleted = true;
        order.provider.transfer(order.price);

        emit OrderCompleted(_orderId);
    }

    function leaveReview(uint _orderId, uint _rating, string memory _comment) public {
        Order memory order = orders[_orderId];
        require(msg.sender == order.client, "Only the client can leave a review");
        require(order.isCompleted, "Order must be completed before leaving a review");

        reviews[_orderId] = Review({
            orderId: _orderId,
            rating: _rating,
            comment: _comment
        });

        emit ReviewLeft(_orderId, _rating, _comment);
    }
        function CalculateEarnings(Order[] calldata _orders, address _provider) 
        public pure returns (uint256) 
    {
        uint256 earnings = 0;

        for (uint i = 0; i < _orders.length; i++) {
            if (_orders[i].provider == _provider) {
                earnings += _orders[i].price;
            }
        }

        return earnings;
    }
}