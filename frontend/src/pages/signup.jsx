import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import blackwal from '../assets/blackwal.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@])/.test(password)) {
      alert('Password must contain at least one letter, one number, and one @ symbol');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:8001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, address }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful');
        // Redirect to login
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error signing up');
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
        }}>Sign Up</h2>

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

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600'
          }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div style={{ marginBottom: '15px' }}>
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

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600'
          }}>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          }}>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
          Submit
        </button>

        <Link to="/login" style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '20px',
          color: '#ccc',
          fontSize: '0.9rem',
          textDecoration: 'none'
        }}>
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
};

export default Signup;
