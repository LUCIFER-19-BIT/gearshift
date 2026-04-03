import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { fetchNearbyTataDealerships, groupDealershipsByCity } from "../utils/dealershipApi";
import testdriveImg from "../assets/testdrive.jpg";
import DealershipLocator from "../components/DealershipLocator";
// Car model images
import harrierImg from "../assets/harriyellow.png";
import nexonImg2 from "../assets/nexonnew.png";
import safariImg2 from "../assets/safarinew.png";
import curvet from "../assets/curvet.png";
import altrozImg2 from "../assets/altrozenew.png";
import tiagoImg2 from "../assets/tiagonew.png";
import punchImg from "../assets/punch.png";
import tigorImg from "../assets/TIGOR/opal-white-right-39-Picsart-BackgroundRemover.png";
const carImages = {
    harrier: harrierImg,
    nexon: nexonImg2,
    safari: safariImg2,
    curve: curvet,
    altroz: altrozImg2,
    tiago: tiagoImg2,
    punch: punchImg,
    tigor: tigorImg,
};

const carDisplayNames = {
    harrier: "HARRIER",
    nexon: "Nexon",
    safari: "SAFARI",
    curve: "CURVE",
    altroz: "ALTROZ",
    tiago: "TIAGO",
    punch: "PUNCH",
    tigor: "TIGOR",
};

const variantOptions = {
    harrier: ["XE", "XM", "XT", "XZ", "XZ+"],
    nexon: ["XE", "XM", "XT", "XZ", "XZ+"],
    safari: ["XE", "XM", "XT", "XZ", "XZ+"],
    curve: ["XE", "XM", "XT", "XZ", "XZ+"],
    altroz: ["XE", "XM", "XT", "XZ", "XZ+"],
    tiago: ["XE", "XM", "XT", "XZ", "XZ+"],
    punch: ["XE", "XM", "XT", "XZ", "XZ+"],
    tigor: ["XE", "XM", "XT", "XZ", "XZ+"],
};

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
    const [displayImage, setDisplayImage] = useState(initialImage || carImages[initialModel] || "");
    const [selectedDealership, setSelectedDealership] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [dealershipSearch, setDealershipSearch] = useState("");
    const [dealerships, setDealerships] = useState([]);
    const [dealershipLoading, setDealershipLoading] = useState(true);
    const [dealershipError, setDealershipError] = useState("");
    const [userLocation, setUserLocation] = useState(null);
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
            setLocationError("Enable location to load nearby Tata dealerships.");
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

                setUserLocation(liveLocation);
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
                setLocationError("Location access was denied. Enable location to load nearby Tata dealerships.");
                setDealershipError("No live Tata dealerships available without location access.");
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
            setDisplayImage(carImages[selectedModel]);
        }
    }, [selectedModel]);

    const dealershipsByCity = React.useMemo(() => {
        return groupDealershipsByCity(dealerships);
    }, [dealerships]);

    const filteredDealershipsByCity = React.useMemo(() => {
        const search = dealershipSearch.trim().toLowerCase();
        return Object.keys(dealershipsByCity)
            .sort()
            .reduce((acc, city) => {
                if (selectedCity && city !== selectedCity) {
                    return acc;
                }
                const dealers = dealershipsByCity[city].filter((dealer) => {
                    if (!search) {
                        return true;
                    }
                    return (
                        dealer.name.toLowerCase().includes(search) ||
                        dealer.address.toLowerCase().includes(search)
                    );
                });
                if (dealers.length > 0) {
                    acc[city] = dealers;
                }
                return acc;
            }, {});
    }, [dealershipSearch, dealershipsByCity, selectedCity]);

    const selectedDealershipInfo = React.useMemo(() => {
        if (!selectedDealership) {
            return null;
        }
        try {
            return typeof selectedDealership === "string"
                ? JSON.parse(selectedDealership)
                : selectedDealership;
        } catch (error) {
            return null;
        }
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
            const response = await fetch("http://localhost:8001/api/testdrive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Test drive booked successfully");
                fetchTestDrives(localStorage.getItem("token"));
            } else {
                alert("Error booking test drive");
            }
        } catch (error) {
            alert("Error");
        }
    };

    const availableVariants = variantOptions[selectedModel] || [];

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
                                        {carDisplayNames[model]}
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
                            <div className="form-group">
                                <label>Search Dealership</label>
                                <input
                                    type="text"
                                    value={dealershipSearch}
                                    onChange={(e) => {
                                        setDealershipSearch(e.target.value);
                                        setSelectedDealership("");
                                    }}
                                    placeholder="Type area or showroom"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Select Dealership</label>
                            {dealershipLoading && (
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Loading live Tata dealerships...
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
                                {Object.keys(filteredDealershipsByCity).length > 0 ? (
                                    Object.keys(filteredDealershipsByCity).map((city) => (
                                        <optgroup key={city} label={city}>
                                            {filteredDealershipsByCity[city]
                                                .sort((a, b) => (a.distance || 999) - (b.distance || 999))
                                                .map((dealer) => (
                                                    <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                        {dealer.name} {dealer.distance ? `(${dealer.distance}km)` : ""}
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
                                                        {dealer.name} {dealer.distance ? `(${dealer.distance}km)` : ""}
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
                            <strong>{selectedModel ? carDisplayNames[selectedModel] : "Not selected"}</strong>
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

                <div className="testdrive-content">
                    <img
                        src={testdriveImg}
                        alt="Test Drive"
                        className="testdrive-image"
                    />
                    <h1>Standard Test Drive</h1>
                    <p>Up to 1 hour</p>
                    <p>
                        Go on a test drive with one of our expert representatives. You can
                        either drive out from the dealership itself or have the car reach
                        your home. Either way, you'll experience a drive like no other.
                    </p>
                    <h3>Price</h3>
                    <p>Free</p>
                </div>
            </section>
            {/* Dealership Locator Section */}
            <DealershipLocator />
        </>
    );
};

export default TestDrive;