import React from 'react';
import { useNavigate } from 'react-router-dom';
import TigorImg from '../assets/vehicles/ev/tigorev.webp';
import tigorContrastBlackImg from '../assets/vehicles/tigor/contrast-black-roof.avif';
import tigorDashboardImg from '../assets/vehicles/tigor/dash-board.avif';
import tigorVid from '../assets/vehicles/tigor/tigorvid.mp4';
import tigorVid2 from '../assets/vehicles/tigor/tigorvid2.mp4';
import ChargingStations from '../components/ChargingStations';
import '../curve.css';

const Tigor = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="curve-container">
        <div className="curve-content">
          <div className="curve-electric-label">Compact Sedan</div>
          <h1 className="curve-heading">Tigor EV</h1>
          <p className="curve-subheading">
            Tigor is a stylish compact sedan that offers premium features in a practical package. With its sophisticated design, spacious boot, and advanced connectivity, Tigor delivers comfort and reliability for the modern urban driver.
          </p>
          <div>
            <button className="curve-button" onClick={() => navigate('/bookings', { state: { image: TigorImg } })}>Book Now</button>
          </div>
        </div>
        <div>
          <img src={TigorImg} alt="Tigor" className="curve-image" />
        </div>
      </div>
      <section className="video-section">
        <h2 className="video-headline">Premium Design</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={tigorVid}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-text">
          <h2 className="innovative-headline">All-New Magnetic Red Color With Contrast Black Roof</h2>
          <p className="innovative-subheading">A shade that exudes all the charisma you need.</p>
          <h3 className="v2v-headline">Spacious & Comfortable</h3>
          <p className="v2v-subheading">Experience luxurious comfort with generous boot space and premium interiors.</p>
        </div>
        <div className="innovative-image-container">
          <img src={tigorContrastBlackImg} alt="Contrast black roof" className="innovative-image" />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-image-container">
          <img src={tigorDashboardImg} alt="Dashboard" className="innovative-image" />
        </div>
        <div className="innovative-text">
          <h2 className="innovative-headline">Dual-Tone Dashboard</h2>
          <p className="innovative-subheading">An elegant blend of black and light grey interior shades that adds richness to your EV experience.</p>
          
        </div>
      </section>
      <section className="video-section">
        <h2 className="video-headline">Performance & Reliability</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={tigorVid2}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <div className="tigor-specs">
        <div className="tigor-spec-item">
          <div className="tigor-spec-heading">Range</div>
          <div className="tigor-spec-value">315# km</div>
        </div>
        <div className="tigor-spec-item">
          <div className="tigor-spec-heading">Safety</div>
          <div className="tigor-spec-value">Safest Electric Sedan in India.</div>
        </div>
        <div className="tigor-spec-item">
          <div className="tigor-spec-heading">0 to 60 km/h</div>
          <div className="tigor-spec-value">5.7^ sec</div>
        </div>
        <div className="tigor-spec-item">
          <div className="tigor-spec-heading">Fast-Charge</div>
          <div className="tigor-spec-value">59** min</div>
        </div>
      </div>
      <ChargingStations />
    </>
  );
};

export default Tigor;
