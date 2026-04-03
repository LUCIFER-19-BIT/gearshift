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
} = require("./controllers/bookingController");
const {
  createTestDrive,
  getTestDrives,
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
} = require("./controllers/cartController");

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

app.post("/api/testdrive", auth, createTestDrive);
app.get("/api/testdrives", auth, getTestDrives);

app.post("/api/carcircle", auth, uploadCarCircleImages, validateCarBrand, createCarCircleListing);
app.get("/api/carcircle", auth, getCarCircleListings);
app.put("/api/carcircle/:id", auth, uploadCarCircleImages, validateCarBrand, updateCarCircleListing);
app.delete("/api/carcircle/:id", auth, deleteCarCircleListing);

// Cart routes
app.post("/api/cart/items", auth, addCartItem);
app.get("/api/cart/items", auth, getCartItems);
app.delete("/api/cart/items/:id", auth, removeCartItem);

app.post("/api/cart", auth, createOrder);
app.get("/api/cart", auth, getOrders);
app.get("/api/cart/:id", auth, getOrderById);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
