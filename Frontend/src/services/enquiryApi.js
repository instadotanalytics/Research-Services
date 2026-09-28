import api from './api.js';

export const createEnquiry = (data) => api.post('/enquiries', data);
export const getEnquiries = (params) => api.get('/enquiries', { params });
export const getEnquiryById = (id) => api.get(`/enquiries/${id}`);
export const updateEnquiry = (id, data) => api.put(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);