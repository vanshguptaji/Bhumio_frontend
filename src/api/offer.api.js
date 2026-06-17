import api from "./axios";

export const submitOffer = (payload) =>
  api.post("/api/v1/offers", payload);

export const getOffers = () =>
  api.get("/api/v1/offers");

export const getOfferById = (id) =>
  api.get(`/api/v1/offers/${id}`);

export const getOffersByProperty = (propertyId) =>
  api.get(`/api/v1/offers/property/${propertyId}`);

export const updateOffer = (id, payload) =>
  api.put(`/api/v1/offers/${id}`, payload);

export const deleteOffer = (id) =>
  api.delete(`/api/v1/offers/${id}`);