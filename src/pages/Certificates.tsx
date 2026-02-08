import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input } from "../Components/ui";
import {
  listCertificates,
  createCertificate,
  updateCertificate,
  downloadCertificateFile,
} from "../api/certificates";
import type { Certificate } from "../api/certificates";

import { listCourses } from "../api/courses";
import type { Course } from "../api/courses";

import { listUsers } from "../api/users";
import type { User } from "../api/users";

export default function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState({
    course_id: 0,
    user_id: 0,
  });

  const [editing, setEditing] = useState<Certificate | null>(null);

  // ✅ maps tepada (onCreate/onUpdate ishlatadi)
  const courseMap = useMemo(
    () => new Map<number, string>(courses.map((c) => [c.id, c.name])),
    [courses]
  );
  const userMap = useMemo(
    () =>
      new Map<number, string>(
        users.map((u) => [
          u.id,
          `${u.last_name} ${u.first_name} (${u.login})`,
        ])
      ),
    [users]
  );

  async function load() {
    const data = await listCertificates({
      offset,
      limit,
      course_name: q || undefined,
    });
    setItems(data.items);
    setTotal(data.total);
  }

  async function loadOptions() {
    const [c, u] = await Promise.all([
      listCourses({ offset: 0, limit: 200 }),
      listUsers({ offset: 0, limit: 200 }),
    ]);

    setCourses(c.items);
    setUsers(u.items);

    // default select
    setForm((p) => ({
      ...p,
      course_id: p.course_id || c.items?.[0]?.id || 0,
      user_id: p.user_id || u.items?.[0]?.id || 0,
    }));
  }

  useEffect(() => {
    load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  useEffect(() => {
    loadOptions().catch(console.error);
  }, []);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  const filteredHint = useMemo(
    () => (q ? `Filter: course_name="${q}"` : "No filters"),
    [q]
  );

  async function onCreate() {
    if (!form.course_id || !form.user_id) return;

    const course_name = courseMap.get(form.course_id) || "";

    const created = await createCertificate({
      course_name,
      course_id: Number(form.course_id),
      user_id: Number(form.user_id),
    });

    setItems((p) => [created, ...p]);
    setTotal((t) => t + 1);

    setForm({
      course_id: courses?.[0]?.id || 0,
      user_id: users?.[0]?.id || 0,
    });
  }

  async function onUpdate() {
    if (!editing) return;

    // ✅ course_name ni doim mapdan olamiz
    const course_name = courseMap.get(editing.course_id) || editing.course_name || "";

    const updated = await updateCertificate(editing.id, {
      course_name,
      course_id: editing.course_id,
      user_id: editing.user_id,
    });

    setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    setEditing(null);
  }

  async function onDownload(id: number) {
    const blob = await downloadCertificateFile(id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate_${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-100">Certificates</div>
          <div className="mt-1 text-sm text-slate-500">
            GET /certificates • POST /certificates • PATCH /certificates/{`{id}`} • GET /certificates/{`{id}`}/file
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="course_name filter..."
          />
          <Button
            variant="secondary"
            onClick={() => {
              setOffset(0);
              load();
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Paging */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-slate-400">{filteredHint}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={!canPrev}
            onClick={() => setOffset((x) => Math.max(0, x - limit))}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            disabled={!canNext}
            onClick={() => setOffset((x) => x + limit)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl ring-1 ring-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-950">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Course ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((x) => (
                <tr
                  key={x.id}
                  className="border-b border-slate-900 hover:bg-slate-900/35"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{x.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">{x.course_name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{x.course_id}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{x.user_id}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {new Date(x.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setEditing({ ...x })}>
                        Edit
                      </Button>
                      <Button variant="ghost" onClick={() => onDownload(x.id)}>
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create */}
      <div className="mt-6 rounded-2xl bg-slate-950 p-5 ring-1 ring-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-100">Create Certificate</div>
          <Badge tone="blue">POST /certificates</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-slate-400">course</div>
            <select
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-slate-100 ring-1 ring-slate-800"
              value={String(form.course_id)}
              onChange={(e) => setForm((p) => ({ ...p, course_id: Number(e.target.value) }))}
            >
              {!courses.length && <option value="0">No courses</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (#{c.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 text-xs text-slate-400">user</div>
            <select
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-slate-100 ring-1 ring-slate-800"
              value={String(form.user_id)}
              onChange={(e) => setForm((p) => ({ ...p, user_id: Number(e.target.value) }))}
            >
              {!users.length && <option value="0">No users</option>}
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.last_name} {u.first_name} ({u.login}) • #{u.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onCreate} disabled={!form.course_id || !form.user_id}>
            Save
          </Button>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-950 ring-1 ring-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="text-base font-semibold text-slate-100">
                Update Certificate #{editing.id}
              </div>
              <Button variant="ghost" onClick={() => setEditing(null)} className="rounded-lg px-2">
                ✕
              </Button>
            </div>

            <div className="px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-slate-400">course</div>
                  <select
                    className="w-full rounded-xl bg-slate-900 px-3 py-2 text-slate-100 ring-1 ring-slate-800"
                    value={String(editing.course_id)}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setEditing((p) =>
                        p
                          ? { ...p, course_id: id, course_name: courseMap.get(id) || "" }
                          : p
                      );
                    }}
                  >
                    {!courses.length && <option value="0">No courses</option>}
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (#{c.id})
                      </option>
                    ))}
                  </select>

                  <div className="mt-2 text-xs text-slate-500">
                    course_name:{" "}
                    <span className="text-slate-300">
                      {courseMap.get(editing.course_id) || editing.course_name || "-"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-xs text-slate-400">user</div>
                  <select
                    className="w-full rounded-xl bg-slate-900 px-3 py-2 text-slate-100 ring-1 ring-slate-800"
                    value={String(editing.user_id)}
                    onChange={(e) =>
                      setEditing((p) => (p ? { ...p, user_id: Number(e.target.value) } : p))
                    }
                  >
                    {!users.length && <option value="0">No users</option>}
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.last_name} {u.first_name} ({u.login}) • #{u.id}
                      </option>
                    ))}
                  </select>

                  <div className="mt-2 text-xs text-slate-500">
                    selected user:{" "}
                    <span className="text-slate-300">
                      {userMap.get(editing.user_id) || `#${editing.user_id}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                API: <span className="text-slate-300">PATCH /certificates/{`{id}`}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-5 py-4">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={onUpdate}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
