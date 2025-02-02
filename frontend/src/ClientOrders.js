import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import twoerrABI from "./jsons/Twoerr.json";
import addresses from "./jsons/deployedAddresses.json";
import Layout from './layout';
import { useNavigate } from "react-router-dom";

const LOCAL_NODE_URL = "http://127.0.0.1:8545";
const TWOERR_CONTRACT_ADDRESS = addresses.Twoerr;

const OrdersPage = ({currentAccount}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {

      const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
      const signer = provider.getSigner(currentAccount);

      const twoerrContract = new ethers.Contract(TWOERR_CONTRACT_ADDRESS, twoerrABI.abi, signer);
      
      const orderCounter = await twoerrContract.orderCounter();
      const ordersList = [];

      for (let i = 1; i <= orderCounter; i++) {
        const order = await twoerrContract.GetOrder(i);
        const orderDetails = {
          title: order[0],
          price: ethers.utils.formatEther(order[1]),
          isCompleted: order[2],
          id: i, 
        };
        const fullOrder = await twoerrContract.orders(i);
        
        console.log(fullOrder.client);

        console.log(signer._address);
        if (fullOrder.client === signer._address) {
          console.log("asdasdsa");
          ordersList.push(orderDetails);
        }
      }

      setOrders(ordersList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333333" }}>
          My Orders
        </h1>
        
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading orders...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "#ff0000" }}>{error}</p>
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
                onClick={() => navigate(`/ServiceDetail/${order.id}`)}
              >
                <h3 style={styles.title}>{order.title}</h3>
                <p style={styles.price}>{order.price} ETH</p>
                <p style={{
                  ...styles.status,
                  color: order.isCompleted ? "#00cc00" : "#ff9900"
                }}>
                  Status: {order.isCompleted ? "Completed" : "Pending"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;