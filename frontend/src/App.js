import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import providerABI from "./jsons/Provider.json"; // Importă ABI-ul contractului Provider
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './register'; 
import RegisterClient from "./RegisterClient";
import RegisterProvider from "./RegisterProvider";
import ServicePage from "./Service";
import ServicesPage from "./Services";
import { useParams } from "react-router-dom";
import ServiceDetail from "./ServiceDetail";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider; // Adresa contractului Provider

const App = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [twoerrContract, setTwoerrContract] = useState(null);
  const [providerContract, setProviderContract] = useState(null); // Instanța contractului Provider
  const [contractData, setContractData] = useState("");
  const [isProvider, setIsProvider] = useState(false);

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
        setTwoerrContract(twoerrInstance);

        const providerInstance = new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer);
        setProviderContract(providerInstance);

        const providerInfo = await providerInstance.providers(accountsList[0]);
        const [name, isActive] = providerInfo;

        if (name.length > 0) {
          setIsProvider(true);
        } else {
          setIsProvider(false);
        }
        console.log(name);
      }
    };

    connectToBlockchain();
  }, []);

 

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {accounts.length > 0 ? (
                <div className="bodyClass">
                  <p><strong>Account:</strong> {accounts[0]}</p>
                  <p><strong>Balance:</strong> {ethBalance} ETH</p>
                  <p><strong>TwoerrCoin Balance:</strong> {tokenBalance} TWC</p>
                  <Link to="/Service">{isProvider && <button>Create Service</button>}</Link>
                  
                  <Link to="/Services"><button>See Services</button></Link>
                </div>
              ) : (
                <p>Connecting to local Ethereum network...</p>
              )}
              
            </Layout>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/RegisterClient" element={<RegisterClient />} />
        <Route path="/RegisterProvider" element={<RegisterProvider />} />
        <Route path="/Service" element={<ServicePage />} />
        <Route path="/Services" element={<ServicesPage />} />
        <Route path="/ServiceDetail/:id" element={<ServiceDetail />} />
        
      </Routes>
    </Router>
  );
};

export default App;