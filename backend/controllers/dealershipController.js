const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const TATA_DEALER_LOCATOR = 'https://dealer-locator.cars.tatamotors.com';
const BIGDATACLOUD_REVERSE_ENDPOINT = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_NEARBY_RADIUS_KM = 30;
const cache = new Map();

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
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
    tags['addr:state'],
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return tags['addr:full'] || tags['contact:address'] || 'Address not listed';
};

const buildTagText = (tags = {}) => {
  return [
    tags.name,
    tags.brand,
    tags.operator,
    tags.network,
    tags.description,
    tags.website,
    tags['contact:website'],
    tags['contact:brand'],
  ]
    .filter(Boolean)
    .join(' ');
};

const isTataText = (value = '') => /tata/i.test(String(value));

const scoreTataMatch = (tags = {}, text = '') => {
  const values = `${buildTagText(tags)} ${text}`;
  let score = 0;

  if (isTataText(tags.name)) score += 6;
  if (isTataText(tags.brand)) score += 8;
  if (isTataText(tags.operator)) score += 8;
  if (isTataText(tags.network)) score += 4;
  if (isTataText(tags['contact:brand'])) score += 4;
  if (/tata\s*motor/i.test(values)) score += 10;
  if (/dealership|dealer|showroom|service center|service centre/i.test(values)) score += 3;

  return score;
};

const isTataDealership = (tags = {}, text = '') => scoreTataMatch(tags, text) > 0;

const normalizeDealership = (element, location, originLocation, index) => {
  const tags = element.tags || {};

  return {
    id: `${element.type}-${element.id || index}`,
    name: tags.name || tags.brand || tags.operator || 'Tata Dealership',
    address: buildAddress(tags),
    lat: location.lat,
    lng: location.lng,
    city: tags['addr:city'] || tags['addr:suburb'] || tags['addr:state'] || 'Nearby',
    phone: tags.phone || tags['contact:phone'] || 'Not listed',
    website: tags.website || tags['contact:website'] || null,
    matchScore: scoreTataMatch(tags),
    services: [
      'Sales',
      tags['service:vehicle:car'] ? 'Vehicle Service' : 'Service',
      tags['sales:used'] ? 'Used Cars' : 'New Cars',
    ],
    timing: tags.opening_hours || 'Hours not listed',
    distance: calculateDistance(originLocation.lat, originLocation.lng, location.lat, location.lng),
  };
};

const normalizeNominatimResult = (result, originLocation, index) => {
  const address = result.address || {};
  const displayName = result.display_name || '';
  const extraTags = result.extratags || {};

  return {
    id: `nominatim-${result.place_id || index}`,
    name: result.name || displayName.split(',')[0] || 'Tata Dealership',
    address: [
      address.house_number,
      address.road,
      address.suburb,
      address.city || address.town || address.village,
      address.state,
      address.postcode,
    ].filter(Boolean).join(', ') || displayName,
    lat: Number(result.lat),
    lng: Number(result.lon),
    city: address.city || address.town || address.village || address.suburb || address.state || 'Nearby',
    phone: extraTags.phone || extraTags['contact:phone'] || 'Not listed',
    website: extraTags.website || extraTags['contact:website'] || null,
    matchScore: scoreTataMatch(extraTags, displayName),
    services: ['Sales', 'Service', 'New Cars'],
    timing: extraTags.opening_hours || 'Hours not listed',
    distance: calculateDistance(originLocation.lat, originLocation.lng, Number(result.lat), Number(result.lon)),
  };
};

