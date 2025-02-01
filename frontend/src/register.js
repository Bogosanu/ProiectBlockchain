import React from 'react';
import Layout from './layout'; 

const Register = () => {
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.boxContainer}>
          <div style={{ ...styles.box, ...styles.silverBox }}>
            <h2 style={styles.title}>Client</h2>
            <ul style={styles.list}>
              <li>Choose from a variety of services</li>
              <li>Pay up for it</li>
              <li>Wait for the provider to finish it</li>
              <li>Leave a review</li>
            </ul>
            <button style={styles.signUpButton}>Sign Me Up</button>
          </div>
          <div style={{ ...styles.box, ...styles.goldBox }}>
            <h2 style={styles.title}>Provider</h2>
            <ul style={styles.list}>
              <li>Post the thing you are good at</li>
              <li>Wait for clients to request it</li>
              <li>Get the job done</li>
              <li>Get your well deserved money</li>
              <li>Get reviews on your work</li>
            </ul>
            <button style={styles.signUpButton}>Sign Me Up</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    backgroundColor: '#f0f0f0',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '80%',
    height: '60%',
  },
  box: {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '45%',
    textAlign: 'center',
  },
  silverBox: {
    backgroundColor: '#c0c0c0',
    color: '#000',
  },
  goldBox: {
    backgroundColor: '#ffd700',
    color: '#000',
  },
  title: {
    marginBottom: '15px',
    fontSize: '48px',
  },
  list: {
    listStyleType: 'disc', // Adaugă puncte (•) în loc de cercuri goale
    paddingLeft: '20px',   // Aliniază textul listei
    textAlign: 'left',
    fontSize: '24px',     // Asigură-te că textul este aliniat la stânga
  },
  signUpButton: { // Poziționează butonul absolut în interiorul boxului
    bottom: '20px',       // Distanța de la partea de jos a boxului
    left: '50%',          // Centrează butonul pe orizontală
    backgroundColor: '#4CAF50', // Culoare de fundal verde
    color: 'white',       // Culoare text alb
    padding: '15px 30px', // Padding pentru buton
    border: 'none',       // Elimină bordura implicită
    borderRadius: '5px',  // Rotunjeste colțurile
    fontSize: '30px',     // Mărimea textului
    cursor: 'pointer',    // Cursor pointer la hover
  },
};

export default Register;