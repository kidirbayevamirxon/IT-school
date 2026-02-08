import { http, tokenStore } from "./http";

export type LoginBody = {
  login: string;
  password: string;
};

// backend turlicha nom bilan qaytarsa ham ushlaymiz
function normalizeTokens(raw: any) {
  const access =
    raw?.access_token ??
    raw?.accessToken ??
    raw?.access ??
    raw?.token ??
    raw?.jwt ??
    raw?.data?.access_token ??
    raw?.data?.accessToken ??
    raw?.data?.access ??
    raw?.data?.token;

  const refresh =
    raw?.refres_token ??       
    raw?.refresh_token ??
    raw?.refreshToken ??
    raw?.refresh ??
    raw?.data?.refres_token ??
    raw?.data?.refresh_token ??
    raw?.data?.refreshToken ??
    raw?.data?.refresh;

  const role = raw?.role ?? raw?.data?.role ?? "USER";

  return {
    access_token: access,
    refres_token: refresh,
    role,
  };
}

export async function login(body: LoginBody) {
  const res = await http.post("/auth/login", body);

  // ba'zan data ichida data bo'ladi:
  const tokens = normalizeTokens(res.data);

  // ✅ agar token yo'q bo'lsa, xatoni ko'rsatamiz
  if (!tokens.access_token || !tokens.refres_token) {
    console.log("LOGIN RESPONSE:", res.data); // devda ko'rib olasan
    throw new Error("Backend token qaytarmadi (response formatni tekshir)");
  }

  tokenStore.set(tokens);
  return tokens;
}

export function logout() {
  tokenStore.clear();
}
