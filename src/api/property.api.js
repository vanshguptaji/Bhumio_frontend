import api from "./axios";

// Get all properties
export const getProperties = () => api.get("/api/v1/properties");

// Get property by ID
export const getPropertyById = (id) => api.get(`/api/v1/properties/${id}`);

// Create new property
export const createProperty = (payload) =>
  api.post("/api/v1/properties", payload);

// Update property
export const updateProperty = (id, payload) =>
  api.put(`/api/v1/properties/${id}`, payload);

// Delete property
export const deleteProperty = (id) => api.delete(`/api/v1/properties/${id}`);