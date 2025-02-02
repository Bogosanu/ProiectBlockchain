import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import twoerrCoinABI from "./jsons/TwoerrCoin.json";
import providerABI from "./jsons/Provider.json"; // Importă ABI-ul contractului Provider
import clientABI from "./jsons/Client.json"; // Import client ABI
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
import ClientOrders from "./ClientOrders";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const TWOERRCOIN_CONTRACT_ADDRESS = addresses.TwoerrCoin;
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider; // Adresa contractului Provider
const CLIENT_CONTRACT_ADDRESS = addresses.Client; // Add client contract address

const App = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [twoerrContract, setTwoerrContract] = useState(null);
  const [twoerrCoinContract, setTwoerrCoinContract] = useState(null);
  const [providerContract, setProviderContract] = useState(null);
  const [clientContract, setClientContract] = useState(null);
  const [contractData, setContractData] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", contactInfo: "" });

  useEffect(() => {
    const connectToBlockchain = async () => {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      setProvider(provider);

      const accountsList = await provider.listAccounts();
      setAccounts(accountsList);

      // Check session storage for the current account
      let selectedAccount = sessionStorage.getItem('currentAccount');

      if (!selectedAccount) {
        // Get the last used account index from local storage
        let lastUsedIndex = parseInt(localStorage.getItem('lastUsedAccountIndex'), 10) || 0;

        // Select the next available account
        const nextAccountIndex = (lastUsedIndex + 1) % accountsList.length;
        selectedAccount = accountsList[nextAccountIndex];
        setCurrentAccount(selectedAccount);

        // Update local storage with the new index
        localStorage.setItem('lastUsedAccountIndex', nextAccountIndex);

        // Store the selected account in session storage
        sessionStorage.setItem('currentAccount', selectedAccount);
      } else {
        setCurrentAccount(selectedAccount);
      }

      if (selectedAccount) {
        const balanceWei = await provider.getBalance(selectedAccount);
        setEthBalance(ethers.utils.formatEther(balanceWei));

        const signer = provider.getSigner(selectedAccount);

        const twoerrInstance = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
        setTwoerrContract(twoerrInstance);

        const twoerrCoinInstance = new ethers.Contract(TWOERRCOIN_CONTRACT_ADDRESS, twoerrCoinABI.abi, signer);
        setTwoerrCoinContract(twoerrCoinInstance);

        const providerInstance = new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer);
        setProviderContract(providerInstance);

        const clientInstance = new ethers.Contract(CLIENT_CONTRACT_ADDRESS, clientABI.abi, signer);
        setClientContract(clientInstance);

        // Reset user information
        setUserInfo({ name: "", contactInfo: "" });
        setIsProvider(false);
        setIsClient(false);

        // Check if the user is a provider
        const providerInfo = await providerInstance.providers(selectedAccount);
        const [providerName, providerContactInfo] = providerInfo;
        const isProviderRegistered = providerName.length > 0;

        // Check if the user is a client
        const clientInfo = await clientInstance.clients(selectedAccount);
        const [clientName, clientContactInfo] = clientInfo;
        const isClientRegistered = clientName.length > 0;

        if (isProviderRegistered) {
          setIsProvider(true);
          setUserInfo({ name: providerName, contactInfo: providerContactInfo });
        } else if (isClientRegistered) {
          setIsClient(true);
          setUserInfo({ name: clientName, contactInfo: clientContactInfo });
        }

        const tokenBalance = await twoerrCoinInstance.balanceOf(selectedAccount);
        setTokenBalance(ethers.utils.formatEther(tokenBalance));
      }
    };

    connectToBlockchain();
  }, [currentAccount]);

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "600px",
      textAlign: "center",
      position: "sticky",
      top: "20px",
      zIndex: 1,
    },
    accountInfo: {
      marginBottom: "20px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "20px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <div style={styles.container}>
                {currentAccount ? (
                  <div style={styles.card}>
                    <div style={styles.accountInfo}>
                      <h2>Account Details</h2>
                      <p><strong>Account:</strong> {currentAccount}</p>
                      <p><strong>Name:</strong> {userInfo.name || "Not registered"}</p>
                      <p><strong>Contact Info:</strong> {userInfo.contactInfo || "Not registered"}</p>
                      <p><strong>Balance:</strong> {ethBalance} ETH</p>
                      <p><strong>TwoerrCoin Balance:</strong> {tokenBalance} TWC</p>
                    </div>
                    <div style={styles.buttonContainer}>
                      {isProvider && (
                        <Link to="/Service">
                          <button
                            style={styles.button}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                          >
                            Create Service
                          </button>
                        </Link>
                      )}
                      <Link to="/Services">
                        <button
                          style={styles.button}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                        >
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
        <Route path="/ClientOrders" element={<ClientOrders currentAccount={currentAccount} />} />
      </Routes>
    </Router>
  );
};

export default App;