const dedupeDealerships = (dealerships = []) => {
  const seen = new Set();

  return dealerships.filter((dealer) => {
    const key = `${dealer.name}-${dealer.lat.toFixed(4)}-${dealer.lng.toFixed(4)}`.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const filterDealershipsWithinRadius = (dealerships = []) => {
  return dealerships.filter((dealer) => Number.parseFloat(dealer.distance) <= MAX_NEARBY_RADIUS_KM);
};

const buildViewbox = (location, radiusMeters) => {
  const radiusKm = radiusMeters / 1000;
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.max(Math.cos(deg2rad(location.lat)), 0.2));

  return `${location.lng - lngDelta},${location.lat + latDelta},${location.lng + lngDelta},${location.lat - latDelta}`;
};

const fetchJson = async (url, options = {}, { ignoreNonOk = false } = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (ignoreNonOk) {
      return null;
    }
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
};

const fetchText = async (url, options = {}, { ignoreNonOk = false } = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (ignoreNonOk) {
      return null;
    }
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.text();
};

const reverseGeocodeLocation = async (location, signal) => {
  try {
    const params = new URLSearchParams({
      latitude: String(location.lat),
      longitude: String(location.lng),
      localityLanguage: 'en',
    });

    const payload = await fetchJson(`${BIGDATACLOUD_REVERSE_ENDPOINT}?${params.toString()}`, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    }, { ignoreNonOk: true });

    if (!payload) {
      return null;
    }

    return {
      city: payload.city || payload.locality || payload.principalSubdivision || payload.principalSubdivisionCode || null,
      locality: payload.locality || payload.city || null,
      state: payload.principalSubdivision || payload.principalSubdivisionCode || null,
      postcode: payload.postcode || null,
    };
  } catch (error) {
    return null;
  }
};

const slugifyLocatorValue = (value = '') => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const buildTataLocatorTargets = (locationContext = {}) => {
  const targets = [
    `${TATA_DEALER_LOCATOR}/?search=Tata Motors dealer`,
    `${TATA_DEALER_LOCATOR}/?search=Tata Motors showroom`,
    `${TATA_DEALER_LOCATOR}/?search=Tata dealership`,
    `${TATA_DEALER_LOCATOR}/?search=Tata showroom`,
    `${TATA_DEALER_LOCATOR}/?search=Tata service center`,
  ];

  const locationHints = [locationContext.locality, locationContext.city, locationContext.state, locationContext.postcode]
    .filter(Boolean)
    .map((value) => String(value).trim());

  for (const hint of locationHints) {
    targets.push(`${TATA_DEALER_LOCATOR}/?search=${encodeURIComponent(hint)}`);
    targets.push(`${TATA_DEALER_LOCATOR}/?search=${encodeURIComponent(`Tata Motors dealer ${hint}`)}`);
    targets.push(`${TATA_DEALER_LOCATOR}/?search=${encodeURIComponent(`Tata Motors showroom ${hint}`)}`);
    targets.push(`${TATA_DEALER_LOCATOR}/?search=${encodeURIComponent(`Tata dealer ${hint}`)}`);
  }

  if (locationContext.state) {
    const stateSlug = slugifyLocatorValue(locationContext.state);
    if (stateSlug) {
      targets.push(`${TATA_DEALER_LOCATOR}/location/${stateSlug}`);
    }
  }

  return [...new Set(targets)];
};

const parseHiddenValue = (block, field) => {
  const match = block.match(new RegExp(`${field}[\\s\\S]*?value="([^"]*)"`, 'i'));
  return match ? match[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'") : null;
};

const parseDealerBlocks = (html) => {
  const blocks = html.match(/<div class="store_outlet_01__item store-info-box">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi) || [];

  return blocks.map((block, index) => {
    const name = parseHiddenValue(block, 'business_name') || 'Tata Dealership';
    const address = parseHiddenValue(block, 'address') || 'Address not listed';
    const phone = parseHiddenValue(block, 'phone') || 'Not listed';
    const city = parseHiddenValue(block, 'business_city') || 'Nearby';
    const lat = Number(parseHiddenValue(block, 'outlet-latitude'));
    const lng = Number(parseHiddenValue(block, 'outlet-longitude'));
    const hoursMatch = block.match(/<div class="store_outlet_01__text" id="store_outlet_business_hours_[^"]+">\s*<span><span>([^<]+)<\/span>/i);
    const mapLinkMatch = block.match(/href="([^"]+\/Map)"/i);
    const websiteLinkMatch = block.match(/href="([^"]+\/Home)"/i);
    const rawText = block.replace(/<[^>]+>/g, ' ');
    const services = /service centre|service center/i.test(rawText) ? ['Sales', 'Service'] : ['Sales'];

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return {
      id: `tata-locator-${index}-${lat.toFixed(4)}-${lng.toFixed(4)}`,
      name,
      address,
      lat,
      lng,
      city,
      phone,
      website: websiteLinkMatch ? websiteLinkMatch[1] : null,
      mapUrl: mapLinkMatch ? mapLinkMatch[1] : null,
      matchScore: 100,
      services,
      timing: hoursMatch ? hoursMatch[1] : 'Hours not listed',
    };
  }).filter(Boolean);
};

