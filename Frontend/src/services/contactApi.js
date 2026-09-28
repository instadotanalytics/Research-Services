import api from './api.js';

export const createContact = (data) => api.post('/contact', data);
export const getContacts = () => api.get('/contact');
export const updateContact = (id, data) => api.put(`/contact/${id}`, data);
export const deleteContact = (id) => api.delete(`/contact/${id}`);