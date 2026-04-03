import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
// Harrier colors
import ashGrey from "../assets/harrier/ash-grey-left-8.png";
import coralRed from "../assets/harrier/coral-red-left-11.png";
import lunarWhite from "../assets/harrier/lunar-white-left-19.png";
import pebbleGrey from "../assets/harrier/pebble-grey-left-11.png";
import sunlitYellow from "../assets/harrier/sunlit-yellow-left-7.png";
// Nexon colors
import calgaryWhite from "../assets/nexon/calgary-white-right-43.png";
import daytonaGreyNexon from "../assets/nexon/daytona-grey-right-210.png";
import grasslandBeige from "../assets/nexon/grassland-beige-right-4.png";
import oceanBlue from "../assets/nexon/ocean-blue-right-1.png";
import pureGreyNexon from "../assets/nexon/pure-grey-right-31.png";
// Safari colors
import galacticSapphire from "../assets/safari/galactic-sapphire-right-5.png";
import lunarSlate from "../assets/safari/lunar-slate-right-8.png";
import stardustAsh from "../assets/safari/stardust-ash-right-12.png";
import stellarFrost from "../assets/safari/stellar-frost-right-20.png";
import supernovaCopper from "../assets/safari/supernova-copper-right-5.png";
// Curve colors
import daytonaGreyCurve from "../assets/CURVE/daytona-grey-left-162.png";
import goldEssence from "../assets/CURVE/gold-essence-left.png";
import nitroCrimson from "../assets/CURVE/nitro-crimson.png";
import pristineWhiteCurve from "../assets/CURVE/pristine-white-left-12.png";
import pureGreyCurve from "../assets/CURVE/pure-grey-left-11.png";
// Altroz colors
import arcadeGrey from "../assets/altroze/arcade-grey-left-52-Picsart-BackgroundRemover.png";
import duneGlow from "../assets/altroze/dune-glow-left-Picsart-BackgroundRemover.png";
import emberGlow from "../assets/altroze/ember-glow-left-Picsart-BackgroundRemover.png";
import prestineWhite from "../assets/altroze/prestine-white-left-1-Photoroom.png";
import royalBlue from "../assets/altroze/royal-blue-left-3-Photoroom.png";
// Tiago colors
import classyRed from "../assets/TIAGO/classy-red-right-Picsart-BackgroundRemover.png";
import daytonaGreyTiago from "../assets/TIAGO/daytona-grey-right-211-Picsart-BackgroundRemover.png";
import mysticSea from "../assets/TIAGO/mystic-seadt-dt-right-Picsart-BackgroundRemover.png";
import polarWhite from "../assets/TIAGO/polar-white-dt-right-1-Picsart-BackgroundRemover.png";
import tornadoBlue from "../assets/TIAGO/tornado-blue-right-30-Picsart-BackgroundRemover.png";
// Punch colors
import calypsoRed from "../assets/punch/CalypsoRedLeft-Photoroom.png";
import daytonaGreyPunch from "../assets/punch/DaytonaGreyLeft-Photoroom.png";
import orcusWhite from "../assets/punch/OrcusWhiteLeft-Photoroom.png";
import tornadoBluePunch from "../assets/punch/TormadoBlueLeft-Photoroom.png";
import tropicalMist from "../assets/punch/TropicalMistLeft-Photoroom.png";
// Tigor colors
import arizonaBlue from "../assets/TIGOR/arizona-blue-right-25-Picsart-BackgroundRemover.png";
import classyRedTigor from "../assets/TIGOR/classy-red-right-2-Picsart-BackgroundRemover.png";
import daytonaGreyTigor from "../assets/TIGOR/daytona-grey-right-213-Picsart-BackgroundRemover.png";
import meteorBronze from "../assets/TIGOR/meteor-bronze-right-41-Picsart-BackgroundRemover.png";
import opalWhite from "../assets/TIGOR/opal-white-right-39-Picsart-BackgroundRemover.png";

