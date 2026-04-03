import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">TATA</div>
        <a href="tel:1800-XXX-XXXX" className="footer-phone">Call: 1800-XXX-XXXX</a>
        <div className="social-links">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="YouTube">📺</a>
        </div>
      </div>

      <div className="footer-links">
        <div>
          <h4>Products</h4>
          <a href="#">SUVs</a>
          <a href="#">eSUVs</a>
          <a href="#">Commercial Vehicles</a>
        </div>
        <div>
          <h4>Services</h4>
          <a href="#">Book a Test Drive</a>
          <a href="#">Book Online</a>
          <a href="#">Find a Dealer</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
          <a href="#">Warranty</a>
        </div>
        <div>
          <h4>About</h4>
          <a href="#">About Tata Motors</a>
          <a href="#">Careers</a>
          <a href="#">News & Media</a>
        </div>
      </div>

      <p>&copy; 2023 Tata Motors. All rights reserved.</p>
    </footer>
  );
}
