import api from "./axios";

export const createLoan = (payload) =>
  api.post("/api/v1/loans", payload);

export const getLoans = () =>
  api.get("/api/v1/loans");

export const getLoanById = (id) =>
  api.get(`/api/v1/loans/${id}`);

export const getLoansByOffer = (offerId) =>
  api.get(`/api/v1/loans/offer/${offerId}`);

export const updateLoan = (id, payload) =>
  api.put(`/api/v1/loans/${id}`, payload);

export const deleteLoan = (id) =>
  api.delete(`/api/v1/loans/${id}`);