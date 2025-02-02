import React, { useState } from 'react';
import { ethers } from 'ethers';
import conversionABI from "./jsons/PriceConverter.json";
import Layout from './layout';
import addresses from "./jsons/deployedAddresses.json";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";

const PriceConverter = () => {
  const [amountInUSD, setAmountInUSD] = useState('');
  const [amountInETH, setAmountInETH] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);

  const contractAddress = addresses.Converter;

  const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, conversionABI.abi, signer); // Folosește conversionABI.abi

  const convertFromUSD = async () => {
    try {
      const amount = ethers.utils.parseUnits(amountInUSD.toString(), 18);
      console.log(amount);
      const result = await contract.getConversionRateFromUSD(200);
      setConvertedAmount(ethers.utils.formatEther(result));
    } catch (error) {
      console.error('Error while converting from USD:', error);
    }
  };
  
  const convertToUSD = async () => {
    try {
      const amount = ethers.utils.parseEther(amountInETH); 
      const result = await contract.getConversionRateToUSD(amount);
      setConvertedAmount(ethers.utils.formatUnits(result, 6)); 
    } catch (error) {
      console.error('Error while converting to USD:', error);
    }
  };
  

  return (
    <Layout>
      <div style={styles.container}>
        <h1>Price Converter</h1>
        <div style={styles.inputGroup}>
          <label>Amount in USD:</label>
          <input
            type="text"
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
            type="text"
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

// Stilurile în același fișier
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '8px',
    marginLeft: '10px',
    marginRight: '10px',
    width: '200px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  result: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
};

export default PriceConverter;