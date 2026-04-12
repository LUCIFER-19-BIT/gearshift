import React from 'react';
import { useNavigate } from 'react-router-dom';
import NexonImg from '../assets/vehicles/ev/nexonev.webp';
import nexonDasImg from '../assets/vehicles/nexon/nexondas.avif';
import nexonAlloyImg from '../assets/vehicles/nexon/nexonalloy.webp';
import nexonVid from '../assets/vehicles/nexon/nexonvid.mp4';
import nexonVid2 from '../assets/vehicles/nexon/nexonvid2.mp4';
import ChargingStations from '../components/ChargingStations';
import '../curve.css';

const Nexon = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="curve-container">
        <div className="curve-content">
          <div className="curve-electric-label">Compact SUV</div>
          <h1 className="curve-heading">Nexon EV</h1>
          <p className="curve-subheading">
            Nexon is a real-world adventure companion that refuses to compromise on style or substance. With its distinctive design, advanced safety features, and powerful performance, Nexon is ready to take you wherever life leads.
          </p>
          <div>
            <button className="curve-button" onClick={() => navigate('/bookings', { state: { image: NexonImg } })}>Book Now</button>
          </div>
        </div>
        <div>
          <img src={NexonImg} alt="Nexon SUV" className="curve-image" />
        </div>
      </div>
      <section className="video-section">
        <h2 className="video-headline">Advanced Safety</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={nexonVid}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-text">
          <h2 className="innovative-headline">Digital Dashboard</h2>
          <p className="innovative-subheading">A dynamic digital dashboard that elevates your cabin experience</p>
        </div>
        <div className="innovative-image-container">
          <img src={nexonDasImg} alt="Nexon DAS" className="innovative-image" />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-image-container">
          <img src={nexonAlloyImg} alt="Nexon alloy" className="innovative-image" />
        </div>
        <div className="innovative-text">
          <h2 className="innovative-headline">R16 Alloy wheels</h2>
          <p className="innovative-subheading">Glide through with aero inserts on R16 alloy wheels.</p>
          <h3 className="v2v-headline">Connected Experience</h3>
          <p className="v2v-subheading">Enjoy seamless connectivity and advanced comfort features for every adventure.</p>
        </div>
      </section>
      <section className="video-section">
        <h2 className="video-headline">Power & Precision</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={nexonVid2}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <div className="nexon-specs">
        <div className="nexon-spec-item">
          <div className="nexon-spec-heading">Range</div>
          <div className="nexon-spec-value">Certified full charge range as per
MIDC Part 1 + Part 2 (km) : 489# km</div>
        </div>
        <div className="nexon-spec-item">
          <div className="nexon-spec-heading">Fast Charge</div>
          <div className="nexon-spec-value">40 mins*</div>
        </div>
        <div className="nexon-spec-item">
          <div className="nexon-spec-heading">0 to 100 kmph</div>
          <div className="nexon-spec-value">8.9^ sec</div>
        </div>
        <div className="nexon-spec-item">
          <div className="nexon-spec-heading">Lifetime HV Battery Warrantyθ</div>
          <div className="nexon-spec-value">Powerfull Battery</div>
        </div>
      </div>
      <ChargingStations />
    </>
  );
};

export default Nexon;
