import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">GearShift</div>
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
          <a href="#">About GearShift</a>
          <a href="#">Careers</a>
          <a href="#">News & Media</a>
        </div>
      </div>

      <p>&copy; 2023 GearShift. All rights reserved.</p>
      <p className="footer-disclaimer">
        <strong>Important Notice:</strong> GearShift is an independent platform developed for educational purposes. It is not affiliated with, endorsed by, or associated with Tata Motors in any way. Vehicle data, specifications, and model information featured on this platform are based on publicly available information about Tata vehicles. GearShift's design, features, algorithms, and user interface are entirely original and independently built. The platform uses Tata vehicles as its niche focus, but the marketplace itself, branding, and all tools are property of GearShift and are not owned or operated by Tata Motors.
      </p>
    </footer>
  );
}
