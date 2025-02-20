import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import providerABI from "./jsons/Provider.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import { useNavigate } from "react-router-dom";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const PROVIDER_CONTRACT_ADDRESS = addresses.Provider;

const ServicesPage = ({ currentAccount }) => {
  const [services, setServices] = useState([]);
  const [isProvider, setIsProvider] = useState(false); // Check if user is a provider
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicesAndCheckProvider = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        const signer = provider.getSigner();
        const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, provider);
        const providerContract = new ethers.Contract(PROVIDER_CONTRACT_ADDRESS, providerABI.abi, signer);

        // Fetch all services
        const serviceCounter = await twoerrContract.serviceCounter();
        const servicesList = [];

        for (let i = 1; i <= serviceCounter; i++) {
          const service = await twoerrContract.GetService(i);
          servicesList.push({
            id: i,
            title: service[0],
            description: service[1],
            price: ethers.utils.formatEther(service[2]),
            isActive: service[3],
            providerAddress: service[5]
          });
        }

        setServices(servicesList);

        // Check if user is a provider
        if (currentAccount) {
          try {
            const providerInfo = await providerContract.providers(currentAccount);
            setIsProvider(providerInfo[0].length > 0);
          } catch (err) {
            console.warn("User is not a provider.");
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services. Please try again.");
        setLoading(false);
      }
    };

    if (currentAccount) {
      fetchServicesAndCheckProvider();
    }
  }, [currentAccount]);

  // Styles
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      padding: "20px",
    },
    button: {
      backgroundColor: "#ffffff",
      border: "1px solid #cccccc",
      borderRadius: "10px",
      padding: "20px",
      textAlign: "center",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "150px",
    },
    buttonHover: {
      transform: "scale(1.05)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333333",
      marginBottom: "10px",
    },
    price: {
      fontSize: "16px",
      color: "#007bff",
    },
    loading: {
      textAlign: "center",
      fontSize: "18px",
      color: "#555555",
    },
    error: {
      textAlign: "center",
      fontSize: "18px",
      color: "#ff0000",
    },
  };

  return (
      <Layout isProvider={isProvider}>
        <div style={styles.container}>
          <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333333" }}>
            Available Services
          </h1>
          {loading ? (
              <p style={styles.loading}>Loading services...</p>
          ) : error ? (
              <p style={styles.error}>{error}</p>
          ) : (
              <div style={styles.grid}>
                {services.map((service) => (
                    <div
                        key={service.id}
                        style={styles.button}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = styles.buttonHover.transform;
                          e.currentTarget.style.boxShadow = styles.buttonHover.boxShadow;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = styles.button.boxShadow;
                        }}
                        onClick={() => navigate(`/ServiceDetail/${service.id}`)}
                    >
                      <div style={styles.title}>{service.title}</div>
                      <div style={styles.price}>{service.price} ETH</div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </Layout>
  );
};

export default ServicesPage;
