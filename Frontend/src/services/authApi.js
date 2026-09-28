import api from './api.js';

export const loginAdmin = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const changePassword = (data) => api.post('/auth/change-password', data);