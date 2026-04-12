const Cart = require("../models/Cart");
const PartOrder = require("../models/PartOrder");
const { ensureAuthenticatedUser } = require("../library/authHelper");

exports.addCartItem = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const {
      productId,
      productName,
      productCategory,
      productPrice,
      productImage,
      productBrand,
      productStock,
    } = req.body;

    if (
      !productId ||
      !productName ||
      !productCategory ||
      !productBrand ||
      !Number.isFinite(Number(productPrice))
    ) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    let cartItem = await Cart.findOne({
      userId,
      productId: Number(productId),
      recordType: "cart",
    });

    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.productStock = Number(productStock ?? cartItem.productStock);
      cartItem.productPrice = Number(productPrice);
      cartItem.productImage = productImage || cartItem.productImage;
      cartItem = await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId: Number(productId),
        productName,
        productCategory,
        productPrice: Number(productPrice),
        productImage,
        productBrand,
        productStock: Number(productStock ?? 0),
        quantity: 1,
        recordType: "cart",
      });
    }

    return res.status(201).json({
      message: "Item added to cart",
      item: cartItem,
    });
  } catch (error) {
    console.error("Error adding cart item:", error);
    return res.status(500).json({ error: "Failed to add item to cart" });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const items = await Cart.find({ userId, recordType: "cart" }).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const { id } = req.params;

    const deleted = await Cart.findOneAndDelete({ _id: id, userId, recordType: "cart" });

    if (!deleted) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({ error: "Failed to remove cart item" });
  }
};

// Create or update cart order
exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productCategory,
      productPrice,
      productImage,
      productBrand,
      productStock,
      quantity,
      customerName,
      contactNumber,
      email,
      homeAddress,
    } = req.body;

    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    // Validate required fields
    if (
      !productId ||
      !productName ||
      !customerName ||
      !contactNumber ||
      !email ||
      !homeAddress
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new order in dedicated parts collection
    const order = new PartOrder({
      userId,
      productId,
      productName,
      productCategory,
      productPrice,
      productImage,
      productBrand,
      productStock,
      quantity: Number(quantity ?? 1),
      customerName,
      contactNumber,
      email,
      homeAddress,
      paymentMethod: "COD",
      orderStatus: "Pending",
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// Get all orders for a user
exports.getOrders = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const orders = await PartOrder.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const order = await PartOrder.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify ownership
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const deletedOrder = await PartOrder.findOneAndDelete({ _id: id, userId });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order cancelled and removed successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "Failed to cancel order" });
  }
};
