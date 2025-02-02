import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          Twoerr
        </Link>
        <Link to="/register">
          <button style={styles.joinButton}>Join us</button>
        </Link>
        <Link to="/ClientOrders">
          <button style={styles.joinButton}>My Orders</button>
        </Link>
      </header>
      <main style={styles.main}>
        {children}
      </main>
      <footer style={styles.footer}>
        <p>© 2025 Twoerr</p>
      </footer>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#00AEE6',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logo: {
    textDecoration: 'none',
    fontSize: '48px',
    color: '#002833',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  main: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: 'calc(100vh - 200px)',
  },
  footer: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#282c34',
    color: 'white',
  },
};

export default Layout;