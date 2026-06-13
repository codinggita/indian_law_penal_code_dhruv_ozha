import axiosInstance from './axiosInstance';

export const searchLaws = async (params) => {
  const response = await axiosInstance.get('/search/laws', { params });
  return response.data;
};
