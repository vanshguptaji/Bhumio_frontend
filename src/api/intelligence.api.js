import api from "./axios";

export const getOfferScore = (offerId) =>
  api.get(
    `/api/v1/intelligence/offer/${offerId}/score`
  );