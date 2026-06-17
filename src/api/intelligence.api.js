import api from "./axios";

export const analyzeDisclosure = (disclosureId) =>
  api.post(
    `/api/v1/intelligence/disclosure/${disclosureId}`
  );

export const analyzeOffer = (offerId) =>
  api.post(
    `/api/v1/intelligence/offer/${offerId}`
  );

export const generatePropertySummary = (propertyId) =>
  api.get(
    `/api/v1/intelligence/property/${propertyId}`
  );