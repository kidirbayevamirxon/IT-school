import {
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { tokenStore } from "../api/http";
import { Button } from "../Components/ui";

function cx(...s: Array<string | false | undefined>) {
  return s.filter(Boolean).join(" ");
}

function NavItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon?: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={cx(
        "group relative flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition",
        "ring-1 ring-white/10 hover:ring-white/20",
        "bg-white/0 hover:bg-white/5",
        active
          ? "bg-white/10 text-white ring-white/25"
          : "text-slate-200"
      )}
    >
      {/* Active glow */}
      {active && (
        <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-purple-500/20" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {icon ? <span className="opacity-80">{icon}</span> : null}
        <span className="font-medium">{label}</span>
      </span>
    </Link>
  );
}

function RoleBadge({ role }: { role?: string | null }) {
  const r = (role || "").toUpperCase();

  const tone =
    r === "ADMIN"
      ? "from-emerald-500/25 to-emerald-500/5 ring-emerald-500/25 text-emerald-200"
      : "from-sky-500/25 to-sky-500/5 ring-sky-500/25 text-sky-200";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
        "bg-gradient-to-r ring-1",
        tone
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {r || "GUEST"}
    </span>
  );
}

function Avatar({ name = "Admin" }: { name?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-purple-500/15" />
      <span className="relative z-10 text-xs font-semibold text-slate-100">
        {initials || "A"}
      </span>
    </div>
  );
}

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthed = Boolean(tokenStore.access);
  if (!isAuthed)
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );

  function onLogout() {
    tokenStore.clear();
    navigate("/login", { replace: true });
  }

  const role = tokenStore.role || "-";

  return (
    <div className="min-h-screen text-slate-100">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[#070B14]" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute top-20 right-[-120px] h-[520px] w-[520px] rounded-full bg-purple-500/12 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-140px] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-black/25 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar name="Admin" />

              <div className="min-w-[180px]">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold tracking-wide">
                    Admin Panel
                  </div>
                  <RoleBadge role={role} />
                </div>
                <div className="text-xs text-slate-400">
                  Secure dashboard • tokens + refresh
                </div>
              </div>

              {/* Nav */}
              <div className="hidden items-center gap-2 sm:flex">
                <NavItem to="/certificates" label="Certificates" icon={<span>📄</span>} />
                <NavItem to="/courses" label="Courses" icon={<span>🎓</span>} />
                <NavItem to="/users" label="Users" icon={<span>👤</span>} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {/* Mobile nav */}
              <div className="flex items-center gap-2 sm:hidden">
                <NavItem to="/certificates" label="📄" />
                <NavItem to="/courses" label="🎓" />
                <NavItem to="/users" label="👤" />
              </div>

              <Button variant="secondary" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page container */}
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        {/* Content card shell (subtle) */}
        <div className="rounded-[28px] bg-white/[0.02] ring-1 ring-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="rounded-[28px] p-4 sm:p-6">
            <Outlet />
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Admin UI</span>
          <span className="opacity-70">Built with React + Vite</span>
        </div>
      </div>
    </div>
  );
}
