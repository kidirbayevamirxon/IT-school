import { http } from "./http";

export type Course = { id: number; name: string };

export type CourseList = {
  total: number;
  limit: number;
  offset: number;
  items: Course[];
};

export async function listCourses(params?: { offset?: number; limit?: number; name?: string }) {
  const res = await http.get<any>("/courses", { params });
  const data = res.data;

  if (data && Array.isArray(data.items)) return data as CourseList;

  if (Array.isArray(data)) {
    return {
      total: data.length,
      limit: params?.limit ?? data.length,
      offset: params?.offset ?? 0,
      items: data as Course[],
    } satisfies CourseList;
  }

  return {
    total: 0,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    items: [],
  } satisfies CourseList;
}

export async function getCourse(course_id: number) {
  const { data } = await http.get<Course>(`/courses/${course_id}`);
  return data;
}
export async function createCourse(body: { name: string }) {
  const { data } = await http.post<Course>("/courses", body);
  return data;
}
export async function updateCourse(course_id: number, body: { name: string }) {
  const { data } = await http.patch<Course>(`/courses/${course_id}`, body);
  return data;
}
export async function deleteCourse(course_id: number) {
  await http.delete(`/courses/${course_id}`);
}
