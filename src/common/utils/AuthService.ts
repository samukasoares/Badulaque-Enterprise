import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, 
});
// Adiciona um interceptor para incluir o token em todas as requisições
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou outra forma de armazenamento de token (sessionStorage, Vuex, etc.)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;