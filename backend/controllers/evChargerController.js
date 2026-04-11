const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const DEFAULT_SEARCH_RADIUS_METERS = 3000;
const REQUEST_TIMEOUT_MS = 15000;

const withTimeout = async (url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const buildOverpassQuery = (points = [], radiusMeters = DEFAULT_SEARCH_RADIUS_METERS) => {
  const aroundQueries = points
    .filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lng))
    .map((point) => {
      return `
        node["amenity"="charging_station"](around:${radiusMeters},${point.lat},${point.lng});
        way["amenity"="charging_station"](around:${radiusMeters},${point.lat},${point.lng});
        relation["amenity"="charging_station"](around:${radiusMeters},${point.lat},${point.lng});
      `;
    })
    .join("\n");

  return `[out:json][timeout:25];(
    ${aroundQueries}
  );out center tags;`;
};

const readOverpassJson = async (response) => {
  const raw = await response.text();

  if (!response.ok) {
    throw new Error(`Overpass request failed with status ${response.status}`);
  }

  try {
    return JSON.parse(raw);
  } catch (parseError) {
    throw new Error("Invalid Overpass response format");
  }
};

const fetchRouteChargers = async (req, res) => {
  try {
    const points = Array.isArray(req.body?.points) ? req.body.points : [];
    const requestedRadius = Number.parseInt(req.body?.radiusMeters, 10);
    const radiusMeters = Number.isFinite(requestedRadius)
      ? Math.min(Math.max(requestedRadius, 500), 5000)
      : DEFAULT_SEARCH_RADIUS_METERS;

    if (!points.length) {
      return res.status(400).json({ message: "Route points are required." });
    }

    const query = buildOverpassQuery(points, radiusMeters);
    let lastError = null;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const response = await withTimeout(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "application/json",
          },
          body: `data=${encodeURIComponent(query)}`,
        });

        const payload = await readOverpassJson(response);
        return res.status(200).json({ elements: payload.elements || [] });
      } catch (error) {
        lastError = error;
      }
    }

    return res.status(502).json({
      message: "Unable to fetch EV chargers from providers right now.",
      details: lastError?.message || "No provider response",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error while loading EV chargers." });
  }
};

module.exports = {
  fetchRouteChargers,
};
