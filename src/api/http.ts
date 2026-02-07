import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export type AuthTokens = {
  access_token: string;
  refres_token: string; // backend spelling
  role: string;
};

const ACCESS = "access_token";
const REFRESH = "refres_token";

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS);
  },
  get refresh() {
    return localStorage.getItem(REFRESH);
  },
  set(tokens: AuthTokens) {
    localStorage.setItem(ACCESS, tokens.access_token);
    localStorage.setItem(REFRESH, tokens.refres_token);
    localStorage.setItem("role", tokens.role);
  },
  clear() {
    localStorage.clear();
  },
};

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ACCESS TOKENNI HAR REQUESTGA QO‘YADI */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (tokenStore.access) {
    config.headers.Authorization = `Bearer ${tokenStore.access}`;
  }
  return config;
});

let refreshing = false;
let queue: Array<(t?: string) => void> = [];

/* 401 → REFRESH */
http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;

      if (!tokenStore.refresh) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push((t) => {
            if (!t) return reject(error);
            original.headers.Authorization = `Bearer ${t}`;
            resolve(http(original));
          });
        });
      }

      refreshing = true;
      try {
        const { data } = await axios.post<AuthTokens>(
          `${BASE_URL}/auth/refresh`,
          { refres_token: tokenStore.refresh }
        );

        tokenStore.set(data);
        queue.forEach((cb) => cb(data.access_token));
        queue = [];

        original.headers.Authorization = `Bearer ${data.access_token}`;
        return http(original);
      } catch (e) {
        tokenStore.clear();
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
