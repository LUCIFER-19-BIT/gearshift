const mongoose = require("../database");

const carCircleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    carName: {
      type: String,
      required: true,
      trim: true,
    },
    kilometers: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1 && arr.length <= 10,
        message: "You must provide 1 to 10 photos",
      },
    },
    overview: {
      price: { type: String, required: true },
      kilometers: { type: String, required: true },
      fuelType: { type: String, required: true },
      registrationYear: { type: String, required: true },
      manufacturingYear: { type: String, required: true },
      owners: { type: String, required: true },
      transmission: { type: String, required: true },
      color: { type: String, required: true },
      availableAt: { type: String, required: true },
      insurance: { type: String, required: true },
      registrationType: { type: String, required: true },
      state: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarCircle", carCircleSchema, "carcircle");
