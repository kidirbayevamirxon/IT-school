import { http } from "./http";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  birthday: string;
  phone: string;
  login: string;
  role: "ADMIN" | "USER" | string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserList = {
  total: number;
  limit: number;
  offset: number;
  items: User[];
};

export type CreateUserBody = {
  first_name: string;
  last_name: string;
  middle_name: string;
  birthday: string;
  phone: string;
  login: string;
  password: string;
  role: "USER" | "ADMIN" | string;
  is_active: boolean;
};

export type UpdateUserBody = Partial<CreateUserBody>;

export async function listUsers(params?: {
  offset?: number;
  limit?: number;
  first_name?: string;
  last_name?: string;
  login?: string;
  is_active?: boolean;
}) {
  const res = await http.get<any>("/users", { params });
  const data = res.data;

  if (data && Array.isArray(data.items)) return data as UserList;

  if (Array.isArray(data)) {
    return {
      total: data.length,
      limit: params?.limit ?? data.length,
      offset: params?.offset ?? 0,
      items: data as User[],
    } satisfies UserList;
  }

  return {
    total: 0,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    items: [],
  } satisfies UserList;
}

export async function getUser(user_id: number) {
  const { data } = await http.get<User>(`/users/${user_id}`);
  return data;
}

export async function createUser(body: CreateUserBody) {
  const { data } = await http.post<User>("/users", body);
  return data;
}

export async function updateUser(user_id: number, body: UpdateUserBody) {
  const { data } = await http.patch<User>(`/users/${user_id}`, body);
  return data;
}
