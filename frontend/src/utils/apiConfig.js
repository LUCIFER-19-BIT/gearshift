export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export const API_ENDPOINTS = {
  login: `${BACKEND_BASE_URL}/api/login`,
  signup: `${BACKEND_BASE_URL}/api/signup`,
  booking: `${BACKEND_BASE_URL}/api/booking`,
  bookings: `${BACKEND_BASE_URL}/api/bookings`,
  testDrive: `${BACKEND_BASE_URL}/api/testdrive`,
  testDrives: `${BACKEND_BASE_URL}/api/testdrives`,
  scrapAnalyze: `${BACKEND_BASE_URL}/api/scrap/analyze`,
  partsAiRecommend: `${BACKEND_BASE_URL}/api/parts/ai-recommend`,
  cart: `${BACKEND_BASE_URL}/api/cart`,
  cartItems: `${BACKEND_BASE_URL}/api/cart/items`,
  carCircle: `${BACKEND_BASE_URL}/api/carcircle`,
  nearbyDealerships: `${BACKEND_BASE_URL}/api/dealerships/nearby`,
};
