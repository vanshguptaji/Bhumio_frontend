import api from "./axios";

export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    "/api/v1/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const uploadDisclosurePdf = async (
  propertyId,
  file
) => {
  const formData = new FormData();

  formData.append("propertyId", propertyId);
  formData.append("file", file);

  return api.post(
    "/api/v1/upload/disclosure",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const uploadContractPdf = async (
  offerId,
  file
) => {
  const formData = new FormData();

  formData.append("offerId", offerId);
  formData.append("file", file);

  return api.post(
    "/api/v1/upload/contract",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const uploadLoanDocument = async (
  offerId,
  file
) => {
  const formData = new FormData();

  formData.append("offerId", offerId);
  formData.append("file", file);

  return api.post(
    "/api/v1/upload/loan",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};