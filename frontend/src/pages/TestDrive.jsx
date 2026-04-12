import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { fetchNearbyTataDealerships, groupDealershipsByCity } from "../utils/dealershipApi";
import { CAR_DISPLAY_NAMES, CAR_IMAGE_BY_MODEL, VARIANT_OPTIONS } from "../utils/carData";
import { API_ENDPOINTS } from "../utils/apiConfig";
import { parseDealershipValue } from "../utils/dealershipHelpers";
import DealershipLocator from "../components/DealershipLocator";

const TestDrive = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, fetchTestDrives } = useAuthStore();
    const { image: initialImage, model: initialModel } = location.state || {};

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [pincode, setPincode] = useState("");
    const [selectedModel, setSelectedModel] = useState(initialModel || "");
    const [selectedVariant, setSelectedVariant] = useState("");
    const [displayImage, setDisplayImage] = useState(initialImage || CAR_IMAGE_BY_MODEL[initialModel] || "");
    const [selectedDealership, setSelectedDealership] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [dealerships, setDealerships] = useState([]);
    const [dealershipLoading, setDealershipLoading] = useState(true);
    const [dealershipError, setDealershipError] = useState("");
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.username);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        let active = true;

        if (!navigator.geolocation) {
            setLocationError("Enable location to load Tata dealerships.");
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

                setLocationError("");

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
                setLocationError("Location access was denied. Enable location to load Tata dealerships.");
                setDealershipError("No Tata dealerships available without location access.");
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

    useEffect(() => {
        if (selectedModel) {
            setDisplayImage(CAR_IMAGE_BY_MODEL[selectedModel]);
        }
    }, [selectedModel]);

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

    if (!user) {
        return (
            <section className="testdrive-container">
                <p>Please login to book a test drive.</p>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate("/login")}
                >
                    Log In
                </button>
            </section>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedModel) {
            alert("Please select a car model");
            return;
        }
        if (!selectedVariant) {
            alert("Please select a variant");
            return;
        }
        if (!selectedDealership) {
            alert("Please select a dealership");
            return;
        }

        const data = { firstName, lastName, mobile, email, pincode, model: selectedModel, variant: selectedVariant, dealership: selectedDealership };
        try {
            const response = await fetch(API_ENDPOINTS.testDrive, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Test drive booked successfully");
                fetchTestDrives();
            } else {
                alert("Error booking test drive");
            }
        } catch (error) {
            alert("Error");
        }
    };

    const availableVariants = VARIANT_OPTIONS[selectedModel] || [];

    return (
        <>
            <section className="testdrive-container">
                <header className="section-header">
                    <h1>Choose your Test Drive experience</h1>
                    <p>
                        Our vehicles are all about the experience. Take our premium test
                        drive to get a feel or explore the unique features at leisure. Select
                        your car model and variant to request a test drive!
                    </p>
                </header>

                <div className="booking-interactive-layout">
                    <form onSubmit={handleSubmit} className="booking-form booking-form-elevated">
                        <div className="booking-grid-two">
                            <div className="form-group">
                                <label>First name</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last name</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="booking-grid-two">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mobile number</label>
                                <div className="mobile-input">
                                    <span className="flag-icon">🇮🇳</span>
                                    <span>+91</span>
                                    <input
                                        type="tel"
                                        placeholder="Mobile number"
                                        value={mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 10) {
                                                setMobile(value);
                                            }
                                        }}
                                        required
                                        maxLength="10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Select Car Model</label>
                            <div className="pill-row">
                                {["harrier", "nexon", "safari", "curve", "altroz", "tiago", "punch", "tigor"].map((model) => (
                                    <button
                                        key={model}
                                        type="button"
                                        className={`pill-btn ${selectedModel === model ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedModel(model);
                                            setSelectedVariant("");
                                        }}
                                    >
                                        {CAR_DISPLAY_NAMES[model]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedModel && (
                            <div className="form-group">
                                <label>Select Variant</label>
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
                            {dealershipLoading && (
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Loading Tata dealerships...
                                </p>
                            )}
                            {locationError && (
                                <p style={{ fontSize: "12px", color: "#ff6b6b", marginBottom: "8px" }}>
                                    {locationError}
                                </p>
                            )}
                            {dealershipError && (
                                <p style={{ fontSize: "12px", color: "#ff6b6b", marginBottom: "8px" }}>
                                    {dealershipError}
                                </p>
                            )}
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
                                            {dealershipGroupsForDropdown[city]
                                                .sort((a, b) => (a.distance || 999) - (b.distance || 999))
                                                .map((dealer) => (
                                                    <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                        {dealer.name}
                                                    </option>
                                                ))}
                                        </optgroup>
                                    ))
                                ) : (
                                    Object.keys(dealershipsByCity).map((city) => (
                                        <optgroup key={city} label={city}>
                                            {dealershipsByCity[city]
                                                .sort((a, b) => (a.distance || 999) - (b.distance || 999))
                                                .map((dealer) => (
                                                    <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                        {dealer.name}
                                                    </option>
                                                ))}
                                        </optgroup>
                                    ))
                                )}
                            </select>
                            {locationError && (
                                <p style={{ fontSize: "12px", color: "#ff6b6b", marginTop: "4px" }}>
                                    {locationError}
                                </p>
                            )}
                        </div>

                        {selectedDealershipInfo && (
                            <div className="dealership-info-card">
                                <h3>Selected Dealership</h3>
                                <p className="dealer-name">{selectedDealershipInfo.name}</p>
                                <p className="dealer-address">{selectedDealershipInfo.address}</p>
                            </div>
                        )}

                        <button type="submit" className="btn-primary">
                            Book Test Drive
                        </button>
                    </form>

                    <aside className="booking-summary-panel">
                        <h3>Selected Car</h3>
                        {displayImage && (
                            <img
                                src={displayImage}
                                alt={selectedModel || "Car"}
                                className="testdrive-preview-image"
                                style={{
                                    width: "100%",
                                    maxHeight: "350px",
                                    objectFit: "contain",
                                    marginBottom: "20px",
                                    borderRadius: "8px",
                                }}
                            />
                        )}
                        <div className="summary-row">
                            <span>Model</span>
                            <strong>{selectedModel ? CAR_DISPLAY_NAMES[selectedModel] : "Not selected"}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Variant</span>
                            <strong>{selectedVariant || "Select one"}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Dealership</span>
                            <strong>{selectedDealershipInfo?.name || "Select one"}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Email</span>
                            <strong>{email || "Enter email"}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Phone</span>
                            <strong>{mobile ? `+91 ${mobile}` : "Enter phone"}</strong>
                        </div>
                        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
                            Our team will contact you within 24 hours to schedule your test drive.
                        </p>
                    </aside>
                </div>

                
            </section>
            {/* Dealership Locator Section */}
            <DealershipLocator />
        </>
    );
};

export default TestDrive;