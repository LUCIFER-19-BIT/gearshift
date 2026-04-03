import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8001/api/carcircle";
const MAX_IMAGE_COUNT = 10;
const MAX_SINGLE_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 12 * 1024 * 1024;

const INITIAL_FORM_DATA = {
  sellerName: "",
  contactNumber: "",
  carName: "",
  kilometers: "",
  price: "",
  city: "",
  description: "",
  fuelType: "",
  registrationYear: "",
  manufacturingYear: "",
  owners: "",
  transmission: "",
  color: "",
  availableAt: "",
  insurance: "",
  registrationType: "",
  state: "",
};

const SEEDED_STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Delhi", "Uttar Pradesh", "Rajasthan", "Punjab", "Telangana"];

const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const responseText = await response.text();

  if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
    throw new Error("API returned HTML instead of JSON. Make sure backend is running on http://localhost:8001.");
  }

  if (!responseText.trim()) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error("Received an invalid response from server.");
  }
};

const getApiErrorMessage = (body, fallback) => {
  if (body && typeof body === "object" && "message" in body && body.message) {
    return body.message;
  }

  if (typeof body === "string" && body.trim()) {
    return body;
  }

  return fallback;
};

const validateSelectedImages = (files) => {
  if (files.length > MAX_IMAGE_COUNT) {
    return "You can upload a maximum of 10 photos.";
  }

  if (files.some((file) => file.size > MAX_SINGLE_IMAGE_BYTES)) {
    return "Each photo must be 4 MB or smaller.";
  }

  const totalImageSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalImageSize > MAX_TOTAL_IMAGE_BYTES) {
    return "Total photo size is too large. Upload smaller images or fewer photos.";
  }

  return null;
};

const createOverview = ({
  price,
  kilometers,
  fuelType,
  registrationYear,
  manufacturingYear,
  owners,
  transmission,
  color,
  availableAt,
  insurance,
  registrationType,
  state,
}) => ({
  price,
  kilometers,
  fuelType,
  registrationYear,
  manufacturingYear,
  owners,
  transmission,
  color,
  availableAt,
  insurance,
  registrationType,
  state,
});

