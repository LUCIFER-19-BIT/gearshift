import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../ChargingStations.css';

const DEFAULT_MAP_CENTER = { lat: 20.5937, lng: 78.9629 };
const SEARCH_RADIUS_METERS = 25000;
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
];
const TILE_LAYER_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

const buildStationIcon = (isPublic) => L.divIcon({
    className: 'charging-marker',
    html: `<span class="charging-marker__pin ${isPublic ? 'charging-marker__pin--public' : 'charging-marker__pin--restricted'}"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -26]
});

const userLocationIcon = L.divIcon({
    className: 'charging-marker charging-marker--user',
    html: '<span class="charging-marker__user-dot"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10]
});

const deg2rad = (deg) => deg * (Math.PI / 180);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return (earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

const buildAddress = (tags = {}) => {
    const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:suburb'],
        tags['addr:city'],
        tags['addr:state']
    ].filter(Boolean);

    if (addressParts.length > 0) {
        return addressParts.join(', ');
    }

    return tags['addr:full'] || tags.operator || 'Address not listed';
};

const buildPowerLabel = (tags = {}) => tags.maxpower || tags.capacity || 'Power info not listed';

const buildConnectorLabel = (tags = {}) => {
    const connectorFields = [
        'socket:type2',
        'socket:ccs1',
        'socket:ccs2',
        'socket:chademo',
        'socket:type1',
        'socket:tesla_supercharger',
        'socket:gbt_dc'
    ];

    const connectors = connectorFields
        .filter((field) => tags[field])
        .map((field) => field.replace('socket:', '').toUpperCase());

    return connectors.length > 0 ? connectors.join(', ') : 'Connector not listed';
};

const isPublicAccess = (tags = {}) => {
    const access = String(tags.access || 'public').toLowerCase();
    return access === 'public' || access === 'permissive' || access === 'yes';
};

const buildDirectionsUrl = (from, to) => {
    if (!from || !to) {
        return 'https://www.openstreetmap.org';
    }

    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from.lat}%2C${from.lng}%3B${to.lat}%2C${to.lng}`;
};

const MapViewController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);

    return null;
};

const normalizeStation = (element, location, originLocation, index) => {
    const tags = element.tags || {};

    return {
        id: `${element.type}-${element.id || index}`,
        name: tags.name || tags.operator || tags.network || 'EV Charging Station',
        address: buildAddress(tags),
        lat: location.lat,
        lng: location.lng,
        operator: tags.operator || tags.network || 'OpenStreetMap',
        connector: buildConnectorLabel(tags),
        power: buildPowerLabel(tags),
        access: tags.access || 'public',
        isPublic: isPublicAccess(tags),
        distance: calculateDistance(originLocation.lat, originLocation.lng, location.lat, location.lng),
        website: tags.website || tags['contact:website'] || null,
        phone: tags.phone || tags['contact:phone'] || null
    };
};

