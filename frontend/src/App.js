import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./jsons/Twoerr.json";
import addresses from "./jsons/deployedAddresses.json";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = addresses.Twoerr;

const App = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState(null);
  const [contractData, setContractData] = useState("");

  useEffect(() => {
    const connectToBlockchain = async () => {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      setProvider(provider);

      const accountsList = await provider.listAccounts();
      setAccounts(accountsList);

      if (accountsList.length > 0) {
        const balanceWei = await provider.getBalance(accountsList[0]);
        setBalance(ethers.utils.formatEther(balanceWei)); // Convert to ETH
      }

      // Initialize the contract
      const signer = provider.getSigner(accountsList[0]);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      setContract(contractInstance);
    };

    connectToBlockchain();
  }, []);

  // Function to interact with the smart contract
  const callContractFunction = async () => {
    if (!contract) return alert("Contract is not connected!");

    try {
      const response = await contract.someFunction();
      console.log("Contract Response:", response);
      setContractData(response); // Store the result of the contract call
    } catch (error) {
      console.error("Error interacting with contract:", error);
    }
  };

  return (
      <div>
        <h1>Local Ethereum DApp</h1>
        {accounts.length > 0 ? (
            <div>
              <p><strong>Account:</strong> {accounts[0]}</p>
              <p><strong>Balance:</strong> {balance} ETH</p>
              <button onClick={callContractFunction}>Call Contract Function</button>
              {contractData && <p><strong>Contract Data:</strong> {contractData.toString()}</p>}
            </div>
        ) : (
            <p>Connecting to local Ethereum network...</p>
        )}
      </div>
  );
};

export default App;
