import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};

export const getBookmarks = async () => {
  const response = await axiosInstance.get('/auth/bookmarks');
  return response.data;
};

export const toggleBookmark = async (lawId) => {
  const response = await axiosInstance.post(`/auth/bookmarks/${lawId}`);
  return response.data;
};
