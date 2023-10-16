import axios from "axios";

const API_URL = "https://2fd3-87-241-138-217.ngrok-free.app";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  config.headers = {
    Authorization: "",
    language: "",
  };
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response && response.data && response.data.status === 200) {
      return response.data;
    }
    if (response && response.data && response.data?.status === 500) {
      console.error("Something went wrong");
    }
    if (response && response.data && response.data.status !== 200) {
      const currentError = response.data;
      //if typeof error === string
      if (
        currentError &&
        currentError.message &&
        (!currentError.errors ||
          (currentError.errors && !currentError.errors.length))
      ) {
        return Promise.reject(currentError);
      }
      //if typeof error === Array
      if (
        currentError.errors &&
        currentError.errors.length &&
        !Object.keys(currentError.errors).length
      ) {
        currentError.errors.forEach((err) => {
          if (err.length && err[0] && err[0].key) {
            return Promise.reject(err[0].key);
          }
        });
      }
      //if typeof error === Object
      if (currentError.errors && Object.keys(currentError.errors).length) {
        return Promise.reject(
          currentError.errors[Object.keys(currentError.errors)[0]][0]?.key
        );
      }
    }
  },
  (error) => {
    if (error.response) {
      const currentError = error.response.data;
      //if typeof error === string
      if (
        currentError &&
        currentError.message &&
        (!currentError.errors ||
          (currentError.errors && !currentError.errors.length))
      ) {
        return Promise.reject(currentError);
      }
      //if typeof error === Array
      if (currentError.errors && currentError.errors.length) {
        currentError.errors.forEach((err) => {
          if (err.length && err[0] && err[0].key) {
            // alert(err[0].key);
            console.error(err[0].key);
          }
        });
      }
      //if typeof error === Object
      if (
        typeof currentError.errors === "object" &&
        Object.keys(currentError.errors).length
      ) {
        return Promise.reject(
          currentError.errors[Object.keys(currentError.errors)[0]][0]?.key
        );
      }
    } else {
      return Promise.reject();
    }
  }
);

export class Api {
  static getTickers(data) {
    return api.post("/stock", data);
  }

  static analizeForm(data) {
    return api.post("/stock/analize", data);
  }

  static getSecurities(data) {
    return api.post("/stock/getSecurity", data);
  }

  static oneInstrumentAnalayzer(data) {
    return api.post("/stock/oneInstrumentAnalayzer", data);
  }

  static twoInstrumentsAnalyzer(data) {
    return api.post("/stock/twoInstrumentsAnalyzer", data);
  }

  static getSecurityTypes() {
    return api.get("/stock/getSecurityTypes");
  }

  static getAllOneInstrumentNotifiers() {
    return api.get("/stock/getAllOneInstrumentNotifiers");
  }

  static getAllTwoInstrumentsNotifier() {
    return api.get("/stock/getAllTwoInstrumentsNotifier");
  }

  static createOneInstrumentNotifier(data) {
    return api.post("/stock/createOneInstrumentNotifier", data);
  }

  static updateOneInstrumentNotifier(data) {
    return api.put("/stock/updateOneInstrumentNotifier", data);
  }

  static getOneInstrumentNotifierById(itemId) {
    return api.get(`/stock/GetOneInstrumentNotifier/${itemId}`);
  }

  static getTwoInstrumentNotifierById(itemId) {
    return api.get(`/stock/findTwoInstrumentsNotifier/${itemId}`);
  }

  static deleteOneInstrumentsNotifier(itemId) {
    return api.delete(`/stock/deleteOneInstrumentNotifier/${itemId}`);
  }

  static deleteTwoInstrumentsNotifier(itemId) {
    return api.delete(`/stock/deleteTwoInstrumentsNotifier/${itemId}`);
  }

  static updateTwoInstrumentsNotifier(data) {
    return api.put(`/stock/updateTwoInstrumentsNotifier`, data);
  }

  static createTwoInstrumentsNotifier(data) {
    return api.post(`/stock/createTwoInstrumentsNotifier`, data);
  }
}
export default Api;