const ChargingStations = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    const mapCenter = selectedStation
        ? [selectedStation.lat, selectedStation.lng]
        : userLocation
            ? [userLocation.lat, userLocation.lng]
            : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng];

    const fetchChargingStations = useCallback(async (location, signal) => {
        const query = `[out:json][timeout:25];(
            node["amenity"="charging_station"](around:${SEARCH_RADIUS_METERS},${location.lat},${location.lng});
            way["amenity"="charging_station"](around:${SEARCH_RADIUS_METERS},${location.lat},${location.lng});
            relation["amenity"="charging_station"](around:${SEARCH_RADIUS_METERS},${location.lat},${location.lng});
        );out center tags;`;

        let lastError = null;

        for (const endpoint of OVERPASS_ENDPOINTS) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: `data=${encodeURIComponent(query)}`,
                    signal
                });

                if (!response.ok) {
                    throw new Error(`Overpass request failed with ${response.status}`);
                }

                const data = await response.json();
                const results = (data.elements || [])
                    .map((element, index) => {
                        const coordinates = element.type === 'node' ? { lat: element.lat, lng: element.lon } : element.center;
                        if (!coordinates) {
                            return null;
                        }

                        return normalizeStation(element, coordinates, location, index);
                    })
                    .filter(Boolean)
                    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                    .slice(0, 25);

                if (results.length > 0) {
                    return results;
                }

                lastError = new Error('No charging stations returned from this endpoint.');
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('Unable to load charging stations.');
    }, []);

    useEffect(() => {
        let active = true;

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser. Enable location to see nearby charging stations.');
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
            },
            () => {
                if (!active) {
                    return;
                }

                setError('Location access was denied. Enable location to see nearby charging stations.');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
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

        const loadStations = async () => {
            setLoading(true);

            try {
                const results = await fetchChargingStations(userLocation, controller.signal);

                if (!active) {
                    return;
                }

                setStations(results);
                setSelectedStation(null);
            } catch (error) {
                if (!active || controller.signal.aborted) {
                    return;
                }

                console.error('Error loading charging stations:', error);
                setStations([]);
                setSelectedStation(null);
                setError('Unable to load live charging stations right now. Please try again later.');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadStations();

        return () => {
            active = false;
            controller.abort();
        };
    }, [fetchChargingStations, userLocation]);

    const handleStationClick = (station) => {
        setSelectedStation(station);
    };

    const handleGetDirections = (station) => {
        window.open(buildDirectionsUrl(userLocation, station), '_blank', 'noopener,noreferrer');
    };

    if (loading) {
        return (
            <div className="charging-stations-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Finding live charging stations near you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="charging-stations-container">
            <header className="charging-header">
                <h1>Live EV Charging Points</h1>
                <p>Nearby public charging stations shown on the Carto Voyager basemap, centered on your location.</p>
                {error && <div className="error-message">⚠️ {error}</div>}
            </header>

            <div className="charging-content">
                <div className="map-section">
                    <MapContainer
                        id="map"
                        className="map"
                        center={mapCenter}
                        zoom={12}
                        scrollWheelZoom
                        key={`${mapCenter[0]}-${mapCenter[1]}`}
                    >
                        <MapViewController center={mapCenter} zoom={12} />
                        <TileLayer
                            attribution={TILE_LAYER_ATTRIBUTION}
                            url={TILE_LAYER_URL}
                        />

                        {userLocation && (
                            <Marker position={userLocation} icon={userLocationIcon}>
                                <Popup>
                                    <strong>Your current location</strong>
                                    <br />
                                    Nearby charging stations are sorted by distance.
                                </Popup>
                            </Marker>
                        )}

                        {stations.map((station) => (
                            <Marker
                                key={station.id}
                                position={[station.lat, station.lng]}
                                icon={buildStationIcon(station.isPublic)}
                                eventHandlers={{
                                    click: () => handleStationClick(station)
                                }}
                            >
                                <Popup>
                                    <strong>{station.name}</strong>
                                    <br />
                                    {station.address}
                                    <br />
                                    {station.distance ? `${station.distance} km away` : 'Nearby'}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <div className="map-legend">
                        <div className="legend-item">
                            <span className="legend-dot available"></span>
                            <span>Public station</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot unavailable"></span>
                            <span>Restricted access</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot user"></span>
                            <span>Your location</span>
                        </div>
                    </div>
                </div>

                <div className="stations-list">
                    <h2>Nearby Stations ({stations.length})</h2>
                    {stations.length === 0 ? (
                        <div className="station-card">
                            <p className="station-address">No public charging stations were found within the current search area.</p>
                        </div>
                    ) : stations.map((station) => (
                        <div
                            key={station.id}
                            className={`station-card ${selectedStation?.id === station.id ? 'selected' : ''}`}
                            onClick={() => handleStationClick(station)}
                        >
                            <div className="station-header">
                                <h3>{station.name}</h3>
                                <span className={`status-badge ${station.isPublic ? 'available' : 'unavailable'}`}>
                                    {station.isPublic ? 'Public' : 'Restricted'}
                                </span>
                            </div>
                            <p className="station-address">📍 {station.address}</p>
                            <div className="station-details">
                                <div className="detail-item">
                                    <span className="detail-label">Operator:</span>
                                    <span className="detail-value">{station.operator}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Connector:</span>
                                    <span className="detail-value">{station.connector}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Power:</span>
                                    <span className="detail-value">{station.power}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Distance:</span>
                                    <span className="detail-value">{station.distance} km</span>
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
