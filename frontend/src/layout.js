import React from 'react';
import { Link } from 'react-router-dom'; // Corectat: folosim { Link }

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <div style={{
          backgroundColor: '#00AEE6',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '150px',
        }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              margin: 0,
              zIndex: 1,
              fontSize: '48px',
              position: 'relative',
              top: '-60px',
              color: '#002833',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}>
              Twoerr
            </button>
          </Link>

          <div style={{
            position: 'absolute',
            bottom: '-30px', // Ajustează această valoare pentru a controla curbura
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '100px', // Înălțimea curburii
            backgroundColor: '#FFEFE6',
            borderRadius: '50%',
            clipPath: 'ellipse(50% 100% at 50% 100%)', // Creează curbura în jos
            zIndex: 0,
          }}></div>

          {/* Butonul "Join us" */}
          <Link to="/register"> {/* Corectat: folosim "/register" pentru ruta absolută */}
            <button style={{
              position: 'absolute',
              bottom: '100px',
              right: '20px', 
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
            }}>
              Join us
            </button>
          </Link>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>© 2025 Twoerr</p>
      </footer>
    </div>
  );
};

export default Layout;