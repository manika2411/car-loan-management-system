import api from "../api";

export const getAllUsers = async () => {
  const response = await api.get("/api/users");
  return response.data;
};

export const getAllRoles = async () => {
  const response = await api.get("/api/users/roles");
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/api/users/${userId}/role`, { role });
  return response.data;
};