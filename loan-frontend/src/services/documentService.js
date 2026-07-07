import api from "../api";

export const uploadDocument = async (documentType, file) => {
  const formData = new FormData();
  formData.append("documentType", documentType);
  formData.append("file", file);
  const response = await api.post("/api/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyDocuments = async () => {
  const response = await api.get("/api/documents/my");
  return response.data;
};

export const getAllDocuments = async () => {
  const response = await api.get("/api/documents");
  return response.data;
};

export const downloadDocument = async (documentId) => {
  const response = await api.get(`/api/documents/download/${documentId}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });

  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export const getDocumentsByApplication = async (applicationId) => {
  const response = await api.get(
    `/api/documents/application/${applicationId}`
  );
  return response.data;
};