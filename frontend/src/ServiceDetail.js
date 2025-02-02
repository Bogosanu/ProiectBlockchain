import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import clientABI from "./jsons/Client.json";
import providerABI from "./jsons/Provider.json";
import twoerrCoinABI from "./jsons/TwoerrCoin.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from "./layout";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const CLIENT_CONTRACT_ADDRESS = addresses.Client;
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider;
const TWOERRCOIN_CONTRACT_ADDRESS = addresses.TwoerrCoin;

const ServiceDetail = ({ currentAccount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isProvider, setIsProvider] = useState(false); // General provider role
  const [isOwningProvider, setIsOwningProvider] = useState(false); // Is this provider the owner of this service?
  const [providerInfo, setProviderInfo] = useState({ name: "", contactInfo: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useTokens, setUseTokens] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!currentAccount) return;

    const fetchServiceDetails = async () => {
      try {
        console.log("Current Account:", currentAccount);
        console.log("Service ID:", id);

        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        const signer = provider.getSigner();
        const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
        const clientContract = new ethers.Contract(CLIENT_CONTRACT_ADDRESS, clientABI.abi, signer);
        const providerContract = new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer);

        // Fetch service details
        const serviceData = await twoerrContract.GetService(id);
        const providerAddress = serviceData[5];

        setService({
          id: id,
          title: serviceData[0],
          description: serviceData[1],
          price: ethers.utils.formatEther(serviceData[2]),
          isActive: serviceData[3],
          providerAddress: providerAddress,
        });

        // Fetch provider details
        if (providerAddress !== ethers.constants.AddressZero) {
          const providerDetails = await providerContract.providers(providerAddress);
          if (providerDetails[0].length > 0) {
            setProviderInfo({
              name: providerDetails[0],
              contactInfo: providerDetails[1],
            });
          }
        }

        // Check if user is a client
        const clientInfo = await clientContract.clients(currentAccount);
        setIsClient(clientInfo && clientInfo[0].length > 0);

        // Check if user is a provider (general)
        const providerInfo = await providerContract.providers(currentAccount);
        setIsProvider(providerInfo && providerInfo[0].length > 0);

        // Check if user is the **specific provider** for this service
        setIsOwningProvider(providerAddress === currentAccount);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to fetch service details. Please try again.");
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [currentAccount, id]);

  const handlePurchase = async () => {
    if (!service || !currentAccount) {
      setError("Service or account not found!");
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);
      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
      const tokenContract = new ethers.Contract(TWOERRCOIN_CONTRACT_ADDRESS, twoerrCoinABI.abi, signer);

      const priceInWei = ethers.utils.parseEther(service.price);

      let tx;

      if (useTokens) {
        const approveTx = await tokenContract.approve(TWOERR_CONTRACT_ADDRESS, priceInWei);
        await approveTx.wait();
        tx = await twoerrContract.placeOrder(service.id, true);
      } else {
        tx = await twoerrContract.placeOrder(service.id, false, { value: priceInWei });
      }

      await tx.wait();
      setSuccess("Service purchased successfully!");

      // Redirect user to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error purchasing service:", err);
      setError("Failed to purchase service. Please try again.");
    }
  };

  const toggleServiceStatus = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);
      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);

      const tx = await twoerrContract.toggleServiceStatus(service.id);
      await tx.wait();

      setService(prevService => ({
        ...prevService,
        isActive: !prevService.isActive,
      }));

      setSuccess(`Service is now ${!service.isActive ? "active" : "inactive"}.`);
    } catch (err) {
      console.error("Error toggling service status:", err);
      setError("Failed to toggle service status. Please try again.");
    }
  };

  if (loading) return <p>Loading service details...</p>;
  if (error) return <p>{error}</p>;

  return (
      <Layout isProvider={isProvider}> {/* ✅ Pass isProvider to Layout */}
        <div style={styles.container}>
          <div style={styles.leftSection}>
            <h1 style={styles.title}>{service.title}</h1>
            <p style={styles.description}>{service.description}</p>

            {/* Display Provider Details */}
            <div style={styles.providerBox}>
              <h3>Provider Information</h3>
              <p><strong>Name:</strong> {providerInfo.name || "Not available"}</p>
              <p><strong>Contact Info:</strong> {providerInfo.contactInfo || "Not available"}</p>
            </div>
          </div>

          <div style={styles.rightSection}>
            <div style={styles.priceBox}>
              <p style={styles.price}>{service.price} ETH</p>
              <p style={{ color: service.isActive ? "#4CAF50" : "#f44336" }}>
                {service.isActive ? "🟢 Active" : "🔴 Inactive"}
              </p>
            </div>

            {/* Toggle Button for Owning Providers */}
            {isOwningProvider && (
                <button onClick={toggleServiceStatus} style={styles.toggleButton}>
                  {service.isActive ? "Deactivate Service" : "Activate Service"}
                </button>
            )}

            {/* Payment Options (Visible to Clients Only) */}
            {isClient && service.isActive && (
                <div style={styles.paymentBox}>
                  <h3>Select Payment Method</h3>
                  <label style={styles.radioOption}>
                    <input type="radio" name="paymentMethod" value="ETH" checked={!useTokens} onChange={() => setUseTokens(false)} />
                    Pay with ETH
                  </label>
                  <label style={styles.radioOption}>
                    <input type="radio" name="paymentMethod" value="Tokens" checked={useTokens} onChange={() => setUseTokens(true)} />
                    Pay with Tokens
                  </label>
                </div>
            )}

            {isClient && service.isActive && (
                <button onClick={handlePurchase} style={styles.purchaseButton}>
                  Purchase Service
                </button>
            )}

            {success && <p style={{ color: "green" }}>{success}</p>}
          </div>
        </div>
      </Layout>
  );
};

export default ServiceDetail;


// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "40px",
    maxWidth: "1000px",
    margin: "40px auto",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  leftSection: {
    width: "60%",
    paddingRight: "20px",
  },
  rightSection: {
    width: "35%",
    textAlign: "right",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#2d2d2d",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#555",
    marginBottom: "30px",
  },
  providerBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  priceBox: {
    marginBottom: "20px",
  },
  price: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2d2d2d",
  },
  paymentBox: {
    marginBottom: "20px",
    textAlign: "left",
  },
  radioOption: {
    display: "block",
    marginBottom: "10px",
  },
  purchaseButton: {
    padding: "12px 25px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },
  toggleButton: {
    padding: "12px 25px",
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "20px",
  },
};
