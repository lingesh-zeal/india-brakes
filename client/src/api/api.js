import axios from "axios";

export const BASE_URL = "http://192.168.1.18:5000/api";
export const BASE_IMG = "http://192.168.1.18:5000/";
const api = axios.create({
    baseURL: "http://192.168.1.18:5000/api",
});

api.interceptors.request.use((config)=> {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export default api;