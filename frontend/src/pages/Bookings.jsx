import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { fetchNearbyTataDealerships, groupDealershipsByCity } from "../utils/dealershipApi";
import { CAR_COLORS, CAR_DISPLAY_NAMES, CAR_IMAGE_NAME_MAP, EV_VARIANT_PRICES, VARIANT_OPTIONS, VARIANT_PRICES } from "../utils/carData";
import { API_ENDPOINTS } from "../utils/apiConfig";
import { getDealershipName, parseDealershipValue } from "../utils/dealershipHelpers";

const Bookings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, fetchBookings } = useAuthStore();
    const [searchParams] = useSearchParams();
    const { image, model } = location.state || {};
    const carFromQuery = searchParams.get("car");
    const imageName = image ? image.split("/").pop().split(".")[0] : "";
    const carName = carFromQuery || CAR_IMAGE_NAME_MAP[imageName] || imageName;
    const isEV = imageName.includes("ev");
    const modelName = `${CAR_DISPLAY_NAMES[carName] || carName || "Vehicle"}${isEV ? " EV" : ""}`;
    const colorOptions = CAR_COLORS[carName] ? Object.keys(CAR_COLORS[carName]) : [];
    const availableVariants = (isEV && EV_VARIANT_PRICES[carName]
        ? Object.keys(EV_VARIANT_PRICES[carName])
        : VARIANT_OPTIONS[carName]) || [];

    const [name, setName] = useState(user ? user.username : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [selectedVariant, setSelectedVariant] = useState(model || "");
    const [price, setPrice] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [selectedColorImage, setSelectedColorImage] = useState(image);
    const [selectedDealership, setSelectedDealership] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [dealerships, setDealerships] = useState([]);
    const [dealershipLoading, setDealershipLoading] = useState(true);
    const [dealershipError, setDealershipError] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    useEffect(() => {
        let active = true;

        if (!navigator.geolocation) {
            setDealershipError("Enable location to load Tata dealerships.");
            setDealershipLoading(false);
            return () => {
                active = false;
            };
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                if (!active) {
                    return;
                }

                const liveLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                try {
                    const liveDealerships = await fetchNearbyTataDealerships(liveLocation);
                    if (!active) {
                        return;
                    }
                    setDealerships(liveDealerships);
                    setDealershipError("");
                } catch (error) {
                    if (!active) {
                        return;
                    }
                    console.error("Error fetching live Tata dealerships:", error);
                    setDealerships([]);
                    setDealershipError("Unable to load live Tata dealerships right now.");
                } finally {
                    if (active) {
                        setDealershipLoading(false);
                    }
                }
            },
            (error) => {
                if (!active) {
                    return;
                }
                console.error("Geolocation error:", error);
                setDealershipError("Location access was denied. Enable location to load Tata dealerships.");
                setDealershipLoading(false);
                setDealerships([]);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );

        return () => {
            active = false;
        };
    }, []);

    const dealershipsByCity = useMemo(() => {
        return groupDealershipsByCity(dealerships);
    }, [dealerships]);

    const filteredDealershipsByCity = useMemo(() => {
        return Object.keys(dealershipsByCity)
            .sort()
            .reduce((acc, city) => {
                if (selectedCity && city !== selectedCity) {
                    return acc;
                }
                const dealers = dealershipsByCity[city];
                if (dealers.length > 0) {
                    acc[city] = dealers;
                }
                return acc;
            }, {});
    }, [dealershipsByCity, selectedCity]);

    const dealershipGroupsForDropdown = useMemo(() => {
        if (!selectedCity) {
            return dealershipsByCity;
        }

        return filteredDealershipsByCity;
    }, [dealershipsByCity, filteredDealershipsByCity, selectedCity]);

    const selectedDealershipInfo = useMemo(() => {
        return parseDealershipValue(selectedDealership);
    }, [selectedDealership]);

    const selectedPriceValue = price ? parseInt(price.replace(/,/g, ""), 10) : 0;
    const estimatedEmi = selectedPriceValue
        ? Math.round(selectedPriceValue / 60).toLocaleString()
        : "";

    const completionCount = [
        Boolean(name.trim()),
        Boolean(email.trim()),
        Boolean(selectedVariant),
        isEV ? true : Boolean(selectedFuel),
        Boolean(selectedColor),
        Boolean(selectedDealership),
        Boolean(price),
    ].filter(Boolean).length;
    const completionPercent = Math.round((completionCount / 7) * 100);

    useEffect(() => {
        if (user) {
            setName(user.username);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        const priceSource = isEV && EV_VARIANT_PRICES[carName] ? EV_VARIANT_PRICES : VARIANT_PRICES;

        if (selectedVariant && priceSource[carName] && priceSource[carName][selectedVariant]) {
            let basePrice = priceSource[carName][selectedVariant];
            if (selectedFuel === "Diesel" && !isEV) {
                basePrice += 100000;
            }
            setPrice(basePrice.toLocaleString());
        } else {
            setPrice("");
        }
    }, [selectedVariant, selectedFuel, carName, isEV]);

    useEffect(() => {
        if (!feedback.message) {
            return undefined;
        }
        const timeout = setTimeout(() => {
            setFeedback({ type: "", message: "" });
        }, 3500);
        return () => clearTimeout(timeout);
    }, [feedback]);

    if (!user) {
        return (
            <div className="bookings-container">
                <p>Please log in to book a vehicle.</p>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate("/login")}
                >
                    Log In
                </button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: "", message: "" });
        try {
            const response = await fetch(API_ENDPOINTS.booking, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                    model: modelName,
                    variant: selectedVariant,
                    color: selectedColor,
                    fuel: selectedFuel,
                    price: parseInt(price.replace(/,/g, ""), 10),
                    image: selectedColorImage,
                    dealership: selectedDealership,
                }),
            });
            if (response.ok) {
                setFeedback({ type: "success", message: "Booking confirmed. Our team will reach out shortly." });
                fetchBookings();
            } else {
                setFeedback({ type: "error", message: "Booking failed. Please review details and try again." });
            }
        } catch (error) {
            console.error("Error:", error);
            setFeedback({ type: "error", message: "An unexpected error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bookings-container bookings-interactive">
            <div className="bookings-hero">
                <p className="bookings-kicker">Secure your drive today</p>
                <h1>Book Your {modelName}</h1>
                <p className="bookings-subtitle">
                    Configure your preferred variant, color and dealership, then submit in one tap.
                </p>
            </div>

            <div className="booking-progress-shell">
                <div className="booking-progress-header">
                    <span>Booking Progress</span>
                    <strong>{completionPercent}% complete</strong>
                </div>
                <div className="booking-progress-track">
                    <div
                        className="booking-progress-fill"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
            </div>

            {feedback.message && (
                <div className={`booking-feedback ${feedback.type === "success" ? "is-success" : "is-error"}`}>
                    {feedback.message}
                </div>
            )}

            <div className="booking-interactive-layout">
                <form onSubmit={handleSubmit} className="booking-form booking-form-elevated">
                    <div className="booking-grid-two">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Variant</label>
                        <div className="pill-row">
                            {availableVariants.map((variant) => (
                                <button
                                    key={variant}
                                    type="button"
                                    className={`pill-btn ${selectedVariant === variant ? "active" : ""}`}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    {variant}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!isEV && (
                        <div className="form-group">
                            <label>Fuel Type</label>
                            <div className="pill-row">
                                {["Petrol", "Diesel"].map((fuel) => (
                                    <button
                                        key={fuel}
                                        type="button"
                                        className={`pill-btn ${selectedFuel === fuel ? "active" : ""}`}
                                        onClick={() => setSelectedFuel(fuel)}
                                    >
                                        {fuel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Color</label>
                        <div className="pill-row">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`pill-btn ${selectedColor === color ? "active" : ""}`}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        setSelectedColorImage(CAR_COLORS[carName]?.[color]);
                                    }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedColorImage && (
                        <div className="color-preview color-preview-highlight">
                            <img
                                src={selectedColorImage}
                                alt={selectedColor || modelName}
                                className="color-image"
                            />
                        </div>
                    )}

                    <div className="booking-grid-two">
                        <div className="form-group">
                            <label>City Filter</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setSelectedDealership("");
                                }}
                            >
                                <option value="">All Cities</option>
                                {Object.keys(dealershipsByCity)
                                    .sort()
                                    .map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Select Dealership</label>
                        {dealershipLoading && <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Loading Tata dealerships...</p>}
                        {dealershipError && <p style={{ fontSize: "12px", color: "#ff6b6b", marginBottom: "8px" }}>{dealershipError}</p>}
                        <select
                            value={selectedDealership}
                            onChange={(e) => setSelectedDealership(e.target.value)}
                            required
                            disabled={dealershipLoading || dealerships.length === 0}
                        >
                            <option value="">Select Preferred Dealership</option>
                            {Object.keys(dealershipGroupsForDropdown).length > 0 ? (
                                Object.keys(dealershipGroupsForDropdown).map((city) => (
                                    <optgroup key={city} label={city}>
                                        {dealershipGroupsForDropdown[city].map((dealer) => (
                                            <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                {dealer.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))
                            ) : (
                                Object.keys(dealershipsByCity).map((city) => (
                                    <optgroup key={city} label={city}>
                                        {dealershipsByCity[city].map((dealer) => (
                                            <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                {dealer.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))
                            )}
                        </select>
                    </div>

                    {selectedDealershipInfo && (
                        <div className="dealership-info-card">
                            <h3>Selected Dealership</h3>
                            <p className="dealer-name">{selectedDealershipInfo.name}</p>
                            <p className="dealer-address">{selectedDealershipInfo.address}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Price</label>
                        <input type="text" value={price ? `₹${price}` : "₹0"} readOnly />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Booking..." : "Book Now"}
                    </button>
                </form>

                <aside className="booking-summary-panel">
                    <h3>Live Summary</h3>
                    <div className="summary-row">
                        <span>Model</span>
                        <strong>{modelName}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Variant</span>
                        <strong>{selectedVariant || "Select one"}</strong>
                    </div>
                    {!isEV && (
                        <div className="summary-row">
                            <span>Fuel</span>
                            <strong>{selectedFuel || "Select one"}</strong>
                        </div>
                    )}
                    <div className="summary-row">
                        <span>Color</span>
                        <strong>{selectedColor || "Select one"}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Dealership</span>
                        <strong>{selectedDealershipInfo?.name || "Select one"}</strong>
                    </div>
                    <div className="summary-row total-row">
                        <span>On-road estimate</span>
                        <strong>{price ? `₹${price}` : "-"}</strong>
                    </div>
                    <p className="emi-hint">
                        {estimatedEmi
                            ? `Estimated EMI from ₹${estimatedEmi}/month for 60 months.`
                            : "Choose a variant to preview EMI estimate."}
                    </p>
                    <button
                        type="button"
                        className="scrap-discount-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!modelName || !price) {
                                alert("Please select a car and variant first");
                                return;
                            }
                            const cleanPrice = Number(String(price).replace(/,/g, ""));
                            navigate(
                                `/scrap?model=${encodeURIComponent(modelName)}&variant=${encodeURIComponent(
                                    selectedVariant || ""
                                )}&price=${cleanPrice}`
                            );
                        }}
                    >
                        Check Discount Scrap
                    </button>
                </aside>
            </div>
        </div>
    );
};

export default Bookings;