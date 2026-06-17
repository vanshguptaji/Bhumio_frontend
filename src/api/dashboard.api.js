import api from "./axios";

export const getSellerDashboard = (propertyId) =>
  api.get(`/api/v1/dashboard/${propertyId}`);

export const getOfferRankings = (propertyId) =>
  api.get(`/api/v1/dashboard/${propertyId}/rankings`);

export const getOfferComparisons = (propertyId) =>
  api.get(`/api/v1/dashboard/${propertyId}/comparison`);