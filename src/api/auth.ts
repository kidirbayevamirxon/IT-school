import { http, tokenStore } from "./http";

export type LoginBody = {
  login: string;
  password: string;
};

export async function login(body: LoginBody) {
  const { data } = await http.post("/auth/login", body);
  tokenStore.set(data);
  return data;
}

export function logout() {
  tokenStore.clear();
}
