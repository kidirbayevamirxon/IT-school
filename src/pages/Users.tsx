import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input, Card, Divider, cn } from "../Components/ui";
import { createUser, listUsers, updateUser } from "../api/users";
import type { User } from "../api/users";

const emptyForm = {
  first_name: "",
  last_name: "",
  middle_name: "",
  birthday: "",
  phone: "",
  login: "",
  password: "",
  role: "USER",
  is_active: true,
};

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative group">
      <div
        className={cn(
          "absolute -inset-1 rounded-full blur transition-opacity duration-300",
          isActive ? "bg-emerald-500/20" : "bg-rose-500/20",
        )}
      />
      <span
        className={cn(
          "relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide",
          "ring-1 backdrop-blur-sm transition-all duration-300",
          isActive
            ? "bg-gradient-to-r from-emerald-500/30 via-emerald-500/20 to-emerald-500/30 text-emerald-100 ring-emerald-300/30"
            : "bg-gradient-to-r from-rose-500/30 via-rose-500/20 to-rose-500/30 text-rose-100 ring-rose-300/30",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              isActive
                ? "bg-emerald-400 animate-ping"
                : "bg-rose-400 animate-ping",
            )}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
        {isActive ? "ACTIVE" : "INACTIVE"}
      </span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "ADMIN";

  return (
    <div className="relative group">
      <div
        className={cn(
          "absolute -inset-1 rounded-full blur transition-opacity duration-300",
          isAdmin ? "bg-purple-500/20" : "bg-blue-500/20",
        )}
      />
      <span
        className={cn(
          "relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide",
          "ring-1 backdrop-blur-sm transition-all duration-300",
          isAdmin
            ? "bg-gradient-to-r from-purple-500/30 via-purple-500/20 to-purple-500/30 text-purple-100 ring-purple-300/30"
            : "bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-500/30 text-blue-100 ring-blue-300/30",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
        {role}
      </span>
    </div>
  );
}

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState<User | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const data = await listUsers({ offset, limit, login: q || undefined });
      setItems(data.items);
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
    () => (q ? `🔍 Filtered: "${q}"` : "✨ All users"),
    [q],
  );

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  async function onCreate() {
    if (!form.login.trim() || !form.password.trim()) {
      showSuccess("Login and password are required!");
      return;
    }

    try {
      const created = await createUser({
        ...form,
        role: form.role as any,
        is_active: Boolean(form.is_active),
      });
      setItems((p) => [created, ...p]);
      setForm({ ...emptyForm });
      setTotal((t) => t + 1);
      showSuccess(`User "${created.login}" created successfully!`);
    } catch (error) {
      console.error("Failed to create user:", error);
      showSuccess("Failed to create user!");
    }
  }

  async function onUpdate() {
    if (!editing) return;

    try {
      const updated = await updateUser(editing.id, {
        first_name: editing.first_name,
        last_name: editing.last_name,
        middle_name: editing.middle_name,
        birthday: editing.birthday,
        phone: editing.phone,
        login: editing.login,
        role: editing.role as any,
        is_active: editing.is_active,
      });

      setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
      showSuccess(`User "${updated.login}" updated successfully!`);
    } catch (error) {
      console.error("Failed to update user:", error);
      showSuccess("Failed to update user!");
    }
  }

  const formatFullName = (user: User) => {
    return `${user.last_name} ${user.first_name} ${user.middle_name}`.trim();
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Success Notification */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 p-4 ring-1 ring-emerald-300/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm text-emerald-100">{success}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header with cosmic effects */}
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-cyan-500/10 rounded-3xl blur-2xl opacity-30" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur opacity-40 rounded-lg"></div>
                <h1 className="relative text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  Quantum Users
                </h1>
              </div>
              <Badge tone="cosmic" pulsating className="animate-pulse">
                ADMIN PANEL
              </Badge>
            </div>
            <div className="mt-2 text-sm text-slate-400/80 font-mono">
              GET /users • POST /users • PATCH /users/{`{id}`}
            </div>
          </div>

          {/* Search with cosmic effects */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-blue-400/15 to-cyan-400/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by login..."
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

      {/* Stats and Pagination */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">Total Users</div>
            <div className="text-xl font-bold text-white">{total}</div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm px-4 py-2 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">
              Page {Math.floor(offset / limit) + 1}
            </div>
            <div className="text-sm font-medium text-cyan-300">
              Showing {items.length} users
            </div>
          </div>

          <div className="text-sm text-slate-400 font-mono px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10">
            {filteredHint}
          </div>
        </div>

        {/* Pagination Controls */}
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

      {/* Main Users Table */}
      <Card glowing hoverable className="mb-8 overflow-hidden border-none">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Table Header */}
          <div className="border-b border-white/10 bg-gradient-to-r from-purple-500/5 via-blue-500/3 to-cyan-500/5 backdrop-blur-sm">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-1 text-xs font-semibold text-cyan-300/80 tracking-wider">
                ID
              </div>
              <div className="col-span-3 text-xs font-semibold text-cyan-300/80 tracking-wider">
                FULL NAME
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                LOGIN
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                ROLE
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                STATUS
              </div>
              <div className="col-span-2 text-xs font-semibold text-cyan-300/80 tracking-wider">
                ACTIONS
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse px-6 py-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-3 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-2 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-2 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-2 h-4 bg-white/5 rounded"></div>
                    <div className="col-span-2 h-4 bg-white/5 rounded"></div>
                  </div>
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((user) => (
                <div
                  key={user.id}
                  className="group px-6 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500/5 hover:via-blue-500/3 hover:to-cyan-500/5"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* ID */}
                    <div className="col-span-1">
                      <span className="font-mono text-sm text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-2 py-1 rounded-lg">
                        #{user.id}
                      </span>
                    </div>

                    {/* Full Name */}
                    <div className="col-span-3">
                      <div className="text-sm font-medium text-white">
                        {formatFullName(user)}
                      </div>
                      {user.phone && (
                        <div className="text-xs text-slate-400 mt-1">
                          📱 {user.phone}
                        </div>
                      )}
                    </div>

                    {/* Login */}
                    <div className="col-span-2">
                      <div className="text-sm text-slate-200 font-mono">
                        @{user.login}
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <RoleBadge role={user.role} />
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <StatusBadge isActive={user.is_active} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => setEditing({ ...user })}
                          className="text-xs px-3 py-1.5 group/btn"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="group-hover/btn:rotate-12 transition-transform duration-300">
                              ✏️
                            </span>
                            Edit
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="px-6 py-12 text-center">
                <div className="mb-4 text-5xl opacity-30">👥</div>
                <div className="text-lg font-medium text-slate-300 mb-2">
                  No users found
                </div>
                <div className="text-sm text-slate-500">
                  Create your first user to get started
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Create New User */}
      <Card glowing className="mb-8 border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-200 via-white to-cyan-200 bg-clip-text text-transparent">
              Create New User
            </h2>
            <div className="mt-1 text-sm text-slate-400">
              Add a new user to the quantum system
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <Badge tone="cyan">POST /users</Badge>
            <div className="text-xs text-slate-500 font-mono">
              Status: Ready
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Personal Info Column */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="First Name"
                value={form.first_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, first_name: e.target.value }))
                }
                placeholder="Enter first name"
                className="backdrop-blur-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="Last Name"
                value={form.last_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, last_name: e.target.value }))
                }
                placeholder="Enter last name"
                className="backdrop-blur-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="Middle Name"
                value={form.middle_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, middle_name: e.target.value }))
                }
                placeholder="Enter middle name"
                className="backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="Birthday"
                value={form.birthday}
                onChange={(e) =>
                  setForm((p) => ({ ...p, birthday: e.target.value }))
                }
                placeholder="YYYY-MM-DD"
                className="backdrop-blur-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+998 XX XXX XX XX"
                className="backdrop-blur-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="Login"
                value={form.login}
                onChange={(e) =>
                  setForm((p) => ({ ...p, login: e.target.value }))
                }
                placeholder="Enter username"
                className="backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Account Info Column */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Enter secure password"
                className="backdrop-blur-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div>
                <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                  ROLE
                </label>
                <select
                  className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3 text-slate-100 
                    ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                    hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40
                    appearance-none cursor-pointer"
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value }))
                  }
                >
                  <option value="USER" className="bg-slate-900">
                    USER
                  </option>
                  <option value="ADMIN" className="bg-slate-900">
                    ADMIN
                  </option>
                </select>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div>
                <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                  STATUS
                </label>
                <select
                  className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3 text-slate-100 
                    ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                    hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40
                    appearance-none cursor-pointer"
                  value={String(form.is_active)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      is_active: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true" className="bg-slate-900">
                    O'qiyapdi (active)
                  </option>
                  <option value="false" className="bg-slate-900">
                    O'qimayapdi (inactive)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onCreate}
            disabled={!form.login.trim() || !form.password.trim()}
            variant="cosmic"
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="group-hover:rotate-180 transition-transform duration-500">
                ✨
              </span>
              Create Quantum User
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                🚀
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:via-blue-500/15 group-hover:to-cyan-500/20 transition-all duration-500"></div>
          </Button>
        </div>
      </Card>

      {/* Edit Modal - Cosmic Style */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl">
            {/* Modal glow effect */}
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-cyan-500/30 blur-2xl opacity-40" />
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-400/20 via-blue-400/15 to-cyan-400/20 blur opacity-50" />

            {/* Modal content */}
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl">
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-200 via-white to-cyan-200 bg-clip-text text-transparent">
                    Update User
                  </h3>
                  <div className="mt-1 text-sm text-slate-400 font-mono">
                    PATCH /users/{`{id: ${editing.id}}`}
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

              {/* Modal body */}
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  <Input
                    label="First Name"
                    value={editing.first_name}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, first_name: e.target.value } : p,
                      )
                    }
                    className="backdrop-blur-sm"
                  />

                  <Input
                    label="Last Name"
                    value={editing.last_name}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, last_name: e.target.value } : p,
                      )
                    }
                    className="backdrop-blur-sm"
                  />

                  <Input
                    label="Middle Name"
                    value={editing.middle_name}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, middle_name: e.target.value } : p,
                      )
                    }
                    className="backdrop-blur-sm"
                  />

                  <Input
                    label="Birthday"
                    value={editing.birthday}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, birthday: e.target.value } : p,
                      )
                    }
                    placeholder="YYYY-MM-DD"
                    className="backdrop-blur-sm"
                  />

                  <Input
                    label="Phone"
                    value={editing.phone}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, phone: e.target.value } : p,
                      )
                    }
                    className="backdrop-blur-sm"
                  />

                  <Input
                    label="Login"
                    value={editing.login}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, login: e.target.value } : p,
                      )
                    }
                    className="backdrop-blur-sm"
                  />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                      ROLE
                    </label>
                    <select
                      className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3 text-slate-100 
                        ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                        hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40"
                      value={editing.role}
                      onChange={(e) =>
                        setEditing((p) =>
                          p ? { ...p, role: e.target.value } : p,
                        )
                      }
                    >
                      <option value="USER" className="bg-slate-900">
                        USER
                      </option>
                      <option value="ADMIN" className="bg-slate-900">
                        ADMIN
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-cyan-300/90 tracking-wider">
                      STATUS
                    </label>
                    <select
                      className="w-full rounded-2xl bg-gradient-to-br from-white/10 via-white/8 to-white/5 px-4 py-3 text-slate-100 
                        ring-1 ring-white/15 backdrop-blur-sm outline-none transition-all duration-300
                        hover:ring-cyan-300/30 focus:ring-2 focus:ring-cyan-300/40"
                      value={String(editing.is_active)}
                      onChange={(e) =>
                        setEditing((p) =>
                          p
                            ? { ...p, is_active: e.target.value === "true" }
                            : p,
                        )
                      }
                    >
                      <option value="true" className="bg-slate-900">
                        ACTIVE
                      </option>
                      <option value="false" className="bg-slate-900">
                        INACTIVE
                      </option>
                    </select>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/8 to-cyan-500/10 p-4 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
                    <div className="text-sm text-slate-300">
                      User ID:{" "}
                      <span className="font-bold text-cyan-300">
                        #{editing.id}
                      </span>
                    </div>
                    <div className="text-slate-600">•</div>
                    <div className="text-sm text-slate-300">
                      Full Name:{" "}
                      <span className="font-medium text-white">
                        {formatFullName(editing)}
                      </span>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:via-blue-500/15 group-hover:to-cyan-500/20 transition-all duration-500"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
