import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../ChargingStations.css';

const ChargingStations = () => {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    // Tata Power EZ Charge stations across major Indian cities
    // Based on Tata Power's 5,500+ charging network across 620+ cities
    const tataChargingStations = useMemo(() => [
        // Delhi NCR Region (92 stations across Delhi)
        {
            id: 1,
            name: "Tata Power EZ Charge - Connaught Place",
            address: "Connaught Place, New Delhi, Delhi 110001",
            lat: 28.6315,
            lng: 77.2167,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 2,
            name: "Tata Power EZ Charge - Cyber City",
            address: "DLF Cyber City, Gurugram, Haryana 122002",
            lat: 28.4950,
            lng: 77.0890,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 3,
            name: "Tata Power EZ Charge - Nehru Place",
            address: "Nehru Place, New Delhi, Delhi 110019",
            lat: 28.5494,
            lng: 77.2501,
            type: "Rapid Charging",
            power: "120kW DC",
            available: false,
            phone: "+91-1800-209-8282"
        },
        {
            id: 4,
            name: "Tata Power EZ Charge - Sector 18",
            address: "Sector 18, Noida, Uttar Pradesh 201301",
            lat: 28.5677,
            lng: 77.3240,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 5,
            name: "Tata Power EZ Charge - Aerocity",
            address: "Aerocity, New Delhi, Delhi 110037",
            lat: 28.5562,
            lng: 77.1181,
            type: "Ultra Fast Charging",
            power: "240kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 6,
            name: "Tata Power EZ Charge - Saket Mall",
            address: "Select Citywalk, Saket, New Delhi, Delhi 110017",
            lat: 28.5244,
            lng: 77.2066,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 7,
            name: "Tata Power EZ Charge - Vasant Kunj",
            address: "Vasant Kunj, New Delhi, Delhi 110070",
            lat: 28.5167,
            lng: 77.1598,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 8,
            name: "Tata Power EZ Charge - Dwarka",
            address: "Sector 21, Dwarka, New Delhi, Delhi 110075",
            lat: 28.5521,
            lng: 77.0590,
            type: "Fast Charging",
            power: "60kW DC",
            available: false,
            phone: "+91-1800-209-8282"
        },
        // Mumbai Region
        {
            id: 9,
            name: "Tata Power EZ Charge - BKC",
            address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
            lat: 19.0596,
            lng: 72.8656,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 10,
            name: "Tata Power EZ Charge - Powai",
            address: "Hiranandani, Powai, Mumbai, Maharashtra 400076",
            lat: 19.1197,
            lng: 72.9059,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 11,
            name: "Tata Power EZ Charge - Andheri",
            address: "Andheri East, Mumbai, Maharashtra 400069",
            lat: 19.1136,
            lng: 72.8697,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 12,
            name: "Tata Power EZ Charge - Thane",
            address: "Thane West, Thane, Maharashtra 400601",
            lat: 19.2183,
            lng: 72.9781,
            type: "Fast Charging",
            power: "60kW DC",
            available: false,
            phone: "+91-1800-209-8282"
        },
        // Bangalore Region
        {
            id: 13,
            name: "Tata Power EZ Charge - MG Road",
            address: "MG Road, Bangalore, Karnataka 560001",
            lat: 12.9759,
            lng: 77.6069,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 14,
            name: "Tata Power EZ Charge - Whitefield",
            address: "Whitefield, Bangalore, Karnataka 560066",
            lat: 12.9698,
            lng: 77.7499,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 15,
            name: "Tata Power EZ Charge - Electronic City",
            address: "Electronic City Phase 1, Bangalore, Karnataka 560100",
            lat: 12.8458,
            lng: 77.6603,
            type: "Ultra Fast Charging",
            power: "240kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 16,
            name: "Tata Power EZ Charge - Indiranagar",
            address: "Indiranagar, Bangalore, Karnataka 560038",
            lat: 12.9719,
            lng: 77.6412,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        // Pune Region
        {
            id: 17,
            name: "Tata Power EZ Charge - Koregaon Park",
            address: "Koregaon Park, Pune, Maharashtra 411001",
            lat: 18.5362,
            lng: 73.8958,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 18,
            name: "Tata Power EZ Charge - Hinjewadi",
            address: "Hinjewadi Phase 1, Pune, Maharashtra 411057",
            lat: 18.5912,
            lng: 73.7389,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 19,
            name: "Tata Power EZ Charge - Viman Nagar",
            address: "Viman Nagar, Pune, Maharashtra 411014",
            lat: 18.5679,
            lng: 73.9143,
            type: "Fast Charging",
            power: "60kW DC",
            available: false,
            phone: "+91-1800-209-8282"
        },
        // Hyderabad Region
        {
            id: 20,
            name: "Tata Power EZ Charge - HITEC City",
            address: "HITEC City, Hyderabad, Telangana 500081",
            lat: 17.4435,
            lng: 78.3772,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 21,
            name: "Tata Power EZ Charge - Gachibowli",
            address: "Gachibowli, Hyderabad, Telangana 500032",
            lat: 17.4401,
            lng: 78.3489,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 22,
            name: "Tata Power EZ Charge - Banjara Hills",
            address: "Banjara Hills, Hyderabad, Telangana 500034",
            lat: 17.4239,
            lng: 78.4738,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        // Chennai Region
        {
            id: 23,
            name: "Tata Power EZ Charge - OMR",
            address: "Old Mahabalipuram Road, Chennai, Tamil Nadu 600096",
            lat: 12.9121,
            lng: 80.2273,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 24,
            name: "Tata Power EZ Charge - Anna Nagar",
            address: "Anna Nagar, Chennai, Tamil Nadu 600040",
            lat: 13.0878,
            lng: 80.2086,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 25,
            name: "Tata Power EZ Charge - Velachery",
            address: "Velachery, Chennai, Tamil Nadu 600042",
            lat: 12.9750,
            lng: 80.2200,
            type: "Fast Charging",
            power: "60kW DC",
            available: false,
            phone: "+91-1800-209-8282"
        },
        // Kolkata Region
        {
            id: 26,
            name: "Tata Power EZ Charge - Salt Lake",
            address: "Salt Lake City, Kolkata, West Bengal 700091",
            lat: 22.5726,
            lng: 88.4194,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 27,
            name: "Tata Power EZ Charge - New Town",
            address: "New Town, Rajarhat, Kolkata, West Bengal 700156",
            lat: 22.5875,
            lng: 88.4732,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        // Ahmedabad Region (Gujarat - 95 stations)
        {
            id: 28,
            name: "Tata Power EZ Charge - SG Highway",
            address: "SG Highway, Ahmedabad, Gujarat 380015",
            lat: 23.0258,
            lng: 72.5673,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        {
            id: 29,
            name: "Tata Power EZ Charge - Vastrapur",
            address: "Vastrapur, Ahmedabad, Gujarat 380015",
            lat: 23.0395,
            lng: 72.5245,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
        },
        // Additional Major Cities
        {
            id: 30,
            name: "Tata Power EZ Charge - Jaipur",
            address: "Malviya Nagar, Jaipur, Rajasthan 302017",
            lat: 26.8523,
            lng: 75.8140,
            type: "Fast Charging",
            power: "60kW DC",
            available: true,
            phone: "+91-1800-209-8282"
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

                    // Add distance to each station and sort by distance
                    const stationsWithDistance = tataChargingStations.map(station => ({
                        ...station,
                        distance: calculateDistance(
                            location.lat,
                            location.lng,
                            station.lat,
                            station.lng
                        )
                    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                    setStations(stationsWithDistance);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Unable to get your location. Showing default Delhi location.");
                    // Use default location (Delhi) if user denies location
                    const defaultLocation = { lat: 28.6139, lng: 77.2090 };
                    setUserLocation(defaultLocation);

                    const stationsWithDistance = tataChargingStations.map(station => ({
                        ...station,
                        distance: calculateDistance(
                            defaultLocation.lat,
                            defaultLocation.lng,
                            station.lat,
                            station.lng
                        )
                    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                    setStations(stationsWithDistance);
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, [calculateDistance, tataChargingStations]);

    // Initialize Google Map
    useEffect(() => {
        if (!userLocation || !window.google) return;

        const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
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

        // Add charging station markers
        stations.forEach((station) => {
            const marker = new window.google.maps.Marker({
                position: { lat: station.lat, lng: station.lng },
                map: mapInstance,
                title: station.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="${station.available ? '#4CAF50' : '#F44336'}">
              <path d="M14.5 11l-3 6v-4h-2l3-6v4h2M17 3H7v1h10V3m0 17v-1H7v1l-2-2v-3h1V7H5v2H3V7c0-1.11.89-2 2-2h1V3c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2h1c1.11 0 2 .89 2 2v2h-2V7h-1v8h1v-3h2v5l-2 2M9 5h6v11h-2v2h2v1H9v-1h2v-2H9V5z"/>
            </svg>
          `),
                    scaledSize: new window.google.maps.Size(40, 40),
                }
            });

            // Add click listener to marker
            marker.addListener('click', () => {
                setSelectedStation(station);
                mapInstance.panTo({ lat: station.lat, lng: station.lng });
                mapInstance.setZoom(14);
            });
        });
    }, [userLocation, stations]);

    const handleStationClick = (station) => {
        setSelectedStation(station);
        if (map) {
            map.panTo({ lat: station.lat, lng: station.lng });
            map.setZoom(14);
        }
    };

    const handleGetDirections = (station) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="charging-stations-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Finding charging stations near you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="charging-stations-container">
            <header className="charging-header">
                <h1>Tata EV Charging Stations</h1>
                <p>Find the nearest Tata Power EZ Charge stations near you</p>
                {error && <div className="error-message">⚠️ {error}</div>}
            </header>

            <div className="charging-content">
                <div className="map-section">
                    <div id="map" className="map"></div>
                    <div className="map-legend">
                        <div className="legend-item">
                            <span className="legend-dot available"></span>
                            <span>Available</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot unavailable"></span>
                            <span>In Use</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot user"></span>
                            <span>Your Location</span>
                        </div>
                    </div>
                </div>

                <div className="stations-list">
                    <h2>Nearby Stations ({stations.length})</h2>
                    {stations.map((station) => (
                        <div
                            key={station.id}
                            className={`station-card ${selectedStation?.id === station.id ? 'selected' : ''}`}
                            onClick={() => handleStationClick(station)}
                        >
                            <div className="station-header">
                                <h3>{station.name}</h3>
                                <span className={`status-badge ${station.available ? 'available' : 'unavailable'}`}>
                                    {station.available ? '✓ Available' : '⚡ In Use'}
                                </span>
                            </div>
                            <p className="station-address">📍 {station.address}</p>
                            <div className="station-details">
                                <div className="detail-item">
                                    <span className="detail-label">Type:</span>
                                    <span className="detail-value">{station.type}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Power:</span>
                                    <span className="detail-value">{station.power}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Distance:</span>
                                    <span className="detail-value">{station.distance} km</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{station.phone}</span>
                                </div>
                            </div>
                            <button
                                className="directions-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleGetDirections(station);
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

export default ChargingStations;