const fetchTataLocatorDealerships = async (location, signal) => {
  const locationContext = await reverseGeocodeLocation(location, signal);
  const targets = buildTataLocatorTargets(locationContext || {});
  const results = [];

  for (const target of targets) {
    try {
      const html = await fetchText(target, {
        signal,
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'gearshift-share/1.0 (+local-dev)',
        },
      }, { ignoreNonOk: true });

      if (!html) {
        continue;
      }

      const parsed = parseDealerBlocks(html)
        .map((dealer) => ({
          ...dealer,
          distance: calculateDistance(location.lat, location.lng, dealer.lat, dealer.lng),
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      results.push(...parsed);

      if (results.length >= 10) {
        break;
      }
    } catch (error) {
      continue;
    }
  }

  return filterDealershipsWithinRadius(dedupeDealerships(results))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    .slice(0, 25);
};

const fetchNominatimTataDealerships = async (location, signal) => {
  const results = [];

  for (const term of ['Tata Motors dealership', 'Tata Motors car dealer', 'Tata Motors showroom', 'Tata Motors service center']) {
    for (const radiusMeters of [10000, 20000, 30000]) {
      const params = new URLSearchParams({
        format: 'jsonv2',
        q: term,
        bounded: '1',
        addressdetails: '1',
        extratags: '1',
        namedetails: '1',
        countrycodes: 'in',
        limit: '20',
        viewbox: buildViewbox(location, radiusMeters),
      });

      try {
        const payload = await fetchJson(
          `${NOMINATIM_ENDPOINT}?${params.toString()}`,
          {
            signal,
            headers: {
              Accept: 'application/json',
              'User-Agent': 'gearshift-share/1.0 (+local-dev)',
              Referer: 'http://localhost:3000',
            },
          },
          { ignoreNonOk: true }
        );

        if (!Array.isArray(payload)) {
          continue;
        }

        payload
          .filter((item) => isTataText(item.display_name) || isTataText(item.name) || isTataText(item.extratags?.brand) || isTataText(item.extratags?.operator))
          .forEach((item, index) => {
            results.push(normalizeNominatimResult(item, location, index));
          });
      } catch (error) {
        // Ignore individual Nominatim failures/rate limits and keep trying.
        continue;
      }

      if (results.length >= 5) {
        return filterDealershipsWithinRadius(dedupeDealerships(results))
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          .slice(0, 25);
      }
    }
  }

  return filterDealershipsWithinRadius(dedupeDealerships(results))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    .slice(0, 25);
};

const fetchOverpassTataDealerships = async (location, signal) => {
    const overpassQuery = `[out:json][timeout:25];(
      node["amenity"="car_dealer"](around:30000,${location.lat},${location.lng});
      way["amenity"="car_dealer"](around:30000,${location.lat},${location.lng});
      relation["amenity"="car_dealer"](around:30000,${location.lat},${location.lng});
      node["shop"="car"](around:30000,${location.lat},${location.lng});
      way["shop"="car"](around:30000,${location.lat},${location.lng});
      relation["shop"="car"](around:30000,${location.lat},${location.lng});
  );out center tags;`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'gearshift-share/1.0 (+local-dev)',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal,
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const results = (data.elements || [])
        .map((element, index) => {
          const tags = element.tags || {};
          const text = buildTagText(tags);

          if (!isTataDealership(tags, text)) {
            return null;
          }

          const coordinates = element.type === 'node' ? { lat: element.lat, lng: element.lon } : element.center;
          if (!coordinates) {
            return null;
          }

          return normalizeDealership(element, coordinates, location, index);
        })
        .filter(Boolean);

      if (results.length > 0) {
        return filterDealershipsWithinRadius(dedupeDealerships(results))
          .sort((a, b) => (parseFloat(b.matchScore || 0) - parseFloat(a.matchScore || 0)) || (parseFloat(a.distance) - parseFloat(b.distance)))
          .slice(0, 25);
      }
    } catch (error) {
      // try next endpoint
    }
  }

  return [];
};

const getCacheKey = (lat, lng) => `${lat.toFixed(3)}:${lng.toFixed(3)}`;

exports.getNearbyDealerships = async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ message: 'lat and lng query parameters are required.' });
  }

  const cacheKey = getCacheKey(lat, lng);
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.json({ source: cached.source, dealerships: cached.dealerships });
  }

  const location = { lat, lng };

  try {
    const tataLocatorResults = await fetchTataLocatorDealerships(location, req.signal);
    if (tataLocatorResults.length > 0) {
      cache.set(cacheKey, { source: 'tata-locator', dealerships: tataLocatorResults, expiresAt: Date.now() + CACHE_TTL_MS });
      return res.json({ source: 'tata-locator', dealerships: tataLocatorResults });
    }

    const nominatimResults = await fetchNominatimTataDealerships(location, req.signal);
    if (nominatimResults.length > 0) {
      cache.set(cacheKey, { source: 'nominatim', dealerships: nominatimResults, expiresAt: Date.now() + CACHE_TTL_MS });
      return res.json({ source: 'nominatim', dealerships: nominatimResults });
    }

    const overpassResults = await fetchOverpassTataDealerships(location, req.signal);
    if (overpassResults.length > 0) {
      cache.set(cacheKey, { source: 'overpass', dealerships: overpassResults, expiresAt: Date.now() + CACHE_TTL_MS });
      return res.json({ source: 'overpass', dealerships: overpassResults });
    }

    return res.status(404).json({ message: 'No Tata dealerships were found near this location.' });
  } catch (error) {
    console.error('Dealership lookup failed:', error);
    return res.status(502).json({ message: 'Unable to load Tata dealership data right now.' });
  }
};