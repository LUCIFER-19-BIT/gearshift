const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    console.log("Received booking data:", req.body);
    const {
      name,
      email,
      model,
      variant,
      color,
      fuel,
      price,
      image,
      dealership,
    } = req.body;
    const userId = req.user.id;

    // Create booking
    const booking = new Booking({
      userId,
      name,
      email,
      model,
      variant,
      color,
      fuel,
      price,
      image,
      dealership,
    });

    console.log("Saving booking...");
    const savedBooking = await booking.save();
    console.log("Booking saved:", savedBooking);

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: savedBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBooking, getBookings };
