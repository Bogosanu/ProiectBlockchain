import React, { useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json"; 
import providerABI from "./jsons/Provider.json"; 
import clientABI from "./jsons/Client.json"; // Import client ABI
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import { useNavigate } from "react-router-dom";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr; // Adresa contractului Twoerr
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider;
const CLIENT_CONTRACT_ADDRESS = addresses.Client;

const RegisterProvider = ({ currentAccount }) => {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);

      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);

      const providerContractAddress = await twoerrContract.providerContract();

      const providerContract = new ethers.Contract(providerContractAddress, providerABI.abi, signer);
      const clientContract = new ethers.Contract(CLIENT_CONTRACT_ADDRESS, clientABI.abi, signer);

      // Check if already registered as a client
      const clientInfo = await clientContract.clients(await signer.getAddress());
      if (clientInfo[0].length > 0) {
        setError("You are already registered as a client.");
        return;
      }

      const tx = await providerContract.registerProvider(name, contactInfo);
      await tx.wait();

      setSuccess("Provider registered successfully!");
      setName("");
      setContactInfo("");
      
      setTimeout(() => {
        navigate("/"); 
      }, 2000); 

    } catch (err) {
      console.error("Error registering provider:", err);
      setError("Failed to register provider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.title}>Register Provider</h2>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Contact Info:</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterProvider;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "5rem",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  box: {
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333333",
    fontSize: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#555555",
    fontSize: "0.9rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "10px",
    border: "1px solid #cccccc",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "100%",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.2s",
    marginTop: "1rem",
  },
  error: {
    color: "#ff0000",
    textAlign: "center",
    marginBottom: "1rem",
  },
  success: {
    color: "#28a745",
    textAlign: "center",
    marginBottom: "1rem",
  },
};