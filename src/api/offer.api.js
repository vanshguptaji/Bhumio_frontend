import api from "./axios";
import { cleanPayload } from "../utils/apiHelpers";

// Submit/Create offer
export const submitOffer = (payload) => {
  // Basic client-side validation to catch common 400 causes early
  const required = ["buyerName", "buyerEmail", "offerPrice"];
  const missing = required.filter(
    (k) => typeof payload[k] === "undefined" || payload[k] === null || payload[k] === ""
  );
  if (missing.length > 0) {
    return Promise.reject(new Error(`Missing required offer fields: ${missing.join(", ")}`));
  }

  const cleaned = cleanPayload(payload);
  return api.post("/api/v1/offers", cleaned);
};

// Get all offers
export const getOffers = () => api.get("/api/v1/offers");

// Get offer by ID
export const getOfferById = (id) => api.get(`/api/v1/offers/${id}`);

// Get offers by property
export const getOffersByProperty = (propertyId) =>
  api.get(`/api/v1/offers/property/${propertyId}`);

// Update offer
export const updateOffer = (id, payload) =>
  api.put(`/api/v1/offers/${id}`, cleanPayload(payload));

// Delete offer
export const deleteOffer = (id) => api.delete(`/api/v1/offers/${id}`);