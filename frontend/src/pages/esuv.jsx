import React from "react";
import { useNavigate } from "react-router-dom";
import artcurve from "../assets/artcurve.jpg";
import Harrierev2 from "../assets/harrierev2.jpg";
import punchImg from "../punchev.webp";
import tiagoImg from "../tiagoev.webp";
import tigorImg from "../tigorev.webp";
import nexonImg from "../nexonev.webp";
export default function ESUV() {
  const navigate = useNavigate();
  return (
    <section className="esuv-container">
      <header className="section-header">
        <h1>Explore Our Electric SUVs</h1>
        <p>Discover the future of driving with our range of electric SUVs combining sustainability and performance.</p>
      </header>
      <div className="esuv-list">
        <article className="esuv-card">
          <img src={artcurve} alt="TATA EV Model 1" className="esuv-image" />
          <h2>TATA CURVE EV</h2>
          <p>Efficient, stylish, and packed with the latest electric vehicle technology.</p>
          <button className="btn-primary" onClick={() => navigate('/curve')}>Learn More</button>
        </article>
        <article className="esuv-card">
          <img src={Harrierev2} alt="TATA harrier" className="esuv-image" />
          <h2>TATA HARRIER EV</h2>
          <p>Experience the power of electric with extended range and fast charging.</p>
          <button className="btn-primary" onClick={() => navigate('/harrier')}>Learn More</button>
        </article>
        <article className="esuv-card">
          <img src={punchImg} alt="TATA Punch" className="esuv-image" />
          <h2>TATA PUNCH EV</h2>
          <p>Bold, compact SUV with commanding presence and intelligent features.</p>
          <button className="btn-primary" onClick={() => navigate('/punch')}>Learn More</button>
        </article>
        <article className="esuv-card">
          <img src={tiagoImg} alt="TATA Tiago" className="esuv-image" />
          <h2>TATA TIAGO EV</h2>
          <p>Compact hatchback combining practicality with modern style and comfort.</p>
          <button className="btn-primary" onClick={() => navigate('/tiago')}>Learn More</button>
        </article>
        <article className="esuv-card">
          <img src={tigorImg} alt="TATA Tigor" className="esuv-image" />
          <h2>TATA TIGOR EV</h2>
          <p>Stylish compact sedan with premium features and spacious interiors.</p>
          <button className="btn-primary" onClick={() => navigate('/tigor')}>Learn More</button>
        </article>
        <article className="esuv-card">
          <img src={nexonImg} alt="TATA Nexon" className="esuv-image" />
          <h2>TATA NEXON EV</h2>
          <p>Adventure-ready SUV with distinctive design and advanced safety features.</p>
          <button className="btn-primary" onClick={() => navigate('/nexon')}>Learn More</button>
        </article>
      </div>
    </section>
  );
}
