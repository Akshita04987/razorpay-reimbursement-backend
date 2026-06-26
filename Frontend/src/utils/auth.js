const USER_KEY = 'reimbursement_user';
const TOKEN_KEY = 'reimbursement_token';

export const getSavedUser = () => {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
};

export const saveSession = ({ user, token }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
