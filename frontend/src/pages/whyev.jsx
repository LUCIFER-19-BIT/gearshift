import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/whyev.css";
import EvStatsGraphs from "../components/EvStatsGraphs";
import {
  DEFAULT_LOCATION,
  calculateDistance,
  fetchNearbyTataDealerships,
} from "../utils/dealershipApi";

const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const TILE_LAYER_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const OSRM_ROUTE_ENDPOINT = "https://router.project-osrm.org/route/v1/driving";
const ENDPOINT_EXCLUSION_KM = 3;
const BACKEND_BASE_URL = "http://localhost:8001";
const MID_ROUTE_MIN_PROGRESS = 0.1;
const MID_ROUTE_MAX_PROGRESS = 0.9;
const ROUTE_CORRIDOR_KM_STRICT = 6;
const ROUTE_CORRIDOR_KM_RELAXED = 10;

const dealerIcon = L.divIcon({
  className: "whyev-marker whyev-marker--dealer",
  html: '<span class="whyev-marker__dot"></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -20],
});

const placeIcon = L.divIcon({
  className: "whyev-marker whyev-marker--place",
  html: '<span class="whyev-marker__dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
  popupAnchor: [0, -18],
});

const chargerIcon = L.divIcon({
  className: "whyev-marker whyev-marker--charger",
  html: '<span class="whyev-marker__dot"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -16],
});

const getMidPoint = (pointA, pointB) => {
  if (!pointA || !pointB) {
    return null;
  }

  return {
    lat: (pointA.lat + pointB.lat) / 2,
    lng: (pointA.lng + pointB.lng) / 2,
  };
};

const readJsonResponse = async (response, fallbackMessage) => {
  const raw = await response.text();

  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  try {
    return JSON.parse(raw);
  } catch (parseError) {
    const sample = raw.slice(0, 60).trim();
    const looksLikeMarkup = sample.startsWith("<");

    throw new Error(
      looksLikeMarkup
        ? "Service is temporarily unavailable or rate-limited. Please try again in a moment."
        : fallbackMessage
    );
  }
};

const getFriendlyErrorMessage = (error, fallbackMessage) => {
  const rawMessage = String(error?.message || "").trim();

  if (!rawMessage) {
    return fallbackMessage;
  }

  if (
    rawMessage === "Failed to fetch" ||
    /networkerror|load failed|network request failed/i.test(rawMessage)
  ) {
    return "Unable to reach map services right now. Please check your internet connection and try again.";
  }

  if (/aborted/i.test(rawMessage)) {
    return "Request was interrupted. Please try again.";
  }

  return rawMessage;
};

const geocodeAddress = async (query) => {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    addressdetails: "1",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await readJsonResponse(
    response,
    "Unable to fetch map coordinates. Please try again."
  );
  if (!data.length) {
    throw new Error(`Location not found for: ${query}`);
  }

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    label: data[0].display_name,
  };
};

