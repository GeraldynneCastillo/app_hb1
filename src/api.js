const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'http://172.19.7.106:8000';

export default API_BASE_URL;