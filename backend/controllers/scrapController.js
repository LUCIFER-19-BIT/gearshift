const { GoogleGenerativeAI } = require("@google/generative-ai");
const { safeParseJson } = require("../library/helper");

const genAI = process.env.GEMINI_API_KEY
	? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
	: null;

const toNumber = (value) => {
	const parsed = Number(String(value || "").replace(/,/g, ""));
	return Number.isFinite(parsed) ? parsed : 0;
};

const toRangeDiscount = (condition) => {
	if (condition === "good") {
		return 4 + Math.random();
	}
	return 2 + Math.random();
};

const applyDiscount = (price, discountPercent) => {
	const discountAmount = Math.round((price * discountPercent) / 100);
	const finalPrice = Math.max(0, price - discountAmount);
	return {
		discountAmount,
		finalPrice,
	};
};

const analyzeScrapDiscount = async (req, res) => {
	try {
		const { imageData, mimeType, selectedModel, selectedPrice } = req.body || {};

		if (!imageData || typeof imageData !== "string") {
			return res.status(400).json({ message: "Car image is required." });
		}

		const basePrice = toNumber(selectedPrice);
		if (!basePrice || basePrice <= 0) {
			return res.status(400).json({ message: "Selected car price is invalid." });
		}

		const effectiveMimeType = mimeType || "image/jpeg";

		if (!genAI) {
			const fallbackCondition = "poor";
			const discountPercent = Number(toRangeDiscount(fallbackCondition).toFixed(2));
			const { discountAmount, finalPrice } = applyDiscount(basePrice, discountPercent);
			return res.json({
				source: "fallback",
				detectedModel: selectedModel || "Unknown",
				detectedYear: "Unknown",
				condition: fallbackCondition,
				conditionStatement: "Manual fallback used because Gemini key is not configured.",
				discountPercent,
				discountAmount,
				originalPrice: basePrice,
				finalPrice,
			});
		}

		const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

		const prompt = `You are an automotive condition assessor.

Analyze the uploaded car image and return ONLY valid JSON in this exact schema:
{
	"detectedModel": "string",
	"detectedYear": "string",
	"condition": "good|poor",
	"conditionStatement": "short statement about visible metal/body condition"
}

Rules:
- condition can only be "good" or "poor".
- If uncertain, choose the safer option "poor".
- Keep conditionStatement concise (max 2 short sentences).
- Do not return markdown, explanation, or extra text.`;

		const result = await model.generateContent([
			prompt,
			{
				inlineData: {
					data: imageData,
					mimeType: effectiveMimeType,
				},
			},
		]);

		const response = await result.response;
		const parsed = safeParseJson(response.text());

		const normalizedCondition =
			String(parsed?.condition || "poor").toLowerCase() === "good" ? "good" : "poor";

		const discountPercent = Number(toRangeDiscount(normalizedCondition).toFixed(2));
		const { discountAmount, finalPrice } = applyDiscount(basePrice, discountPercent);

		return res.json({
			source: "gemini",
			detectedModel: String(parsed?.detectedModel || selectedModel || "Unknown"),
			detectedYear: String(parsed?.detectedYear || "Unknown"),
			condition: normalizedCondition,
			conditionStatement: String(
				parsed?.conditionStatement ||
					"Condition analyzed from uploaded image and discount applied accordingly."
			),
			discountPercent,
			discountAmount,
			originalPrice: basePrice,
			finalPrice,
		});
	} catch (error) {
		console.error("Scrap discount analysis error:", error);
		return res.status(500).json({
			message: "Unable to analyze car image right now. Please try again.",
		});
	}
};

module.exports = {
	analyzeScrapDiscount,
};
