import api from "./axios";
import { cleanPayload } from "../utils/apiHelpers";

export const createLoan = (payload) =>
  api.post("/api/v1/loans", cleanPayload(payload));

export const getLoans = () => api.get("/api/v1/loans");

export const getLoanById = (id) => api.get(`/api/v1/loans/${id}`);

export const getLoansByOffer = (offerId) =>
  api.get(`/api/v1/loans/offer/${offerId}`);

export const updateLoan = (id, payload) =>
  api.put(`/api/v1/loans/${id}`, cleanPayload(payload));

export const deleteLoan = (id) => api.delete(`/api/v1/loans/${id}`);