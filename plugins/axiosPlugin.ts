import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  axios.defaults.baseURL = `${config.public.apiBase}/api`;
  axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  axios.interceptors.response.use(
    (res: any) => res,
    (error: any) => {
      if (
        [401, 419].includes(error.response.status) &&
        !error.request.responseURL.endsWith("/api/user")
      ) {
        const store = useAuthStore();
        store.logout();
      } else {
        return Promise.reject(error);
      }
    }
  );

  await axios.get("/sanctum/csrf-cookie", {
    baseURL: config.public.apiBase,
  });
});
