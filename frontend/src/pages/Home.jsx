import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import home2Img from "../assets/home2.avif";
import home3Img from "../assets/home3.avif";
import home4Img from "../assets/home4.avif";
import home5Img from "../assets/home5.avif";
// Feature videos
import techVideo from "../assets/tatatech.mp4";
import designVideo from "../assets/tatade.mp4";
import performanceVideo from "../assets/tataper.mp4";
import safetyVideo from "../assets/tatasaf.mp4";
// Optional images for the ebony hero (place in src/ or remove if not available)
import ebonyBg from "../assets/black.jpg";
import xuvBlack from "../assets/harri.png";
// New section image (you'll need to add this image to your project folder)
import unlimitPerfImg from "../assets/curve2.jpg";

const Home = () => {
    // top hero slider images
    const images = [home2Img, home3Img, home4Img, home5Img];
    const [current, setCurrent] = useState(0);
    const [previous, setPrevious] = useState(null);
    const [transitionDirection, setTransitionDirection] = useState("next");
    const [isAnimating, setIsAnimating] = useState(false);
    const animationTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (animationTimerRef.current) {
                clearTimeout(animationTimerRef.current);
            }
        };
    }, []);

    const changeSlide = (direction) => {
        if (isAnimating) return;

        setTransitionDirection(direction);
        setPrevious(current);

        setCurrent((p) => {
            if (direction === "next") {
                return (p + 1) % images.length;
            }
            return (p - 1 + images.length) % images.length;
        });

        setIsAnimating(true);

        animationTimerRef.current = setTimeout(() => {
            setPrevious(null);
            setIsAnimating(false);
        }, 550);
    };

    const handleNext = () => changeSlide("next");
    const handlePrev = () => changeSlide("prev");

    return (
        <div className="home-container">
            <main className="main-content">
                {}
                <div className="image-slider">
                    <button
                        className="arrow-btn left"
                        onClick={handlePrev}
                        aria-label="Previous slide"
                    >
                        &#8592;
                    </button>
                    {previous !== null ? (
                        <img
                            src={images[previous]}
                            alt="Previous slide"
                            className={`hero-img hero-img-leaving ${
                                transitionDirection === "next" ? "slide-out-left" : "slide-out-right"
                            }`}
                        />
                    ) : null}

                    <img
                        src={images[current]}
                        alt="Slide"
                        className={`hero-img ${
                            isAnimating
                                ? `hero-img-entering ${
                                      transitionDirection === "next" ? "slide-in-right" : "slide-in-left"
                                  }`
                                : "hero-img-static"
                        }`}
                    />
                    <button
                        className="arrow-btn right"
                        onClick={handleNext}
                        aria-label="Next slide"
                    >
                        &#8594;
                    </button>
                </div>

                {}
                <section className="features-section">
                    <h1>Shift Into The Future</h1>
                    <p className="features-desc">
                        We Provide Authentic SUVs that help you explore the impossible.
                        Experience the best in tech, design, safety and comfort in our range
                        of products made in India, for the world.
                    </p>

                    <div className="features-row">
                        <div className="feature-card">
                            <video
                                className="feature-img"
                                src={techVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <h2>Sci-fi Technology</h2>
                            <p>
                                With best-in-class automotive technology and Adrenox-powered
                                intelligence.
                            </p>
                        </div>

                        <div className="feature-card">
                            <video
                                className="feature-img"
                                src={designVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <h2>Unmissable Design</h2>
                            <p>
                                Stunning designs that command attention and set hearts racing.
                            </p>
                        </div>

                        <div className="feature-card">
                            <video
                                className="feature-img"
                                src={performanceVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <h2>Spirited Performance</h2>
                            <p>Powerful engines engineered to rule the road.</p>
                        </div>

                        <div className="feature-card">
                            <video
                                className="feature-img"
                                src={safetyVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <h2>Unmatched Safety</h2>
                            <p>Advanced safety systems to protect you and your loved ones.</p>
                        </div>
                    </div>
                </section>

                {/* Line 273 omitted */}
                <section className="stats-hero-section">
                    <div className="stats-row">
                        <div className="stat">
                            <div className="stat-number">941K+</div>
                            <div className="stat-label">Units sold in FY 25</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">2.6M+</div>
                            <div className="stat-label">Active Customers</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">10k+</div>
                            <div className="stat-label">Workforce</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">70+</div>
                            <div className="stat-label">Years of legacy</div>
                        </div>
                    </div>

                    <div
                        className="ebony-hero"
                        style={ebonyBg ? { backgroundImage: `url(${ebonyBg})` } : {}}
                    >
                        <div className="ebony-left">
                            <h2 className="ebony-title">TATA HARRIER 5TH EDITION</h2>
                            <p className="ebony-sub">OUTSHINES THE DARK</p>
                            <Link to="/suvs" className="ebony-cta">→ Book Now</Link>
                        </div>
                        <div className="ebony-right">
                            {xuvBlack ? (
                                <img
                                    src={xuvBlack}
                                    alt="TATA HARRIER 5TH EDITION"
                                    className="ebony-car"
                                />
                            ) : null}
                        </div>
                    </div>
                </section>

                {/* Line 315 omitted */}
                <section className="unlimit-section">
                    <div className="unlimit-container">
                        <div className="unlimit-image-container">
                            <img
                                src={unlimitPerfImg}
                                alt="XEV 9e electric vehicle"
                                className="unlimit-image"
                            />
                        </div>
                        <div className="unlimit-content">
                            <p className="unlimit-subtitle">TATA CURVE EV</p>
                            <h2 className="unlimit-title">
                                Unlimit
                                <br />
                                Performance
                            </h2>
                            <Link to="/curve" className="unlimit-cta">→ Know More</Link>
                        </div>
                    </div>
                </section>
                {/* Line 336 omitted */}
            </main>
        </div>
    );
};

export default Home;