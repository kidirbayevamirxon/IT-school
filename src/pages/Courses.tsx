import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input, Card, cn } from "../Components/ui";
import { createCourse, deleteCourse, listCourses, updateCourse } from "../api/courses";
import type { Course } from "../api/courses";

interface CourseWithTimestamp extends Course {
  created_at?: string;
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur opacity-40 rounded-lg"></div>
          <h1 className="relative text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <Badge tone="cosmic" pulsating className="animate-pulse">
          QUANTUM CRUD
        </Badge>
      </div>
      <div className="mt-2 text-sm text-slate-400/80 font-mono">{sub}</div>
    </div>
  );
}

export default function CoursesPage() {
  const [items, setItems] = useState<CourseWithTimestamp[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState<CourseWithTimestamp | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const data = await listCourses({ offset, limit, name: q || undefined });
      const itemsWithTimestamp = data.items.map(item => ({
        ...item,
        created_at: (item as any).created_at || new Date().toISOString()
      }));
      setItems(itemsWithTimestamp);
      setTotal(data.total);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load().catch(console.error);
  }, [offset, q]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;
  
  const filteredHint = useMemo(
    () => (q ? `🔍 Filtered: "${q}"` : "✨ All courses"),
    [q]
  );

  async function onCreate() {
    if (!form.name.trim()) return;
    
    try {
      const created = await createCourse({ name: form.name.trim() });
      const courseWithTimestamp = {
        ...created,
        created_at: new Date().toISOString()
      };
      setItems((p) => [courseWithTimestamp, ...p]);
      setTotal((t) => t + 1);
      setForm({ name: "" });
      
      const successBadge = document.getElementById('create-success');
      if (successBadge) {
        successBadge.classList.add('animate-pulse');
        setTimeout(() => successBadge.classList.remove('animate-pulse'), 2000);
      }
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  }

  async function onUpdate() {
    if (!editing) return;
    
    try {
      const updated = await updateCourse(editing.id, { name: editing.name });
      const updatedWithTimestamp = {
        ...updated,
        created_at: editing.created_at || new Date().toISOString()
      };
      setItems((p) => p.map((x) => (x.id === updatedWithTimestamp.id ? updatedWithTimestamp : x)));
      setEditing(null);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    try {
      setIsDeleting(id);
      await deleteCourse(id);
      setItems((p) => p.filter((x) => x.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setIsDeleting(null);
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl opacity-30" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            title="Quantum Courses"
            sub="GET /courses • POST /courses • PATCH /courses/{id} • DELETE /courses/{id}"
          />
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search course name..."
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <span className="group-hover:rotate-90 transition-transform duration-300">🔍</span>
                Search
              </span>
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">Total Courses</div>
            <div className="text-xl font-bold text-white">{total}</div>
          </div>
          
          <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">Page {Math.floor(offset/limit) + 1}</div>
            <div className="text-sm font-medium text-cyan-300">
              Showing {items.length} items
            </div>
          </div>

          <div className="text-sm text-slate-400 font-mono px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10">
            {filteredHint}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 mr-2 hidden sm:block">Navigate:</div>
          <Button
            variant="secondary"
            disabled={!canPrev}
            onClick={() => setOffset((x) => Math.max(0, x - limit))}
            className="group"
          >
            <span className="flex items-center gap-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
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
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </Button>
        </div>
      </div>

      <Card glowing hoverable className="mb-8 overflow-hidden border-none">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-purple-500/5 backdrop-blur-sm">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-1 text-xs font-semibold text-cyan-300/80 tracking-wider">ID</div>
              <div className="col-span-8 text-xs font-semibold text-cyan-300/80 tracking-wider">COURSE NAME</div>
              <div className="col-span-1 text-xs font-semibold text-cyan-300/80 tracking-wider">CREATED</div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">ACTIONS</div>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse px-6 py-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-8 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-1 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-2 h-4 bg-white/5 rounded"></div>
                  </div>
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((course) => (
                <div
                  key={course.id}
                  className="group px-6 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:via-blue-500/3 hover:to-purple-500/5"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <span className="font-mono text-sm text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-2 py-1 rounded-lg">
                        #{course.id}
                      </span>
                    </div>
                    <div className="col-span-8">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:scale-150 transition-transform duration-300"></div>
                        <div className="text-sm font-medium text-white">{course.name}</div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-xs text-slate-400">
                        {formatDate(course.created_at)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setEditing(course)}
                          className="text-xs px-3 py-1.5 group/btn"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="group-hover/btn:rotate-12 transition-transform duration-300">✏️</span>
                            Edit
                          </span>
                        </Button>
                        
                        <Button
                          variant={isDeleting === course.id ? "danger" : "ghost"}
                          onClick={() => onDelete(course.id)}
                          disabled={isDeleting === course.id}
                          className="text-xs px-3 py-1.5 group/btn"
                        >
                          <span className="flex items-center gap-1.5">
                            {isDeleting === course.id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <span className="group-hover/btn:scale-110 group-hover/btn:text-red-300 transition-all duration-300">🗑️</span>
                            )}
                            {isDeleting === course.id ? "..." : "Delete"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mb-4 text-5xl opacity-30">🎓</div>
                <div className="text-lg font-medium text-slate-300 mb-2">No courses found</div>
                <div className="text-sm text-slate-500">Create your first course to get started</div>
              </div>
            )}
          </div>
        </div>
      </Card>
      <Card glowing className="mb-8 border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
              Create New Course
            </h2>
            <div className="mt-1 text-sm text-slate-400">Add a new course to the quantum system</div>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className="text-xs text-slate-500 font-mono">Status: Ready</div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/15 via-blue-400/10 to-purple-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
              <label className="text-xs font-medium text-cyan-300/90 tracking-wider">COURSE NAME</label>
            </div>
            <textarea
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Enter course name (e.g., Quantum Physics 101)"
              className="backdrop-blur-sm w-full p-3"
            />
            <div className="mt-2 text-xs text-slate-400">
              {form.name.length}/100 characters
              <span className={cn(
                "ml-2 transition-colors",
                form.name.length > 90 ? "text-amber-300" : "text-slate-500"
              )}>
                {form.name.length > 90 ? "⚠️ Approaching limit" : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onCreate} 
            disabled={!form.name.trim() || isLoading}
            variant="cosmic"
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="group-hover:rotate-180 transition-transform duration-500">✨</span>
              Create Quantum Course
              <span className="group-hover:translate-x-1 transition-transform duration-300">🚀</span>
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
                    Update Course
                  </h3>
                  <div className="mt-1 text-sm text-slate-400 font-mono">
                    PATCH /courses/{`{id: ${editing.id}}`}
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
                <div className="relative group">
                  <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                    COURSE NAME
                  </label>
                  
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing((p) => (p ? { ...p, name: e.target.value } : p))}
                    placeholder="Enter course name..."
                    className="w-full backdrop-blur-sm"
                  />
                  
                  <div className="mt-3 text-xs text-slate-400 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-cyan-300">Current ID:</span>{" "}
                    <span className="text-slate-200 font-mono">#{editing.id}</span>
                    <span className="mx-3 text-slate-600">•</span>
                    <span className="text-cyan-300">Created:</span>{" "}
                    <span className="text-slate-300">{formatDateTime(editing.created_at)}</span>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/8 to-purple-500/10 p-4 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
                    <div className="text-sm text-slate-300">Course ID: <span className="font-bold text-cyan-300">#{editing.id}</span></div>
                    <div className="text-slate-600">•</div>
                    <div className="text-sm text-slate-400">Created: {formatDateTime(editing.created_at)}</div>
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
                    <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
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
                    <span className="group-hover:rotate-180 transition-transform duration-500">⚡</span>
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