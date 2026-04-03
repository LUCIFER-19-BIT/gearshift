import React from 'react';
import { useNavigate } from 'react-router-dom';
import PunchImg from '../punchev.webp';
import punchBannerImg from '../punchbanner.avif';
import punchContentImg from '../punchcon.avif';
import punchVideo from '../punchvid.mp4';
import punchVideo2 from '../punchvid2.mp4';
import ChargingStations from '../components/ChargingStations';
import '../curve.css';

const Punch = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="curve-container">
        <div className="curve-content">
          <div className="curve-electric-label">Compact SUV</div>
          <h1 className="curve-heading">Punch EV</h1>
          <p className="curve-subheading">
            Punch is engineered for those who refuse to compromise. Bold design, commanding presence, and intelligent features make it the perfect urban companion. Built tough to tackle any situation, Punch is ready to make an impact wherever you go.
          </p>
          <div>
            <button className="curve-button" onClick={() => navigate('/bookings', { state: { image: PunchImg } })}>Book Now</button>
          </div>
        </div>
        <div>
          <img src={PunchImg} alt="Punch SUV" className="curve-image" />
        </div>
      </div>
      <section className="video-section">
        <h2 className="video-headline">Bold Design & Performance</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={punchVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-text">
          <h2 className="innovative-headline">Designed for Bold Performance</h2>
          <p className="innovative-subheading">Compact yet powerful with commanding road presence.</p>
          <h3 className="v2v-headline">Smart Design & Durability</h3>
          <p className="v2v-subheading">Built with every adventure in mind, featuring robust construction and modern aesthetics.</p>
        </div>
        <div className="innovative-image-container">
          <img src={punchBannerImg} alt="Punch design" className="innovative-image" />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-image-container">
          <img src={punchContentImg} alt="Punch technology" className="innovative-image" />
        </div>
        <div className="innovative-text">
          <h2 className="innovative-headline">Advanced Technology</h2>
          <p className="innovative-subheading">Stay connected with modern features and smart controls.</p>
          <h3 className="v2v-headline">Connectivity & Convenience</h3>
          <p className="v2v-subheading">Experience intuitive controls and seamless integration for your daily drive.</p>
        </div>
      </section>
      <section className="video-section">
        <h2 className="video-headline">Power & Precision</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={punchVideo2}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <div className="punch-specs">
        <div className="punch-spec-item">
          <div className="punch-spec-heading">Battery</div>
          <div className="punch-spec-value">Larger 40 kWh Battery Pack</div>
        </div>
        <div className="punch-spec-item">
          <div className="punch-spec-heading">Faster Charging</div>
          <div className="punch-spec-value">20% to 80% in 26 minutes▲
135 km real world range in 15 minutes</div>
        </div>
        <div className="punch-spec-item">
          <div className="punch-spec-heading">Max Power</div>
          <div className="punch-spec-value">81.8 kW</div>
        </div>
        <div className="punch-spec-item">
          <div className="punch-spec-heading">Lifetime* HV Battery Pack Warranty</div>
          <div className="punch-spec-value">Lifetime* HV Battery Pack Warranty</div>
        </div>
      </div>
      <ChargingStations />
    </>
  );
};

export default Punch;
