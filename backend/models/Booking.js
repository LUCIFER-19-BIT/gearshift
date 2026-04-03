const mongoose = require("../database");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    fuel: {
      type: String,
      required: false, // Optional for EVs
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    dealership: {
      type: String,
      required: false, // Stores JSON string with dealership details
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema, "book");
