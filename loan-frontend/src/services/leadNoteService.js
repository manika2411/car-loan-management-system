import api from "../api";

export const getLeadNotes = async (leadId) => {
  const response = await api.get(`/api/leads/${leadId}/notes`);
  return response.data;
};

export const createLeadNote = async (leadId, note) => {
  const response = await api.post(`/api/leads/${leadId}/notes`, { note });
  return response.data;
};