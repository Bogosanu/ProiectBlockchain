import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;

const ProviderOrders = ({ currentAccount }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProviderOrders = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
        const signer = provider.getSigner(currentAccount);
        const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);

        const orderCount = await twoerrContract.orderCounter();
        const providerOrders = [];

        for (let i = 1; i <= orderCount; i++) {
          const order = await twoerrContract.GetOrder(i);
          const fullOrder = await twoerrContract.orders(i);

          if (fullOrder.provider === currentAccount) {
            providerOrders.push({
              title: order[0],
              price: ethers.utils.formatEther(order[1]),
              isCompleted: order[2],
              id: i,
            });
          }
        }

        setOrders(providerOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching provider orders:", err);
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    if (currentAccount) {
      fetchProviderOrders();
    }
  }, [currentAccount]);

  const handleCompleteOrder = async (orderId) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);
      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);

      const tx = await twoerrContract.completeOrder(orderId);
      await tx.wait();

      // Update the order status in the frontend
      setOrders(orders.map(order =>
          order.id === orderId ? { ...order, isCompleted: true } : order
      ));

      setSuccess(`Order ${orderId} marked as completed.`);
    } catch (err) {
      console.error("Error completing order:", err);
      setError("Failed to complete the order. Please try again.");
    }
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      padding: "20px",
    },
    orderCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #cccccc",
      borderRadius: "10px",
      padding: "20px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
    status: {
      fontWeight: "bold",
      marginTop: "10px",
    },
    button: {
      backgroundColor: "#28a745",
      color: "#ffffff",
      padding: "8px 12px",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background-color 0.3s ease",
    },
    buttonDisabled: {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
    },
  };

  return (
      <Layout>
        <div style={styles.container}>
          <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333333" }}>
            My Orders (Provider)
          </h1>

          {success && <p style={{ textAlign: "center", color: "green" }}>{success}</p>}
          {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

          {loading ? (
              <p style={{ textAlign: "center" }}>Loading orders...</p>
          ) : orders.length === 0 ? (
              <p style={{ textAlign: "center" }}>No orders found.</p>
          ) : (
              <div style={styles.grid}>
                {orders.map(order => (
                    <div
                        key={order.id}
                        style={{
                          ...styles.orderCard,
                          borderColor: order.isCompleted ? "#00cc00" : "#cccccc"
                        }}
                    >
                      <h3 style={styles.title}>{order.title}</h3>
                      <p style={styles.price}>{order.price} ETH</p>
                      <p style={{
                        ...styles.status,
                        color: order.isCompleted ? "#00cc00" : "#ff9900"
                      }}>
                        Status: {order.isCompleted ? "Completed" : "Pending"}
                      </p>
                      {!order.isCompleted && (
                          <button
                              style={styles.button}
                              onClick={() => handleCompleteOrder(order.id)}
                          >
                            Mark as Completed
                          </button>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </Layout>
  );
};

export default ProviderOrders;
