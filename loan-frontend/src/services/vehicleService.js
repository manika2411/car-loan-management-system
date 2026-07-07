import api from "../api";

export const getVehicles = async () => {
  const response = await api.get("/api/vehicles");
  return response.data;
};

export const createVehicle = async (vehicle) => {
  const response = await api.post("/api/vehicles", vehicle);
  return response.data;
};

export const updateVehicle = async (id, vehicle) => {
  const response = await api.put(`/api/vehicles/${id}`, vehicle);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/api/vehicles/${id}`);
  return response.data;
};