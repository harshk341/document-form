import axios from "axios";

const instanceOfAxios = axios.create({
  baseURL: "http://reactnodejstest.xicom.us/api/v1",
  timeout: 10000,
});

instanceOfAxios.interceptors.request.use(
  (congif) => Promise.resolve(congif),
  (error) => Promise.reject(error)
);

instanceOfAxios.interceptors.response.use(
  (response) => {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response);
    } else if (error.request) {
      return Promise.reject(error.request);
    } else {
      return Promise.reject(error.message);
    }
  }
);

const apiCaller = async (endpoint, method = "get", body, params) =>
  instanceOfAxios({
    url: endpoint,
    method: method,
    data: body,
    params: params,
  });

export { apiCaller, instanceOfAxios };
