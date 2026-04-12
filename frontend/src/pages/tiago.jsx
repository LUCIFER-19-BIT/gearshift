import React from 'react';
import { useNavigate } from 'react-router-dom';
import TiagoImg from '../assets/vehicles/ev/tiagoev.webp';
import tiagoSmartImg from '../assets/vehicles/tiago/smarttiago.avif';
import tiagoLedImg from '../assets/vehicles/tiago/tiagoled.avif';
import tiagoVid from '../assets/vehicles/tiago/tiagovid.mp4';
import tiagoVid2 from '../assets/vehicles/tiago/tiagovid2.mp4';
import ChargingStations from '../components/ChargingStations';
import '../curve.css';

const Tiago = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="curve-container">
        <div className="curve-content">
          <div className="curve-electric-label">Compact Hatchback</div>
          <h1 className="curve-heading">Tiago EV</h1>
          <p className="curve-subheading">
            Tiago combines practicality with style, delivering a perfect blend of comfort and efficiency. With modern features, spacious interiors, and responsive handling, Tiago is designed for drivers who value versatility and performance in their everyday journey.
          </p>
          <div>
            <button className="curve-button" onClick={() => navigate('/bookings', { state: { image: TiagoImg } })}>Book Now</button>
          </div>
        </div>
        <div>
          <img src={TiagoImg} alt="Tiago" className="curve-image" />
        </div>
      </div>
      <section className="video-section">
        <h2 className="video-headline">Stylish & Versatile</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={tiagoVid}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-text">
          <h2 className="innovative-headline">Advanced Digital Instrument Cluster</h2>
          <p className="innovative-subheading">For laid-back driving, enjoy smart support with the fully-equipped Digital Instrument Cluster.</p>
          <h3 className="v2v-headline">Spacious Interior</h3>
          <p className="v2v-subheading">Enjoy comfortable seating and flexible storage for all your needs.</p>
        </div>
        <div className="innovative-image-container">
          <img src={tiagoSmartImg} alt="Interior" className="innovative-image" />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-image-container">
          <img src={tiagoLedImg} alt="Performance" className="innovative-image" />
        </div>
        <div className="innovative-text">
          <h2 className="innovative-headline">Daytime Running Lamps (DRLs)</h2>
          <p className="innovative-subheading">Lit DRLs keep it cool, adding that perfect touch of effortless style.</p>
         
        </div>
      </section>
      <section className="video-section">
        <h2 className="video-headline">Technology & Comfort</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={tiagoVid2}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <div className="tiago-specs">
        <div className="tiago-spec-item">
          <div className="tiago-spec-heading">Range</div>
          <div className="tiago-spec-value">293# Km</div>
        </div>
        <div className="tiago-spec-item">
          <div className="tiago-spec-heading">0 to 60 km/h</div>
          <div className="tiago-spec-value">5.7^ sec</div>
        </div>
        <div className="tiago-spec-item">
          <div className="tiago-spec-heading">Fast-Charge</div>
          <div className="tiago-spec-value">58▲ mins</div>
        </div>
        <div className="tiago-spec-item">
          <div className="tiago-spec-heading">Great power</div>
          <div className="tiago-spec-value">Capable For High Performance</div>
        </div>
      </div>
      <ChargingStations />
    </>
  );
};

export default Tiago;
