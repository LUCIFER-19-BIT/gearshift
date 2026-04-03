import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/thank.css";

export default function Thank() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const orderData = location.state?.order;
    const productData = location.state?.product;

    if (!orderData || !productData) {
      navigate("/parts");
      return;
    }

    setOrder(orderData);
    setProduct(productData);
  }, [location.state, navigate]);

  if (!order || !product) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  return (
    <div className="thank-container">
      <div className="thank-content">
        {/* Success Animation/Icon */}
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>

        {/* Main Message */}
        <div className="thank-message">
          <h1>Thank You for Your Order! 🎉</h1>
          <p className="subtitle">
            Your order has been placed successfully and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="order-details-card">
          <h2>Order Details</h2>

          <div className="details-grid">
            <div className="detail-section">
              <h3>Order Information</h3>
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span className="value">{order._id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Order Date:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Product Information</h3>
              <div className="detail-row">
                <span className="label">Product Name:</span>
                <span className="value">{product.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Category:</span>
                <span className="value">{product.category}</span>
              </div>
              <div className="detail-row">
                <span className="label">Price:</span>
                <span className="value">₹{product.price.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Shipping Details</h3>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{order.customerName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Contact:</span>
                <span className="value">{order.contactNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{order.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Address:</span>
                <span className="value">{order.homeAddress}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Payment & Delivery</h3>
              <div className="detail-row">
                <span className="label">Payment Method:</span>
                <span className="value badge-cod">💳 Cash on Delivery</span>
              </div>
              <div className="detail-row">
                <span className="label">Expected Delivery:</span>
                <span className="value">5-7 Business Days</span>
              </div>
              <div className="info-box">
                <p>
                  <strong>Note:</strong> You will receive a confirmation email
                  and an SMS with tracking details once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Summary Card */}
        <div className="product-summary-card">
          <div className="product-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200?text=Part+Image";
              }}
            />
          </div>
          <div className="product-summary-info">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <div className="product-price">
              ₹{product.price.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate("/parts")}
            className="btn-continue-shop"
          >
            Continue Shopping 🛍️
          </button>
          <button onClick={() => navigate("/")} className="btn-home">
            Back to Home
          </button>
        </div>

        {/* Contact Support */}
        <div className="support-section">
          <h3>Need Help?</h3>
          <p>
            If you have any questions about your order, please contact our support team:
          </p>
          <div className="support-info">
            <p>📧 Email: support@tatacars.com</p>
            <p>📱 Phone: 1-800-TATA-CAR (1-800-828-2227)</p>
            <p>⏰ Available: Monday - Friday, 9 AM - 6 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
