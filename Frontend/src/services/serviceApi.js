import api from './api.js';

export const getServices = (all = false) => api.get(`/services${all ? '?all=true' : ''}`);
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);