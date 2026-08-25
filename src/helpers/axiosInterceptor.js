import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (cookie) {
      const token = cookie.substring("token=".length);
      // NO enviar JWT a OCR.space
      if (config.url?.includes("api.ocr.space")) {
        return config;
      }

      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
