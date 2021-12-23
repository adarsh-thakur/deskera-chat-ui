import axios from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_BASE_URL,
});
export const getCustomAxiosInstance = (config) => {
    const customInstance = axios.create(config);
    return customInstance;
};

const requestInterceptSuccess = (config) => {
    return config;
};
const requestInterceptError = (error) => {
    return Promise.reject(error);
};
const responseInterceptSuccess = (response) => {
    return response.data;
};
const responseInterceptError = (error) => {
    return Promise.reject(error.response.data);
}

axiosInstance.interceptors.request.use(
    (response) => requestInterceptSuccess(response),
    (error) => requestInterceptError(error)
);

axiosInstance.interceptors.response.use(
    (response) => responseInterceptSuccess(response),
    (error) => responseInterceptError(error)
);
export default axiosInstance;