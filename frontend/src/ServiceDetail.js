import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import clientABI from "./jsons/Client.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from "./layout";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;
const CLIENT_CONTRACT_ADDRESS = addresses.Client;

const ServiceDetail = ({ currentAccount }) => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        const signer = provider.getSigner(currentAccount);

        const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
        const clientContract = new ethers.Contract(CLIENT_CONTRACT_ADDRESS, clientABI.abi, signer);

        const serviceData = await twoerrContract.GetService(id);
        setService({
          id: id,
          title: serviceData[0],
          description: serviceData[1],
          price: ethers.utils.formatEther(serviceData[2]),
          isActive: serviceData[3],
        });

        const clientInfo = await clientContract.clients(currentAccount);
        setIsClient(clientInfo && clientInfo.name.length > 0);
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
    try {
      // Implement purchase logic here
      console.log("Service purchased!");
    } catch (err) {
      console.error("Error purchasing service:", err);
      setError("Failed to purchase service. Please try again.");
    }
  };

  if (loading) return <p>Loading service details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div style={{
        padding: "40px", 
        maxWidth: "1000px", 
        minHeight: "300px", 
        margin: "40px auto", 
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "relative"
      }}>
        <div style={{ width: "75%", paddingRight: "20px" }}> 
          <h1 style={{
            fontSize: "32px", 
            fontWeight: "700",
            marginBottom: "20px",
            color: "#2d2d2d"
          }}>
            {service.title}
          </h1>
          <p style={{
            fontSize: "18px", 
            lineHeight: "1.7", 
            color: "#555",
            marginBottom: "30px" 
          }}>
            {service.description}
          </p>
        </div>

        <div style={{
          position: "absolute",
          right: "40px", 
          top: "40px", 
          textAlign: "right"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <p style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#2d2d2d",
              margin: "0"
            }}>
              {service.price} ETH
            </p>
            <p style={{
              color: service.isActive ? "#4CAF50" : "#f44336",
              margin: "5px 0 0 0"
            }}>
              {service.isActive ? "🟢 Active" : "🔴 Inactive"}
            </p>
          </div>

          {isClient && (
            <button onClick={handlePurchase} style={{
              padding: "12px 25px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "background-color 0.3s",
              ":hover": {
                backgroundColor: "#1976D2"
              }
            }}>
              Purchase Service
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;