const CarCircle = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [imageFiles, setImageFiles] = useState([]);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [filters, setFilters] = useState({
    budget: 2000000,
    modelYear: "",
    maxKm: 200000,
    state: "",
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser?.id || currentUser?._id || null;

  useEffect(() => {
    const fetchListings = async () => {
      if (!token) {
        setListings([]);
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response = await fetch(API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorBody = await parseApiResponse(response);
          throw new Error(getApiErrorMessage(errorBody, "Failed to fetch listings"));
        }

        const data = await parseApiResponse(response);
        setListings(data);
      } catch (error) {
        console.error(error);
        alert("Unable to load your saved cars right now.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchListings();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    const imageValidationError = validateSelectedImages(selectedFiles);

    if (imageValidationError) {
      alert(imageValidationError);
      event.target.value = "";
      setImageFiles([]);
      return;
    }

    setImageFiles(selectedFiles);
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setImageFiles([]);
    setEditingListingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please login first to add or update cars.");
      return;
    }

    const existingListing = editingListingId
      ? listings.find((listing) => listing._id === editingListingId)
      : null;

    if (!existingListing && imageFiles.length === 0) {
      alert("Please upload at least 1 car photo.");
      return;
    }

    const imageValidationError = validateSelectedImages(imageFiles);
    if (imageValidationError) {
      alert(imageValidationError);
      return;
    }

    try {
      setIsSaving(true);

      const overview = createOverview({
        price: `Rs. ${Number(formData.price).toLocaleString()}`,
        kilometers: `${Number(formData.kilometers).toLocaleString()} km`,
        fuelType: formData.fuelType,
        registrationYear: formData.registrationYear,
        manufacturingYear: formData.manufacturingYear,
        owners: formData.owners,
        transmission: formData.transmission,
        color: formData.color,
        availableAt: formData.availableAt,
        insurance: formData.insurance,
        registrationType: formData.registrationType,
        state: formData.state,
      });

      const payload = new FormData();
      payload.append("sellerName", formData.sellerName);
      payload.append("contactNumber", formData.contactNumber);
      payload.append("carName", formData.carName);
      payload.append("kilometers", String(Number(formData.kilometers)));
      payload.append("price", String(Number(formData.price)));
      payload.append("city", formData.city);
      payload.append("description", formData.description);
      payload.append("overview", JSON.stringify(overview));

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          payload.append("images", file);
        });
      } else if (existingListing) {
        payload.append("existingImageUrls", JSON.stringify(existingListing.imageUrls || []));
      }

      const response = await fetch(
        existingListing ? `${API_BASE_URL}/${existingListing._id}` : API_BASE_URL,
        {
          method: existingListing ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const result = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result, "Unable to save listing"));
      }

      if (existingListing) {
        setListings((previous) =>
          previous.map((listing) =>
            listing._id === existingListing._id ? result : listing
          )
        );
        setSelectedListing(result);
      } else {
        setListings((previous) => [result, ...previous]);
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to save listing");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDetails = () => {
    if (!selectedListing || selectedListing.userId !== currentUserId) {
      return;
    }

    setFormData({
      sellerName: selectedListing.sellerName || "",
      contactNumber: selectedListing.contactNumber || "",
      carName: selectedListing.carName || "",
      kilometers: String(selectedListing.kilometers || ""),
      price: String(selectedListing.price || ""),
      city: selectedListing.city || "",
      description: selectedListing.description || "",
      fuelType: selectedListing.overview?.fuelType || "",
      registrationYear: selectedListing.overview?.registrationYear || "",
      manufacturingYear: selectedListing.overview?.manufacturingYear || "",
      owners: selectedListing.overview?.owners || "",
      transmission: selectedListing.overview?.transmission || "",
      color: selectedListing.overview?.color || "",
      availableAt: selectedListing.overview?.availableAt || "",
      insurance: selectedListing.overview?.insurance || "",
      registrationType: selectedListing.overview?.registrationType || "",
      state: selectedListing.overview?.state || "",
    });
    setImageFiles([]);
    setEditingListingId(selectedListing._id);
    setShowForm(true);
    closeExploreModal();
  };

  const handleDeleteListing = async () => {
    if (!token || !selectedListing?._id || selectedListing.userId !== currentUserId) {
      return;
    }

    const shouldDelete = window.confirm("Are you sure you want to delete this car listing?");

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`${API_BASE_URL}/${selectedListing._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result, "Unable to delete listing"));
      }

      setListings((previous) =>
        previous.filter((listing) => listing._id !== selectedListing._id)
      );

      if (editingListingId === selectedListing._id) {
        resetForm();
        setShowForm(false);
      }

      closeExploreModal();
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  const openExploreModal = (listing) => {
    setSelectedListing(listing);
    setCurrentPhotoIndex(0);
  };

  const closeExploreModal = () => {
    setSelectedListing(null);
    setCurrentPhotoIndex(0);
    setShowContactPopup(false);
  };

  const handleContactOwner = () => {
    setShowContactPopup(true);
  };

  const handlePrevPhoto = () => {
    if (!selectedListing) {
      return;
    }

    setCurrentPhotoIndex(
      (previous) =>
        (previous - 1 + selectedListing.imageUrls.length) %
        selectedListing.imageUrls.length
    );
  };

  const handleNextPhoto = () => {
    if (!selectedListing) {
      return;
    }

    setCurrentPhotoIndex(
      (previous) => (previous + 1) % selectedListing.imageUrls.length
    };

  const getListingState = (listing) => listing.overview?.state || "Not Available";

  const getListingYear = (listing) => {
    const source = listing.overview?.manufacturingYear || listing.overview?.registrationYear || "";
    const yearMatch = String(source).match(/\d{4}/);
    return yearMatch ? Number(yearMatch[0]) : null;
  };

  const stateOptions = useMemo(() => {
    const listingStates = new Set(listings.map((listing) => listing.overview?.state).filter(Boolean));
    return SEEDED_STATES.filter((stateItem) => listingStates.has(stateItem));
  }, [listings]);

  const yearOptions = useMemo(() => {
    const uniqueYears = new Set(listings.map((listing) => getListingYear(listing)).filter(Boolean));
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const listingState = getListingState(listing);
      const listingYear = getListingYear(listing);

      const budgetMatch = !filters.budget || Number(listing.price) <= Number(filters.budget);
      const yearMatch = !filters.modelYear || Number(filters.modelYear) === listingYear;
      const kmMatch = !filters.maxKm || Number(listing.kilometers) <= Number(filters.maxKm);
      const stateMatch = !filters.state || filters.state === listingState;

      return budgetMatch && yearMatch && kmMatch && stateMatch;
    });
  }, [listings, filters]);

  const overviewRows = selectedListing
    ? [
      { label: "Price", value: selectedListing.overview?.price || "Not Available" },
      { label: "Kilometer", value: selectedListing.overview?.kilometers || "Not Available" },
      { label: "Fuel type", value: selectedListing.overview?.fuelType || "Not Available" },
      { label: "Registration year", value: selectedListing.overview?.registrationYear || "Not Available" },
      { label: "Manufacturing Year", value: selectedListing.overview?.manufacturingYear || "Not Available" },
      { label: "No. of owners", value: selectedListing.overview?.owners || "Not Available" },
      { label: "Transmission", value: selectedListing.overview?.transmission || "Not Available" },
      { label: "Color", value: selectedListing.overview?.color || "Not Available" },
      { label: "Car Available at", value: selectedListing.overview?.availableAt || "Not Available" },
      { label: "Insurance", value: selectedListing.overview?.insurance || "Not Available" },
      { label: "Registration Type", value: selectedListing.overview?.registrationType || "Not Available" },
      { label: "State", value: selectedListing.overview?.state || "Not Available" },
    ]
    : [];

  return (
    <section className="carcircle-container">
      <header className="section-header">
        <h1>Explore Second-Hand Cars</h1>
        <p>Find quality pre-owned cars listed by verified sellers in your city.</p>
      </header>

      {!token ? (
        <div className="carcircle-empty">
          <p>Please login to view or manage second-hand cars.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      ) : null}

      {showForm ? (
        <form className="carcircle-form" onSubmit={handleSubmit}>
          <h3>{editingListingId ? "Update Car Details" : "Add Car Details"}</h3>
          <div className="carcircle-grid">
            <input
              name="sellerName"
              placeholder="Seller Name"
              value={formData.sellerName}
              onChange={handleChange}
              required
            />
            <input
              name="contactNumber"
              placeholder="Owner Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
            <input
              name="carName"
              placeholder="Car Name (e.g. Nexon)"
              value={formData.carName}
              onChange={handleChange}
              required
            />
            <input
              name="kilometers"
              placeholder="Kilometers Driven"
              type="number"
              value={formData.kilometers}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              placeholder="Price (₹)"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              name="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required={!editingListingId}
            />
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
            <input
              name="registrationYear"
              placeholder="Registration Year (e.g. Dec 2021)"
              value={formData.registrationYear}
              onChange={handleChange}
              required
            />
            <input
              name="manufacturingYear"
              placeholder="Manufacturing Year (e.g. Jun 2021)"
              value={formData.manufacturingYear}
              onChange={handleChange}
              required
            />
            <input
              name="owners"
              placeholder="No. of Owners"
              value={formData.owners}
              onChange={handleChange}
              required
            />
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
            <input
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              required
            />
            <input
              name="availableAt"
              placeholder="Car Available At"
              value={formData.availableAt}
              onChange={handleChange}
              required
            />
            <select
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              required
            >
              <option value="">Select Insurance</option>
              <option value="First Party">First Party</option>
              <option value="Third Party">Third Party</option>
            </select>
            <input
              name="registrationType"
              placeholder="Registration Type"
              value={formData.registrationType}
              onChange={handleChange}
              required
            />
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {SEEDED_STATES.map((stateItem) => (
                <option key={stateItem} value={stateItem}>{stateItem}</option>
              ))}
            </select>
          </div>
          <p>Upload up to 10 photos (max 4 MB each, 12 MB total). While updating, uploading new photos is optional.</p>
          <textarea
            name="description"
            placeholder="Car description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : editingListingId ? "Update Listing" : "Add Listing"}
          </button>
        </form>
      ) : null}

      <section className="carcircle-filters">
        <h3>Filter Cars</h3>
        <div className="carcircle-filter-grid">
          <div>
            <label htmlFor="budget">Budget (Max): ₹{Number(filters.budget).toLocaleString("en-IN")}</label>
            <input
              id="budget"
              name="budget"
              type="range"
              min="100000"
              max="2000000"
              step="10000"
              value={filters.budget}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="modelYear">Model Year</label>
            <select
              id="modelYear"
              name="modelYear"
              value={filters.modelYear}
              onChange={handleFilterChange}
            >
              <option value="">All Years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="maxKm">KM Driven (Max): {Number(filters.maxKm).toLocaleString("en-IN")} km</label>
            <input
              id="maxKm"
              name="maxKm"
              type="range"
              min="5000"
              max="200000"
              step="1000"
              value={filters.maxKm}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
            >
              <option value="">All States</option>
              {stateOptions.map((stateItem) => (
                <option key={stateItem} value={stateItem}>{stateItem}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="carcircle-listings">
        {isFetching ? (
          <p className="carcircle-empty">Loading listings...</p>
        ) : filteredListings.length === 0 ? (
          <p className="carcircle-empty">No cars listed yet. Add the first listing.</p>
        ) : (
          filteredListings.map((listing) => (
            <article className="carcircle-card" key={listing._id}>
              <img
                src={listing.imageUrls?.[0]}
                alt={listing.carName}
                className="carcircle-image"
                onError={(event) => {
                  event.currentTarget.src = "https://placehold.co/600x350?text=Second+Hand+Car";
                }}
              />
              <div className="carcircle-card-content">
                <h2>{listing.carName}</h2>
                <p className="carcircle-price">₹{Number(listing.price).toLocaleString()}</p>
                <p>{Number(listing.kilometers).toLocaleString()} km • {listing.city}</p>
                <p>Year: {getListingYear(listing) || "N/A"} • State: {getListingState(listing)}</p>
                <p>{listing.description}</p>
                <p>{listing.imageUrls?.length || 0} photos</p>
                <button className="btn-outline" onClick={() => openExploreModal(listing)}>
                  Explore
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {selectedListing ? (
        <div className="carcircle-modal-overlay" onClick={closeExploreModal}>
          <section className="carcircle-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="carcircle-modal-close"
              onClick={closeExploreModal}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="carcircle-modal-main-image-wrap">
              <button type="button" className="carcircle-modal-nav" onClick={handlePrevPhoto}>
                ‹
              </button>
              <img
                src={selectedListing.imageUrls[currentPhotoIndex]}
                alt={`${selectedListing.carName} ${currentPhotoIndex + 1}`}
                className="carcircle-modal-main-image"
              />
              <button type="button" className="carcircle-modal-nav" onClick={handleNextPhoto}>
                ›
              </button>
            </div>

            <div className="carcircle-modal-content">
              <div className="carcircle-details-header">
                <h2>{selectedListing.carName}</h2>
                <p className="carcircle-price">₹{Number(selectedListing.price).toLocaleString()}</p>
              </div>
              <p>{Number(selectedListing.kilometers).toLocaleString()} km • {selectedListing.city}</p>
              <p>{selectedListing.description}</p>
              <p>Seller: {selectedListing.sellerName}</p>

              <section className="carcircle-overview-section">
                <h3>Car Overview</h3>
                <div className="carcircle-overview-grid">
                  {overviewRows.map((item) => (
                    <div key={item.label} className="carcircle-overview-cell">
                      <p className="carcircle-overview-label">{item.label}</p>
                      <p className="carcircle-overview-value">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <button
                type="button"
                className="btn-outline"
                onClick={handleContactOwner}
              >
                Contact Owner
              </button>
              {selectedListing.userId === currentUserId ? (
                <>
                  <button type="button" className="btn-primary" onClick={handleEditDetails}>
                    Edit Details
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={handleDeleteListing}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Listing"}
                  </button>
                </>
              ) : null}
            </div>

            {showContactPopup ? (
              <div
                className="carcircle-contact-popup-overlay"
                onClick={() => setShowContactPopup(false)}
              >
                <div
                  className="carcircle-contact-popup"
                  onClick={(event) => event.stopPropagation()}
                >
                  <h4>Owner Contact</h4>
                  <p>{selectedListing.contactNumber || "Not available"}</p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setShowContactPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      <button
        type="button"
        className="carcircle-add-floating"
        onClick={() => {
          if (!showForm) {
            resetForm();
          }
          setShowForm((previous) => !previous);
        }}
      >
        <span className="carcircle-add-icon">+</span>
        <span>{showForm ? "Close" : "Add"}</span>
      </button>
    </section>
  );
};

export default CarCircle;
