import api from "./axios";

export const createDisclosure = (payload) =>
  api.post("/api/v1/disclosures", payload);

export const getDisclosures = () =>
  api.get("/api/v1/disclosures");

export const getDisclosureById = (id) =>
  api.get(`/api/v1/disclosures/${id}`);

export const getDisclosureByPropertyId = (propertyId) =>
  api.get(`/api/v1/disclosures/property/${propertyId}`);

export const updateDisclosure = (id, payload) =>
  api.put(`/api/v1/disclosures/${id}`, payload);

export const deleteDisclosure = (id) =>
  api.delete(`/api/v1/disclosures/${id}`);