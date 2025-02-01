require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Provider = await ethers.getContractFactory("Provider");
    const provider = await Provider.deploy(owner.address);
    await provider.deployed();
    console.log("Provider contract deployed at:", provider.address);

    const Client = await ethers.getContractFactory("Client");
    const client = await Client.deploy(owner.address);
    await client.deployed();
    console.log("Client contract deployed at:", client.address);

    const Twoerr = await ethers.getContractFactory("Twoerr");
    const twoerr = await Twoerr.deploy(provider.address, client.address);
    await twoerr.deployed();
    console.log("Twoerr contract deployed at:", twoerr.address);

    const name = "Test Provider";
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
    console.log("Client info:", clientInfo);

    console.log("Client name: ", clientInfo.name);
    console.log("Client email :", clientInfo.contactInfo);

    await twoerr.connect(user1).createService("Service","depanari",50);

    const service = await provider.getProviderServices(user1.address);
    console.log(service);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
