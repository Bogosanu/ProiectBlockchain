import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import clientABI from "./jsons/Client.json";
import providerABI from "./jsons/Provider.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import { useNavigate } from "react-router-dom";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const CLIENT_CONTRACT_ADDRESS = addresses.Client;
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider;

const RegisterClient = ({ currentAccount }) => {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isProvider, setIsProvider] = useState(false); // Track provider role
  const navigate = useNavigate();

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);
      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
      const clientContractAddress = await twoerrContract.clientContract();
      const clientContract = new ethers.Contract(clientContractAddress, clientABI.abi, signer);

      const providerInfo = await new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer)
          .providers(await signer.getAddress());
      if (providerInfo[0].length > 0) {
        setError("You are already registered as a provider.");
        return;
      }

      // Register client using Client contract
      const tx = await clientContract.registerClient(name, contactInfo);
      await tx.wait();

      setSuccess("Client registered successfully!");
      setName("");
      setContactInfo("");
      setTimeout(() => {
        navigate("/"); // Redirect to main page
      }, 2000);
    } catch (err) {
      console.error("Error registering client:", err);
      setError("Failed to register client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Layout isProvider={isProvider}>
        <div style={styles.container}>
          <div style={styles.box}>
            <h2 style={styles.title}>Register Client</h2>
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

// Styles
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

export default RegisterClient;
