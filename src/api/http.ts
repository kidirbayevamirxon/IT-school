import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export type AuthTokens = {
  access_token: string;
  refres_token: string;
  role: string;
};

const ACCESS = "access_token";
const REFRESH = "refres_token";
const ROLE = "role";

function hasStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function getItem(key: string) {
  if (!hasStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: unknown) {
  if (!hasStorage()) return;
  if (typeof value !== "string" || !value) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export const tokenStore = {
  get access() {
    return getItem(ACCESS);
  },
  get refresh() {
    return getItem(REFRESH);
  },
  get role() {
    return getItem(ROLE);
  },
  set(tokens: { access_token: string; refres_token: string; role: string }) {
    setItem(ACCESS, tokens.access_token);
    setItem(REFRESH, tokens.refres_token);
    setItem(ROLE, tokens.role);
  },
  clear() {
    clearAll();
  },
};
function normalizeTokens(raw: any) {
  const access =
    raw?.access_token ??
    raw?.accessToken ??
    raw?.access ??
    raw?.data?.access_token ??
    raw?.data?.accessToken;
  const refresh =
    raw?.refres_token ??
    raw?.refresh_token ??
    raw?.refreshToken ??
    raw?.refresh ??
    raw?.data?.refres_token ??
    raw?.data?.refresh_token;
  const role = raw?.role ?? raw?.data?.role ?? tokenStore.role ?? "USER";
  return { access_token: access, refres_token: refresh, role };
}
function clearAll() {
  setItem(ACCESS, "");
  setItem(REFRESH, "");
  setItem(ROLE, "");
}
export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t = tokenStore.access;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

let refreshing = false;
let queue: Array<(t?: string) => void> = [];

function flushQueue(token?: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;

      const rt = tokenStore.refresh;
      if (!rt) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push((newAccess) => {
            if (!newAccess) return reject(error);
            original.headers.Authorization = `Bearer ${newAccess}`;
            resolve(http(original));
          });
        });
      }
      refreshing = true;
      try {
        const { data: raw } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refres_token: rt,
        });
        const data = normalizeTokens(raw);

        if (!data.access_token || !data.refres_token) {
          console.log("REFRESH RESPONSE:", raw);
          throw new Error("Refresh token qaytmadi");
        }

        tokenStore.set(data);
        flushQueue(data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return http(original);
      } catch (e) {
        flushQueue(undefined);
        tokenStore.clear();
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
