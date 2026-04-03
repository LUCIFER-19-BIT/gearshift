const BACKEND_BASE_URL = 'http://localhost:8001';

export const DEFAULT_LOCATION = { lat: 20.5937, lng: 78.9629 };

const deg2rad = (deg) => deg * (Math.PI / 180);

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return (earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

export const groupDealershipsByCity = (dealerships = []) => {
    return dealerships.reduce((acc, dealership) => {
        const city = dealership.city || 'Nearby';
        if (!acc[city]) {
            acc[city] = [];
        }
        acc[city].push(dealership);
        return acc;
    }, {});
};

export const fetchNearbyTataDealerships = async (location = DEFAULT_LOCATION) => {
    const params = new URLSearchParams({
        lat: String(location.lat),
        lng: String(location.lng),
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/dealerships/nearby?${params.toString()}`, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Unable to load Tata dealerships.');
    }

    const payload = await response.json();
    return payload.dealerships || [];
};
