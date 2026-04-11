import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getEvSalesGrowth,
  getChargingStationGrowth,
  calculateEnvironmentalImpact,
  calculateCostSavings,
  getEvMarketAnalysis,
} from "../utils/evStatsApi";
import "../styles/evStats.css";

const COLORS = ["#10B981", "#059669", "#047857", "#065F46"];

export default function EvStatsGraphs() {
  const [salesData, setSalesData] = useState(null);
  const [chargingData, setChargingData] = useState(null);
  const [envData, setEnvData] = useState(null);
  const [costData, setCostData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sales, charging, analysis] = await Promise.all([
          getEvSalesGrowth(),
          getChargingStationGrowth(),
          Promise.resolve(getEvMarketAnalysis()),
        ]);

        setSalesData(sales);
        setChargingData(charging);
        setEnvData(calculateEnvironmentalImpact(40, 22));
        setCostData(calculateCostSavings(40, 22, 6));
        setAnalysis(analysis);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching EV stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="ev-stats-container">
        <p className="loading">Loading real-time EV data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ev-stats-container">
        <p className="error">Unable to load data: {error}</p>
      </div>
    );
  }

  // Prepare pie chart data for market share
  const marketShareData = salesData?.data?.slice(-1).map((item) => ({
    name: item.year,
    evMarket: item.marketShare,
    traditionalMarket: 100 - item.marketShare,
  })) || [];

  return (
    <div className="ev-stats-container">
      <div className="stats-header">
        <h3>EV Market Analytics: Real-Time Data Analysis</h3>
        <p className="data-info">
          Data sources: SIAM, NITI Aayog, Ministry of Power, OpenChargeMap API, World Bank
        </p>
      </div>

      {/* EV Sales Growth Section */}
      <section className="stats-section">
        <div className="section-header">
          <h4>📈 EV Sales Growth in India (2019-2025)</h4>
          <span className="badge">87% CAGR</span>
        </div>
        <p className="section-description">
          Source: {salesData?.source} | Data Shows: Annual EV sales and market share growth
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" label={{ value: "EV Sales (units)", angle: -90, position: "insideLeft" }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: "Market Share (%)", angle: 90, position: "insideRight" }} />
            <Tooltip
              formatter={(value) => value.toLocaleString()}
              contentStyle={{ backgroundColor: "#f5f5f5", border: "1px solid #10B981" }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="evSales"
              stroke="#10B981"
              strokeWidth={2}
              name="EV Sales (units)"
              connectNulls
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marketShare"
              stroke="#059669"
              strokeWidth={2}
              name="Market Share (%)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="stat-insights">
          <div className="insight">
            <h5>Latest Year (2025)</h5>
            <p>
              <strong>{salesData?.data?.slice(-1)[0]?.evSales?.toLocaleString()}</strong> EV units sold
            </p>
            <p>Market Share: <strong>{salesData?.data?.slice(-1)[0]?.marketShare?.toFixed(1)}%</strong></p>
          </div>
          <div className="insight">
            <h5>Growth Factor</h5>
            <p>{salesData?.cagr}</p>
            <p className="metric-note">From 5,000 units (2019) to 350,000 units (2025)</p>
          </div>
        </div>
      </section>

      {/* Charging Infrastructure Growth Section */}
      <section className="stats-section">
        <div className="section-header">
          <h4>🔌 EV Charging Station Expansion in India</h4>
          <span className="badge">75x Growth</span>
        </div>
        <p className="section-description">
          Source: {chargingData?.source} | Coverage: Public AC & DC charging networks
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chargingData?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: "Number of Charging Stations", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="stations" fill="#10B981" name="Charging Stations" radius={[8, 8, 0, 0]} />
            <Bar dataKey="cities" fill="#059669" name="Cities Covered" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="stat-insights">
          <div className="insight">
            <h5>Current Coverage (2025)</h5>
            <p>
              <strong>{chargingData?.data?.slice(-1)[0]?.stations?.toLocaleString()}</strong> public charging points
            </p>
            <p>Across <strong>{chargingData?.data?.slice(-1)[0]?.cities}</strong> cities</p>
          </div>
          <div className="insight">
            <h5>Key Initiatives</h5>
            <ul className="initiatives-list">
              {chargingData?.keyInitiatives?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="stats-section">
        <div className="section-header">
          <h4>🌍 Environmental Impact: 40 km Daily Commute</h4>
          <span className="badge">{envData?.co2ReductionPercentage}% Less CO2</span>
        </div>
        <p className="section-description">
          Source: {envData?.source} | Comparison: Petrol vs EV over 1 year
        </p>

        <div className="impact-grid">
          <div className="impact-card">
            <h5>Annual CO2 Reduction</h5>
            <p className="big-number">{envData?.yearlyCo2Reduction} kg</p>
            <p className="description">Greenhouse gas not emitted</p>
          </div>
          <div className="impact-card">
            <h5>Tree Equivalence</h5>
            <p className="big-number">{envData?.treesEquivalent}</p>
            <p className="description">Trees needed to absorb this CO2</p>
          </div>
          <div className="impact-card">
            <h5>Petrol Saved Annually</h5>
            <p className="big-number">{envData?.petrolSavedLiters} L</p>
            <p className="description">Fossil fuel not consumed</p>
          </div>
          <div className="impact-card">
            <h5>Grid Clean Energy</h5>
            <p className="big-number">{envData?.gridCleaningPercentage}%+</p>
            <p className="description">Growing renewable energy in India's grid</p>
          </div>
        </div>

        <div className="note-box">
          <strong>📌 Key Insight:</strong> As India transitions to 50%+ renewable energy by 2030, EV emissions will
          reduce even further. A Tata EV switches from {envData?.avgCo2PerKmEV} kg to ~0.02 kg CO2/km with 100%
          renewable grid energy.
        </div>
      </section>

      {/* Total Cost of Ownership Analysis */}
      <section className="stats-section">
        <div className="section-header">
          <h4>📊 Total Cost of Ownership (TCO) & Government Incentives</h4>
          <span className="badge">5-Year ROI Analysis</span>
        </div>
        <p className="section-description">
          Long-term ownership comparison including purchase price, incentives, and operational costs
        </p>

        <div className="tco-grid">
          <div className="tco-card">
            <h5>Upfront Cost (Before Incentives)</h5>
            <div className="tco-row">
              <span>Petrol Car</span>
              <strong>₹8,00,000</strong>
            </div>
            <div className="tco-row">
              <span>Tata EV (Nexon EV)</span>
              <strong>₹13,50,000</strong>
            </div>
            <div className="tco-row highlight">
              <span>Initial Difference</span>
              <strong>+ ₹5,50,000</strong>
            </div>
          </div>

          <div className="tco-card incentive">
            <h5>🎁 Government Incentives Available</h5>
            <div className="tco-row">
              <span>Central FAME Subsidy (up to)</span>
              <strong>₹5,00,000</strong>
            </div>
            <div className="tco-row">
              <span>State-Level Benefits (avg)</span>
              <strong>₹1,00,000</strong>
            </div>
            <div className="tco-row">
              <span>Road Tax Exemption (annual)</span>
              <strong>₹2,500 - ₹5,000</strong>
            </div>
            <div className="tco-row highlight">
              <span>Total Incentives</span>
              <strong>₹6,00,000+</strong>
            </div>
          </div>

          <div className="tco-card">
            <h5>5-Year Operating Costs</h5>
            <div className="tco-row">
              <span>Fuel/Electricity (₹15,000/month)</span>
              <strong>₹9,00,000</strong>
            </div>
            <div className="tco-row">
              <span>Maintenance</span>
              <strong>₹1,50,000</strong>
            </div>
            <div className="tco-row">
              <span>Insurance</span>
              <strong>₹75,000</strong>
            </div>
            <div className="tco-row highlight">
              <span>Total Operating</span>
              <strong>₹11,25,000</strong>
            </div>
          </div>

          <div className="tco-card savings">
            <h5>✨ 5-Year TCO Summary</h5>
            <div className="tco-row">
              <span>Petrol: Purchase + Operations</span>
              <strong>₹20,75,000</strong>
            </div>
            <div className="tco-row">
              <span>EV: After Incentives</span>
              <strong>₹8,75,000</strong>
            </div>
            <div className="tco-row highlight biggest">
              <span>NET SAVINGS (5 years)</span>
              <strong>₹12,00,000+</strong>
            </div>
          </div>
        </div>

        <div className="incentives-section">
          <h5>🏆 Where to Get Incentives</h5>
          <ul className="incentives-list">
            <li>
              <strong>FAME-II Scheme</strong> (Central) - Up to ₹5 lakh subsidy on battery cost
              <br /><span>Apply at: SEISINDIA.com</span>
            </li>
            <li>
              <strong>State Incentives</strong> - Varies by state (Karnataka, Delhi, etc.)
              <br /><span>Check: State transport department website</span>
            </li>
            <li>
              <strong>Corporate Tax Benefits</strong> (if not personal) - Enhanced deduction under Section 32
            </li>
            <li>
              <strong>Charging Subsidies</strong> - Free/subsidized home charging installation in many states
            </li>
          </ul>
        </div>
      </section>

      {/* Market Analysis Section */}
      <section className="stats-section">
        <div className="section-header">
          <h4>📊 Key EV Market Insights & Government Targets</h4>
        </div>
        <p className="section-description">Source: {analysis?.source}</p>

        <div className="insights-grid">
          {analysis?.keyFactsIndia?.map((fact, idx) => (
            <div key={idx} className="insight-card">
              <h5>{fact.title}</h5>
              <p className="data">{fact.data}</p>
              <p className="source">Source: {fact.source}</p>
            </div>
          ))}
        </div>

        <div className="charging-expansion">
          <h5>Charging Infrastructure Roadmap</h5>
          <div className="roadmap">
            {Object.entries(analysis?.chargingExpansionPlan || {}).map(([year, plan]) =>
              typeof plan === "string" ? (
                <div key={year} className="roadmap-item">
                  <span className="year">{year}:</span>
                  <span className="plan">{plan}</span>
                </div>
              ) : null
            )}
          </div>

          <div className="tech-section">
            <h6>Charging Technologies</h6>
            <ul className="tech-list">
              {analysis?.chargingExpansionPlan?.Technologies?.map((tech, idx) => (
                <li key={idx}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>


    </div>
  );
}
