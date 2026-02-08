import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input } from "../Components/ui";
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-slate-950/70 ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      {children}
    </div>
  );
}

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState<User | null>(null);

  async function load() {
    const data = await listUsers({ offset, limit, login: q || undefined });
    setItems(data.items);
    setTotal(data.total);
  }

  useEffect(() => {
    load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;
  const filteredHint = useMemo(() => (q ? `Filter: login="${q}"` : "No filters"), [q]);

  async function onCreate() {
    const created = await createUser({
      ...form,
      role: form.role as any,
      is_active: Boolean(form.is_active),
    });
    setItems((p) => [created, ...p]);
    setForm({ ...emptyForm });
    setTotal((t) => t + 1);
  }

  async function onUpdate() {
    if (!editing) return;

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
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold text-slate-100">Users</div>
            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
              Admin
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-500">
            GET /users • POST /users • PATCH /users/{`{id}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by login..." />
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Full name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Login</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((x) => (
                <tr key={x.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{x.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">
                    {x.last_name} {x.first_name} {x.middle_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{x.login}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{x.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        x.is_active
                          ? "inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 ring-1 ring-emerald-500/20"
                          : "inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-200 ring-1 ring-rose-500/20"
                      }
                    >
                      {x.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" onClick={() => setEditing({ ...x })}>
                        Edit
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
      </Card>

      {/* Create */}
      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="text-sm font-semibold text-slate-100">Create User</div>
            <Badge tone="blue">POST /users</Badge>
          </div>

          <div className="px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="first_name" value={form.first_name} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} />
              <Input label="last_name" value={form.last_name} onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))} />
              <Input label="middle_name" value={form.middle_name} onChange={(e) => setForm((p) => ({ ...p, middle_name: e.target.value }))} />
              <Input label="birthday" value={form.birthday} onChange={(e) => setForm((p) => ({ ...p, birthday: e.target.value }))} placeholder="YYYY-MM-DD" />
              <Input label="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              <Input label="login" value={form.login} onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))} />
              <Input label="password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
              <Input label="role (ADMIN/USER)" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />

              <div className="sm:col-span-1">
                <div className="mb-1 text-xs text-slate-400">status</div>
                <select
                  className="w-full rounded-2xl bg-slate-900/80 px-3 py-2 text-slate-100 ring-1 ring-white/10 focus:outline-none focus:ring-white/20"
                  value={String(form.is_active)}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === "true" }))}
                >
                  <option value="true">O'qiyapdi (active)</option>
                  <option value="false">O'qimayapdi (inactive)</option>
                </select>
              </div>
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
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950/80 ring-1 ring-white/15 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="text-base font-semibold text-slate-100">Update User #{editing.id}</div>
              <Button variant="ghost" onClick={() => setEditing(null)} className="rounded-lg px-2">
                ✕
              </Button>
            </div>

            <div className="px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Input label="first_name" value={editing.first_name} onChange={(e) => setEditing((p) => (p ? { ...p, first_name: e.target.value } : p))} />
                <Input label="last_name" value={editing.last_name} onChange={(e) => setEditing((p) => (p ? { ...p, last_name: e.target.value } : p))} />
                <Input label="middle_name" value={editing.middle_name} onChange={(e) => setEditing((p) => (p ? { ...p, middle_name: e.target.value } : p))} />
                <Input label="birthday" value={editing.birthday} onChange={(e) => setEditing((p) => (p ? { ...p, birthday: e.target.value } : p))} />
                <Input label="phone" value={editing.phone} onChange={(e) => setEditing((p) => (p ? { ...p, phone: e.target.value } : p))} />
                <Input label="login" value={editing.login} onChange={(e) => setEditing((p) => (p ? { ...p, login: e.target.value } : p))} />
                <Input label="role" value={editing.role} onChange={(e) => setEditing((p) => (p ? { ...p, role: e.target.value } : p))} />

                <div className="sm:col-span-3">
                  <div className="mb-1 text-xs text-slate-400">status</div>
                  <select
                    className="w-full rounded-2xl bg-slate-900/80 px-3 py-2 text-slate-100 ring-1 ring-white/10 focus:outline-none focus:ring-white/20"
                    value={String(editing.is_active)}
                    onChange={(e) =>
                      setEditing((p) =>
                        p ? { ...p, is_active: e.target.value === "true" } : p
                      )
                    }
                  >
                    <option value="true">O'qiyapdi (active)</option>
                    <option value="false">O'qimayapdi (inactive)</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                API: <span className="text-slate-300">PATCH /users/{`{id}`}</span>
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
