import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import "../styles/parts.css";

const CART_ITEMS_API = "http://localhost:8001/api/cart/items";
const PARTS_AI_API = "http://localhost:8001/api/parts/ai-recommend";

const PARTS_DATA = [
  // Brake System
  { id: 1, name: "Brake Pads Front Set", category: "Brake System", brand: "Tata", price: 1200, carModels: ["Nexon", "Punch", "Tiago", "Harrier"], stock: 15, image: "/parts/brake-pads-front.jpg" },
  { id: 2, name: "Brake Pads Rear Set", category: "Brake System", brand: "Tata", price: 950, carModels: ["Nexon", "Punch", "Tiago", "Harrier", "Tigor"], stock: 12, image: "/parts/brake-pads-rear.jpg" },
  { id: 3, name: "Brake Rotor Front", category: "Brake System", brand: "Tata", price: 2500, carModels: ["Harrier", "Nexon"], stock: 8, image: "/parts/brake-rotor.jpg" },

  // Filters & Fluids
  { id: 4, name: "Engine Oil Filter", category: "Filters & Fluids", brand: "Tata", price: 350, carModels: ["Tiago", "Tigor", "Punch", "Nexon"], stock: 25, image: "/parts/oil-filter.jpg" },
  { id: 5, name: "Air Filter", category: "Filters & Fluids", brand: "Tata", price: 450, carModels: ["Nexon", "Punch", "Tiago", "Harrier"], stock: 20, image: "/parts/air-filter.jpg" },
  { id: 6, name: "Cabin Air Filter", category: "Filters & Fluids", brand: "Tata", price: 600, carModels: ["Harrier", "Nexon"], stock: 18, image: "/parts/cabin-filter.jpg" },
  { id: 7, name: "Engine Oil 5L (0W-30)", category: "Filters & Fluids", brand: "Tata", price: 1800, carModels: ["Tiago", "Punch", "Nexon"], stock: 30, image: "/parts/engine-oil.jpg" },

  // Ignition System
  { id: 8, name: "Spark Plugs (Set of 4)", category: "Ignition System", brand: "Tata", price: 800, carModels: ["Tiago", "Tigor", "Punch"], stock: 22, image: "/parts/spark-plugs.jpg" },
  { id: 9, name: "Ignition Coil", category: "Ignition System", brand: "Tata", price: 1500, carModels: ["Nexon", "Harrier"], stock: 10, image: "/parts/ignition-coil.jpg" },

  // Cooling System
  { id: 10, name: "Radiator Coolant 1L", category: "Cooling System", brand: "Tata", price: 400, carModels: ["Nexon", "Punch", "Tiago"], stock: 28, image: "/parts/coolant.jpg" },
  { id: 11, name: "Water Pump", category: "Cooling System", brand: "Tata", price: 3200, carModels: ["Harrier", "Nexon"], stock: 7, image: "/parts/water-pump.jpg" },
  { id: 12, name: "Thermostat", category: "Cooling System", brand: "Tata", price: 1100, carModels: ["Nexon", "Harrier"], stock: 9, image: "/parts/thermostat.jpg" },

  // Lighting
  { id: 13, name: "Headlight Bulb H4", category: "Lighting", brand: "Tata", price: 600, carModels: ["Nexon", "Punch", "Tiago", "Tigor"], stock: 18, image: "/parts/headlight-bulb.jpg" },
  { id: 14, name: "LED Tail Light Module", category: "Lighting", brand: "Tata", price: 2200, carModels: ["Harrier", "Nexon"], stock: 6, image: "/parts/tail-light.jpg" },
  { id: 15, name: "Fog Light Bulb", category: "Lighting", brand: "Tata", price: 500, carModels: ["Nexon", "Harrier"], stock: 12, image: "/parts/fog-light.jpg" },

  // Tires & Suspension
  { id: 16, name: "MRF Tyre 205/65 R16", category: "Tires & Suspension", brand: "Tata", price: 4500, carModels: ["Nexon", "Harrier"], stock: 14, image: "/parts/mrf-tyre.jpg" },
  { id: 17, name: "Ceat Tyre 185/60 R14", category: "Tires & Suspension", brand: "Tata", price: 3200, carModels: ["Tiago", "Tigor"], stock: 20, image: "/parts/ceat-tyre.jpg" },
  { id: 18, name: "Shock Absorber Front", category: "Tires & Suspension", brand: "Tata", price: 2800, carModels: ["Nexon", "Harrier"], stock: 8, image: "/parts/shock-absorber.jpg" },
  { id: 19, name: "Suspension Coil Spring", category: "Tires & Suspension", brand: "Tata", price: 1900, carModels: ["Nexon", "Harrier"], stock: 10, image: "/parts/coil-spring.jpg" },

  // Battery
  { id: 20, name: "Car Battery 60Ah", category: "Battery", brand: "Tata", price: 4200, carModels: ["Nexon", "Harrier"], stock: 8, image: "/parts/battery-60ah.jpg" },
  { id: 21, name: "Car Battery 45Ah", category: "Battery", brand: "Tata", price: 3200, carModels: ["Tiago", "Tigor", "Punch"], stock: 16, image: "/parts/battery-45ah.jpg" },

  // Electrical
  { id: 22, name: "Alternator", category: "Electrical", brand: "Tata", price: 6500, carModels: ["Nexon", "Harrier"], stock: 5, image: "/parts/alternator.jpg" },
  { id: 23, name: "Starter Motor", category: "Electrical", brand: "Tata", price: 4800, carModels: ["Nexon", "Harrier"], stock: 6, image: "/parts/starter-motor.jpg" },
  { id: 24, name: "Wiper Blades (Pair)", category: "Electrical", brand: "Tata", price: 700, carModels: ["Nexon", "Punch", "Tiago", "Harrier"], stock: 24, image: "/parts/wiper-blades.jpg" },

  // Interior & Exterior
  { id: 25, name: "Door Handle Kit (Front)", category: "Interior & Exterior", brand: "Tata", price: 1200, carModels: ["Nexon", "Punch", "Tiago"], stock: 11, image: "/parts/door-handle.jpg" },
  { id: 26, name: "Side View Mirror Left", category: "Interior & Exterior", brand: "Tata", price: 1800, carModels: ["Nexon", "Harrier", "Punch"], stock: 9, image: "/parts/side-mirror.jpg" },
  { id: 27, name: "Dashboard Trim Kit", category: "Interior & Exterior", brand: "Tata", price: 2200, carModels: ["Harrier"], stock: 4, image: "/parts/dashboard-trim.jpg" },
];

