import axios from "axios";
import {authentication} from "../actions/AuthAction";

import {Link, useLocation} from 'react-router-dom'

var isRefreshToken = false;

const handleError = (error) => {
  if (error?.status) {
    // eslint-disable-next-line default-case
    switch (error?.status) {
      case 401:
        localStorage.removeItem('admin_user')
          location.href='/sh-admin/#/login'
        break;
      case 403:
        console.log("403 Forbidden");
        break;

    }
  }
};
const getToken = () =>{

  let userStorage = localStorage.getItem('admin_user');

  if (userStorage!=undefined && userStorage!=null){

    userStorage = JSON.parse(userStorage)
    if (userStorage.access_token!=undefined){

      return userStorage.access_token;
    }
    else {
      return false;
    }
  }
  else{
    return false;
  }
}
const axiosIns = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 300000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosIns.interceptors.request.use(
  (config) => {
    config.headers["Accept-Language"] = "fa";
    if (getToken()) {
      config.headers["Authorization"] = `Bearer ${getToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add request/response interceptor
axiosIns.interceptors.response.use(
  (response) => response,
  (error) => {
    handleError(error.response);
    return Promise.reject(error.response);
  }
);

export default axiosIns;
