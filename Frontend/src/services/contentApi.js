import api from './api.js';

// Testimonials
export const getTestimonials = (all = false) => api.get(`/testimonials${all ? '?all=true' : ''}`);
export const createTestimonial = (d) => api.post('/testimonials', d);
export const updateTestimonial = (id, d) => api.put(`/testimonials/${id}`, d);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

// FAQs
export const getFAQs = (all = false) => api.get(`/faqs${all ? '?all=true' : ''}`);
export const createFAQ = (d) => api.post('/faqs', d);
export const updateFAQ = (id, d) => api.put(`/faqs/${id}`, d);
export const deleteFAQ = (id) => api.delete(`/faqs/${id}`);

// Statistics
export const getStatistics = (all = false) => api.get(`/statistics${all ? '?all=true' : ''}`);
export const createStatistic = (d) => api.post('/statistics', d);
export const updateStatistic = (id, d) => api.put(`/statistics/${id}`, d);
export const deleteStatistic = (id) => api.delete(`/statistics/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (d) => api.put('/settings', d);