import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import conversionABI from "./jsons/PriceConverter.json";
import providerABI from "./jsons/Provider.json"; // Import Provider ABI
import Layout from "./layout";
import addresses from "./jsons/deployedAddresses.json";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";

const PriceConverter = ({ currentAccount }) => {
  const [amountInUSD, setAmountInUSD] = useState("");
  const [amountInETH, setAmountInETH] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProvider, setIsProvider] = useState(false); // Track provider role

  const contractAddress = addresses.Converter;
  const providerContractAddress = addresses.Provider;

  useEffect(() => {
    const checkIfProvider = async () => {
      if (!currentAccount) return;
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        const signer = provider.getSigner();
        const providerContract = new ethers.Contract(providerContractAddress, providerABI.abi, signer);

        const providerInfo = await providerContract.providers(currentAccount);
        setIsProvider(providerInfo && providerInfo[0].length > 0);
      } catch (error) {
        console.error("Error checking provider status:", error);
      }
    };

    checkIfProvider();
  }, [currentAccount]);

  const convertFromUSD = async () => {
    setErrorMessage("");
    setConvertedAmount(null);
    setLoading(true);

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const contract = new ethers.Contract(contractAddress, conversionABI.abi, provider);

      if (!amountInUSD || isNaN(parseFloat(amountInUSD)) || parseFloat(amountInUSD) <= 0) {
        throw new Error("Invalid USD amount entered. Enter a valid number.");
      }

      const amount = ethers.utils.parseUnits(amountInUSD, 8);
      const result = await contract.getConversionRateFromUSD(amount);
      setConvertedAmount(ethers.utils.formatUnits(result, 8));
    } catch (error) {
      console.error("Error while converting from USD:", error);
      setErrorMessage(error.message || "Conversion failed. Ensure contract is deployed.");
    } finally {
      setLoading(false);
    }
  };

  const convertToUSD = async () => {
    setErrorMessage("");
    setConvertedAmount(null);
    setLoading(true);

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const contract = new ethers.Contract(contractAddress, conversionABI.abi, provider);

      if (!amountInETH || isNaN(parseFloat(amountInETH)) || parseFloat(amountInETH) <= 0) {
        throw new Error("Invalid ETH amount entered. Enter a valid number.");
      }

      const amount = ethers.utils.parseEther(amountInETH);
      const result = await contract.getConversionRateToUSD(amount);
      setConvertedAmount(ethers.utils.formatUnits(result, 18));
    } catch (error) {
      console.error("Error while converting to USD:", error);
      setErrorMessage(error.message || "Conversion failed. Ensure contract is deployed.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Layout isProvider={isProvider}>
        <div style={styles.container}>
          <h1>Price Converter</h1>

          {errorMessage && <p style={styles.error}>{errorMessage}</p>}

          <div style={styles.inputGroup}>
            <label>Amount in USD:</label>
            <input
                type="number"
                value={amountInUSD}
                onChange={(e) => setAmountInUSD(e.target.value)}
                style={styles.input}
                min="0"
            />
            <button onClick={convertFromUSD} style={styles.button} disabled={loading}>
              {loading ? "Converting..." : "Convert to ETH"}
            </button>
          </div>

          <div style={styles.inputGroup}>
            <label>Amount in ETH:</label>
            <input
                type="number"
                value={amountInETH}
                onChange={(e) => setAmountInETH(e.target.value)}
                style={styles.input}
                min="0"
            />
            <button onClick={convertToUSD} style={styles.button} disabled={loading}>
              {loading ? "Converting..." : "Convert to USD"}
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
