const fs = require("fs");
const path = require("path");
const multer = require("multer");
const CarCircle = require("../models/CarCircle");
const { validateTataCarImages, detectDentStatusFromImages } = require("../library/geminiValidator");

const MAX_IMAGE_COUNT = 10;
const MAX_SINGLE_IMAGE_BYTES = 4 * 1024 * 1024;
const CARCIRCLE_UPLOAD_DIR = path.join(__dirname, "..", "..", "frontend", "public", "carcircle");
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"]);

if (!fs.existsSync(CARCIRCLE_UPLOAD_DIR)) {
  fs.mkdirSync(CARCIRCLE_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, CARCIRCLE_UPLOAD_DIR);
  },
  filename: (_, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SINGLE_IMAGE_BYTES,
    files: MAX_IMAGE_COUNT,
  },
  fileFilter: (_, file, callback) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      callback(new Error("Only image files are allowed"));
      return;
    }
    callback(null, true);
  },
});

const uploadCarCircleImages = (req, res, next) => {
  upload.array("images", MAX_IMAGE_COUNT)(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ message: "Each photo must be 4 MB or smaller" });
        return;
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        res.status(400).json({ message: "Please upload between 1 and 10 photos" });
        return;
      }
    }

    res.status(400).json({ message: error.message || "Unable to process uploaded images" });
  });
};

/**
 * Middleware to validate car brand using Gemini AI
 * Only allows Tata brand cars to be uploaded
 */
const validateCarBrand = async (req, res, next) => {
  try {
    // Skip validation if no new images are uploaded (for updates with existing images)
    if (!req.files || req.files.length === 0) {
      next();
      return;
    }

    // Validate car brand using Gemini
    const validationResult = await validateTataCarImages(req.files);

    if (!validationResult.isValid) {
      // Delete uploaded files since validation failed
      await Promise.all(
        req.files.map((file) =>
          fs.promises.unlink(file.path).catch((err) => {
            if (err.code !== "ENOENT") {
              console.error("Error deleting file after validation failure:", err);
            }
          })
        )
      );

      return res.status(400).json({
        message: validationResult.message,
        detectedBrand: validationResult.brand,
      });
    }

    // Attach validation result to request for potential logging
    req.carBrandValidation = validationResult;
    next();
  } catch (error) {
    console.error("Error in car brand validation middleware:", error);

    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map((file) =>
          fs.promises.unlink(file.path).catch((err) => {
            if (err.code !== "ENOENT") {
              console.error("Error deleting file after validation error:", err);
            }
          })
        )
      );
    }

    res.status(500).json({
      message: "Error validating car brand. Please try again.",
    });
  }
};

const parseJsonField = (value, fallback = null) => {
  if (!value) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const createImageUrl = (_, filename) => `/carcircle/${filename}`;

const getUploadedImageUrls = (req) => (req.files || []).map((file) => createImageUrl(req, file.filename));

const deleteImageFile = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return;
  }

  const cleanPath = imageUrl.split("?")[0];
  const fileName = path.basename(cleanPath);

  if (!fileName) {
    return;
  }

  const absoluteFilePath = path.join(CARCIRCLE_UPLOAD_DIR, fileName);

  try {
    await fs.promises.unlink(absoluteFilePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error deleting carcircle image file:", error);
    }
  }
};

const normalizePayload = (body, imageUrls) => ({
  sellerName: body.sellerName,
  contactNumber: body.contactNumber,
  carName: body.carName,
  kilometers: Number(body.kilometers),
  price: Number(body.price),
  city: body.city,
  description: body.description,
  imageUrls,
  overview: parseJsonField(body.overview, null),
});

const validatePayload = (payload) => {
  if (!Array.isArray(payload.imageUrls) || payload.imageUrls.length < 1 || payload.imageUrls.length > MAX_IMAGE_COUNT) {
    return "Please upload between 1 and 10 photos";
  }

  if (!payload.sellerName || !payload.contactNumber || !payload.carName || !payload.city || !payload.description) {
    return "Missing required text fields";
  }

  if (!Number.isFinite(payload.kilometers) || payload.kilometers < 0) {
    return "Kilometers must be a valid number";
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return "Price must be a valid number";
  }

  if (!payload.overview || typeof payload.overview !== "object") {
    return "Overview details are required";
  }

  return null;
};

const createCarCircleListing = async (req, res) => {
  try {
    const imageUrls = getUploadedImageUrls(req);
    const payload = normalizePayload(req.body, imageUrls);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const dentStatus = await detectDentStatusFromImages(req.files || []);
    payload.dentStatus = dentStatus;
    payload.overview = {
      ...payload.overview,
      dentStatus,
    };

    const listing = new CarCircle({
      userId: req.user.id,
      ...payload,
    });

    const savedListing = await listing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error("Error creating carcircle listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCarCircleListings = async (req, res) => {
  try {
    const listings = await CarCircle.find({}).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error("Error fetching carcircle listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCarCircleListing = async (req, res) => {
  try {
    const existingListing = await CarCircle.findOne({ _id: req.params.id, userId: req.user.id });

    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const uploadedImageUrls = getUploadedImageUrls(req);
    const existingImageUrls = parseJsonField(req.body.existingImageUrls, existingListing.imageUrls);
    const nextImageUrls = uploadedImageUrls.length > 0 ? uploadedImageUrls : existingImageUrls;

    const payload = normalizePayload(req.body, nextImageUrls);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Dent status is always backend-controlled (not user-editable).
    const dentStatus =
      uploadedImageUrls.length > 0
        ? await detectDentStatusFromImages(req.files || [])
        : existingListing.dentStatus || existingListing.overview?.dentStatus || "No Dent Detected";

    payload.dentStatus = dentStatus;
    payload.overview = {
      ...payload.overview,
      dentStatus,
    };

    const updatedListing = await CarCircle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      payload,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (error) {
    console.error("Error updating carcircle listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCarCircleListing = async (req, res) => {
  try {
    const deletedListing = await CarCircle.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    await Promise.all((deletedListing.imageUrls || []).map((imageUrl) => deleteImageFile(imageUrl)));

    return res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting carcircle listing:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadCarCircleImages,
  validateCarBrand,
  createCarCircleListing,
  getCarCircleListings,
  updateCarCircleListing,
  deleteCarCircleListing,
};
