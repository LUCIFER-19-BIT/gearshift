import React from 'react';
import { useNavigate } from 'react-router-dom';
import CurveImg from '../assets/curveev.webp';
import ChargingImg from '../assets/charging.avif';
import load from '../assets/load.avif';
import summit from '../assets/summit.mp4';
import TataCurveEvVideo from '../assets/tatacurveev.mp4';
import ChargingStations from '../components/ChargingStations';
import '../curve.css';

const Curve = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="curve-container">
        <div className="curve-content">
          <div className="curve-electric-label">Electric</div>
          <h1 className="curve-heading">Curvv.ev</h1>
          <p className="curve-subheading">
            The SUV Coupé is designed to impress with its blend of elegance and innovation. With a distinctive design, luxurious comfort, robust performance, and top-tier safety features, every ride is a statement. It has it all because it's shaped for you.
          </p>
          <div>
            <button className="curve-button" onClick={() => navigate('/bookings', { state: { image: CurveImg } })}>Book Now</button>
            {/* Removed Digital Showroom button as per request */}
          </div>
        </div>
        <div>
          <img src={CurveImg} alt="Curvv.ev SUV" className="curve-image" />
        </div>
      </div>
      <section className="video-section">
        <h2 className="video-headline">Shaped for You</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={TataCurveEvVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-text">
          <h2 className="innovative-headline">Shaped for Innovative Technology</h2>
          <p className="innovative-subheading">Get entertainment and productivity on the go with modern tech.</p>
          <h3 className="v2v-headline">Vehicle to Vehicle (V2V) Charging</h3>
          <p className="v2v-subheading">Share power with compatible vehicles^^^.</p>
        </div>
        <div className="innovative-image-container">
          <img src={ChargingImg} alt="Charging Vehicles" className="innovative-image" />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-image-container">
          <img src={load} alt="Charging Vehicles" className="innovative-image" />
        </div>
        <div className="innovative-text">
          <h2 className="innovative-headline">Shaped for Advanced Connectivity</h2>
          <p className="innovative-subheading">Stay connected with seamless integration and smart features.</p>
          <h3 className="v2v-headline">Smart Vehicle Communication</h3>
          <p className="v2v-subheading">Experience next-level vehicle interaction and control.</p>
        </div>
      </section>
      <div className="curve-specs">
        <div className="curve-spec-item">
          <div className="curve-spec-heading">Range</div>
          <div className="curve-spec-value">502&#35; Km</div>
        </div>
        <div className="curve-spec-item">
          <div className="curve-spec-heading">Fast Charge</div>
          <div className="curve-spec-value">40&#965; mins (with 70kW DC Fast Charger)</div>
        </div>
        <div className="curve-spec-item">
          <div className="curve-spec-heading">0 to 100 kmph</div>
          <div className="curve-spec-value">8.6&#94; sec</div>
        </div>
        <div className="curve-spec-item">
          <div className="curve-spec-heading">Lifetime HV Battery Warranty&#176;</div>
        </div>

      </div>
      <section className="video-section">
        <h2 className="video-headline">The Silent Summit</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={summit}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>

      {/* Charging Stations Section */}
      <ChargingStations />
    </>
  );
};

export default Curve;