const reverseGeocode = async (lat, lng) => {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await readJsonResponse(
    response,
    "Unable to resolve selected map location."
  );
  return data.display_name || `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
};

const buildStationAddress = (tags = {}) => {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return tags["addr:full"] || tags.operator || "Address not listed";
};

const buildConnectorText = (tags = {}) => {
  const socketFields = [
    "socket:type2",
    "socket:ccs2",
    "socket:chademo",
    "socket:gbt_dc",
  ];
  const supported = socketFields
    .filter((field) => tags[field])
    .map((field) => field.replace("socket:", "").toUpperCase());

  return supported.length > 0 ? supported.join(", ") : "Connector not listed";
};

const normalizeStation = (element, location, homeLocation, officeLocation, index) => {
  const tags = element.tags || {};
  const distanceFromOffice = calculateDistance(
    officeLocation.lat,
    officeLocation.lng,
    location.lat,
    location.lng
  );
  const distanceFromHome = homeLocation
    ? calculateDistance(homeLocation.lat, homeLocation.lng, location.lat, location.lng)
    : null;

  return {
    id: `${element.type}-${element.id || index}`,
    name: tags.name || tags.operator || tags.network || "EV Charging Station",
    lat: location.lat,
    lng: location.lng,
    address: buildStationAddress(tags),
    connector: buildConnectorText(tags),
    power: tags.maxpower || tags.capacity || "Power info not listed",
    distance: distanceFromOffice,
    distanceFromOffice,
    distanceFromHome,
  };
};

const sampleRoutePoints = (coordinates, maxPoints = 12) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return [];
  }

  if (coordinates.length <= maxPoints) {
    return coordinates;
  }

  const step = Math.max(1, Math.floor(coordinates.length / maxPoints));
  const sampled = [];

  for (let index = 0; index < coordinates.length; index += step) {
    sampled.push(coordinates[index]);
  }

  const lastPoint = coordinates[coordinates.length - 1];
  const existingLast = sampled[sampled.length - 1];
  if (!existingLast || existingLast[0] !== lastPoint[0] || existingLast[1] !== lastPoint[1]) {
    sampled.push(lastPoint);
  }

  return sampled;
};

const buildMidRoutePoints = (coordinates) => {
  const sampledPoints = sampleRoutePoints(coordinates, 24);
  if (sampledPoints.length <= 2) {
    return sampledPoints;
  }

  // Skip the first and last sampled points to avoid clustering near home/office.
  return sampledPoints.slice(1, -1);
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const haversineDistanceKm = (pointA, pointB) => {
  const earthRadius = 6371;
  const dLat = toRadians(pointB[0] - pointA[0]);
  const dLng = toRadians(pointB[1] - pointA[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(pointA[0])) *
      Math.cos(toRadians(pointB[0])) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getClosestRoutePoint = (stationPoint, routePoints) => {
  if (!routePoints.length) {
    return { index: -1, distanceKm: Number.POSITIVE_INFINITY };
  }

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  routePoints.forEach((routePoint, index) => {
    const distance = haversineDistanceKm(stationPoint, routePoint);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return { index: bestIndex, distanceKm: bestDistance };
};

const withinProgressBand = (progress, min, max) => progress >= min && progress <= max;

const buildRoutePath = async (homeLocation, officeLocation) => {
  const url = `${OSRM_ROUTE_ENDPOINT}/${homeLocation.lng},${homeLocation.lat};${officeLocation.lng},${officeLocation.lat}?overview=full&geometries=geojson`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await readJsonResponse(
    response,
    "Unable to build route between home and office right now."
  );

  const routeCoordinates = data?.routes?.[0]?.geometry?.coordinates;
  if (!Array.isArray(routeCoordinates) || routeCoordinates.length === 0) {
    throw new Error("Could not find a drivable route between selected points.");
  }

  return routeCoordinates.map(([lng, lat]) => [lat, lng]);
};

const MapClickSelector = ({ onPick }) => {
  useMapEvents({
    click: (event) => {
      onPick(event.latlng);
    },
  });

  return null;
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

export default function WhyEV() {
  const [homeAddress, setHomeAddress] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [homePoint, setHomePoint] = useState(null);
  const [officePoint, setOfficePoint] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [dealerships, setDealerships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pickTarget, setPickTarget] = useState("home");
  const [chargingStations, setChargingStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState("");
  const [selectedChargingStation, setSelectedChargingStation] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [retryRouteFetchKey, setRetryRouteFetchKey] = useState(0);

  const [petrolPrice, setPetrolPrice] = useState(104);
  const [petrolMileage, setPetrolMileage] = useState(15);
  const [electricityPrice, setElectricityPrice] = useState(8);
  const [evEfficiency, setEvEfficiency] = useState(6.2);
  const [workingDays, setWorkingDays] = useState(22);

  const mapCenter = useMemo(() => {
    if (selectedChargingStation) {
      return [selectedChargingStation.lat, selectedChargingStation.lng];
    }
    const midPoint = getMidPoint(homePoint, officePoint);
    if (midPoint) {
      return [midPoint.lat, midPoint.lng];
    }
    if (homePoint) {
      return [homePoint.lat, homePoint.lng];
    }
    if (officePoint) {
      return [officePoint.lat, officePoint.lng];
    }
    if (dealerships.length > 0) {
      return [dealerships[0].lat, dealerships[0].lng];
    }
    return [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng];
  }, [selectedChargingStation, homePoint, officePoint, dealerships]);

  const commuteStats = useMemo(() => {
    if (!distanceKm || distanceKm <= 0 || petrolMileage <= 0 || evEfficiency <= 0) {
      return null;
    }

    const monthlyKm = distanceKm * 2 * workingDays;
    const monthlyPetrolCost = (monthlyKm / petrolMileage) * petrolPrice;
    const monthlyEvCost = (monthlyKm / evEfficiency) * electricityPrice;
    const monthlySavings = monthlyPetrolCost - monthlyEvCost;
    const yearlySavings = monthlySavings * 12;
    const petrolLitresMonthly = monthlyKm / petrolMileage;
    const co2SavedKg = petrolLitresMonthly * 2.31;

    return {
      monthlyKm,
      monthlyPetrolCost,
      monthlyEvCost,
      monthlySavings,
      yearlySavings,
      co2SavedKg,
    };
  }, [distanceKm, petrolMileage, petrolPrice, evEfficiency, electricityPrice, workingDays]);

  const loadDealershipsNear = async (location) => {
    try {
      const results = await fetchNearbyTataDealerships(location);
      setDealerships(results);
    } catch (apiError) {
      console.error("Dealership API failed:", apiError);
      setDealerships([]);
      setError(getFriendlyErrorMessage(apiError, "Unable to load dealership data right now."));
    }
  };

  useEffect(() => {
    let isActive = true;

    const fetchInitialDealers = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              if (!isActive) {
                return;
              }

              await loadDealershipsNear({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            async () => {
              if (!isActive) {
                return;
              }
              await loadDealershipsNear(DEFAULT_LOCATION);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
          return;
        }

        await loadDealershipsNear(DEFAULT_LOCATION);
      } catch (apiError) {
        console.error("Initial dealership fetch failed:", apiError);
      }
    };

    fetchInitialDealers();

    return () => {
      isActive = false;
    };
  }, []);

  const handleCompare = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const [resolvedHome, resolvedOffice] = await Promise.all([
        geocodeAddress(homeAddress),
        geocodeAddress(officeAddress),
      ]);

      const calculatedDistance = Number(
        calculateDistance(
          resolvedHome.lat,
          resolvedHome.lng,
          resolvedOffice.lat,
          resolvedOffice.lng
        )
      );

      setHomePoint(resolvedHome);
      setOfficePoint(resolvedOffice);
      setDistanceKm(calculatedDistance);
      await loadDealershipsNear(resolvedHome);
    } catch (apiError) {
      setError(getFriendlyErrorMessage(apiError, "Could not compare costs right now."));
    } finally {
      setLoading(false);
    }
  };

  const handleMapPick = async ({ lat, lng }) => {
    setError("");
    const fallbackLabel = `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;

    let resolvedLabel = fallbackLabel;
    try {
      resolvedLabel = await reverseGeocode(lat, lng);
    } catch (apiError) {
      console.error("Reverse geocode failed:", apiError);
    }

    if (pickTarget === "home") {
      const nextHome = { lat, lng, label: resolvedLabel };
      setHomePoint(nextHome);
      setSelectedChargingStation(null);
      setRetryRouteFetchKey(0);
      setHomeAddress(resolvedLabel);
      await loadDealershipsNear(nextHome);

      if (officePoint) {
        const calculatedDistance = Number(
          calculateDistance(lat, lng, officePoint.lat, officePoint.lng)
        );
        setDistanceKm(calculatedDistance);
      }
      return;
    }

    const nextOffice = { lat, lng, label: resolvedLabel };
    setOfficePoint(nextOffice);
    setSelectedChargingStation(null);
    setRetryRouteFetchKey(0);
    setOfficeAddress(resolvedLabel);

    if (homePoint) {
      const calculatedDistance = Number(
        calculateDistance(homePoint.lat, homePoint.lng, lat, lng)
      );
      setDistanceKm(calculatedDistance);
    }
  };

  useEffect(() => {
    if (!officePoint) {
      setChargingStations([]);
      setSelectedChargingStation(null);
      setStationsError("");
      setRoutePath([]);
      return;
    }

    if (!homePoint) {
      setChargingStations([]);
      setSelectedChargingStation(null);
      setStationsError("");
      setRoutePath([]);
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const loadChargingStations = async () => {
      setStationsLoading(true);
      setStationsError("");
      setRoutePath([]);

      let routeCoordinates = [];

      try {
        routeCoordinates = await buildRoutePath(homePoint, officePoint);
        setRoutePath(routeCoordinates);
      } catch (apiError) {
        if (!isActive || controller.signal.aborted) {
          return;
        }
        setChargingStations([]);
        setSelectedChargingStation(null);
        setStationsLoading(false);
        setStationsError(
          getFriendlyErrorMessage(apiError, "Unable to load route between home and office.")
        );
        return;
      }

      const midRoutePoints = buildMidRoutePoints(routeCoordinates);
      if (midRoutePoints.length === 0) {
        setChargingStations([]);
        setSelectedChargingStation(null);
        setStationsLoading(false);
        setStationsError("Unable to sample points on selected route.");
        return;
      }

      let resolvedStations = [];
      let lastError = null;

      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/ev-chargers/route`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            points: midRoutePoints.map(([lat, lng]) => ({ lat, lng })),
            radiusMeters: 3500,
          }),
          signal: controller.signal,
        });

        const data = await readJsonResponse(
          response,
          `Charging API failed with ${response.status}`
        );

        const allStations = (data.elements || [])
          .map((element, index) => {
            const coordinates =
              element.type === "node"
                ? { lat: element.lat, lng: element.lon }
                : {
                    lat: element.center?.lat,
                    lng: element.center?.lon,
                  };

            if (
              !coordinates ||
              !Number.isFinite(coordinates.lat) ||
              !Number.isFinite(coordinates.lng)
            ) {
              return null;
            }

            return normalizeStation(element, coordinates, homePoint, officePoint, index);
          })
          .filter(Boolean)
          .sort((a, b) => parseFloat(a.distanceFromOffice) - parseFloat(b.distanceFromOffice));

        const inBetweenStations = allStations.filter((station) => {
          const officeDistance = Number.parseFloat(station.distanceFromOffice);
          const homeDistance = Number.parseFloat(station.distanceFromHome || "0");
          const closest = getClosestRoutePoint([station.lat, station.lng], routeCoordinates);
          const progress = closest.index / Math.max(routeCoordinates.length - 1, 1);

          return (
            Number.isFinite(officeDistance) &&
            Number.isFinite(homeDistance) &&
            closest.distanceKm <= ROUTE_CORRIDOR_KM_STRICT &&
            withinProgressBand(progress, MID_ROUTE_MIN_PROGRESS, MID_ROUTE_MAX_PROGRESS)
          );
        });

        const relaxedStations = allStations.filter((station) => {
          const officeDistance = Number.parseFloat(station.distanceFromOffice);
          const homeDistance = Number.parseFloat(station.distanceFromHome || "0");
          const closest = getClosestRoutePoint([station.lat, station.lng], routeCoordinates);
          const progress = closest.index / Math.max(routeCoordinates.length - 1, 1);

          return (
            Number.isFinite(officeDistance) &&
            Number.isFinite(homeDistance) &&
            closest.distanceKm <= ROUTE_CORRIDOR_KM_RELAXED &&
            withinProgressBand(progress, 0.05, 0.95)
          );
        });

        const corridorStations = allStations.filter((station) => {
          const officeDistance = Number.parseFloat(station.distanceFromOffice);
          const homeDistance = Number.parseFloat(station.distanceFromHome || "0");
          const closest = getClosestRoutePoint([station.lat, station.lng], routeCoordinates);

          return (
            Number.isFinite(officeDistance) &&
            Number.isFinite(homeDistance) &&
            closest.distanceKm <= ROUTE_CORRIDOR_KM_RELAXED
          );
        });

        const endpointStations = allStations.filter((station) => {
          const officeDistance = Number.parseFloat(station.distanceFromOffice);
          const homeDistance = Number.parseFloat(station.distanceFromHome || "0");

          return (
            Number.isFinite(officeDistance) &&
            Number.isFinite(homeDistance) &&
            (officeDistance <= ENDPOINT_EXCLUSION_KM || homeDistance <= ENDPOINT_EXCLUSION_KM)
          );
        });

        let routeSelection = [];

        if (inBetweenStations.length >= 5) {
          routeSelection = inBetweenStations.slice(0, 20);
        } else if (relaxedStations.length >= 3) {
          routeSelection = relaxedStations.slice(0, 20);
        } else {
          routeSelection = corridorStations.slice(0, 20);
        }

        const merged = [...routeSelection];
        endpointStations.slice(0, 8).forEach((station) => {
          if (!merged.some((item) => item.id === station.id)) {
            merged.push(station);
          }
        });

        resolvedStations = merged.slice(0, 28);
        if (resolvedStations.length === 0) {
          lastError = new Error("No charging stations found in the middle section of this route.");
        }
      } catch (apiError) {
        lastError = apiError;
      }

      if (!isActive || controller.signal.aborted) {
        return;
      }

      if (resolvedStations.length > 0) {
        setChargingStations(resolvedStations);
        setSelectedChargingStation(null);
      } else {
        setChargingStations([]);
        setSelectedChargingStation(null);
        setStationsError(
          getFriendlyErrorMessage(lastError, "Could not fetch EV chargers on this route.")
        );
      }

      setStationsLoading(false);
    };

    loadChargingStations().catch((apiError) => {
      if (!isActive || controller.signal.aborted) {
        return;
      }
      setStationsLoading(false);
      setStationsError(
        getFriendlyErrorMessage(apiError, "Could not fetch EV chargers on this route.")
      );
    });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [homePoint, officePoint, retryRouteFetchKey]);

  const handleRetryRouteFetch = () => {
    setStationsError("");
    setRetryRouteFetchKey((prev) => prev + 1);
  };

  return (
    <main className="whyev-page">
      <section className="whyev-hero">
        <h1>Why EV?</h1>
        <p>
          Explore nearby Tata EV dealerships on the map, compare your daily commute
          cost, and see why an EV is often the smarter long-term choice.
        </p>
      </section>

      <section className="whyev-map-card">
        <div className="whyev-card-head">
          <h2>Nearby Tata Dealerships Map</h2>
          <p>Dealerships are loaded using your existing backend API endpoint.</p>
        </div>

        <div className="whyev-map-picker-controls">
          <button
            type="button"
            className={`whyev-pick-btn ${pickTarget === "home" ? "active" : ""}`}
            onClick={() => setPickTarget("home")}
          >
            Pick Home on Map
          </button>
          <button
            type="button"
            className={`whyev-pick-btn ${pickTarget === "office" ? "active" : ""}`}
            onClick={() => setPickTarget("office")}
          >
            Pick Office on Map
          </button>
          <p className="whyev-pick-hint">Map click mode: {pickTarget.toUpperCase()}</p>
        </div>

        <MapContainer center={mapCenter} zoom={11} className="whyev-map" scrollWheelZoom>
          <MapViewController center={mapCenter} zoom={selectedChargingStation ? 13 : 11} />
          <MapClickSelector onPick={handleMapPick} />
          <TileLayer attribution={TILE_LAYER_ATTRIBUTION} url={TILE_LAYER_URL} />

          {routePath.length > 0 ? (
            <Polyline positions={routePath} pathOptions={{ color: "#3ca8ff", weight: 4, opacity: 0.85 }} />
          ) : null}

          {homePoint ? (
            <Marker position={[homePoint.lat, homePoint.lng]} icon={placeIcon}>
              <Popup>
                <strong>Home</strong>
                <br />
                {homePoint.label}
              </Popup>
            </Marker>
          ) : null}

          {officePoint ? (
            <Marker position={[officePoint.lat, officePoint.lng]} icon={placeIcon}>
              <Popup>
                <strong>Office</strong>
                <br />
                {officePoint.label}
              </Popup>
            </Marker>
          ) : null}

          {!homePoint || !officePoint
            ? dealerships.map((dealer) => (
                <Marker key={dealer.id} position={[dealer.lat, dealer.lng]} icon={dealerIcon}>
                  <Popup>
                    <strong>{dealer.name}</strong>
                    <br />
                    {dealer.address}
                    <br />
                    {dealer.distance} km away
                  </Popup>
                </Marker>
              ))
            : null}

          {chargingStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={chargerIcon}
              eventHandlers={{
                click: () => setSelectedChargingStation(station),
              }}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                {station.address}
                <br />
                {station.distance} km from office
                {homePoint ? (
                  <>
                    <br />
                    {station.distanceFromHome} km from home
                  </>
                ) : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <section className="whyev-calculator">
        <div className="whyev-card-head">
          <h2>Home to Office Cost Comparison</h2>
          <p>Enter both locations to calculate distance, monthly running cost, and savings.</p>
        </div>

        <form className="whyev-form" onSubmit={handleCompare}>
          <label>
            Home location
            <input
              type="text"
              value={homeAddress}
              onChange={(event) => setHomeAddress(event.target.value)}
              placeholder="Example: Viman Nagar, Pune"
              required
            />
          </label>

          <label>
            Office location
            <input
              type="text"
              value={officeAddress}
              onChange={(event) => setOfficeAddress(event.target.value)}
              placeholder="Example: Hinjewadi Phase 2, Pune"
              required
            />
          </label>

          <div className="whyev-assumptions">
            <label>
              Petrol price (Rs/litre)
              <input
                type="number"
                min="1"
                value={petrolPrice}
                onChange={(event) => setPetrolPrice(Number(event.target.value))}
              />
            </label>

            <label>
              Petrol mileage (km/l)
              <input
                type="number"
                min="1"
                step="0.1"
                value={petrolMileage}
                onChange={(event) => setPetrolMileage(Number(event.target.value))}
              />
            </label>

            <label>
              Electricity price (Rs/kWh)
              <input
                type="number"
                min="1"
                step="0.1"
                value={electricityPrice}
                onChange={(event) => setElectricityPrice(Number(event.target.value))}
              />
            </label>

            <label>
              EV efficiency (km/kWh)
              <input
                type="number"
                min="1"
                step="0.1"
                value={evEfficiency}
                onChange={(event) => setEvEfficiency(Number(event.target.value))}
              />
            </label>

            <label>
              Working days/month
              <input
                type="number"
                min="1"
                max="31"
                value={workingDays}
                onChange={(event) => setWorkingDays(Number(event.target.value))}
              />
            </label>
          </div>

          <button type="submit" className="whyev-btn" disabled={loading}>
            {loading ? "Calculating..." : "Calculate Distance and Cost"}
          </button>
        </form>

        {error ? <p className="whyev-error">{error}</p> : null}

        {commuteStats ? (
          <div className="whyev-results">
            <article>
              <h3>Distance</h3>
              <p>{distanceKm.toFixed(1)} km one-way</p>
            </article>
            <article>
              <h3>Monthly Petrol Cost</h3>
              <p>Rs {commuteStats.monthlyPetrolCost.toFixed(0)}</p>
            </article>
            <article>
              <h3>Monthly EV Cost</h3>
              <p>Rs {commuteStats.monthlyEvCost.toFixed(0)}</p>
            </article>
            <article>
              <h3>Monthly Savings with EV</h3>
              <p className="savings">Rs {commuteStats.monthlySavings.toFixed(0)}</p>
            </article>
            <article>
              <h3>Estimated Yearly Savings</h3>
              <p className="savings">Rs {commuteStats.yearlySavings.toFixed(0)}</p>
            </article>
            <article>
              <h3>Monthly CO2 Reduction</h3>
              <p>{commuteStats.co2SavedKg.toFixed(1)} kg</p>
            </article>
          </div>
        ) : null}
      </section>

      <section className="whyev-chargers">
        <h2>EV Chargers On Home to Office Route</h2>
        <p>
          {homePoint && officePoint
            ? "Showing charging points along your route, including options near start and end points as well as in-between road sections."
            : "Select both Home and Office to see chargers on the route."}
        </p>

        {stationsLoading ? <p>Loading chargers on your route...</p> : null}
        {stationsError ? <p className="whyev-error">{stationsError}</p> : null}
        {stationsError && homePoint && officePoint ? (
          <button
            type="button"
            className="whyev-retry-btn"
            onClick={handleRetryRouteFetch}
            disabled={stationsLoading}
          >
            Retry Route Chargers
          </button>
        ) : null}

        {chargingStations.length > 0 ? (
          <div className="whyev-charger-list">
            {chargingStations.map((station) => (
              <article
                key={station.id}
                className={`whyev-charger-card ${selectedChargingStation?.id === station.id ? "selected" : ""}`}
                onClick={() => setSelectedChargingStation(station)}
              >
                <h3>{station.name}</h3>
                <p>{station.address}</p>
                <p>Distance from office: {station.distanceFromOffice} km</p>
                {homePoint ? (
                  <p>
                    Distance from home: {station.distanceFromHome} km
                  </p>
                ) : null}
                <p>Connector: {station.connector}</p>
                <p>Power: {station.power}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <EvStatsGraphs />

      <section className="whyev-why-better">
        <h2>Why EV is Better</h2>
        <ul>
          <li>Lower running cost for daily commuting, especially in city stop-go traffic.</li>
          <li>Zero tailpipe emissions, improving urban air quality near homes and offices.</li>
          <li>Lower maintenance needs because EVs have fewer moving parts than petrol cars.</li>
          <li>Smooth and instant torque delivery, making everyday driving effortless.</li>
          <li>Future-ready ownership as charging network and EV support keep expanding.</li>
        </ul>
      </section>
    </main>
  );
}
