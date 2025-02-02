require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deploy() {
    const accounts = await ethers.getSigners(); // Get all Hardhat accounts
    const accountAddresses = accounts.map(account => account.address); // Extract addresses
    const owner = accounts[0]; // First account as owner

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

    
    const TwoerrCoin = await ethers.getContractFactory("TwoerrCoin");
    const twoerrcoin = await TwoerrCoin.deploy(accountAddresses); // Mint to all accounts
    await twoerrcoin.deployed();

    const twoerrCoinReceipt = await twoerrcoin.deployTransaction.wait();
    console.log(`TwoerrCoin contract deployed at: ${twoerrcoin.address} (Gas used: ${twoerrCoinReceipt.gasUsed})`);

    const Twoerr = await ethers.getContractFactory("Twoerr");
    const twoerr = await Twoerr.deploy(provider.address, client.address, twoerrcoin.address);
    await twoerr.deployed();
    const twoerrReceipt = await twoerr.deployTransaction.wait();
    console.log(`Twoerr contract deployed at: ${twoerr.address} (Gas used: ${twoerrReceipt.gasUsed})`);

    // Save deployed contract addresses to frontend
    const addresses = {
        Provider: provider.address,
        Client: client.address,
        Twoerr: twoerr.address,
        TwoerrCoin: twoerrcoin.address,
    };

    const outputFilePath = path.join(__dirname, "../frontend/src/jsons/deployedAddresses.json");
    fs.writeFileSync(outputFilePath, JSON.stringify(addresses, null, 2));
    console.log(`Addresses saved to ${outputFilePath}`);

    for (let i = 0; i < accounts.length; i++) {
        const balance = await twoerrcoin.balanceOf(accounts[i].address);
        console.log(`Account ${i + 1} (${accounts[i].address}) Balance: ${ethers.utils.formatEther(balance)} FVC`);
    }
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });