import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../DealershipLocator.css';
import { fetchNearbyTataDealerships } from '../utils/dealershipApi';

const DEFAULT_MAP_CENTER = [20.5937, 78.9629];
const TILE_LAYER_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

const buildDealerIcon = () => L.divIcon({
    className: 'dealership-marker',
    html: '<span class="dealership-marker__pin"></span>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -26]
});

const userLocationIcon = L.divIcon({
    className: 'dealership-marker dealership-marker--user',
    html: '<span class="dealership-marker__user-dot"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10]
});

const buildDirectionsUrl = (from, to) => {
    if (!from || !to) {
        return 'https://www.google.com/maps';
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}`;
};

const MapViewController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: false });
        }
    }, [center, zoom, map]);

    return null;
};

const DealershipLocator = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationAccuracy, setLocationAccuracy] = useState(null);
    const [dealerships, setDealerships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDealership, setSelectedDealership] = useState(null);

    const mapCenter = selectedDealership
        ? [selectedDealership.lat, selectedDealership.lng]
        : userLocation
            ? [userLocation.lat, userLocation.lng]
            : DEFAULT_MAP_CENTER;

    useEffect(() => {
        let active = true;

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser. Enable location to see nearby Tata dealerships.');
            setLoading(false);
            return () => {
                active = false;
            };
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!active) {
                    return;
                }

                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationAccuracy(position.coords.accuracy || null);
            },
            () => {
                if (!active) {
                    return;
                }

                setError('Location access was denied. Enable location to see nearby Tata dealerships.');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!userLocation) {
            return undefined;
        }

        const controller = new AbortController();
        let active = true;

        const loadDealerships = async () => {
            setLoading(true);

            try {
                const results = await fetchNearbyTataDealerships(userLocation, controller.signal);

                if (!active) {
                    return;
                }

                setDealerships(results);
                setSelectedDealership(null);
            } catch (error) {
                if (!active || controller.signal.aborted) {
                    return;
                }

                console.error('Error loading dealerships:', error);
                setDealerships([]);
                setSelectedDealership(null);
                setError('Unable to load live Tata dealership locations right now. Please try again later.');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadDealerships();

        return () => {
            active = false;
            controller.abort();
        };
    }, [userLocation]);

    const handleDealershipClick = (dealership) => {
        setSelectedDealership(dealership);
    };

    const handleGetDirections = (dealership) => {
        window.open(buildDirectionsUrl(userLocation, dealership), '_blank', 'noopener,noreferrer');
    };

    if (loading) {
        return (
            <div className="dealership-locator-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Finding live Tata dealerships near you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dealership-locator-container">
            <header className="dealership-header">
                <h1>Live Tata Motors Dealerships</h1>
                <p>Nearby Tata dealership locations within 30 km are shown on the Carto Voyager basemap around your current position.</p>
                {locationAccuracy ? (
                    <p className="location-accuracy">Current location accuracy: about {Math.round(locationAccuracy)} meters.</p>
                ) : null}
                {error && <div className="error-message">⚠️ {error}</div>}
            </header>

            <div className="dealership-content">
                <div className="map-section">
                    <MapContainer
                        id="dealership-map"
                        className="map"
                        center={mapCenter}
                        zoom={11}
                        scrollWheelZoom
                    >
                        <MapViewController center={mapCenter} zoom={11} />
                        <TileLayer
                            attribution={TILE_LAYER_ATTRIBUTION}
                            url={TILE_LAYER_URL}
                        />

                        {userLocation && (
                            <Marker position={userLocation} icon={userLocationIcon}>
                                <Popup>
                                    <strong>Your current location</strong>
                                </Popup>
                            </Marker>
                        )}

                        {dealerships.map((dealership) => (
                            <Marker
                                key={dealership.id}
                                position={[dealership.lat, dealership.lng]}
                                icon={buildDealerIcon()}
                                eventHandlers={{
                                    click: () => handleDealershipClick(dealership)
                                }}
                            >
                                <Popup>
                                    <strong>{dealership.name}</strong>
                                    <br />
                                    {dealership.address}
                                    <br />
                                    {dealership.distance} km away
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <div className="map-legend">
                        <div className="legend-item">
                            <span className="legend-dot dealership"></span>
                            <span>Tata dealership</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot user"></span>
                            <span>Your Location</span>
                        </div>
                    </div>
                </div>

                <div className="dealerships-list">
                    <h2>Nearby Tata Dealerships within 30 km ({dealerships.length})</h2>
                    {dealerships.length === 0 ? (
                        <div className="dealership-card">
                            <p className="dealership-address">No Tata dealership locations were returned in the current search area.</p>
                        </div>
                    ) : dealerships.map((dealership) => (
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
