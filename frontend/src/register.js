import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import Layout from './layout';
import providerABI from "./jsons/Provider.json"; // Import Provider ABI
import addresses from "./jsons/deployedAddresses.json";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider;

const Register = ({ currentAccount }) => {
  const [isProvider, setIsProvider] = useState(false); // Track provider role

  useEffect(() => {
    const checkIfProvider = async () => {
      if (!currentAccount) return;
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        const signer = provider.getSigner();
        const providerContract = new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer);

        const providerInfo = await providerContract.providers(currentAccount);
        setIsProvider(providerInfo && providerInfo[0].length > 0);
      } catch (error) {
        console.error("Error checking provider status:", error);
      }
    };

    checkIfProvider();
  }, [currentAccount]);

  return (
      <Layout isProvider={isProvider}>
        <div style={styles.container}>
          <div style={styles.boxContainer}>
            <div style={{ ...styles.box, ...styles.silverBox }}>
              <h2 style={styles.title}>Client</h2>
              <ul style={styles.list}>
                <li>Choose from a variety of services</li>
                <li>Pay up for it</li>
                <li>Wait for the provider to finish it</li>
              </ul>
              <Link to="/RegisterClient">
                <button style={styles.signUpButton}>Sign Me Up</button>
              </Link>
            </div>
            <div style={{ ...styles.box, ...styles.goldBox }}>
              <h2 style={styles.title}>Provider</h2>
              <ul style={styles.list}>
                <li>Post the thing you are good at</li>
                <li>Wait for clients to request it</li>
                <li>Get the job done</li>
                <li>Get your well-deserved money</li>
              </ul>
              <Link to="/RegisterProvider">
                <button style={styles.signUpButton}>Sign Me Up</button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    backgroundColor: '#f0f0f0',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '80%',
    height: '60%',
  },
  box: {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '45%',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  silverBox: {
    backgroundColor: '#e0e0e0',
    color: '#000',
  },
  goldBox: {
    backgroundColor: '#ffeb3b',
    color: '#000',
  },
  title: {
    marginBottom: '15px',
    fontSize: '48px',
  },
  list: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    textAlign: 'left',
    fontSize: '24px',
  },
  signUpButton: {
    bottom: '20px',
    left: '50%',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '30px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
};

export default Register;
