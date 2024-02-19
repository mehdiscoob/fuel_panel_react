import axios from "../services/axios";

// eslint-disable-next-line arrow-body-style
export const httpGet = (url, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};
// eslint-disable-next-line arrow-body-style
export const httpPost = (url, body, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, body, config)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};



// eslint-disable-next-line arrow-body-style
export const httpPut = (url, body, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, body, config)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

// eslint-disable-next-line arrow-body-style
export const httpDelete = (url, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, config)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};
