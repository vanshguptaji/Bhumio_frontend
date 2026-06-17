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

