import axios from 'axios';
import queryString from 'query-string';

const baseURL = 'http://localhost:3500/api/v1';
const axiosClient = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify({ params }),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response;
  },
  (err) => {
    if (!err.response) {
      return alert(err);
    }
    throw err.response;
  }
);

export default axiosClient;
