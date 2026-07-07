import api from "../api";

export const getAllLeads = async () => {
  const response = await api.get("/api/leads");
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await api.get(`/api/leads/${id}`);
  return response.data;
};

export const updateLeadStatus = async (id, status) => {
  const response = await api.put(`/api/leads/${id}/status`, {status});
  return response.data;
};

export const createLead = async (lead) => {
  const response = await api.post("/api/leads", lead);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};