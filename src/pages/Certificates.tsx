import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input, Card } from "../Components/ui";
import {
  listCertificates,
  createCertificate,
  updateCertificate,
  downloadCertificateFile,
} from "../api/certificates";
import type { Certificate } from "../api/certificates";
import { useRef } from "react";
import { listCourses } from "../api/courses";
import type { Course } from "../api/courses";

import { listUsers } from "../api/users";
import type { User } from "../api/users";

export default function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

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

  const courseMap = useMemo(
    () => new Map<number, string>(courses.map((c) => [c.id, c.name])),
    [courses],
  );
  const userMap = useMemo(
    () =>
      new Map<number, string>(
        users.map((u) => [u.id, `${u.last_name} ${u.first_name} (${u.login})`]),
      ),
    [users],
  );

  async function load() {
    setIsLoading(true);
    try {
      const data = await listCertificates({
        offset,
        limit,
        course_name: q || undefined,
      });
      setItems(data.items);
      setTotal(data.total);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadOptions() {
    try {
      const [c, u] = await Promise.all([
        listCourses({ offset: 0, limit: 200 }),
        listUsers({ offset: 0, limit: 200 }),
      ]);
      setCourses(c.items);
      setUsers(u.items);
      setForm((p) => ({
        ...p,
        course_id: p.course_id || c.items?.[0]?.id || 0,
        user_id: p.user_id || u.items?.[0]?.id || 0,
      }));
    } catch (error) {
      console.error("Failed to load options:", error);
    }
  }

  useEffect(() => {
    load().catch(console.error);
  }, [offset, q]);

  useEffect(() => {
    loadOptions().catch(console.error);
  }, []);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  const filteredHint = useMemo(
    () => (q ? `🔍 Filtered: "${q}"` : "✨ No filters applied"),
    [q],
  );

  async function onCreate() {
    if (!form.course_id || !form.user_id) return;

    const course_name = courseMap.get(form.course_id) || "";

    try {
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

      const successBadgeRef = useRef<HTMLDivElement | null>(null);
      if (successBadgeRef.current) {
        successBadgeRef.current.classList.add("animate-pulse");
        setTimeout(
          () => successBadgeRef.current?.classList.remove("animate-pulse"),
          2000,
        );
      }
    } catch (error) {
      console.error("Failed to create certificate:", error);
    }
  }

  async function onUpdate() {
    if (!editing) return;

    try {
      const course_name =
        courseMap.get(editing.course_id) || editing.course_name || "";
      const updated = await updateCertificate(editing.id, {
        course_name,
        course_id: editing.course_id,
        user_id: editing.user_id,
      });

      setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
    } catch (error) {
      console.error("Failed to update certificate:", error);
    }
  }

  async function onDownload(id: number) {
    try {
      setIsDownloading(id);
      const blob = await downloadCertificateFile(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl opacity-30" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
                Quantum Certificates
              </h1>
              <Badge tone="cosmic" pulsating className="hidden sm:flex">
                QUANTUM
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search course_name..."
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                className="min-w-[280px] backdrop-blur-sm"
              />
            </div>
            <Button
              variant="quantum"
              onClick={() => {
                setOffset(0);
                load();
              }}
              className="group"
            >
              <span className="flex items-center gap-2">
                <span className="group-hover:rotate-90 transition-transform duration-300">
                  🔍
                </span>
                Search
              </span>
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">Total Certificates</div>
            <div className="text-xl font-bold text-white">{total}</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">
              Page {Math.floor(offset / limit) + 1}
            </div>
            <div className="text-sm font-medium text-cyan-300">
              Showing {items.length} items
            </div>
          </div>
          <div className="text-sm text-slate-400 font-mono px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10">
            {filteredHint}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 mr-2 hidden sm:block">
            Navigate:
          </div>
          <Button
            variant="secondary"
            disabled={!canPrev}
            onClick={() => setOffset((x) => Math.max(0, x - limit))}
            className="group"
          >
            <span className="flex items-center gap-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">
                ←
              </span>
              Prev
            </span>
          </Button>
          <Button
            variant="secondary"
            disabled={!canNext}
            onClick={() => setOffset((x) => x + limit)}
            className="group"
          >
            <span className="flex items-center gap-2">
              Next
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </Button>
        </div>
      </div>
      <Card glowing hoverable className="mb-8 overflow-hidden border-none">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-purple-500/5 backdrop-blur-sm">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-1 text-xs font-semibold text-cyan-300/80 tracking-wider">
                ID
              </div>
              <div className="col-span-3 text-xs font-semibold text-cyan-300/80 tracking-wider">
                COURSE
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                COURSE ID
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                USER ID
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                CREATED
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                ACTIONS
              </div>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse px-6 py-4">
                  <div className="grid grid-cols-12 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="col-span-2 h-4 bg-white/5 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((x) => (
                <div
                  key={x.id}
                  className="group px-6 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:via-blue-500/3 hover:to-purple-500/5"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <span className="font-mono text-sm text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-2 py-1 rounded-lg">
                        #{x.id}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm font-medium text-white">
                        {x.course_name}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge tone="blue" className="text-xs">
                        CID: {x.course_id}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge tone="purple" className="text-xs">
                        UID: {x.user_id}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-slate-300">
                        {new Date(x.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(x.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setEditing({ ...x })}
                          className="text-xs px-3 py-1.5 group/btn"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="group-hover/btn:rotate-12 transition-transform duration-300">
                              ✏️
                            </span>
                            Edit
                          </span>
                        </Button>
                        <Button
                          variant={
                            isDownloading === x.id ? "cosmic" : "quantum"
                          }
                          onClick={() => onDownload(x.id)}
                          disabled={isDownloading === x.id}
                          className="text-xs px-3 py-1.5 group/btn"
                        >
                          <span className="flex items-center gap-1.5">
                            {isDownloading === x.id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <span className="group-hover/btn:scale-110 transition-transform duration-300">
                                📥
                              </span>
                            )}
                            {isDownloading === x.id ? "..." : "Download"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mb-4 text-5xl opacity-30">📄</div>
                <div className="text-lg font-medium text-slate-300 mb-2">
                  No certificates found
                </div>
                <div className="text-sm text-slate-500">
                  Create your first certificate to get started
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      <Card glowing className="mb-8 border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
              Create New Certificate
            </h2>
            <div className="mt-1 text-sm text-slate-400">
              Generate a new quantum certificate
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className="text-xs text-slate-500 font-mono">
              Status: Ready
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/15 via-blue-400/10 to-purple-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                <label className="text-xs font-medium text-cyan-300/90 tracking-wider">
                  COURSE
                </label>
              </div>

              <div className="relative">
                <select
                  className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3 text-slate-100 
                    ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                    hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40
                    appearance-none cursor-pointer"
                  value={String(form.course_id)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      course_id: Number(e.target.value),
                    }))
                  }
                >
                  {!courses.length && (
                    <option value="0" className="bg-slate-900 text-slate-400">
                      ⏳ Loading courses...
                    </option>
                  )}
                  {courses.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-slate-900 text-slate-100"
                    >
                      {c.name} (#{c.id})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-cyan-300/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"></div>
                <label className="text-xs font-medium text-cyan-300/90 tracking-wider">
                  USER
                </label>
              </div>

              <div className="relative">
                <select
                  className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3 text-slate-100 
                    ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                    hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40
                    appearance-none cursor-pointer"
                  value={String(form.user_id)}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, user_id: Number(e.target.value) }))
                  }
                >
                  {!users.length && (
                    <option value="0" className="bg-slate-900 text-slate-400">
                      ⏳ Loading users...
                    </option>
                  )}
                  {users.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                      className="bg-slate-900 text-slate-100"
                    >
                      {u.last_name} {u.first_name} ({u.login}) • #{u.id}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-cyan-300/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onCreate}
            disabled={!form.course_id || !form.user_id || isLoading}
            variant="cosmic"
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="group-hover:rotate-180 transition-transform duration-500">
                ✨
              </span>
              Create Quantum Certificate
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                🚀
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/15 group-hover:to-purple-500/20 transition-all duration-500"></div>
          </Button>
        </div>
      </Card>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl">
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 blur-2xl opacity-40" />
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-purple-400/20 blur opacity-50" />
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
                    Update Certificate
                  </h3>
                  <div className="mt-1 text-sm text-slate-400 font-mono">
                    PATCH /certificates/{`{id: ${editing.id}}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setEditing(null)}
                  className="rounded-xl p-2 hover:bg-white/10"
                >
                  <span className="text-lg">✕</span>
                </Button>
              </div>
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative group">
                    <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                      SELECT COURSE
                    </label>
                    <div className="relative">
                      <select
                        className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3.5 text-slate-100 
                          ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                          hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40"
                        value={String(editing.course_id)}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setEditing((p) =>
                            p
                              ? {
                                  ...p,
                                  course_id: id,
                                  course_name: courseMap.get(id) || "",
                                }
                              : p,
                          );
                        }}
                      >
                        {courses.map((c) => (
                          <option
                            key={c.id}
                            value={c.id}
                            className="bg-slate-900"
                          >
                            {c.name} (#{c.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-cyan-300">course_name:</span>{" "}
                      <span className="text-slate-200">
                        {courseMap.get(editing.course_id) ||
                          editing.course_name ||
                          "-"}
                      </span>
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                      SELECT USER
                    </label>
                    <div className="relative">
                      <select
                        className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3.5 text-slate-100 
                          ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                          hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40"
                        value={String(editing.user_id)}
                        onChange={(e) =>
                          setEditing((p) =>
                            p ? { ...p, user_id: Number(e.target.value) } : p,
                          )
                        }
                      >
                        {users.map((u) => (
                          <option
                            key={u.id}
                            value={u.id}
                            className="bg-slate-900"
                          >
                            {u.last_name} {u.first_name} ({u.login}) • #{u.id}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-cyan-300">selected:</span>{" "}
                      <span className="text-slate-200">
                        {userMap.get(editing.user_id) || `#${editing.user_id}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/8 to-purple-500/10 p-4 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
                    <div className="text-sm text-slate-300">
                      Certificate ID:{" "}
                      <span className="font-bold text-cyan-300">
                        #{editing.id}
                      </span>
                    </div>
                    <div className="text-slate-600">•</div>
                    <div className="text-sm text-slate-400">
                      Created: {new Date(editing.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
                <Button
                  variant="secondary"
                  onClick={() => setEditing(null)}
                  className="group"
                >
                  <span className="flex items-center gap-2">
                    <span className="group-hover:-translate-x-1 transition-transform duration-300">
                      ←
                    </span>
                    Cancel
                  </span>
                </Button>
                <Button
                  onClick={onUpdate}
                  variant="cosmic"
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Save Changes
                    <span className="group-hover:rotate-180 transition-transform duration-500">
                      ⚡
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/15 group-hover:to-purple-500/20 transition-all duration-500"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
