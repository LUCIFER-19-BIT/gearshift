const mongoose = require("mongoose");
require("dotenv").config();

// Single MongoDB connection using a database with multiple collections
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn("MONGODB_URI is not set. Please set it in your .env file.");
}

mongoose
  .connect(mongoUri, {
    // Mongoose v8 uses sensible defaults; keep options explicit for clarity
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "test",
  })
  .then(async () => {
    try {
      await mongoose.connection.db.createCollection("parts");
    } catch (error) {
      if (error?.codeName !== "NamespaceExists") {
        throw error;
      }
    }
    console.log("MongoDB connected (db: test)");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
