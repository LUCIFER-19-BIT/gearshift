import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Recommendation.css";

// Import car images
import harrierImg from "../assets/harriyellow.png";
import nexonImg from "../assets/nexonnew.png";
import safariImg from "../assets/safarinew.png";
import curveImg from "../assets/curvet.png";
import altrozImg from "../assets/altrozenew.png";
import tiagoImg from "../assets/tiagonew.png";
import punchImg from "../assets/punch.png";
import artcurveImg from "../assets/artcurve.jpg";
import harrierevImg from "../assets/harrierev2.jpg";

const Recommendation = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // All available Tata cars with detailed specs
    const allCars = [
        {
            name: "HARRIER",
            image: harrierImg,
            price: "₹12.25L - ₹22.06L",
            type: "suv",
            fuelType: "diesel",
            electric: false,
            seating: 7,
            budget: "premium",
            usage: ["family", "luxury", "highway"],
            features: ["spacious", "safety", "comfort", "premium"],
            route: "/bookings"
        },
        {
            name: "NEXON",
            image: nexonImg,
            price: "₹7.28L - ₹17.40L",
            type: "compact-suv",
            fuelType: "petrol-diesel",
            electric: false,
            seating: 5,
            budget: "medium",
            usage: ["city", "family", "daily"],
            features: ["safety", "stylish", "efficient"],
            route: "/bookings"
        },
        {
            name: "SAFARI",
            image: safariImg,
            price: "₹13.20L - ₹24.17L",
            type: "suv",
            fuelType: "diesel",
            electric: false,
            seating: 7,
            budget: "premium",
            usage: ["family", "luxury", "highway", "adventure"],
            features: ["spacious", "safety", "comfort", "premium"],
            route: "/bookings"
        },
        {
            name: "CURVV",
            image: curveImg,
            price: "₹13.66L - ₹17.71L",
            type: "suv-coupe",
            fuelType: "petrol-diesel",
            electric: false,
            seating: 5,
            budget: "premium",
            usage: ["city", "style", "performance"],
            features: ["stylish", "modern", "tech"],
            route: "/bookings"
        },
        {
            name: "ALTROZ",
            image: altrozImg,
            price: "₹9.99L - ₹13.99L",
            type: "hatchback",
            fuelType: "petrol-diesel",
            electric: false,
            seating: 5,
            budget: "medium",
            usage: ["city", "daily", "efficient"],
            features: ["efficient", "stylish", "safety"],
            route: "/bookings"
        },
        {
            name: "TIAGO",
            image: tiagoImg,
            price: "₹12.98L - ₹13.70L",
            type: "hatchback",
            fuelType: "petrol",
            electric: false,
            seating: 5,
            budget: "budget",
            usage: ["city", "daily", "first-car"],
            features: ["efficient", "affordable", "compact"],
            route: "/bookings"
        },
        {
            name: "PUNCH",
            image: punchImg,
            price: "₹5.99L - ₹10.00L",
            type: "micro-suv",
            fuelType: "petrol",
            electric: false,
            seating: 5,
            budget: "budget",
            usage: ["city", "daily", "adventure"],
            features: ["compact", "stylish", "rugged"],
            route: "/bookings"
        },

        {
            name: "CURVV.EV",
            image: artcurveImg,
            price: "₹17.49L - ₹21.99L",
            type: "suv-coupe",
            fuelType: "electric",
            electric: true,
            seating: 5,
            budget: "premium",
            usage: ["city", "eco", "tech", "performance"],
            features: ["electric", "modern", "tech", "eco-friendly"],
            route: "/curve"
        },
        {
            name: "HARRIER.EV",
            image: harrierevImg,
            price: "₹22.49L - ₹26.99L",
            type: "suv",
            fuelType: "electric",
            electric: true,
            seating: 7,
            budget: "premium",
            usage: ["family", "eco", "luxury", "tech"],
            features: ["electric", "spacious", "premium", "eco-friendly"],
            route: "/harrier"
        }
    ];

    // Questions for the recommendation quiz
    const questions = [
        {
            id: "budget",
            question: "What's your budget range?",
            type: "single",
            options: [
                { value: "budget", label: "₹5L - ₹10L (Budget Friendly)", icon: "💰" },
                { value: "medium", label: "₹10L - ₹15L (Mid Range)", icon: "💵" },
                { value: "premium", label: "₹15L+ (Premium)", icon: "💎" }
            ]
        },
        {
            id: "type",
            question: "What type of vehicle do you prefer?",
            type: "single",
            options: [
                { value: "hatchback", label: "Hatchback", icon: "🚗" },
                { value: "compact-suv", label: "Compact SUV", icon: "�" },
                { value: "suv", label: "SUV", icon: "�" },
                { value: "micro-suv", label: "Micro SUV", icon: "🚙" },
                { value: "suv-coupe", label: "SUV Coupe", icon: "🏎️" }
            ]
        },
        {
            id: "fuelType",
            question: "What fuel type are you looking for?",
            type: "single",
            options: [
                { value: "electric", label: "Electric (Eco-Friendly)", icon: "⚡" },
                { value: "petrol", label: "Petrol", icon: "⛽" },
                { value: "diesel", label: "Diesel", icon: "�" }
            ]
        },
        {
            id: "seating",
            question: "How many seats do you need?",
            type: "single",
            options: [
                { value: 5, label: "5 Seater", icon: "👨‍👩‍👧" },
                { value: 7, label: "7 Seater", icon: "👨‍👩‍👧‍👦" },
                { value: "any", label: "Doesn't Matter", icon: "🤷" }
            ]
        },
        {
            id: "usage",
            question: "What will be your primary use?",
            type: "multiple",
            options: [
                { value: "city", label: "City Driving", icon: "🏙️" },
                { value: "highway", label: "Highway Cruising", icon: "🛣️" },
                { value: "family", label: "Family Trips", icon: "👨‍👩‍👧‍👦" },
                { value: "daily", label: "Daily Commute", icon: "🚗" },
                { value: "adventure", label: "Adventure/Off-road", icon: "🏔️" },
                { value: "eco", label: "Eco-Conscious", icon: "🌱" }
            ]
        },
        {
            id: "features",
            question: "What features are most important to you?",
            type: "multiple",
            options: [
                { value: "safety", label: "Safety Features", icon: "🛡️" },
                { value: "tech", label: "Technology & Infotainment", icon: "📱" },
                { value: "comfort", label: "Comfort & Space", icon: "🛋️" },
                { value: "efficient", label: "Fuel Efficiency", icon: "⛽" },
                { value: "stylish", label: "Stylish Design", icon: "✨" },
                { value: "premium", label: "Premium Experience", icon: "👑" },
                { value: "electric", label: "Electric/Eco-Friendly", icon: "⚡" }
            ]
        }
    ];

    const handleAnswer = (questionId, value) => {
        const question = questions[currentStep];

        if (question.type === "multiple") {
            const currentAnswers = answers[questionId] || [];
            const newAnswers = currentAnswers.includes(value)
                ? currentAnswers.filter(v => v !== value)
                : [...currentAnswers, value];

            setAnswers({ ...answers, [questionId]: newAnswers });
        } else {
            setAnswers({ ...answers, [questionId]: value });
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateRecommendations();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const calculateRecommendations = () => {
        let scoredCars = allCars.map(car => {
            let score = 0;
            let matchDetails = [];

            // Budget matching (high priority)
            if (answers.budget === car.budget) {
                score += 30;
                matchDetails.push("Perfect budget match");
            }

            // Type matching (high priority)
            if (answers.type === car.type) {
                score += 25;
                matchDetails.push("Exact vehicle type");
            }

            // Fuel type matching (high priority)
            if (answers.fuelType === "electric" && car.electric) {
                score += 30;
                matchDetails.push("Electric vehicle");
            } else if (answers.fuelType === "petrol" && (car.fuelType === "petrol" || car.fuelType === "petrol-diesel")) {
                score += car.fuelType === "petrol" ? 30 : 20;
                matchDetails.push("Petrol available");
            } else if (answers.fuelType === "diesel" && (car.fuelType === "diesel" || car.fuelType === "petrol-diesel")) {
                score += car.fuelType === "diesel" ? 30 : 20;
                matchDetails.push("Diesel available");
            }

            // Seating matching
            if (answers.seating === "any" || answers.seating === car.seating) {
                score += 15;
                if (answers.seating !== "any") {
                    matchDetails.push(`${car.seating} seater`);
                }
            }

            // Usage matching (medium priority)
            if (answers.usage && Array.isArray(answers.usage)) {
                const usageMatches = answers.usage.filter(u => car.usage.includes(u));
                score += usageMatches.length * 5;
                if (usageMatches.length > 0) {
                    matchDetails.push(`${usageMatches.length} usage match${usageMatches.length > 1 ? 'es' : ''}`);
                }
            }

            // Features matching (medium priority)
            if (answers.features && Array.isArray(answers.features)) {
                const featureMatches = answers.features.filter(f => car.features.includes(f));
                score += featureMatches.length * 5;
                if (featureMatches.length > 0) {
                    matchDetails.push(`${featureMatches.length} feature match${featureMatches.length > 1 ? 'es' : ''}`);
                }
            }

            return { ...car, score, matchDetails };
        });

        // Sort by score and get top 3
        scoredCars.sort((a, b) => b.score - a.score);
        const topRecommendations = scoredCars.slice(0, 3);

        setRecommendations(topRecommendations);
        setShowResults(true);
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setRecommendations([]);
        setShowResults(false);
    };

    const getMatchPercentage = (score) => {
        const maxScore = 150; // Approximate maximum possible score
        return Math.min(Math.round((score / maxScore) * 100), 100);
    };

    if (showResults) {
        return (
            <div className="recommendation-container">
                <div className="results-header">
                    <h1>🎯 Your Perfect Match</h1>
                    <p>Based on your preferences, here are our top recommendations:</p>
                </div>

                <div className="results-container">
                    {recommendations.map((car, index) => (
                        <div key={car.name} className={`result-card ${index === 0 ? 'best-match' : ''}`}>
                            {index === 0 && (
                                <div className="best-match-badge">
                                    👑 Best Match
                                </div>
                            )}
                            <div className="match-percentage">
                                {getMatchPercentage(car.score)}% Match
                            </div>
                            <img src={car.image} alt={car.name} className="result-car-image" />
                            <h2>{car.name}</h2>
                            <p className="result-price">{car.price}</p>

                            <div className="match-details">
                                <h3>Why this car?</h3>
                                <ul>
                                    {car.matchDetails.map((detail, idx) => (
                                        <li key={idx}>✓ {detail}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="result-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate(car.route, { state: { image: car.image } })}
                                >
                                    Book Now
                                </button>
                                <button
                                    className="btn-outline"
                                    onClick={() => navigate('/testdrive')}
                                >
                                    Test Drive
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="results-footer">
                    <button className="btn-secondary" onClick={resetQuiz}>
                        ← Start Over
                    </button>
                    <button className="btn-outline" onClick={() => navigate('/suvs')}>
                        View All Cars →
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    const isAnswered = currentQuestion.type === "multiple"
        ? currentAnswer && currentAnswer.length > 0
        : currentAnswer !== undefined;

    return (
        <div className="recommendation-container">
            <div className="quiz-header">
                <h1>Find Your Perfect Tata Car</h1>
                <p>Answer a few questions to get personalized recommendations</p>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <span className="progress-text">
                    Question {currentStep + 1} of {questions.length}
                </span>
            </div>

            <div className="question-container">
                <h2 className="question-text">{currentQuestion.question}</h2>
                {currentQuestion.type === "multiple" && (
                    <p className="question-hint">Select all that apply</p>
                )}

                <div className="options-grid">
                    {currentQuestion.options.map((option) => {
                        const isSelected = currentQuestion.type === "multiple"
                            ? currentAnswer && currentAnswer.includes(option.value)
                            : currentAnswer === option.value;

                        return (
                            <button
                                key={option.value}
                                className={`option-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                            >
                                <span className="option-icon">{option.icon}</span>
                                <span className="option-label">{option.label}</span>
                                {isSelected && <span className="checkmark">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="navigation-buttons">
                <button
                    className="btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    ← Previous
                </button>
                <button
                    className="btn-primary"
                    onClick={handleNext}
                    disabled={!isAnswered}
                >
                    {currentStep === questions.length - 1 ? 'Get Recommendations 🎯' : 'Next →'}
                </button>
            </div>
        </div>
    );
};

export default Recommendation;
