import api from "./axios";

export const createProperty = (payload) =>
  api.post("/api/v1/properties", payload);

export const getProperties = () =>
  api.get("/api/v1/properties");

export const getPropertyById = (id) =>
  api.get(`/api/v1/properties/${id}`);

export const updateProperty = (id, payload) =>
  api.put(`/api/v1/properties/${id}`, payload);

export const deleteProperty = (id) =>
  api.delete(`/api/v1/properties/${id}`);