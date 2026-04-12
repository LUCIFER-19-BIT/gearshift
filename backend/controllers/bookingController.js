const Booking = require("../models/Booking");
const { ensureAuthenticatedUser } = require("../library/authHelper");

const createBooking = async (req, res) => {
  try {
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
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

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

    const savedBooking = await booking.save();

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
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;
    const { id } = req.params;

    const deletedBooking = await Booking.findOneAndDelete({ _id: id, userId });

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBooking, getBookings, cancelBooking };
