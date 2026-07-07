import api from "../api";

export const getAllApplications = async () => {
    const response = await api.get("/api/loan-applications");
    return response.data;
};

export const getApplicationById = async (id) => {
    const response = await api.get(`/api/loan-applications/${id}`);
    return response.data;
};

export const approveApplication = async (id) => {
    const response = await api.put(`/api/loan-applications/${id}/approve`);
    return response.data;
};

export const rejectApplication = async (id) => {
    const response = await api.put(`/api/loan-applications/${id}/reject`);
    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get("/api/loan-applications/my");
    return response.data;
};

export const createApplication = async (application) => {
        const response = await api.post("/api/loan-applications",application);
        return response.data;
};

export const reviewApplication = async (id) => {
    const response = await api.put(`/api/loan-applications/${id}/review`);

    return response.data;
  };