const carColors = {
    harrier: {
        "Ash Grey": ashGrey,
        "Coral Red": coralRed,
        "Lunar White": lunarWhite,
        "Pebble Grey": pebbleGrey,
        "Sunlit Yellow": sunlitYellow,
    },
    nexon: {
        "Calgary White": calgaryWhite,
        "Daytona Grey": daytonaGreyNexon,
        "Grassland Beige": grasslandBeige,
        "Ocean Blue": oceanBlue,
        "Pure Grey": pureGreyNexon,
    },
    safari: {
        "Galactic Sapphire": galacticSapphire,
        "Lunar Slate": lunarSlate,
        "Stardust Ash": stardustAsh,
        "Stellar Frost": stellarFrost,
        "Supernova Copper": supernovaCopper,
    },
    curve: {
        "Daytona Grey": daytonaGreyCurve,
        "Gold Essence": goldEssence,
        "Nitro Crimson": nitroCrimson,
        "Pristine White": pristineWhiteCurve,
        "Pure Grey": pureGreyCurve,
    },
    altroz: {
        "Arcade Grey": arcadeGrey,
        "Dune Glow": duneGlow,
        "Ember Glow": emberGlow,
        "Pristine White": prestineWhite,
        "Royal Blue": royalBlue,
    },
    tiago: {
        "Classy Red": classyRed,
        "Daytona Grey": daytonaGreyTiago,
        "Mystic Sea": mysticSea,
        "Polar White": polarWhite,
        "Tornado Blue": tornadoBlue,
    },
    punch: {
        "Calypso Red": calypsoRed,
        "Daytona Grey": daytonaGreyPunch,
        "Orcus White": orcusWhite,
        "Tornado Blue": tornadoBluePunch,
        "Tropical Mist": tropicalMist,
    },
    tigor: {
        "Arizona Blue": arizonaBlue,
        "Classy Red": classyRedTigor,
        "Daytona Grey": daytonaGreyTigor,
        "Meteor Bronze": meteorBronze,
        "Opal White": opalWhite,
    },
};

const variantPrices = {
    harrier: {
        XE: 1225000,
        XM: 1400000,
        XT: 1600000,
        XZ: 1800000,
        "XZ+": 2000000,
    },
    nexon: { XE: 728000, XM: 900000, XT: 1200000, XZ: 1500000, "XZ+": 1740000 },
    safari: {
        XE: 1320000,
        XM: 1500000,
        XT: 1800000,
        XZ: 2100000,
        "XZ+": 2417000,
    },
    curve: {
        XE: 1366000,
        XM: 1450000,
        XT: 1550000,
        XZ: 1650000,
        "XZ+": 1771000,
    },
    altroz: {
        XE: 999000,
        XM: 1100000,
        XT: 1200000,
        XZ: 1300000,
        "XZ+": 1399000,
    },
    tiago: {
        XE: 1298000,
        XM: 1310000,
        XT: 1330000,
        XZ: 1350000,
        "XZ+": 1370000,
    },
    punch: { XE: 599000, XM: 700000, XT: 800000, XZ: 900000, "XZ+": 1000000 },
    tigor: { XE: 629000, XM: 730000, XT: 830000, XZ: 930000, "XZ+": 1030000 },
};

