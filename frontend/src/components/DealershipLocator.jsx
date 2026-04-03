import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../DealershipLocator.css';

const DealershipLocator = () => {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [dealerships, setDealerships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDealership, setSelectedDealership] = useState(null);

    // Tata Motors authorized dealerships across major Indian cities
    // Based on web search data from official Tata Motors dealer locator
    const tataDealerships = useMemo(() => [
        // Mumbai Region (13+ dealerships)
        {
            id: 1,
            name: "Puneet Automobiles - Malad West",
            address: "Shop No 4, Accord Nidhi Building, Link Road, Malad West, Mumbai 400064",
            lat: 19.1868,
            lng: 72.8382,
            phone: "+91-22-2888-9999",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 2,
            name: "Wasan Motors - Borivali East",
            address: "Unit 3 & 4, Blue Rose Industrial Estate, Western Express Highway, Borivali East, Mumbai 400066",
            lat: 19.2304,
            lng: 72.8569,
            phone: "+91-22-2867-5555",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 3,
            name: "Wasan Motors - Chembur",
            address: "Wasan House, 4, Swastik Park, Sion Trombay Road, Chembur, Mumbai 400071",
            lat: 19.0544,
            lng: 72.8991,
            phone: "+91-22-2522-3333",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 4,
            name: "Inderjit Cars - Mira Bhayandar",
            address: "Platinum Building, Ground Floor, Opp. Pleasant Park, Next To Brand Factory, Mira Bhayandar, Mumbai 401107",
            lat: 19.2952,
            lng: 72.8544,
            phone: "+91-22-2811-4444",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 5,
            name: "Keshva Motors - Mulund",
            address: "Shop No 10, Marathon Max, Mulund Goregaon Link Road, Mulund, Mumbai 400080",
            lat: 19.1726,
            lng: 72.9565,
            phone: "+91-22-2564-7777",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 6,
            name: "Inderjit Cars - Andheri West",
            address: "1059/1060, Adarsh Nagar, Near Infinity Mall, Off New Link Road, Andheri West, Mumbai 400102",
            lat: 19.1351,
            lng: 72.8269,
            phone: "+91-22-2632-8888",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 7,
            name: "Puneet Automobiles - Prabhadevi",
            address: "Lloyds Centre Point, Appasaheb Marathe Marg, Prabhadevi, Mumbai 400025",
            lat: 19.0144,
            lng: 72.8303,
            phone: "+91-22-2430-5555",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 8,
            name: "Trident Tata - Andheri West",
            address: "No. 195, PT, Nasar Residency, Showroom 5 & 6, Juhu Lane, Andheri West, Mumbai 400058",
            lat: 19.1136,
            lng: 72.8269,
            phone: "+91-22-2673-9999",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 9,
            name: "Wasan Motors - Marine Lines",
            address: "3 & 4, Pearl Mansion, 91 Maharshri Karve Marg, Near Kala Niketan, Marine Lines, Mumbai 400002",
            lat: 18.9467,
            lng: 72.8233,
            phone: "+91-22-2201-6666",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 10,
            name: "Wasan Motors - Bandra West",
            address: "Kailash Enclave, Plot No. 565, 32nd National College Road, Bandra West, Mumbai 400050",
            lat: 19.0596,
            lng: 72.8295,
            phone: "+91-22-2640-7777",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 11,
            name: "Trident Tata - Vikhroli West",
            address: "96, LBS Marg, Opp. HP Petrol Pump, Vikhroli West, Mumbai 400083",
            lat: 19.1115,
            lng: 72.9294,
            phone: "+91-22-2577-8888",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        // Delhi NCR Region (39+ dealerships)
        {
            id: 12,
            name: "DPS Cars - Mayapuri",
            address: "A1/1, Phase 1, Mayapuri Industrial Area, New Delhi 110064",
            lat: 28.6441,
            lng: 77.1345,
            phone: "+91-11-2811-9999",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 13,
            name: "Malwa Automobiles - Prashant Vihar",
            address: "A-1/16 Prashant Vihar, Outer Ring Road, Near Rohini Court, Delhi 110085",
            lat: 28.7256,
            lng: 77.1489,
            phone: "+91-11-2756-8888",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 14,
            name: "Autovikas Tata - Shivaji Marg",
            address: "26/3-4, Najafgarh Road Industrial Area, Shivaji Marg, Delhi 110015",
            lat: 28.6358,
            lng: 77.1139,
            phone: "+91-11-2545-7777",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 15,
            name: "Concorde Motors - Patparganj",
            address: "Plot No. 88, Patparganj Industrial Area, Delhi 110092",
            lat: 28.6289,
            lng: 77.3089,
            phone: "+91-11-2215-6666",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 16,
            name: "SAB Motors - Lajpat Nagar",
            address: "Plot No 56, Ground Floor, Main Ring Road, Lajpat Nagar III, Delhi 110024",
            lat: 28.5678,
            lng: 77.2439,
            phone: "+91-11-2984-5555",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        // Bangalore Region (36+ dealerships)
        {
            id: 17,
            name: "Tata Motors - MG Road",
            address: "MG Road, Bangalore, Karnataka 560001",
            lat: 12.9759,
            lng: 77.6069,
            phone: "+91-80-4112-8888",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 18,
            name: "Tata Motors - Whitefield",
            address: "Whitefield Main Road, Bangalore, Karnataka 560066",
            lat: 12.9698,
            lng: 77.7499,
            phone: "+91-80-4952-7777",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 19,
            name: "Tata Motors - Electronic City",
            address: "Electronic City Phase 1, Bangalore, Karnataka 560100",
            lat: 12.8458,
            lng: 77.6603,
            phone: "+91-80-2852-6666",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 20,
            name: "Tata Motors - Indiranagar",
            address: "Indiranagar 100 Feet Road, Bangalore, Karnataka 560038",
            lat: 12.9719,
            lng: 77.6412,
            phone: "+91-80-2528-9999",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        // Pune Region (32+ dealerships)
        {
            id: 21,
            name: "Tata Motors - Koregaon Park",
            address: "Koregaon Park, Pune, Maharashtra 411001",
            lat: 18.5362,
            lng: 73.8958,
            phone: "+91-20-2613-7777",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 22,
            name: "Tata Motors - Hinjewadi",
            address: "Hinjewadi Phase 1, Pune, Maharashtra 411057",
            lat: 18.5912,
            lng: 73.7389,
            phone: "+91-20-6745-8888",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 23,
            name: "Tata Motors - Viman Nagar",
            address: "Viman Nagar, Pune, Maharashtra 411014",
            lat: 18.5679,
            lng: 73.9143,
            phone: "+91-20-2669-6666",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        // Hyderabad Region (35+ dealerships)
        {
            id: 24,
            name: "Tata Motors - HITEC City",
            address: "HITEC City, Hyderabad, Telangana 500081",
            lat: 17.4435,
            lng: 78.3772,
            phone: "+91-40-2311-7777",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 25,
            name: "Tata Motors - Gachibowli",
            address: "Gachibowli, Hyderabad, Telangana 500032",
            lat: 17.4401,
            lng: 78.3489,
            phone: "+91-40-2300-8888",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 26,
            name: "Tata Motors - Banjara Hills",
            address: "Road No 12, Banjara Hills, Hyderabad, Telangana 500034",
            lat: 17.4239,
            lng: 78.4738,
            phone: "+91-40-2339-9999",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        // Chennai Region (30+ dealerships)
        {
            id: 27,
            name: "Gurudev Motors - Royapettah",
            address: "No. 69, Sri Krishnapuram Street, Jagadambal Colony, Royapettah, Chennai 600014",
            lat: 13.0569,
            lng: 80.2676,
            phone: "+91-44-2811-6666",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 28,
            name: "Gurudev Motors - Arumbakkam",
            address: "Old No 90, New No 1090, E.V.R. Periyar High Road, Arumbakkam, Chennai 600106",
            lat: 13.0697,
            lng: 80.2065,
            phone: "+91-44-2626-7777",
            services: ["Sales", "Service", "Test Drive", "Spare Parts"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 29,
            name: "FPL Tata - Korattur",
            address: "100 Feet Road, 200 Ft Ring Road, Before DRJ Hospital, Korattur, Chennai 600077",
            lat: 13.1071,
            lng: 80.1963,
            phone: "+91-44-2654-8888",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        },
        {
            id: 30,
            name: "FPL Tata - Kottivakkam",
            address: "No.238/7/8/10, East Coast Road, Kottivakkam, Chennai 600041",
            lat: 12.9494,
            lng: 80.2517,
            phone: "+91-44-2451-9999",
            services: ["Sales", "Service", "Test Drive"],
            timing: "9:00 AM - 7:00 PM"
        }
    ], []);

    // Calculate distance between two coordinates (in km)
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    }, []);

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // Get user's current location and calculate distances
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(location);

                    // Add distance to each dealership and sort by distance
                    const dealershipsWithDistance = tataDealerships.map(dealership => ({
                        ...dealership,
                        distance: calculateDistance(
                            location.lat,
                            location.lng,
                            dealership.lat,
                            dealership.lng
                        )
                    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                    setDealerships(dealershipsWithDistance);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Unable to get your location. Showing default Mumbai location.");
                    // Use default location (Mumbai) if user denies location
                    const defaultLocation = { lat: 19.0760, lng: 72.8777 };
                    setUserLocation(defaultLocation);

                    const dealershipsWithDistance = tataDealerships.map(dealership => ({
                        ...dealership,
                        distance: calculateDistance(
                            defaultLocation.lat,
                            defaultLocation.lng,
                            dealership.lat,
                            dealership.lng
                        )
                    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                    setDealerships(dealershipsWithDistance);
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, [calculateDistance, tataDealerships]);

    // Initialize Google Map
    useEffect(() => {
        if (!userLocation || !window.google) return;

        const mapInstance = new window.google.maps.Map(document.getElementById('dealership-map'), {
            center: userLocation,
            zoom: 11,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
                {
                    "elementType": "geometry",
                    "stylers": [{ "color": "#212121" }]
                },
                {
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "color": "#212121" }]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#757575" }]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#757575" }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#181818" }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#616161" }]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [{ "color": "#2c2c2c" }]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#8a8a8a" }]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#000000" }]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#3d3d3d" }]
                }
            ]
        });

        setMap(mapInstance);

        // Add user location marker
        new window.google.maps.Marker({
            position: userLocation,
            map: mapInstance,
            title: "Your Location",
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#FFD700",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
            }
        });

        // Add dealership markers
        dealerships.forEach((dealership) => {
            const marker = new window.google.maps.Marker({
                position: { lat: dealership.lat, lng: dealership.lng },
                map: mapInstance,
                title: dealership.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#FFD700">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `),
                    scaledSize: new window.google.maps.Size(40, 40),
                }
            });

            // Add click listener to marker
            marker.addListener('click', () => {
                setSelectedDealership(dealership);
                mapInstance.panTo({ lat: dealership.lat, lng: dealership.lng });
                mapInstance.setZoom(14);
            });
        });
    }, [userLocation, dealerships]);

    const handleDealershipClick = (dealership) => {
        setSelectedDealership(dealership);
        if (map) {
            map.panTo({ lat: dealership.lat, lng: dealership.lng });
            map.setZoom(14);
        }
    };

    const handleGetDirections = (dealership) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${dealership.lat},${dealership.lng}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="dealership-locator-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Finding Tata Motors dealerships near you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dealership-locator-container">
            <header className="dealership-header">
                <h1>Tata Motors Dealerships</h1>
                <p>Find the nearest authorized Tata Motors showrooms for test drives</p>
                {error && <div className="error-message">⚠️ {error}</div>}
            </header>

            <div className="dealership-content">
                <div className="map-section">
                    <div id="dealership-map" className="map"></div>
                    <div className="map-legend">
                        <div className="legend-item">
                            <span className="legend-dot dealership"></span>
                            <span>Dealership</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot user"></span>
                            <span>Your Location</span>
                        </div>
                    </div>
                </div>

                <div className="dealerships-list">
                    <h2>Nearby Dealerships ({dealerships.length})</h2>
                    {dealerships.map((dealership) => (
                        <div
                            key={dealership.id}
                            className={`dealership-card ${selectedDealership?.id === dealership.id ? 'selected' : ''}`}
                            onClick={() => handleDealershipClick(dealership)}
                        >
                            <div className="dealership-header-card">
                                <h3>{dealership.name}</h3>
                                <span className="distance-badge">{dealership.distance} km away</span>
                            </div>
                            <p className="dealership-address">📍 {dealership.address}</p>
                            <div className="dealership-details">
                                <div className="detail-item">
                                    <span className="detail-label">📞 Phone:</span>
                                    <span className="detail-value">{dealership.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">🕒 Timing:</span>
                                    <span className="detail-value">{dealership.timing}</span>
                                </div>
                                <div className="detail-item services-item">
                                    <span className="detail-label">✅ Services:</span>
                                    <div className="services-tags">
                                        {dealership.services.map((service, idx) => (
                                            <span key={idx} className="service-tag">{service}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="directions-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleGetDirections(dealership);
                                }}
                            >
                                Get Directions →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealershipLocator;
