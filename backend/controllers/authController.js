const User = require("../models/User");
const { signAuthToken } = require("../library/authToken");

const signup = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      address,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found, please sign up" });
    }

    // Check password
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = signAuthToken({ id: user._id });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };
