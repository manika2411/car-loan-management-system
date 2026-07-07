import api from "../api";

export const getAiRecommendation = async (applicationId) => {
  const response = await api.get(`/api/ai/recommend/${applicationId}`);
  return response.data;

};