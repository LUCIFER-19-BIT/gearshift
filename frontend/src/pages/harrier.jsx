import React from 'react';
import { useNavigate } from 'react-router-dom';
import HarrierImg from '../assets/harrierev.jpg';
import sunroof from '../assets/sunroof.jpg';
import proximity from '../assets/proximity.avif';
import saftey from '../assets/saftey.mp4';
import evele from '../assets/evele.mp4';
import ChargingStations from '../components/ChargingStations';
import '../curve.css';

const Harrier = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="curve-container">
        <div className="curve-content">
          <div className="curve-electric-label">Electric</div>
          <h1 className="curve-heading">Harrier.ev</h1>
          <p className="curve-subheading">
            Harrier.ev is engineered to take on the impossible. It delivers instant torque, dynamic precision, and next-gen terrain adaptability, redefining what it means to go electric in an SUV. Whether you're cruising through the city or taking on nature, with Harrier.ev the power isn’t under the hood anymore. It’s in every move.
          </p>
          <div>
            <button className="curve-button" onClick={() => navigate('/bookings', { state: { image: HarrierImg } })}>Book Now</button>
          </div>
        </div>
        <div>
          <img src={HarrierImg} alt="harrier.ev SUV" className="curve-image" />
        </div>
      </div>
      <section className="video-section">
        <h2 className="video-headline">Safety</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={saftey}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-text">
          <h2 className="innovative-headline">Voice Assisted Panoramic Sunroof with Mood Lighting</h2>
          <p className="innovative-subheading">Get entertainment and productivity on the go with modern tech.</p>
          <h3 className="v2v-headline">Let light flood in through a wide glass roof that redefines every journey.</h3>
          <p className="v2v-subheading">Share power with compatible vehicles^^^.</p>
        </div>
        <div className="innovative-image-container">
          <img src={sunroof} alt="sunroof" className="innovative-image" />
        </div>
      </section>
      <section className="innovative-tech-section">
        <div className="innovative-image-container">
          <img src={proximity} alt="proximity" className="innovative-image" />
        </div>
        <div className="innovative-text">
          <h2 className="innovative-headline">Digi Access</h2>
          <p className="innovative-subheading">Stay connected with seamless integration and smart features.</p>
          <h3 className="v2v-headline">Make your presence felt, with Proximity based lock and unlock through Digi Accessι.</h3>
          <p className="v2v-subheading">Experience next-level vehicle interaction and control.</p>
        </div>
      </section>
      <div className="harrier-specs">
        <div className="harrier-spec-item">
          <div className="harrier-spec-heading">Range</div>
          <div className="harrier-spec-value">502&#35; Km</div>
        </div>
        <div className="harrier-spec-item">
          <div className="harrier-spec-heading">Fast Charge</div>
          <div className="harrier-spec-value">40&#965; mins (with 70kW DC Fast Charger)</div>
        </div>
        <div className="harrier-spec-item">
          <div className="harrier-spec-heading">0 to 100 kmph</div>
          <div className="harrier-spec-value">8.6&#94; sec</div>
        </div>
        <div className="harrier-spec-item">
          <div className="harrier-spec-heading">Lifetime HV Battery Warranty&#176;</div>
        </div>

      </div>
      <section className="video-section">
        <h2 className="video-headline">e-Valet</h2>
        <div className="video-container">
          <video
            className="curve-video"
            src={evele}
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

export default Harrier;
