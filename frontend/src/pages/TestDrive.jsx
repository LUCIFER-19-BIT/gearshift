import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../utils/authStore";
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
const RADIUS_KM = 30;

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};
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

const tataDealerships = [
    { id: 1, name: "Puneet Automobiles - Malad West", city: "Mumbai", address: "Shop No 4, Accord Nidhi Building, Link Road, Malad West, Mumbai 400064", lat: 19.1756, lng: 72.8367 },
    { id: 2, name: "Wasan Motors - Borivali East", city: "Mumbai", address: "Unit 3 & 4, Blue Rose Industrial Estate, Western Express Highway, Borivali East, Mumbai 400066", lat: 19.2183, lng: 72.8517 },
    { id: 3, name: "Wasan Motors - Chembur", city: "Mumbai", address: "Wasan House, 4, Swastik Park, Sion Trombay Road, Chembur, Mumbai 400071", lat: 19.0330, lng: 72.8850 },
    { id: 4, name: "Inderjit Cars - Mira Bhayandar", city: "Mumbai", address: "Platinum Building, Ground Floor, Opp. Pleasant Park, Next To Brand Factory, Mira Bhayandar, Mumbai 401107", lat: 19.2936, lng: 72.7933 },
    { id: 5, name: "Keshva Motors - Mulund", city: "Mumbai", address: "Shop No 10, Marathon Max, Mulund Goregaon Link Road, Mulund, Mumbai 400080", lat: 19.1436, lng: 72.9483 },
    { id: 6, name: "Inderjit Cars - Andheri West", city: "Mumbai", address: "1059/1060, Adarsh Nagar, Near Infinity Mall, Off New Link Road, Andheri West, Mumbai 400102", lat: 19.1136, lng: 72.8267 },
    { id: 7, name: "Puneet Automobiles - Prabhadevi", city: "Mumbai", address: "Lloyds Centre Point, Appasaheb Marathe Marg, Prabhadevi, Mumbai 400025", lat: 18.9820, lng: 72.8250 },
    { id: 8, name: "Trident Tata - Andheri West", city: "Mumbai", address: "No. 195, PT, Nasar Residency, Showroom 5 & 6, Juhu Lane, Andheri West, Mumbai 400058", lat: 19.1089, lng: 72.8181 },
    { id: 9, name: "Wasan Motors - Marine Lines", city: "Mumbai", address: "3 & 4, Pearl Mansion, 91 Maharshri Karve Marg, Near Kala Niketan, Marine Lines, Mumbai 400002", lat: 18.9697, lng: 72.8269 },
    { id: 10, name: "Wasan Motors - Bandra West", city: "Mumbai", address: "Kailash Enclave, Plot No. 565, 32nd National College Road, Bandra West, Mumbai 400050", lat: 19.0596, lng: 72.8286 },
    { id: 11, name: "Trident Tata - Vikhroli West", city: "Mumbai", address: "96, LBS Marg, Opp. HP Petrol Pump, Vikhroli West, Mumbai 400083", lat: 19.0939, lng: 72.9267 },
    { id: 12, name: "DPS Cars - Mayapuri", city: "Delhi", address: "A1/1, Phase 1, Mayapuri Industrial Area, New Delhi 110064", lat: 28.5355, lng: 77.0521 },
    { id: 13, name: "Malwa Automobiles - Prashant Vihar", city: "Delhi", address: "A-1/16 Prashant Vihar, Outer Ring Road, Near Rohini Court, Delhi 110085", lat: 28.7041, lng: 77.0571 },
    { id: 14, name: "Autovikas Tata - Shivaji Marg", city: "Delhi", address: "26/3-4, Najafgarh Road Industrial Area, Shivaji Marg, Delhi 110015", lat: 28.6139, lng: 77.0842 },
    { id: 15, name: "Concorde Motors - Patparganj", city: "Delhi", address: "Plot No. 88, Patparganj Industrial Area, Delhi 110092", lat: 28.5933, lng: 77.2699 },
    { id: 16, name: "SAB Motors - Lajpat Nagar", city: "Delhi", address: "Plot No 56, Ground Floor, Main Ring Road, Lajpat Nagar III, Delhi 110024", lat: 28.5638, lng: 77.2271 },
    { id: 17, name: "Tata Motors - MG Road", city: "Bangalore", address: "MG Road, Bangalore, Karnataka 560001", lat: 12.9352, lng: 77.6245 },
    { id: 18, name: "Tata Motors - Whitefield", city: "Bangalore", address: "Whitefield Main Road, Bangalore, Karnataka 560066", lat: 13.0352, lng: 77.7245 },
    { id: 19, name: "Tata Motors - Electronic City", city: "Bangalore", address: "Electronic City Phase 1, Bangalore, Karnataka 560100", lat: 12.8456, lng: 77.6789 },
    { id: 20, name: "Tata Motors - Indiranagar", city: "Bangalore", address: "Indiranagar 100 Feet Road, Bangalore, Karnataka 560038", lat: 13.0034, lng: 77.6427 },
    { id: 21, name: "Tata Motors - Koregaon Park", city: "Pune", address: "Koregaon Park, Pune, Maharashtra 411001", lat: 18.5335, lng: 73.8488 },
    { id: 22, name: "Tata Motors - Hinjewadi", city: "Pune", address: "Hinjewadi Phase 1, Pune, Maharashtra 411057", lat: 18.5912, lng: 73.7421 },
    { id: 23, name: "Tata Motors - Viman Nagar", city: "Pune", address: "Viman Nagar, Pune, Maharashtra 411014", lat: 18.5667, lng: 73.9167 },
    { id: 24, name: "Tata Motors - HITEC City", city: "Hyderabad", address: "HITEC City, Hyderabad, Telangana 500081", lat: 17.3850, lng: 78.4867 },
    { id: 25, name: "Tata Motors - Gachibowli", city: "Hyderabad", address: "Gachibowli, Hyderabad, Telangana 500032", lat: 17.4432, lng: 78.3496 },
    { id: 26, name: "Tata Motors - Banjara Hills", city: "Hyderabad", address: "Road No 12, Banjara Hills, Hyderabad, Telangana 500034", lat: 17.3972, lng: 78.3854 },
    { id: 27, name: "Gurudev Motors - Royapettah", city: "Chennai", address: "No. 69, Sri Krishnapuram Street, Jagadambal Colony, Royapettah, Chennai 600014", lat: 13.0067, lng: 80.2585 },
    { id: 28, name: "Gurudev Motors - Arumbakkam", city: "Chennai", address: "Old No 90, New No 1090, E.V.R. Periyar High Road, Arumbakkam, Chennai 600106", lat: 13.0650, lng: 80.1842 },
    { id: 29, name: "FPL Tata - Korattur", city: "Chennai", address: "100 Feet Road, 200 Ft Ring Road, Before DRJ Hospital, Korattur, Chennai 600077", lat: 13.1048, lng: 80.2271 },
    { id: 30, name: "FPL Tata - Kottivakkam", city: "Chennai", address: "No.238/7/8/10, East Coast Road, Kottivakkam, Chennai 600041", lat: 12.8833, lng: 80.2667 }
];

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
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.username);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocationError("");
                },
                (error) => {
                    setLocationError("Unable to get your location. Showing all dealerships.");
                    console.log("Geolocation error:", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (selectedModel) {
            setDisplayImage(carImages[selectedModel]);
        }
    }, [selectedModel]);

    const dealershipsByCity = React.useMemo(() => {
        const grouped = {};
        // Always show all dealerships - filter by proximity only if location is available
        const dealershipsToShow = userLocation
            ? tataDealerships.filter((dealer) => {
                const distance = calculateDistance(userLocation.lat, userLocation.lng, dealer.lat, dealer.lng);
                return distance <= RADIUS_KM;
              })
            : tataDealerships; // Show all dealerships if location not available
        
        dealershipsToShow.forEach((dealer) => {
            if (!grouped[dealer.city]) {
                grouped[dealer.city] = [];
            }
            if (userLocation) {
                dealer.distance = calculateDistance(userLocation.lat, userLocation.lng, dealer.lat, dealer.lng);
            }
            grouped[dealer.city].push(dealer);
        });
        return grouped;
    }, [userLocation]);

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
                            {userLocation && (
                                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                                    Showing dealerships within {RADIUS_KM}km of your location
                                </p>
                            )}
                            <select
                                value={selectedDealership}
                                onChange={(e) => setSelectedDealership(e.target.value)}
                                required
                            >
                                <option value="">Select Preferred Dealership</option>
                                {Object.keys(filteredDealershipsByCity).length > 0 ? (
                                    Object.keys(filteredDealershipsByCity).map((city) => (
                                        <optgroup key={city} label={city}>
                                            {filteredDealershipsByCity[city]
                                                .sort((a, b) => (a.distance || 999) - (b.distance || 999))
                                                .map((dealer) => (
                                                    <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                        {dealer.name} {dealer.distance ? `(${dealer.distance.toFixed(1)}km)` : ""}
                                                    </option>
                                                ))}
                                        </optgroup>
                                    ))
                                ) : (
                                    // Fallback: Show all dealerships if filter returns empty
                                    Object.keys(dealershipsByCity).map((city) => (
                                        <optgroup key={city} label={city}>
                                            {dealershipsByCity[city]
                                                .sort((a, b) => (a.distance || 999) - (b.distance || 999))
                                                .map((dealer) => (
                                                    <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                        {dealer.name} {dealer.distance ? `(${dealer.distance.toFixed(1)}km)` : ""}
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