import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import "../styles/autospace.css";

const ORDERS_API_BASE_URL = "http://localhost:8001/api/cart";

const AutoSpace = () => {
    const navigate = useNavigate();
    const { user, bookings, fetchBookings, testDrives, fetchTestDrives } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const token = localStorage.getItem("token");

    const carDisplayMap = {
        harrier: "Harrier",
        nexon: "Nexon",
        safari: "Safari",
        curve: "Curvv",
        altroz: "Altroz",
        tiago: "Tiago",
        punch: "Punch",
        tigor: "Tigor",
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            setLoading(true);
            setError("");
            try {
                // Fetch all user data
                await fetchBookings();
                await fetchTestDrives();

                // Fetch orders
                const response = await fetch(ORDERS_API_BASE_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                } else {
                    console.log("No orders found or unable to fetch");
                    setOrders([]);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load your data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, token, navigate, fetchBookings, fetchTestDrives]);

    const getDealershipName = (dealership) => {
        if (!dealership) return "";
        if (typeof dealership === "string") {
            try {
                return JSON.parse(dealership).name;
            } catch (error) {
                return dealership;
            }
        }
        return dealership.name || "";
    };

    const getTotalStats = () => {
        return {
            bookedCars: bookings?.length || 0,
            testDrives: testDrives?.length || 0,
            orderedParts: orders?.length || 0,
            totalValue: (bookings || []).reduce((sum, b) => sum + (parseInt(b.price) || 0), 0),
        };
    };

    const stats = getTotalStats();

    if (loading) {
        return (
            <div className="autospace-container loading">
                <div className="loader">
                    <p>Loading your AutoSpace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="autospace-container">
            {/* Header */}
            <div className="autospace-header">
                <h1>🚗 AutoSpace</h1>
                <p>Your personalized automotive dashboard</p>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🚙</div>
                    <div className="stat-content">
                        <h3>{stats.bookedCars}</h3>
                        <p>Booked Cars</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏁</div>
                    <div className="stat-content">
                        <h3>{stats.testDrives}</h3>
                        <p>Test Drives</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <h3>{stats.orderedParts}</h3>
                        <p>Ordered Parts</p>
                    </div>
                </div>
                <div className="stat-card highlight">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>₹{(stats.totalValue / 100000).toFixed(1)}L</h3>
                        <p>Investment Value</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === "cars" ? "active" : ""}`}
                    onClick={() => setActiveTab("cars")}
                >
                    Booked Cars
                </button>
                <button
                    className={`tab-btn ${activeTab === "drives" ? "active" : ""}`}
                    onClick={() => setActiveTab("drives")}
                >
                    Test Drives
                </button>
                <button
                    className={`tab-btn ${activeTab === "parts" ? "active" : ""}`}
                    onClick={() => setActiveTab("parts")}
                >
                    Ordered Parts
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-banner">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="tab-content overview-tab">
                    <div className="overview-grid">
                        {/* Booked Cars Section */}
                        <section className="overview-section">
                            <h2>📋 Booked Cars</h2>
                            {bookings && bookings.length > 0 ? (
                                <div className="mini-list">
                                    {bookings.slice(0, 3).map((booking) => (
                                        <div key={booking._id} className="mini-card">
                                            <div className="mini-card-header">
                                                <strong>{booking.model} - {booking.variant}</strong>
                                                <span className="price-badge">₹{booking.price}</span>
                                            </div>
                                            <p><span className="label">Color:</span> {booking.color}</p>
                                            {booking.dealership && (
                                                <p><span className="label">Dealership:</span> {getDealershipName(booking.dealership)}</p>
                                            )}
                                        </div>
                                    ))}
                                    {bookings.length > 3 && (
                                        <p className="view-more" onClick={() => setActiveTab("cars")}>
                                            View all {bookings.length} bookings →
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="empty-state">No booked cars yet. Start exploring models!</p>
                            )}
                        </section>

                        {/* Test Drives Section */}
                        <section className="overview-section">
                            <h2>🏁 Test Drives</h2>
                            {testDrives && testDrives.length > 0 ? (
                                <div className="mini-list">
                                    {testDrives.slice(0, 3).map((td) => (
                                        <div key={td._id} className="mini-card">
                                            <div className="mini-card-header">
                                                <strong>{td.firstName} {td.lastName}</strong>
                                                <span className="date-badge">
                                                    {new Date(td.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p><span className="label">Model:</span> {td.model}</p>
                                            <p><span className="label">Location:</span> {td.pincode}</p>
                                        </div>
                                    ))}
                                    {testDrives.length > 3 && (
                                        <p className="view-more" onClick={() => setActiveTab("drives")}>
                                            View all {testDrives.length} drives →
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="empty-state">No test drives scheduled yet. Book one today!</p>
                            )}
                        </section>

                        {/* Ordered Parts Section */}
                        <section className="overview-section">
                            <h2>📦 Ordered Parts</h2>
                            {orders && orders.length > 0 ? (
                                <div className="mini-list">
                                    {orders.slice(0, 3).map((order) => (
                                        <div key={order._id} className="mini-card">
                                            <div className="mini-card-header">
                                                <strong>{order.productName}</strong>
                                                <span className="price-badge">₹{order.productPrice}</span>
                                            </div>
                                            <p><span className="label">Category:</span> {order.productCategory}</p>
                                            <p><span className="label">Brand:</span> {order.productBrand}</p>
                                            <p className="qty">Qty: {order.quantity}</p>
                                        </div>
                                    ))}
                                    {orders.length > 3 && (
                                        <p className="view-more" onClick={() => setActiveTab("parts")}>
                                            View all {orders.length} orders →
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="empty-state">No parts ordered yet. Browse the parts section!</p>
                            )}
                        </section>
                    </div>
                </div>
            )}

            {/* Booked Cars Tab */}
            {activeTab === "cars" && (
                <div className="tab-content cars-tab">
                    <h2>🚙 Your Booked Cars</h2>
                    {bookings && bookings.length > 0 ? (
                        <div className="full-list">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="full-card">
                                    <div className="card-header">
                                        <h3>{booking.model} <span className="variant">{booking.variant}</span></h3>
                                        <span className="price-large">₹{booking.price}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="detail-row">
                                            <span className="label">Color:</span>
                                            <span className="value">{booking.color}</span>
                                        </div>
                                        {booking.dealership && (
                                            <div className="detail-row">
                                                <span className="label">Dealership:</span>
                                                <span className="value">{getDealershipName(booking.dealership)}</span>
                                            </div>
                                        )}
                                        {booking.fuel && (
                                            <div className="detail-row">
                                                <span className="label">Fuel Type:</span>
                                                <span className="value">{booking.fuel}</span>
                                            </div>
                                        )}
                                        <div className="detail-row">
                                            <span className="label">Booking Date:</span>
                                            <span className="value">{new Date(booking.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-section">
                            <h3>No Booked Cars Yet</h3>
                            <p>Explore our collection and book your dream Tata vehicle!</p>
                            <button className="btn-primary" onClick={() => navigate("/suvs")}>
                                Browse Cars
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Test Drives Tab */}
            {activeTab === "drives" && (
                <div className="tab-content drives-tab">
                    <h2>🏁 Your Test Drive Slots</h2>
                    {testDrives && testDrives.length > 0 ? (
                        <div className="full-list">
                            {testDrives.map((td) => (
                                <div key={td._id} className="full-card">
                                    <div className="card-header">
                                        <h3>{td.firstName} {td.lastName}</h3>
                                        <span className="date-large">
                                            {new Date(td.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <div className="detail-row">
                                            <span className="label">Email:</span>
                                            <span className="value">{td.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Phone:</span>
                                            <span className="value">+91 {td.mobile}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Car Model:</span>
                                            <span className="value">{carDisplayMap[td.model] || td.model}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Variant:</span>
                                            <span className="value">{td.variant || "Not specified"}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Location (Pincode):</span>
                                            <span className="value">{td.pincode}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-section">
                            <h3>No Test Drives Scheduled</h3>
                            <p>Experience your favorite Tata vehicle with a test drive!</p>
                            <button className="btn-primary" onClick={() => navigate("/testdrive")}>
                                Book a Test Drive
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Ordered Parts Tab */}
            {activeTab === "parts" && (
                <div className="tab-content parts-tab">
                    <h2>📦 Your Ordered Parts</h2>
                    {orders && orders.length > 0 ? (
                        <div className="full-list">
                            {orders.map((order) => (
                                <div key={order._id} className="full-card">
                                    <div className="card-header">
                                        <h3>{order.productName}</h3>
                                        <span className="price-large">₹{order.productPrice}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="detail-row">
                                            <span className="label">Category:</span>
                                            <span className="value">{order.productCategory}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Brand:</span>
                                            <span className="value">{order.productBrand}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Quantity:</span>
                                            <span className="value">{order.quantity}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Delivery Address:</span>
                                            <span className="value">{order.homeAddress}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Order Date:</span>
                                            <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Status:</span>
                                            <span className="status-badge processing">Processing</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-section">
                            <h3>No Orders Yet</h3>
                            <p>Enhance your Tata with premium parts and accessories!</p>
                            <button className="btn-primary" onClick={() => navigate("/parts")}>
                                Browse Parts
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutoSpace;
