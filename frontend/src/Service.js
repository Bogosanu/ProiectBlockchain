import React, { useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;

const ServicePage = ({ currentAccount }) => {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);

      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);

      // Check if the current account is a registered provider
      /*
      const providerInfo = await twoerrContract.providers(currentAccount);
      if (!providerInfo || providerInfo.name.length === 0) {
        setError("You must be a registered provider to create a service.");
        return;
      }*/

      // Call createService with the necessary parameters
      const tx = await twoerrContract.createService(serviceName, serviceDescription, ethers.utils.parseEther(servicePrice));
      await tx.wait();

      setSuccess("Service created successfully!");
      setServiceName("");
      setServiceDescription("");
      setServicePrice("");
    } catch (err) {
      console.error("Error creating service:", err);
      setError("Failed to create service. Please try again.");
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h2>Create Service</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Service Name:</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Service Description:</label>
            <input
              type="text"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Service Price (ETH):</label>
            <input
              type="number"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Create Service
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ServicePage;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "500px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#ff0000",
    marginBottom: "10px",
  },
  success: {
    color: "#28a745",
    marginBottom: "10px",
  },
};