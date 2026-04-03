const mongoose = require("../database");

const cartSchema = new mongoose.Schema(
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
    recordType: {
      type: String,
      enum: ["cart", "order"],
      default: "cart",
    },
    customerName: {
      type: String,
      required: false,
    },
    contactNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    homeAddress: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      default: "COD",
    },
    orderStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    },
  },
  {
    timestamps: true,
    collection: "cart",
  }
);

cartSchema.index(
  { userId: 1, productId: 1 },
  { unique: true, partialFilterExpression: { recordType: "cart" } }
);

module.exports = mongoose.model("Cart", cartSchema);
