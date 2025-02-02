require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deploy() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy Provider
    const Provider = await ethers.getContractFactory("Provider");
    const provider = await Provider.deploy(owner.address);
    await provider.deployed();
    const providerReceipt = await provider.deployTransaction.wait();
    console.log(`Provider contract deployed at: ${provider.address} (Gas used: ${providerReceipt.gasUsed})`);

    // Deploy Client
    const Client = await ethers.getContractFactory("Client");
    const client = await Client.deploy(owner.address);
    await client.deployed();
    const clientReceipt = await client.deployTransaction.wait();
    console.log(`Client contract deployed at: ${client.address} (Gas used: ${clientReceipt.gasUsed})`);

    // Deploy TwoerrCoin
    const TwoerrCoin = await ethers.getContractFactory("TwoerrCoin");
    const twoerrcoin = await TwoerrCoin.deploy();
    await twoerrcoin.deployed();
    const twoerrCoinReceipt = await twoerrcoin.deployTransaction.wait();
    console.log(`TwoerrCoin contract deployed at: ${twoerrcoin.address} (Gas used: ${twoerrCoinReceipt.gasUsed})`);

    // Deploy Twoerr
    const Twoerr = await ethers.getContractFactory("Twoerr");
    const twoerr = await Twoerr.deploy(provider.address, client.address, twoerrcoin.address);
    await twoerr.deployed();
    const twoerrReceipt = await twoerr.deployTransaction.wait();
    console.log(`Twoerr contract deployed at: ${twoerr.address} (Gas used: ${twoerrReceipt.gasUsed})`);

    const addresses = {
        Provider: provider.address,
        Client: client.address,
        Twoerr: twoerr.address,
        TwoerrCoin: twoerrcoin.address,
    };

    const outputFilePath = path.join(__dirname, "../frontend/src/jsons/deployedAddresses.json");
    fs.writeFileSync(outputFilePath, JSON.stringify(addresses, null, 2));
    console.log(`Addresses saved to ${outputFilePath}`);


    /*const name = "Test Provider";
    const contactInfo = "test@example.com";
    await provider.connect(user1).registerProvider(name, contactInfo);
    console.log("Provider registered by user1");

    const providerInfo = await provider.providers(user1.address);
    console.log("Provider Info:", providerInfo);
    console.log("Provider Name:", providerInfo.name);
    console.log("Provider Contact Info:", providerInfo.contactInfo);

    const nameClient = "Test Client";
    const emailClient = "test@test.com";
    await client.connect(user2).registerClient(nameClient, emailClient);
    console.log("Client Registered");

    const clientInfo = await client.clients(user2.address);
    console.log("Client Info:", clientInfo);
    console.log("Client Name:", clientInfo.name);
    console.log("Client Email:", clientInfo.contactInfo);


    await twoerr.connect(user1).createService("Service", "depanari", 50);
    const service = await provider.getProviderServices(user1.address);
    console.log(service);
     */
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });