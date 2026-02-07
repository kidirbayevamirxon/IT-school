import { http } from "./http";

export type Course = { id: number; name: string };

export type CourseList = {
  total: number;
  limit: number;
  offset: number;
  items: Course[];
};

export async function listCourses(params?: { offset?: number; limit?: number; name?: string }) {
  const { data } = await http.get<CourseList>("/courses", { params });
  return data;
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
