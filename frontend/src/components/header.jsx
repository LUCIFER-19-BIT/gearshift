import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from '../utils/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          TATA
          <span className="rise">Desh Ka Loha</span>
        </Link>
      </div>

      <div className="user-menu">
        <Link
          to={user ? "/bookings" : "/login"}
          className="user-icon"
          aria-label="User account"
        >
          &#128100;
        </Link>
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
            <span>Welcome, {user.username}</span>
            <button onClick={logout} className="btn-outline">LOGOUT</button>
          </>
        ) : (
          <Link to="/login" className="btn-outline">LOGIN</Link>
        )}
      </div>
    </header>
  );
}