const evVariantPrices = {
    harrier: {
        Adventure: 2149000,
        "Adventure Plus": 2198000,
        "Adventure S": 2199000,
        "Adventure S Plus": 2248000,
        "Fearless Plus": 2399000,
        "Fearless Plus Tech": 2462000,
        "Fearless Plus LR": 2524000,
        "Fearless Plus LR ACFC": 2586000,
        "Fearless Plus Top": 2649000,
        Empowered: 2749000,
        "Empowered Tech": 2815000,
        "Empowered LR": 2882000,
        "Empowered Top": 2948000,
        "Empowered Stealth Edition": 2824000,
        "Empowered Stealth Tech": 2890000,
        "Empowered Stealth LR": 2960000,
        "Empowered Stealth Top": 3023000,
    },
    nexon: {
        "Creative Plus": 1249000,
        Fearless: 1329000,
        "Fearless Plus": 1499000,
        Creative: 1399000,
        Empowered: 1599000,
        "Empowered Plus A": 1599000,
    },
    curve: {
        Creative: 1749000,
        Accomplished: 1849000,
        "Accomplished Long Range": 1925000,
        "Accomplished Plus (S)": 1929000,
        "Accomplished Plus (S) Long Range": 1999000,
        "Empowered Plus": 2125000,
        "Empowered Plus A": 2199000,
        "Empowered Plus A Top": 2224000,
    },
    tiago: {
        XE: 799000,
        XT: 899000,
        "XT Long Range": 1014000,
        "XZ Plus Tech": 1114000,
    },
    punch: {
        Smart: 809000,
        "Smart Plus": 1029000,
        "Smart Plus Long Range": 1089000,
        Adventure: 1159000,
        Empowered: 1229000,
        "Empowered Plus S": 1259000,
    },
    tigor: {
        XE: 1249000,
        XT: 1299000,
        "XZ Plus": 1349000,
        "XZ Plus LUX": 1375000,
    },
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

const Bookings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, fetchBookings } = useAuthStore();
    const [searchParams] = useSearchParams();
    const { image, model } = location.state || {};
    const carFromQuery = searchParams.get("car");
    const imageName = image ? image.split("/").pop().split(".")[0] : "";
    const carMap = {
        harriyellow: "harrier",
        nexonnew: "nexon",
        safarinew: "safari",
        curvet: "curve",
        altrozenew: "altroz",
        tiagonew: "tiago",
        punch: "punch",
        "opal-white-right-39-Picsart-BackgroundRemover": "tigor",
        harrier: "harrier",
        nexon3: "nexon",
        safari2: "safari",
        curve: "curve",
        altroze: "altroz",
        tiago: "tiago",
        tiagoev: "tiago",
        artcurve: "curve",
        curveev: "curve",
        Harrierev2: "harrier",
        harrierev: "harrier",
        punchev: "punch",
        tigorev: "tigor",
        nexonev: "nexon",
    };
    const carName = carFromQuery || carMap[imageName] || imageName;
    const isEV = imageName.includes("ev");
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
    const modelName = `${carDisplayMap[carName] || carName || "Vehicle"}${isEV ? " EV" : ""}`;
    const colorOptions = carColors[carName] ? Object.keys(carColors[carName]) : [];
    const availableVariants = (isEV && evVariantPrices[carName]
        ? Object.keys(evVariantPrices[carName])
        : variantOptions[carName]) || [];

    const [name, setName] = useState(user ? user.username : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [selectedVariant, setSelectedVariant] = useState(model || "");
    const [price, setPrice] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedFuel, setSelectedFuel] = useState("");
    const [selectedColorImage, setSelectedColorImage] = useState(image);
    const [selectedDealership, setSelectedDealership] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [dealershipSearch, setDealershipSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const tataDealerships = useMemo(() => [
        { id: 1, name: "Puneet Automobiles - Malad West", city: "Mumbai", address: "Shop No 4, Accord Nidhi Building, Link Road, Malad West, Mumbai 400064" },
        { id: 2, name: "Wasan Motors - Borivali East", city: "Mumbai", address: "Unit 3 & 4, Blue Rose Industrial Estate, Western Express Highway, Borivali East, Mumbai 400066" },
        { id: 3, name: "Wasan Motors - Chembur", city: "Mumbai", address: "Wasan House, 4, Swastik Park, Sion Trombay Road, Chembur, Mumbai 400071" },
        { id: 4, name: "Inderjit Cars - Mira Bhayandar", city: "Mumbai", address: "Platinum Building, Ground Floor, Opp. Pleasant Park, Next To Brand Factory, Mira Bhayandar, Mumbai 401107" },
        { id: 5, name: "Keshva Motors - Mulund", city: "Mumbai", address: "Shop No 10, Marathon Max, Mulund Goregaon Link Road, Mulund, Mumbai 400080" },
        { id: 6, name: "Inderjit Cars - Andheri West", city: "Mumbai", address: "1059/1060, Adarsh Nagar, Near Infinity Mall, Off New Link Road, Andheri West, Mumbai 400102" },
        { id: 7, name: "Puneet Automobiles - Prabhadevi", city: "Mumbai", address: "Lloyds Centre Point, Appasaheb Marathe Marg, Prabhadevi, Mumbai 400025" },
        { id: 8, name: "Trident Tata - Andheri West", city: "Mumbai", address: "No. 195, PT, Nasar Residency, Showroom 5 & 6, Juhu Lane, Andheri West, Mumbai 400058" },
        { id: 9, name: "Wasan Motors - Marine Lines", city: "Mumbai", address: "3 & 4, Pearl Mansion, 91 Maharshri Karve Marg, Near Kala Niketan, Marine Lines, Mumbai 400002" },
        { id: 10, name: "Wasan Motors - Bandra West", city: "Mumbai", address: "Kailash Enclave, Plot No. 565, 32nd National College Road, Bandra West, Mumbai 400050" },
        { id: 11, name: "Trident Tata - Vikhroli West", city: "Mumbai", address: "96, LBS Marg, Opp. HP Petrol Pump, Vikhroli West, Mumbai 400083" },
        { id: 12, name: "DPS Cars - Mayapuri", city: "Delhi", address: "A1/1, Phase 1, Mayapuri Industrial Area, New Delhi 110064" },
        { id: 13, name: "Malwa Automobiles - Prashant Vihar", city: "Delhi", address: "A-1/16 Prashant Vihar, Outer Ring Road, Near Rohini Court, Delhi 110085" },
        { id: 14, name: "Autovikas Tata - Shivaji Marg", city: "Delhi", address: "26/3-4, Najafgarh Road Industrial Area, Shivaji Marg, Delhi 110015" },
        { id: 15, name: "Concorde Motors - Patparganj", city: "Delhi", address: "Plot No. 88, Patparganj Industrial Area, Delhi 110092" },
        { id: 16, name: "SAB Motors - Lajpat Nagar", city: "Delhi", address: "Plot No 56, Ground Floor, Main Ring Road, Lajpat Nagar III, Delhi 110024" },
        { id: 17, name: "Tata Motors - MG Road", city: "Bangalore", address: "MG Road, Bangalore, Karnataka 560001" },
        { id: 18, name: "Tata Motors - Whitefield", city: "Bangalore", address: "Whitefield Main Road, Bangalore, Karnataka 560066" },
        { id: 19, name: "Tata Motors - Electronic City", city: "Bangalore", address: "Electronic City Phase 1, Bangalore, Karnataka 560100" },
        { id: 20, name: "Tata Motors - Indiranagar", city: "Bangalore", address: "Indiranagar 100 Feet Road, Bangalore, Karnataka 560038" },
        { id: 21, name: "Tata Motors - Koregaon Park", city: "Pune", address: "Koregaon Park, Pune, Maharashtra 411001" },
        { id: 22, name: "Tata Motors - Hinjewadi", city: "Pune", address: "Hinjewadi Phase 1, Pune, Maharashtra 411057" },
        { id: 23, name: "Tata Motors - Viman Nagar", city: "Pune", address: "Viman Nagar, Pune, Maharashtra 411014" },
        { id: 24, name: "Tata Motors - HITEC City", city: "Hyderabad", address: "HITEC City, Hyderabad, Telangana 500081" },
        { id: 25, name: "Tata Motors - Gachibowli", city: "Hyderabad", address: "Gachibowli, Hyderabad, Telangana 500032" },
        { id: 26, name: "Tata Motors - Banjara Hills", city: "Hyderabad", address: "Road No 12, Banjara Hills, Hyderabad, Telangana 500034" },
        { id: 27, name: "Gurudev Motors - Royapettah", city: "Chennai", address: "No. 69, Sri Krishnapuram Street, Jagadambal Colony, Royapettah, Chennai 600014" },
        { id: 28, name: "Gurudev Motors - Arumbakkam", city: "Chennai", address: "Old No 90, New No 1090, E.V.R. Periyar High Road, Arumbakkam, Chennai 600106" },
        { id: 29, name: "FPL Tata - Korattur", city: "Chennai", address: "100 Feet Road, 200 Ft Ring Road, Before DRJ Hospital, Korattur, Chennai 600077" },
        { id: 30, name: "FPL Tata - Kottivakkam", city: "Chennai", address: "No.238/7/8/10, East Coast Road, Kottivakkam, Chennai 600041" }
    ], []);

    const dealershipsByCity = useMemo(() => {
        const grouped = {};
        tataDealerships.forEach((dealer) => {
            if (!grouped[dealer.city]) {
                grouped[dealer.city] = [];
            }
            grouped[dealer.city].push(dealer);
        });
        return grouped;
    }, [tataDealerships]);

    const filteredDealershipsByCity = useMemo(() => {
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

    const selectedDealershipInfo = useMemo(() => {
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

    const getDealershipName = (dealership) => {
        if (!dealership) {
            return "";
        }
        if (typeof dealership === "string") {
            try {
                return JSON.parse(dealership).name;
            } catch (error) {
                return dealership;
            }
        }
        return dealership.name || "";
    };

    useEffect(() => {
        if (user) {
            setName(user.username);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        const priceSource = isEV && evVariantPrices[carName] ? evVariantPrices : variantPrices;

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
            const response = await fetch("http://localhost:8001/api/booking", {
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
                                        setSelectedColorImage(carColors[carName]?.[color]);
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
                        <select
                            value={selectedDealership}
                            onChange={(e) => setSelectedDealership(e.target.value)}
                            required
                        >
                            <option value="">Select Preferred Dealership</option>
                            {Object.keys(filteredDealershipsByCity).length > 0 ? (
                                Object.keys(filteredDealershipsByCity).map((city) => (
                                    <optgroup key={city} label={city}>
                                        {filteredDealershipsByCity[city].map((dealer) => (
                                            <option key={dealer.id} value={JSON.stringify(dealer)}>
                                                {dealer.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))
                            ) : (
                                // Fallback: Show all dealerships if filter returns empty
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
                </aside>
            </div>
        </div>
    );
};

export default Bookings;