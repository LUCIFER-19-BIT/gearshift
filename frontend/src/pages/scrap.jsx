import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS } from "../utils/apiConfig";
import "../styles/scrap.css";

const formatINR = (value) => {
	const amount = Number(value || 0);
	if (!Number.isFinite(amount)) {
		return "-";
	}
	return `₹${amount.toLocaleString("en-IN")}`;
};

const readFileAsBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result || "");
			const match = result.match(/^data:(.*?);base64,(.*)$/);
			if (!match) {
				reject(new Error("Invalid image format."));
				return;
			}
			resolve({
				mimeType: match[1],
				imageData: match[2],
				previewUrl: result,
			});
		};
		reader.onerror = () => reject(new Error("Unable to read image file."));
		reader.readAsDataURL(file);
	});

const Scrap = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const selectedModel = searchParams.get("model") || "Selected Car";
	const selectedVariant = searchParams.get("variant") || "-";
	const selectedPrice = Number(searchParams.get("price") || 0);

	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState(null);

	const hasValidPrice = useMemo(() => selectedPrice > 0, [selectedPrice]);

	const handleImageChange = (event) => {
		const file = event.target.files?.[0];
		setError("");
		setResult(null);

		if (!file) {
			setSelectedFile(null);
			setPreviewUrl("");
			return;
		}

		if (!file.type.startsWith("image/")) {
			setError("Please upload a valid car image.");
			setSelectedFile(null);
			setPreviewUrl("");
			return;
		}

		setSelectedFile(file);
		const localUrl = URL.createObjectURL(file);
		setPreviewUrl(localUrl);
	};

	const handleAnalyze = async () => {
		setError("");
		setResult(null);

		if (!hasValidPrice) {
			setError("Car price is missing. Please open this page from the booking summary.");
			return;
		}

		if (!selectedFile) {
			setError("Please upload a car image before checking discount.");
			return;
		}

		setLoading(true);
		try {
			const payload = await readFileAsBase64(selectedFile);

			const response = await fetch(API_ENDPOINTS.scrapAnalyze, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageData: payload.imageData,
					mimeType: payload.mimeType,
					selectedModel,
					selectedPrice,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Failed to analyze car condition.");
			}

			setResult(data);
		} catch (analysisError) {
			setError(analysisError.message || "Unable to process discount analysis right now.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="scrap-page">
			<div className="scrap-wrapper">
				<div className="scrap-card">
					<h1>Check Discount Scrap</h1>
					<p>
						Upload your car image. Gemini will detect model, model year and metal/body condition,
						then apply discount on your selected car price.
					</p>

					<div className="scrap-selected-car">
						<div>
							<span>Selected Model</span>
							<strong>{selectedModel}</strong>
						</div>
						<div>
							<span>Selected Variant</span>
							<strong>{selectedVariant}</strong>
						</div>
						<div>
							<span>Current Price</span>
							<strong>{formatINR(selectedPrice)}</strong>
						</div>
					</div>

					<label htmlFor="scrap-image" className="scrap-upload-label">
						Upload Car Image
					</label>
					<input
						id="scrap-image"
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="scrap-file-input"
					/>

					{previewUrl && (
						<div className="scrap-preview-box">
							<img src={previewUrl} alt="Uploaded car" className="scrap-preview-image" />
						</div>
					)}

					<div className="scrap-actions">
						<button type="button" className="scrap-btn primary" onClick={handleAnalyze} disabled={loading}>
							{loading ? "Analyzing..." : "Analyze & Apply Discount"}
						</button>
						<button type="button" className="scrap-btn ghost" onClick={() => navigate(-1)}>
							Back
						</button>
					</div>

					{error && <p className="scrap-error">{error}</p>}

					{result && (
						<div className="scrap-result-card">
							<h2>Discount Result</h2>
							<div className="scrap-result-grid">
								<div>
									<span>Detected Car Model</span>
									<strong>{result.detectedModel || "Unknown"}</strong>
								</div>
								<div>
									<span>Detected Model Year</span>
									<strong>{result.detectedYear || "Unknown"}</strong>
								</div>
								<div>
									<span>Condition</span>
									<strong className={result.condition === "good" ? "tag-good" : "tag-poor"}>
										{String(result.condition || "poor").toUpperCase()}
									</strong>
								</div>
								<div>
									<span>Discount Applied</span>
									<strong>{Number(result.discountPercent || 0).toFixed(2)}%</strong>
								</div>
								<div>
									<span>Original Price</span>
									<strong>{formatINR(result.originalPrice)}</strong>
								</div>
								<div>
									<span>Discount Amount</span>
									<strong>{formatINR(result.discountAmount)}</strong>
								</div>
							</div>
							<p className="scrap-condition-note">{result.conditionStatement}</p>
							<div className="scrap-final-price">
								<span>Price After Discount</span>
								<strong>{formatINR(result.finalPrice)}</strong>
							</div>
							<p className="scrap-fluctuation-note">
								Note: This price can fluctuate after real physical inspection and analysis of the car condition.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Scrap;
