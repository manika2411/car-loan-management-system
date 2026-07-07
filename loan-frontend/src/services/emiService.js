import api from "../api";

export const getLoanAccountByAccountNumber = async (accountNumber) => {
  const response = await api.get(`/api/loan-accounts/account-number/${accountNumber}`);
  return response.data;
};

export const getEmiSchedule = async (loanAccountId) => {
  const response = await api.get(`/api/emi-schedules/loan-account/${loanAccountId}`);
  return response.data;
};

export const generateEmiSchedule = async (loanAccountId) => {
  const response = await api.post(`/api/emi-schedules/generate/${loanAccountId}`);
  return response.data;
};
