import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // ajusta si tu API está en otro puerto
});

// Interceptor para añadir el token a todas las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // Verifica que headers exista, o créalo si está indefinido
        if (!config.headers) {
            config.headers = {};
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
