const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Validates if the uploaded car images are of Tata brand vehicles
 * @param {Array} uploadedFiles - Array of file objects from multer (req.files)
 * @returns {Promise<Object>} - { isValid: boolean, message: string, brand: string }
 */
const validateTataCarImages = async (uploadedFiles) => {
  try {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return {
        isValid: false,
        message: "No images provided for validation",
        brand: null,
      };
    }

    // Use Gemini Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // We'll check the first few images (max 3) for efficiency
    const imagesToCheck = uploadedFiles.slice(0, Math.min(3, uploadedFiles.length));

    // Prepare image parts for Gemini
    const imageParts = imagesToCheck.map((file) => {
      const imageData = fs.readFileSync(file.path);
      return {
        inlineData: {
          data: imageData.toString("base64"),
          mimeType: file.mimetype,
        },
      };
    });

    // Prompt to identify car brand
    const prompt = `Analyze this car image carefully. Identify the car brand/manufacturer and model if possible.

IMPORTANT: Focus on identifying the brand logo, design elements, and any visible branding.

Common Tata car models in India include: Tata Nexon, Tata Punch, Tata Safari, Tata Harrier, Tata Altroz, Tata Tiago, Tata Tigor, Tata Curvv.

Please respond in JSON format only:
{
  "brand": "exact brand name",
  "model": "model name if identifiable",
  "confidence": "high/medium/low",
  "reasoning": "brief explanation of how you identified the brand"
}

If you cannot identify the brand with reasonable confidence, set confidence to "low" and brand to "unknown".`;

    // Analyze the first image
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let analysisResult;
    try {
      // Extract JSON from response (sometimes it's wrapped in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);
      return {
        isValid: false,
        message: "Unable to analyze car images. Please ensure images clearly show the car brand.",
        brand: null,
      };
    }

    // Check if the brand is Tata (case-insensitive)
    const detectedBrand = (analysisResult.brand || "").toLowerCase().trim();
    const isTata = detectedBrand === "tata" || detectedBrand.includes("tata");

    if (isTata && analysisResult.confidence !== "low") {
      return {
        isValid: true,
        message: `Tata ${analysisResult.model || "vehicle"} detected successfully`,
        brand: "Tata",
        model: analysisResult.model || null,
        confidence: analysisResult.confidence,
      };
    } else if (detectedBrand === "unknown" || analysisResult.confidence === "low") {
      return {
        isValid: false,
        message: "Unable to clearly identify the car brand. Please upload clearer images showing the car's brand logo and design.",
        brand: null,
      };
    } else {
      return {
        isValid: false,
        message: `Only Tata vehicles are allowed. Detected brand: ${analysisResult.brand}. This platform is exclusively for Tata car listings.`,
        brand: analysisResult.brand,
        model: analysisResult.model || null,
      };
    }
  } catch (error) {
    console.error("Error validating car brand with Gemini:", error);

    // If API key is not set
    if (error.message && error.message.includes("API key")) {
      return {
        isValid: false,
        message: "Car brand validation is not configured. Please contact support.",
        brand: null,
      };
    }

    // Generic error
    return {
      isValid: false,
      message: "Error validating car brand. Please try again.",
      brand: null,
    };
  }
};

module.exports = {
  validateTataCarImages,
};
