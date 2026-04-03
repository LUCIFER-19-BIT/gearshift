import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../utils/authStore';
import blackwal from '../assets/blackwal.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        alert('Login successful');
        // Redirect to home or dashboard
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      backgroundImage: `url(${blackwal})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid #444',
        color: '#fff',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#fff'
        }}>Login</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600'
          }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #555',
              backgroundColor: '#333',
              color: '#fff',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600'
          }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #555',
              backgroundColor: '#333',
              color: '#fff',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ff6b35',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e55a2b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b35'}
        >
          Login
        </button>

        <Link to="/signup" style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '20px',
          color: '#ccc',
          fontSize: '0.9rem',
          textDecoration: 'none'
        }}>
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
};

export default Login;
