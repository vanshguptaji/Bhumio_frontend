import api from "./axios";
import { cleanPayload } from "../utils/apiHelpers";

// Create disclosure
export const createDisclosure = (payload) =>
  api.post("/api/v1/disclosures", cleanPayload(payload));

// Get all disclosures
export const getDisclosures = () => api.get("/api/v1/disclosures");

// Get disclosure by ID
export const getDisclosureById = (id) =>
  api.get(`/api/v1/disclosures/${id}`);

// Get disclosure by property ID
export const getDisclosureByPropertyId = (propertyId) =>
  api.get(`/api/v1/disclosures/property/${propertyId}`);

// Update disclosure
export const updateDisclosure = (id, payload) =>
  api.put(`/api/v1/disclosures/${id}`, cleanPayload(payload));

// Delete disclosure
export const deleteDisclosure = (id) => api.delete(`/api/v1/disclosures/${id}`);