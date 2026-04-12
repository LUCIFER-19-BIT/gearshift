const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./database"); // Initialize single database connection
const auth = require("./middleware/auth");
const { signup, login } = require("./controllers/authController");
const {
  createBooking,
  getBookings,
  cancelBooking,
} = require("./controllers/bookingController");
const {
  createTestDrive,
  getTestDrives,
  cancelTestDrive,
} = require("./controllers/testDriveController");
const {
  uploadCarCircleImages,
  validateCarBrand,
  createCarCircleListing,
  getCarCircleListings,
  updateCarCircleListing,
  deleteCarCircleListing,
} = require("./controllers/carCircleController");
const {
  addCartItem,
  getCartItems,
  removeCartItem,
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} = require("./controllers/cartController");
const {
  getNearbyDealerships,
} = require("./controllers/dealershipController");
const {
  fetchRouteChargers,
} = require("./controllers/evChargerController");
const {
  recommendParts,
} = require("./controllers/partsAiController");
const {
  analyzeScrapDiscount,
} = require("./controllers/scrapController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/carcircle", express.static(path.join(__dirname, "..", "frontend", "public", "carcircle")));

// Routes
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/booking", auth, createBooking);
app.get("/api/bookings", auth, getBookings);
app.delete("/api/bookings/:id", auth, cancelBooking);

app.post("/api/testdrive", auth, createTestDrive);
app.get("/api/testdrives", auth, getTestDrives);
app.delete("/api/testdrives/:id", auth, cancelTestDrive);

app.post("/api/carcircle", auth, uploadCarCircleImages, validateCarBrand, createCarCircleListing);
app.get("/api/carcircle", auth, getCarCircleListings);
app.put("/api/carcircle/:id", auth, uploadCarCircleImages, validateCarBrand, updateCarCircleListing);
app.delete("/api/carcircle/:id", auth, deleteCarCircleListing);

app.get("/api/dealerships/nearby", getNearbyDealerships);
app.post("/api/ev-chargers/route", fetchRouteChargers);
app.post("/api/parts/ai-recommend", auth, recommendParts);
app.post("/api/scrap/analyze", analyzeScrapDiscount);

// Cart routes
app.post("/api/cart/items", auth, addCartItem);
app.get("/api/cart/items", auth, getCartItems);
app.delete("/api/cart/items/:id", auth, removeCartItem);

app.post("/api/cart", auth, createOrder);
app.get("/api/cart", auth, getOrders);
app.get("/api/cart/:id", auth, getOrderById);
app.patch("/api/cart/:id/cancel", auth, cancelOrder);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
