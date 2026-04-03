require("dotenv").config();
const mongoose = require("../database");
const CarCircle = require("../models/CarCircle");
const User = require("../models/User");

const MODELS = ["Nexon", "Punch", "Harrier", "Safari", "Tiago", "Tigor", "Altroz", "Curvv", "Nexon EV"];
const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Delhi", "Uttar Pradesh", "Rajasthan", "Punjab", "Telangana"];
const STATE_CITY_MAP = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Delhi: ["New Delhi", "Dwarka", "Rohini", "Saket"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Ghaziabad"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
};

const buildSeedListings = (userId) => {
  return Array.from({ length: 27 }, (_, index) => {
    const model = MODELS[index % MODELS.length];
    const state = STATES[index % STATES.length];
    const cityOptions = STATE_CITY_MAP[state] || [state];
    const city = cityOptions[index % cityOptions.length];
    const year = 2017 + (index % 8);
    const kilometers = 18000 + index * 3200;
    const price = 420000 + index * 28000;

    return {
      userId,
      sellerName: `Seeded Seller ${index + 1}`,
      contactNumber: `98${String(10000000 + index).slice(0, 8)}`,
      carName: model,
      kilometers,
      price,
      city,
      description: `${model} in good condition with service history and clean documentation.`,
      imageUrls: [
        `https://placehold.co/600x350?text=${encodeURIComponent(`${model} ${year}`)}`,
      ],
      overview: {
        price: `Rs. ${price.toLocaleString()}`,
        kilometers: `${kilometers.toLocaleString()} km`,
        fuelType: index % 5 === 0 ? "Electric" : index % 2 === 0 ? "Petrol" : "Diesel",
        registrationYear: String(year),
        manufacturingYear: String(year - 1),
        owners: index % 3 === 0 ? "1st Owner" : "2nd Owner",
        transmission: index % 2 === 0 ? "Manual" : "Automatic",
        color: index % 2 === 0 ? "White" : "Grey",
        availableAt: `Stock Yard ${index + 1}`,
        insurance: "First Party",
        registrationType: "Individual",
        state,
      },
    };
  });
};

const run = async () => {
  try {
    const ownerUser = await User.findOne().lean();

    if (!ownerUser?._id) {
      console.error("No user found. Please create at least one user account, then run seed again.");
      process.exitCode = 1;
      return;
    }

    const deleteResult = await CarCircle.deleteMany({ sellerName: { $regex: /^Seeded Seller / } });
    const seedListings = buildSeedListings(ownerUser._id);
    const inserted = await CarCircle.insertMany(seedListings);

    console.log(`Removed ${deleteResult.deletedCount} previous seeded listings.`);
    console.log(`Inserted ${inserted.length} seeded car listings.`);
  } catch (error) {
    console.error("Failed to seed car listings:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
