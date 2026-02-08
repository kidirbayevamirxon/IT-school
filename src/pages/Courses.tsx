import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input } from "../Components/ui";
import { createCourse, deleteCourse, listCourses, updateCourse } from "../api/courses";
import type { Course } from "../api/courses";

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="text-xl font-semibold text-slate-100">{title}</div>
        <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
          CRUD
        </span>
      </div>
      <div className="mt-1 text-sm text-slate-500">{sub}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-slate-950/70 ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      {children}
    </div>
  );
}

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState<Course | null>(null);

  async function load() {
    const data = await listCourses({ offset, limit, name: q || undefined });
    setItems(data.items);
    setTotal(data.total);
  }

  useEffect(() => {
    load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;
  const filteredHint = useMemo(() => (q ? `Filter: name="${q}"` : "No filters"), [q]);

  async function onCreate() {
    if (!form.name.trim()) return;
    const created = await createCourse({ name: form.name.trim() });
    setItems((p) => [created, ...p]);
    setTotal((t) => t + 1);
    setForm({ name: "" });
  }

  async function onUpdate() {
    if (!editing) return;
    const updated = await updateCourse(editing.id, { name: editing.name });
    setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    setEditing(null);
  }

  async function onDelete(id: number) {
    await deleteCourse(id);
    setItems((p) => p.filter((x) => x.id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle
          title="Courses"
          sub="GET /courses • POST /courses • PATCH /courses/{id} • DELETE /courses/{id}"
        />

        <div className="flex items-center gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name..." />
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

      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          {filteredHint} •{" "}
          <span className="text-slate-500">
            showing {items.length} / {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled={!canPrev} onClick={() => setOffset((x) => Math.max(0, x - limit))}>
            Prev
          </Button>
          <Button variant="secondary" disabled={!canNext} onClick={() => setOffset((x) => x + limit)}>
            Next
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black/20">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((x) => (
                <tr key={x.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{x.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">{x.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setEditing({ ...x })}>
                        Edit
                      </Button>
                      <Button variant="ghost" onClick={() => onDelete(x.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-sm text-slate-500">
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create */}
      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="text-sm font-semibold text-slate-100">Create Course</div>
            <Badge tone="blue">POST /courses</Badge>
          </div>

          <div className="px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="name" value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={onCreate}>Save</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-950/80 ring-1 ring-white/15 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="text-base font-semibold text-slate-100">Update Course #{editing.id}</div>
              <Button variant="ghost" onClick={() => setEditing(null)} className="rounded-lg px-2">
                ✕
              </Button>
            </div>

            <div className="px-5 py-4">
              <Input
                label="name"
                value={editing.name}
                onChange={(e) => setEditing((p) => (p ? { ...p, name: e.target.value } : p))}
              />
              <div className="mt-3 text-xs text-slate-500">
                API: <span className="text-slate-300">PATCH /courses/{`{id}`}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
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
