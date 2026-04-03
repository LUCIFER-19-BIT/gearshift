import React from "react";
import { useNavigate } from "react-router-dom";
import harrierImg from "../assets/harriyellow.png";
import nexonImg2 from "../assets/nexonnew.png";
import safariImg2 from "../assets/safarinew.png";
import curvet from "../assets/curvet.png";
import altrozImg2 from "../assets/altrozenew.png";
import tiagoImg2 from "../assets/tiagonew.png";
import punchImg from "../assets/punch.png";
import tigorImg from "../assets/TIGOR/opal-white-right-39-Picsart-BackgroundRemover.png";

const SUVs = () => {
    const navigate = useNavigate();

    return (
        <section className="suvs-container">
            <header className="section-header">
                <h1>Explore Our Premium SUVs</h1>
                <p>
                    Discover the perfect blend of power, style, and technology in our
                    range of SUVs designed for every journey.
                </p>
            </header>
            <div className="suv-list">
                <article className="suv-card">
                    <img src={harrierImg} alt="HARRIER" className="suv-image" />
                    <h2>HARRIER</h2>
                    <p>₹12.25L - ₹22.06L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: harrierImg } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "harrier", image: harrierImg } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={nexonImg2} alt="NEXON" className="suv-image" />
                    <h2>Nexon</h2>
                    <p>₹7.28L - ₹17.40L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: nexonImg2 } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "nexon", image: nexonImg2 } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={safariImg2} alt="SAFARI" className="suv-image" />
                    <h2>SAFARI</h2>
                    <p>₹13.20L - ₹24.17L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: safariImg2 } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "safari", image: safariImg2 } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={curvet} alt="CURVE" className="suv-image" />
                    <h2>CURVE</h2>
                    <p>₹13.66L - ₹17.71L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: curvet } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "curve", image: curvet } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={altrozImg2} alt="ALTROZ" className="suv-image" />
                    <h2>ALTROZ</h2>
                    <p>₹9.99L - ₹13.99L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: altrozImg2 } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "altroz", image: altrozImg2 } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={tiagoImg2} alt="TIAGO" className="suv-image" />
                    <h2>TIAGO</h2>
                    <p>₹12.98L - ₹13.70L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: tiagoImg2 } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "tiago", image: tiagoImg2 } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={punchImg} alt="PUNCH" className="suv-image" />
                    <h2>PUNCH</h2>
                    <p>₹5.99L - ₹10.00L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: punchImg } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "punch", image: punchImg } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
                <article className="suv-card">
                    <img src={tigorImg} alt="TIGOR" className="suv-image" />
                    <h2>TIGOR</h2>
                    <p>₹6.29L - ₹10.30L</p>
                    <div className="btn-group">
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/bookings", { state: { image: tigorImg } })
                            }
                        >
                            → Book Now
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() =>
                                navigate("/testdrive", { state: { model: "tigor", image: tigorImg } })
                            }
                        >
                            → Test Drive
                        </button>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default SUVs;