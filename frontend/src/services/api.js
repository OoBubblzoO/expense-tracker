// backend API calls'
import axios from 'axios';

// create axios instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000', // Flask backend URL
    timeout: 5000, // request timeout
});

export default api;