import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import twoerrCoinABI from "./jsons/TwoerrCoin.json";
import providerABI from "./jsons/Provider.json";
import clientABI from "./jsons/Client.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './register';
import RegisterClient from "./RegisterClient";
import RegisterProvider from "./RegisterProvider";
import ServicePage from "./Service";
import ServicesPage from "./Services";
import ServiceDetail from "./ServiceDetail";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const TWOERRCOIN_CONTRACT_ADDRESS = addresses.TwoerrCoin;
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider;
const CLIENT_CONTRACT_ADDRESS = addresses.Client;

const App = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", contactInfo: "" });

  useEffect(() => {
    const connectToBlockchain = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        setProvider(provider);

        const accountsList = await provider.listAccounts();
        setAccounts(accountsList);

        let selectedAccount = sessionStorage.getItem('currentAccount');

        if (!selectedAccount) {
          let lastUsedIndex = parseInt(localStorage.getItem('lastUsedAccountIndex'), 10) || 0;
          const nextAccountIndex = (lastUsedIndex + 1) % accountsList.length;
          selectedAccount = accountsList[nextAccountIndex];

          setCurrentAccount(selectedAccount);
          localStorage.setItem('lastUsedAccountIndex', nextAccountIndex);
          sessionStorage.setItem('currentAccount', selectedAccount);
        } else {
          setCurrentAccount(selectedAccount);
        }

        if (selectedAccount) {
          const balanceWei = await provider.getBalance(selectedAccount);
          setEthBalance(ethers.utils.formatEther(balanceWei));

          const signer = provider.getSigner(selectedAccount);
          const tokenContract = new ethers.Contract(TWOERRCOIN_CONTRACT_ADDRESS, twoerrCoinABI.abi, signer);
          const tokenBalanceWei = await tokenContract.balanceOf(selectedAccount);
          setTokenBalance(ethers.utils.formatEther(tokenBalanceWei));
        }
      } catch (error) {
        console.error("Error connecting to blockchain:", error);
      }
    };

    connectToBlockchain();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentAccount) return;

      try {
        const signer = provider.getSigner();
        const providerContract = new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer);
        const clientContract = new ethers.Contract(CLIENT_CONTRACT_ADDRESS, clientABI.abi, signer);

        let providerInfo = null;
        let clientInfo = null;

        try {
          providerInfo = await providerContract.providers(currentAccount);
        } catch (error) {
          console.warn("Provider lookup failed (maybe not registered)");
        }

        try {
          clientInfo = await clientContract.clients(currentAccount);
        } catch (error) {
          console.warn("Client lookup failed (maybe not registered)");
        }

        if (providerInfo && providerInfo[0].length > 0) {
          setIsProvider(true);
          setUserInfo({ name: providerInfo[0], contactInfo: providerInfo[1] });
        } else if (clientInfo && clientInfo[0].length > 0) {
          setIsClient(true);
          setUserInfo({ name: clientInfo[0], contactInfo: clientInfo[1] });
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (provider) {
      fetchUserRole();
    }
  }, [currentAccount, provider]);

  return (
      <Router>
        <Routes>
          <Route
              path="/"
              element={
                <Layout>
                  <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh", textAlign: "center" }}>
                    {currentAccount ? (
                        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxWidth: "600px", margin: "0 auto" }}>
                          <h2>Account Details</h2>
                          <p><strong>Account:</strong> {currentAccount}</p>
                          <p><strong>Name:</strong> {userInfo.name || "Not registered"}</p>
                          <p><strong>Contact Info:</strong> {userInfo.contactInfo || "Not registered"}</p>
                          <p><strong>Balance:</strong> {ethBalance} ETH</p>
                          <p><strong>TwoerrCoin Balance:</strong> {tokenBalance} TWC</p>

                          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                            {isProvider && (
                                <Link to="/Service">
                                  <button style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer" }}>
                                    Create Service
                                  </button>
                                </Link>
                            )}
                            <Link to="/Services">
                              <button style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer" }}>
                                See Services
                              </button>
                            </Link>
                          </div>
                        </div>
                    ) : (
                        <p>Connecting to local Ethereum network...</p>
                    )}
                  </div>
                </Layout>
              }
          />
          <Route path="/register" element={<Register currentAccount={currentAccount} />} />
          <Route path="/RegisterClient" element={<RegisterClient currentAccount={currentAccount} />} />
          <Route path="/RegisterProvider" element={<RegisterProvider currentAccount={currentAccount} />} />
          <Route path="/Service" element={<ServicePage currentAccount={currentAccount} />} />
          <Route path="/Services" element={<ServicesPage currentAccount={currentAccount} />} />
          <Route path="/ServiceDetail/:id" element={<ServiceDetail currentAccount={currentAccount} />} />
        </Routes>
      </Router>
  );
};

export default App;
