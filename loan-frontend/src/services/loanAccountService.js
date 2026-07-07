import api from "../api";

export const getAllLoanAccounts = async () => {
  const response = await api.get("/api/loan-accounts");
  return response.data;
};

export const createLoanAccount = async (loanApplicationId) => {
  const response = await api.post("/api/loan-accounts", {loanApplicationId,});
  return response.data;
};

export const getLoanAccountByAccountNumber = async (accountNumber) => {
  const response = await api.get(`/api/loan-accounts/account-number/${accountNumber}`);
  return response.data;
};

export const getLoanAccountByApplication = async (applicationId) => {
  const response = await api.get(`/api/loan-accounts/my/${applicationId}`);
  return response.data;
};

export const getLoanAccount = async (id) => {
  const response = await api.get(`/api/loan-accounts/${id}`);
  return response.data;
};
