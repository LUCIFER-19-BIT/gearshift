import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { API_ENDPOINTS, BACKEND_BASE_URL } from "../utils/apiConfig";
import "../styles/cart.css";

const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const responseText = await response.text();

  if (
    responseText.trim().startsWith("<!DOCTYPE") ||
    responseText.trim().startsWith("<html")
  ) {
    throw new Error(
      `API returned HTML instead of JSON. Make sure backend is running on ${BACKEND_BASE_URL}.`
    );
  }

  if (!responseText.trim()) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error("Received an invalid response from server.");
  }
};

const getApiErrorMessage = (body, fallback) => {
  if (body && typeof body === "object") {
    if (body.error) return body.error;
    if (body.message) return body.message;
  }

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  return fallback;
};

export default function Cart() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemsLoading, setItemsLoading] = useState(true);

  const [formData, setFormData] = useState({
    customerName: user?.username || "",
    contactNumber: "",
    email: user?.email || "",
    homeAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const selectedItem = useMemo(
    () => cartItems.find((item) => item._id === selectedItemId) || null,
    [cartItems, selectedItemId]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCartItems = async () => {
      setItemsLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.cartItems, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await parseApiResponse(response);

        if (!response.ok) {
          throw new Error(getApiErrorMessage(data, "Failed to fetch cart items"));
        }

        const items = data?.items || [];
        setCartItems(items);
        setSelectedItemId((prev) => prev || items[0]?._id || "");
      } catch (err) {
        setError(err.message || "Failed to fetch cart items");
      } finally {
        setItemsLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate, token, user]);

  const removeCartItem = async (itemId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cartItems}/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Failed to remove item"));
      }

      const updatedItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedItems);
      if (selectedItemId === itemId) {
        setSelectedItemId(updatedItems[0]?._id || "");
      }
    } catch (err) {
      setError(err.message || "Failed to remove item from cart");
    }
  };

  if (itemsLoading) {
    return (
      <div className="cart-empty">
        <h2>Loading Cart...</h2>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="cart-empty">
        <h2>🛒 Your Cart is Empty</h2>
        <p>Browse parts and add them to your cart</p>
        <button onClick={() => navigate("/parts")} className="btn-continue">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (
      !formData.customerName ||
      !formData.contactNumber ||
      !formData.email ||
      !formData.homeAddress
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.contactNumber.length < 10) {
      setError("Contact number must be at least 10 digits");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        productId: selectedItem.productId,
        productName: selectedItem.productName,
        productCategory: selectedItem.productCategory,
        productPrice: selectedItem.productPrice,
        productImage: selectedItem.productImage,
        productBrand: selectedItem.productBrand,
        productStock: selectedItem.productStock,
        quantity: selectedItem.quantity,
        customerName: formData.customerName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        homeAddress: formData.homeAddress,
      };

      const response = await fetch(API_ENDPOINTS.cart, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Failed to place order"));
      }

      await removeCartItem(selectedItem._id);

      // Redirect to thank you page with order details
      navigate("/thank", {
        state: {
          order: data.order,
          product: {
            name: selectedItem.productName,
            category: selectedItem.productCategory,
            price: selectedItem.productPrice,
            image: selectedItem.productImage,
          },
        },
      });
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      console.error("Order error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Checkout</h1>
        <p>Complete your order for authentic Tata car parts</p>
      </div>

      <div className="cart-content">
        {/* Product Summary */}
        <div className="product-summary">
          <h2>Cart Items ({cartItems.length})</h2>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-row">
                <div className="cart-item-meta">
                  <p className="cart-item-title">{item.productName}</p>
                  <p className="cart-item-sub">
                    {item.productCategory} • Qty: {item.quantity}
                  </p>
                </div>
                <div className="cart-item-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setSelectedItemId(item._id)}
                  >
                    {selectedItemId === item._id ? "Selected" : "Select"}
                  </button>
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => removeCartItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!selectedItem ? null : (
            <>
              <p className="selected-item-note">Selected item for checkout</p>
          <div className="product-card-summary">
            <div className="product-image-section">
              <div className="product-image-container">
                <img
                  src={selectedItem.productImage}
                  alt={selectedItem.productName}
                  className="product-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200?text=Part+Image";
                  }}
                />
              </div>
            </div>

            <div className="product-info-section">
              <h3 className="product-name">{selectedItem.productName}</h3>

              <div className="product-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{selectedItem.productCategory}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Brand:</span>
                  <span className="detail-value">{selectedItem.productBrand}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stock Available:</span>
                  <span className="detail-value stock-badge">
                    {selectedItem.productStock} units
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{selectedItem.quantity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value price">
                    ₹{selectedItem.productPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="order-total">
                <h3>Order Total</h3>
                <div className="total-amount">
                  ₹{(selectedItem.productPrice * selectedItem.quantity).toLocaleString("en-IN")}
                </div>
                <p className="payment-method">Payment: Cash on Delivery (COD)</p>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Checkout Form */}
        <div className="checkout-form-section">
          <h2>Shipping & Contact Details</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input
                id="customerName"
                type="text"
                name="customerName"
                placeholder="Enter your full name"
                value={formData.customerName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                id="contactNumber"
                type="tel"
                name="contactNumber"
                placeholder="Enter 10-digit phone number"
                value={formData.contactNumber}
                onChange={handleChange}
                className="form-input"
                pattern="\d{10,}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="homeAddress">Home Address *</label>
              <textarea
                id="homeAddress"
                name="homeAddress"
                placeholder="Enter complete home address with street, area, city, and postal code"
                value={formData.homeAddress}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                required
              />
            </div>

            <div className="form-group payment-info">
              <label>Payment Method</label>
              <div className="payment-method-display">
                <span className="badge-cod">💳 Cash on Delivery (COD)</span>
                <p>Pay when you receive the product at your doorstep</p>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/parts")}
                className="btn-cancel"
                disabled={loading}
              >
                Continue Shopping
              </button>
              <button
                type="submit"
                className="btn-place-order"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
