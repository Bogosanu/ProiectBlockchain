const { ethers } = require("hardhat");
const assert = require("assert");

describe("Smart Contract Deployment and Unauthorized Actions", function () {
  let clientContract, providerContract, twoerr;
  let owner, otherAccount;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    const accountAddresses = accounts.map(account => account.address);
    owner = accounts[0];
    otherAccount = accounts[1];

    // Deploy the Client contract
    const Client = await ethers.getContractFactory("Client");
    clientContract = await Client.deploy(owner.address);
    await clientContract.deployed();

    // Deploy the Provider contract with the Client address
    const Provider = await ethers.getContractFactory("Provider");
    providerContract = await Provider.deploy(owner.address);
    await providerContract.deployed();

    const TwoerrCoin = await ethers.getContractFactory("TwoerrCoin");
    const twoerrcoin = await TwoerrCoin.deploy(accountAddresses);
    await twoerrcoin.deployed();

    const Twoerr = await ethers.getContractFactory("Twoerr");
    twoerr = await Twoerr.deploy(providerContract.address, clientContract.address, twoerrcoin.address);
    await twoerr.deployed();
  });

  it("Should deploy contracts correctly", async function () {
    assert.ok(clientContract.address, "Client contract was not deployed");
    assert.ok(providerContract.address, "Provider contract was not deployed");
  });


  describe("Unauthorized Actions", function () {

    it("Should not allow a registered client to register again", async function () {
      await clientContract.connect(owner).registerClient("Client Name", "client@example.com");

      try {
        await clientContract.connect(owner).registerClient("Client Name", "client@example.com");
        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Client already registered"));
      }
    });

    it("Should not allow a registered provider to register again", async function () {
      await providerContract.connect(owner).registerProvider("Provider Name", "provider@example.com");

      try {
        await providerContract.connect(owner).registerProvider("Provider Name", "provider@example.com");
        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Provider already registered"));
      }
    });

    it("Should prevent unauthorized access to toggle service status", async function () {
      try {
        await twoerr.connect(otherAccount).toggleServiceStatus(1);
        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Only the provider can toggle service status"));
      }
    });

    it("Should prevent unauthorized marking of orders as complete", async function () {
      try {
        await twoerr.connect(otherAccount).completeOrder(1);
        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Only provider can complete the order"));
      }
    });

    it("Should prevent a client from creating a service", async function () {
      try {
        await clientContract.connect(otherAccount).registerClient("Client Name", "client@example.com");
        await twoerr.connect(otherAccount).createService("Client's Service", 1, 100);
        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Provider not registered"));
      }
    });

    it("Should prevent a client from purchasing an inactive service", async function () {
      try {
        await providerContract.connect(owner).registerProvider("Provider Name", "provider@example.com");
        await clientContract.connect(otherAccount).registerClient("Client Name", "client@example.com");
        await twoerr.connect(owner).createService("Service1", 1, 100);
        await twoerr.connect(owner).toggleServiceStatus(1);
        await twoerr.connect(otherAccount).placeOrder(1, false);

        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Service is not active"));
      }
    });

    it("Should prevent a client from purchasing a service they can not afford", async function () {
      try {
        await providerContract.connect(owner).registerProvider("Provider Name", "provider@example.com");
        await clientContract.connect(otherAccount).registerClient("Client Name", "client@example.com");
        await twoerr.connect(owner).createService("Service1", 1, 100000);
        await twoerr.connect(otherAccount).placeOrder(1, false);

        assert.fail("Expected transaction to revert");
      } catch (error) {
        assert.ok(error.message.includes("Incorrect ETH amount"));
      }
    });


  });
});