export default function Parts() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    carModel: "",
    category: "",
    brand: "",
    maxPrice: 10000,
  });
  const [problemText, setProblemText] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiCaution, setAiCaution] = useState("");
  const [aiSource, setAiSource] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const carModels = ["Nexon", "Punch", "Tiago", "Tigor", "Harrier"];
  const categories = ["All Categories", "Brake System", "Filters & Fluids", "Ignition System", "Cooling System", "Lighting", "Tires & Suspension", "Battery", "Electrical", "Interior & Exterior"];
  const brands = ["Tata"];

  // Filter parts
  const filteredParts = useMemo(() => {
    return PARTS_DATA.filter((part) => {
      const carModelMatch = !filters.carModel || part.carModels.includes(filters.carModel);
      const categoryMatch = !filters.category || part.category === filters.category;
      const brandMatch = !filters.brand || part.brand === filters.brand;
      const priceMatch = part.price <= filters.maxPrice;

      return carModelMatch && categoryMatch && brandMatch && priceMatch;
    });
  }, [filters]);

  const suggestedPartIdSet = useMemo(() => {
    return new Set(aiSuggestions.map((item) => item.partId));
  }, [aiSuggestions]);

  const suggestedParts = useMemo(() => {
    if (!aiSuggestions.length) {
      return [];
    }

    const partById = new Map(PARTS_DATA.map((part) => [part.id, part]));
    return aiSuggestions
      .map((item) => {
        const part = partById.get(item.partId);
        if (!part) {
          return null;
        }
        return {
          ...part,
          reason: item.reason,
          confidence: item.confidence,
        };
      })
      .filter(Boolean);
  }, [aiSuggestions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAiRecommend = async () => {
    if (!problemText.trim()) {
      setAiError("Please describe your car problem first.");
      return;
    }

    setAiError("");
    setAiLoading(true);

    try {
      const response = await fetch(PARTS_AI_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          problem: problemText,
          carModel: filters.carModel || null,
          parts: PARTS_DATA.map((part) => ({
            id: part.id,
            name: part.name,
            category: part.category,
            carModels: part.carModels,
            price: part.price,
          })),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Unable to get AI recommendations right now.");
      }

      setAiSummary(payload.summary || "");
      setAiCaution(payload.caution || "");
      setAiSource(payload.source || "");
      setAiSuggestions(Array.isArray(payload.recommendations) ? payload.recommendations : []);
    } catch (error) {
      setAiSuggestions([]);
      setAiSummary("");
      setAiCaution("");
      setAiSource("");
      setAiError(error.message || "Unable to get AI recommendations right now.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddToCart = async (part) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(CART_ITEMS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: part.id,
          productName: part.name,
          productCategory: part.category,
          productPrice: part.price,
          productImage: part.image,
          productBrand: part.brand,
          productStock: part.stock,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Failed to add item to cart");
      }

      navigate("/cart");
    } catch (error) {
      alert("Unable to add item to cart. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="parts-container">
        <div className="login-prompt">
          <h2>Please login to browse and order authentic car parts</h2>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="parts-container">
      <div className="parts-header">
        <h1>🔧 Authentic Car Parts Store</h1>
        <p>Browse and order genuine parts for your Tata vehicle</p>
      </div>

      <div className="parts-ai-panel">
        <h3>AI Parts Assistant (Gemini)</h3>
        <p>
          Describe your car problem and get suggested parts from available inventory.
        </p>
        <textarea
          value={problemText}
          onChange={(event) => setProblemText(event.target.value)}
          placeholder="Example: While braking, I hear squeaking from front wheels and pedal feels soft."
          rows={4}
        />
        <button
          type="button"
          className="btn-ai-suggest"
          onClick={handleAiRecommend}
          disabled={aiLoading}
        >
          {aiLoading ? "Analyzing Problem..." : "Suggest Parts"}
        </button>

        {aiError ? <p className="parts-ai-error">{aiError}</p> : null}
        {aiSummary ? <p className="parts-ai-summary">{aiSummary}</p> : null}
        {aiCaution ? <p className="parts-ai-caution">Note: {aiCaution}</p> : null}
        {aiSource ? <p className="parts-ai-source">Source: {aiSource}</p> : null}
      </div>

      {suggestedParts.length > 0 ? (
        <div className="parts-ai-results">
          <h3>Recommended Parts For Your Problem</h3>
          <div className="parts-ai-result-grid">
            {suggestedParts.map((part) => (
              <div key={part.id} className="parts-ai-result-card">
                <h4>{part.name}</h4>
                <p><strong>Reason:</strong> {part.reason}</p>
                <p><strong>Confidence:</strong> {part.confidence}</p>
                <p><strong>Price:</strong> ₹{part.price.toLocaleString("en-IN")}</p>
                <button
                  onClick={() => handleAddToCart(part)}
                  className="btn-add-cart"
                  disabled={part.stock === 0}
                >
                  {part.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Filter Section */}
      <div className="parts-filters">
        <h3>Filter Parts</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="carModel">Car Model:</label>
            <select
              id="carModel"
              name="carModel"
              value={filters.carModel}
              onChange={handleFilterChange}
            >
              <option value="">All Models</option>
              {carModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === "All Categories" ? "" : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="brand">Brand:</label>
            <select
              id="brand"
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">All Brands</option>
              {brands.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price: ₹{filters.maxPrice}</label>
            <input
              id="maxPrice"
              type="range"
              name="maxPrice"
              min="100"
              max="10000"
              step="100"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Parts Display */}
      <div className="parts-main">
        <div className="parts-count">
          <p>Showing {filteredParts.length} parts</p>
        </div>

        {filteredParts.length > 0 ? (
          <div className="parts-grid">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className={`part-card ${suggestedPartIdSet.has(part.id) ? "part-card-suggested" : ""}`}
              >
                <div className="part-image-container">
                  <img 
                    src={part.image} 
                    alt={part.name}
                    className="part-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <h3>{part.name}</h3>
                <div className="part-details">
                  <p>
                    <strong>Category:</strong> {part.category}
                  </p>
                  <p>
                    <strong>Brand:</strong> {part.brand}
                  </p>
                  <p>
                    <strong>Compatible Models:</strong> {part.carModels.join(", ")}
                  </p>
                  <p className="stock-badge">
                    {part.stock > 5 ? (
                      <span className="in-stock">✓ In Stock ({part.stock})</span>
                    ) : (
                      <span className="low-stock">⚠ Low Stock ({part.stock})</span>
                    )}
                  </p>
                </div>
                <div className="part-footer">
                  <div className="part-price">₹{part.price.toLocaleString("en-IN")}</div>
                  <button
                    onClick={() => handleAddToCart(part)}
                    className="btn-add-cart"
                    disabled={part.stock === 0}
                  >
                    {part.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-parts">
            <p>No parts found matching your filters. Try adjusting your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
