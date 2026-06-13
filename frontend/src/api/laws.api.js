import axiosInstance from './axiosInstance';

export const getLaws = async (params) => {
  const response = await axiosInstance.get('/laws', { params });
  return response.data;
};

export const getLawById = async (id) => {
  const response = await axiosInstance.get(`/laws/${id}`);
  return response.data;
};

export const createLaw = async (data) => {
  const response = await axiosInstance.post('/laws', data);
  return response.data;
};

export const updateLaw = async (id, data) => {
  const response = await axiosInstance.patch(`/laws/${id}`, data);
  return response.data;
};

export const deleteLaw = async (id) => {
  const response = await axiosInstance.delete(`/laws/${id}`);
  return response.data;
};

export const archiveLaw = async (id) => {
  const response = await axiosInstance.patch(`/laws/${id}/archive`);
  return response.data;
};
