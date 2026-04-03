const mongoose = require("../database");

const testDriveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pincode: {
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
    dealership: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TestDrive", testDriveSchema, "test");
