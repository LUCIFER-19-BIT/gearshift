const { GoogleGenerativeAI } = require("@google/generative-ai");
const { safeParseJson } = require("../library/helper");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const buildFallbackRecommendations = (problem, carModel, parts) => {
  const query = String(problem || "").toLowerCase();
  const keywordBuckets = [
    { keys: ["brake", "stopping", "squeak", "screech"], category: "Brake System" },
    { keys: ["heat", "overheat", "coolant", "temperature", "radiator"], category: "Cooling System" },
    { keys: ["battery", "start", "not starting", "crank", "power"], category: "Battery" },
    { keys: ["light", "headlight", "fog", "indicator", "tail"], category: "Lighting" },
    { keys: ["suspension", "shock", "vibration", "bumpy", "wheel"], category: "Tires & Suspension" },
    { keys: ["wiper", "electrical", "alternator", "starter"], category: "Electrical" },
    { keys: ["engine oil", "filter", "service", "maintenance"], category: "Filters & Fluids" },
  ];

  const matchedCategories = keywordBuckets
    .filter((bucket) => bucket.keys.some((key) => query.includes(key)))
    .map((bucket) => bucket.category);

  const scored = parts
    .map((part) => {
      let score = 0;

      if (matchedCategories.includes(part.category)) {
        score += 4;
      }

      if (carModel && Array.isArray(part.carModels) && part.carModels.includes(carModel)) {
        score += 2;
      }

      if (query.includes(String(part.name || "").toLowerCase())) {
        score += 3;
      }

      return {
        part,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => ({
      partId: item.part.id,
      reason: `Recommended from symptom match in ${item.part.category}.`,
      confidence: item.score >= 6 ? "high" : "medium",
    }));

  return {
    summary:
      scored.length > 0
        ? "These suggestions are based on your reported issue and compatible parts in stock."
        : "Could not identify strong symptom matches. Showing no fallback recommendations.",
    recommendations: scored,
    caution: "Please confirm diagnosis with a technician before replacing parts.",
    source: "fallback",
  };
};

const recommendParts = async (req, res) => {
  try {
    const { problem, carModel, parts } = req.body || {};

    if (!problem || String(problem).trim().length < 8) {
      return res.status(400).json({ message: "Please describe the car problem in more detail." });
    }

    if (!Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({ message: "Parts catalog is required for recommendation." });
    }

    const safeParts = parts
      .map((part) => ({
        id: Number(part.id),
        name: String(part.name || ""),
        category: String(part.category || ""),
        carModels: Array.isArray(part.carModels) ? part.carModels : [],
        price: Number(part.price || 0),
      }))
      .filter((part) => Number.isFinite(part.id) && part.name);

    if (!genAI) {
      return res.json(buildFallbackRecommendations(problem, carModel, safeParts));
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are an automotive service assistant for Tata vehicles.

User issue: ${String(problem).trim()}
Preferred model (if provided): ${carModel || "not specified"}

Available parts catalog JSON:
${JSON.stringify(safeParts)}

Return ONLY valid JSON with this schema:
{
  "summary": "short explanation",
  "recommendations": [
    { "partId": 1, "reason": "why this part", "confidence": "high|medium|low" }
  ],
  "caution": "short safety note"
}

Rules:
- Suggest 3 to 6 parts.
- Use ONLY partId values present in catalog.
- Prioritize parts matching likely root cause and model compatibility.
- Do not include markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = safeParseJson(text);

    if (!parsed || !Array.isArray(parsed.recommendations)) {
      return res.json(buildFallbackRecommendations(problem, carModel, safeParts));
    }

    const validIds = new Set(safeParts.map((part) => part.id));
    const recommendations = parsed.recommendations
      .filter((item) => validIds.has(Number(item.partId)))
      .slice(0, 6)
      .map((item) => ({
        partId: Number(item.partId),
        reason: String(item.reason || "Recommended for your reported issue."),
        confidence: ["high", "medium", "low"].includes(String(item.confidence).toLowerCase())
          ? String(item.confidence).toLowerCase()
          : "medium",
      }));

    if (!recommendations.length) {
      return res.json(buildFallbackRecommendations(problem, carModel, safeParts));
    }

    return res.json({
      summary: String(parsed.summary || "AI selected these parts based on your symptoms."),
      recommendations,
      caution: String(parsed.caution || "Confirm with a certified technician before part replacement."),
      source: "gemini",
    });
  } catch (error) {
    console.error("Parts AI recommendation error:", error);
    return res.status(500).json({
      message: "Unable to generate part recommendations right now. Please try again.",
    });
  }
};

module.exports = {
  recommendParts,
};
