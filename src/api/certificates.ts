import { http } from "./http";

export type Certificate = {
  id: number;
  course_name: string;
  course_id: number;
  user_id: number;
  file_path: string;
  created_at: string;
  updated_at: string;
};

export type CertificateList = {
  total: number;
  limit: number;
  offset: number;
  items: Certificate[];
};

export type CreateCertificateBody = {
  course_name: string;
  course_id: number;
  user_id: number;
};

export type UpdateCertificateBody = Partial<CreateCertificateBody>;

export async function listCertificates(params?: { offset?: number; limit?: number; course_name?: string; id?: number }) {
  const res = await http.get<any>("/certificates", { params });
  const data = res.data;
  if (data && Array.isArray(data.items)) {
    return data as CertificateList;
  }
  if (Array.isArray(data)) {
    return {
      total: data.length,
      limit: params?.limit ?? data.length,
      offset: params?.offset ?? 0,
      items: data as Certificate[],
    } satisfies CertificateList;
  }
  return {
    total: 0,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    items: [],
  } satisfies CertificateList;
}

export async function getCertificate(certificate_id: number) {
  const { data } = await http.get<Certificate>(`/certificates/${certificate_id}`);
  return data;
}

export async function createCertificate(body: CreateCertificateBody) {
  const { data } = await http.post<Certificate>("/certificates", body);
  return data;
}

export async function updateCertificate(certificate_id: number, body: UpdateCertificateBody) {
  const { data } = await http.patch<Certificate>(`/certificates/${certificate_id}`, body);
  return data;
}

export async function downloadCertificateFile(certificate_id: number) {
  const res = await http.get(`/certificates/${certificate_id}/file`, { responseType: "blob" });
  return res.data as Blob;
}
