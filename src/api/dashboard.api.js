import api from "./axios";

export const getPropertyIntelligenceDashboard = (propertyId) =>
  api.get(`/api/v1/dashboard/property/${propertyId}`);