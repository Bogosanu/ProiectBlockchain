import React, { useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json"; 
import providerABI from "./jsons/Provider.json"; 
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import { useNavigate } from "react-router-dom";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr; // Adresa contractului Twoerr

const CreateService = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState(""); // Stare pentru mesaje de eroare
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price) {
      setError("All fields are required.");
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner();

      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);

      const providerContractAddress = await twoerrContract.providerContract();
      const providerContract = new ethers.Contract(providerContractAddress, providerABI.abi, signer);

      const isProvider = await providerContract.providers(signer.getAddress());
      if (!isProvider) {
        setError("Only registered providers can create services.");
        return;
      }

      const tx = await twoerrContract.createService(title, description, ethers.utils.parseEther(price));
      await tx.wait();

      setError("Service created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/"); 
      }, 2000);

    } catch (err) {
      console.error("Error creating service:", err);
      setError("Failed to create service. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5", // Fundal gri deschis
      padding: "20px",
    },
    box: {
      backgroundColor: "#ffffff", // Fundal alb
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Umbra
      width: "100%",
      maxWidth: "500px",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      color: "#333333",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#555555",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #cccccc",
      borderRadius: "5px",
      fontSize: "16px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      border: "1px solid #cccccc",
      borderRadius: "5px",
      fontSize: "16px",
      resize: "vertical", 
      minHeight: "100px",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff", 
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3", 
    },
    error: {
      color: "#ff0000", // Culoare roșie pentru mesajele de eroare
      textAlign: "center",
      marginBottom: "20px",
    },
    success: {
      color: "#008000", // Culoare verde pentru mesajele de succes
      textAlign: "center",
      marginBottom: "20px",
    },
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Create Your Service</h1>
        <div style={styles.box}>
          {/* Afișează mesajul de eroare sau succes */}
          {error && (
            <p style={error.includes("successfully") ? styles.success : styles.error}>
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="title" style={styles.label}>
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter service title"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter service description"
                style={styles.textarea}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="price" style={styles.label}>
                Price (in ETH)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter service price"
                style={styles.input}
                min="0"
                step="0.01"
                required
              />
            </div>
            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            >
              Post Service
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateService;