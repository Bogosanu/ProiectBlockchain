import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import twoerrCoinABI from "./jsons/TwoerrCoin.json";
import addresses from "./jsons/deployedAddresses.json";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const TWOERRCOIN_CONTRACT_ADDRESS = addresses.TwoerrCoin;

const App = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [twoerrContract, setTwoerrContract] = useState(null);
  const [twoerrCoinContract, setTwoerrCoinContract] = useState(null);
  const [contractData, setContractData] = useState("");

  useEffect(() => {
    const connectToBlockchain = async () => {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      setProvider(provider);

      const accountsList = await provider.listAccounts();
      setAccounts(accountsList);

      if (accountsList.length > 0) {
        const balanceWei = await provider.getBalance(accountsList[0]);
        setEthBalance(ethers.utils.formatEther(balanceWei)); // Convert to ETH

        const signer = provider.getSigner(accountsList[0]);
        const twoerrInstance = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
        const twoerrCoinInstance = new ethers.Contract(TWOERRCOIN_CONTRACT_ADDRESS, twoerrCoinABI.abi, signer);

        setTwoerrContract(twoerrInstance);
        setTwoerrCoinContract(twoerrCoinInstance);

        const tokenBalance = await twoerrCoinInstance.balanceOf(accountsList[0]);
        setTokenBalance(ethers.utils.formatEther(tokenBalance)); // Convert from Wei
      }
    };

    connectToBlockchain();
  }, []);

  const callContractFunction = async () => {
    if (!twoerrContract) return alert("Contract is not connected!");

    try {
      const response = await twoerrContract.someFunction();
      console.log("Contract Response:", response);
      setContractData(response);
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
              <p><strong>ETH Balance:</strong> {ethBalance} ETH</p>
              <p><strong>TwoerrCoin Balance:</strong> {tokenBalance} TWC</p>
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
