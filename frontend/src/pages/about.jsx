import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="about-page">
      <article className="about-hero about-article">
        <p className="about-kicker">GearShift Blog</p>
        <h1>Why GearShift Exists as an Independent Automotive Platform</h1>
        <p className="about-intro">
          GearShift is a simple, independent marketplace. We help you explore vehicles, compare options, and understand how much they cost to own. We are not an official Tata website. We were created for learning, with one clear goal: make it easier for users to compare vehicles and make smart choices.
        </p>
        <div className="about-meta">
          Published for educational use · Independent marketplace · Focused on a single automotive niche
        </div>
        <div className="about-highlight">
          <strong>What makes it different:</strong> GearShift is not copying another website. It works like a smart tool that helps you decide. It brings together vehicle listings, comparisons, scrap value analysis, parts information, and EV tips all in one place.
        </div>
      </article>

      <section className="about-grid">
        <article className="about-panel">
          <h2>Focused Marketplace</h2>
          <p>
            We keep things simple by focusing on one brand. This makes the experience clearer, better organized, and easier to trust.
          </p>
        </article>
        <article className="about-panel">
          <h2>Scrap Analysis</h2>
          <p>
            See what your used car is worth. Check the condition before deciding to buy a pre-owned vehicle.
          </p>
        </article>
        <article className="about-panel">
          <h2>Parts Recommendation</h2>
          <p>
            Get suggestions for parts and accessories that work with your car. Stay practical after purchase.
          </p>
        </article>
        <article className="about-panel">
          <h2>EV Incentives</h2>
          <p>
            Learn about electric vehicle benefits, savings, and incentives. Understand the shift toward cleaner cars.
          </p>
        </article>
      </section>

      <section className="about-story">
        <div className="about-panel about-panel-wide">
          <h2>GearShift vs. Tata: What We Own</h2>
          <p>
            Here's the important part: <strong>GearShift is not Tata. We simply focus on Tata vehicles.</strong>
          </p>
          <p>
            GearShift created the website design, features, branding, and tools. These are all ours and original. The car information (specs, models, prices) comes from public sources about Tata vehicles. This is like how Edmunds or Cars.com work—they use car data from many companies, then build their own tools around it.
          </p>
          <p>
            We chose to focus only on Tata vehicles to keep things simple and clear. This is a smart business choice, not a rule we had to follow.
          </p>
        </div>

        <div className="about-panel about-panel-wide">
          <h2>Why We Focus on Tata Vehicles</h2>
          <p>
            <strong>Staying focused = Better for you.</strong> Instead of trying to cover every car brand, GearShift focuses on Tata vehicles only. This lets us:
          </p>
          <ul style={{ marginTop: "12px", marginLeft: "24px", color: "var(--text-light-secondary)" }}>
            <li>Build better comparison tools for Tata models</li>
            <li>Show you the right parts for each car</li>
            <li>Give you accurate scrap value, cost of ownership, and EV information</li>
            <li>Keep the website simple and easy to use</li>
          </ul>
          <p style={{ marginTop: "16px" }}>
            Many successful companies started by being really good at one thing, then grew bigger later. That's what GearShift is doing.
          </p>
        </div>

        <div className="about-panel about-panel-wide">
          <h2>What Information We Use</h2>
          <p>
            <strong>Public vehicle data:</strong> Model names, specs, engine details, available versions, and prices. This information is publicly available through government sources, dealership websites, and automotive databases.
          </p>
          <p>
            <strong>Standard automotive terminology:</strong> Words like "SUV," "sedan," "hybrid," and "test drive" are industry-standard terms, not Tata-specific language.
          </p>
          <p style={{ marginTop: "16px", color: "var(--text-light-tertiary)" }}>
            GearShift is transparent about using Tata vehicle data. It is not hidden. The disclaimer is clear: "This is an independent platform for listing and analyzing pre-owned Tata vehicles."
          </p>
        </div>

        <div className="about-panel about-panel-wide">
          <h2>Why This Matters (For Learning)</h2>
          <p>
            GearShift teaches how to build a marketplace that is:
          </p>
          <ul style={{ marginTop: "12px", marginLeft: "24px", color: "var(--text-light-secondary)" }}>
            <li><strong>Independent:</strong> Our own branding, our own hosting, our own users</li>
            <li><strong>Focused:</strong> One clear purpose, expert level, very relevant</li>
            <li><strong>Honest:</strong> We tell you where our data comes from</li>
            <li><strong>Useful:</strong> We give you real tools to compare and choose cars</li>
            <li><strong>Legal:</strong> We respect brands and copyrights while using public data</li>
          </ul>
          <p style={{ marginTop: "16px" }}>
            For students and developers: You don't need to copy an existing website to build something good. You need a clear idea, your own design, and honesty about your information sources.
          </p>
        </div>
      </section>

      <div className="about-actions">
        <Link to="/bookings" className="btn-outline">Explore Booking</Link>
        <Link to="/parts" className="btn-outline">View Parts</Link>
      </div>

      <p className="about-note">
        This project is independent and is not affiliated with or endorsed by Tata Motors in any way.
      </p>
    </main>
  );
}