import axios from 'axios';

// Client axios — prioriza `NEXT_PUBLIC_API_BASE_URL`, depois `NEXT_PUBLIC_BASE_URL`.
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';

//Client axios
const api = axios.create({
    baseURL: apiBase,
    timeout: 10000
})

//Interceptor, Insere o token JWT automaticamente
api.interceptors.request.use((config) => {
    // Pegar o token do localStorage ao invés de usar o hook useAuth
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

export default api
