import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from '../utils/authStore';
import logoImage from '../assets/gearshift-logo.png';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/about" className="btn-outline about-btn" onClick={() => setIsMenuOpen(false)}>
          About Us
        </Link>
      </div>

      <div className="logo">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <img src={logoImage} alt="GearShift Logo" className="logo-img" />
        </Link>
      </div>

      <div className="user-menu">
        <button
          type="button"
          className="burger-btn"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          &#9776;
        </button>
        {isMenuOpen ? (
          <div className="burger-dropdown">
            <Link to="/suvs" onClick={() => setIsMenuOpen(false)}>SUVs</Link>
            <Link to="/esuv" onClick={() => setIsMenuOpen(false)}>eSUVs</Link>
            <Link to="/recommendation" onClick={() => setIsMenuOpen(false)}>
              Recommendation
            </Link>
            <Link to="/carcircle" onClick={() => setIsMenuOpen(false)}>CarCircle</Link>
            <Link to="/parts" onClick={() => setIsMenuOpen(false)}>Authentic Parts</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
            <Link to="/autospace" onClick={() => setIsMenuOpen(false)}>AutoSpace</Link>
            <Link to="/bookings" onClick={() => setIsMenuOpen(false)}>Bookings</Link>
            <Link to="/testdrive" onClick={() => setIsMenuOpen(false)}>Test Drive</Link>
          </div>
        ) : null}
        {user ? (
          <>
            <button onClick={logout} className="btn-outline">LOGOUT</button>
          </>
        ) : (
          <Link to="/login" className="btn-outline">LOGIN</Link>
        )}
      </div>
    </header>
  );
}
