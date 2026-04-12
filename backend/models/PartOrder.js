const mongoose = require("../database");

const partOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: false,
    },
    productBrand: {
      type: String,
      required: true,
    },
    productStock: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    customerName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    homeAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "COD",
    },
    orderStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Shipped", "Delivered"],
    },
  },
  {
    timestamps: true,
    collection: "parts",
  }
);

module.exports = mongoose.model("PartOrder", partOrderSchema);
