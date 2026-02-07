import { useState } from "react";
import { login } from "../api/auth";

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      onSuccess();
    } catch (e: any) {
      setErr(e?.response?.data?.detail?.[0]?.msg || "Login xato");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#0B1220]">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800"
      >
        <h1 className="text-xl font-semibold text-slate-100 mb-1">
          Login
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          POST /auth/login
        </p>

        {err && (
          <div className="mb-3 rounded-lg bg-red-500/10 p-2 text-sm text-red-300">
            {err}
          </div>
        )}

        <input
          placeholder="login"
          className="mb-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-slate-100 ring-1 ring-slate-800"
          onChange={(e) => setForm({ ...form, login: e.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          className="mb-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-slate-100 ring-1 ring-slate-800"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Kirilmoqda..." : "Login"}
        </button>
      </form>
    </div>
  );
}
