import React, { useState } from "react";
import { ethers } from "ethers";
import conversionABI from "./jsons/PriceConverter.json";
import Layout from "./layout";
import addresses from "./jsons/deployedAddresses.json";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";

const PriceConverter = () => {
  const [amountInUSD, setAmountInUSD] = useState("");
  const [amountInETH, setAmountInETH] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Add error message

  const contractAddress = addresses.Converter;

  const convertFromUSD = async () => {
    try {
      console.log("Connecting to contract...");
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const contract = new ethers.Contract(contractAddress, conversionABI.abi, provider); // No signer needed

      console.log("Fetching conversion rate for USD:", amountInUSD);
      if (!amountInUSD || isNaN(amountInUSD) || Number(amountInUSD) <= 0) {
        setErrorMessage("Invalid USD amount entered");
        return;
      }

      const amount = ethers.BigNumber.from(amountInUSD); // ✅ Convert USD as BigNumber (no decimals)
      console.log("Parsed Amount (USD):", amount.toString());

      const result = await contract.getConversionRateFromUSD(amount);
      console.log("Conversion Result (ETH):", result.toString());

      setConvertedAmount(ethers.utils.formatEther(result)); // ✅ Properly format ETH
      setErrorMessage(""); // Clear errors
    } catch (error) {
      console.error("Error while converting from USD:", error);
      setErrorMessage("Conversion failed. Ensure contract is deployed.");
    }
  };

  const convertToUSD = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const contract = new ethers.Contract(contractAddress, conversionABI.abi, provider); // No signer needed

      console.log("Fetching conversion rate for ETH:", amountInETH);
      if (!amountInETH || isNaN(amountInETH) || Number(amountInETH) <= 0) {
        setErrorMessage("Invalid ETH amount entered");
        return;
      }

      const amount = ethers.utils.parseEther(amountInETH); // ✅ ETH uses 18 decimals
      console.log("Parsed Amount (ETH in Wei):", amount.toString());

      const result = await contract.getConversionRateToUSD(amount);
      console.log("Conversion Result (USD):", result.toString());

      setConvertedAmount(ethers.utils.formatUnits(result, 2)); // ✅ Format to 2 decimals for USD
      setErrorMessage(""); // Clear errors
    } catch (error) {
      console.error("Error while converting to USD:", error);
      setErrorMessage("Conversion failed. Ensure contract is deployed.");
    }
  };

  return (
      <Layout>
        <div style={styles.container}>
          <h1>Price Converter</h1>

          {errorMessage && <p style={styles.error}>{errorMessage}</p>} {/* Show error messages */}

          <div style={styles.inputGroup}>
            <label>Amount in USD:</label>
            <input
                type="number"
                value={amountInUSD}
                onChange={(e) => setAmountInUSD(e.target.value)}
                style={styles.input}
            />
            <button onClick={convertFromUSD} style={styles.button}>
              Convert to ETH
            </button>
          </div>

          <div style={styles.inputGroup}>
            <label>Amount in ETH:</label>
            <input
                type="number"
                value={amountInETH}
                onChange={(e) => setAmountInETH(e.target.value)}
                style={styles.input}
            />
            <button onClick={convertToUSD} style={styles.button}>
              Convert to USD
            </button>
          </div>

          {convertedAmount && (
              <div style={styles.result}>
                <h2>Converted Amount: {convertedAmount}</h2>
              </div>
          )}
        </div>
      </Layout>
  );
};

// CSS Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    padding: "8px",
    marginLeft: "10px",
    marginRight: "10px",
    width: "200px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default PriceConverter;
