import {
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { tokenStore } from "../api/http";
import { Button, Badge, Card, cn } from "../Components/ui";
import { useState, useEffect } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300",
        "ring-1 ring-white/15 hover:ring-cyan-300/30",
        "bg-gradient-to-br from-white/5 via-white/3 to-transparent",
        "backdrop-blur-sm",
        active
          ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/20 text-white shadow-[0_0_25px_-8px_rgba(34,211,238,0.4)]"
          : "text-slate-200 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:via-blue-500/8 hover:to-purple-500/10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {active && (
        <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-400/30 via-blue-400/20 to-purple-400/30 blur opacity-70" />
      )}

      {isHovered && !active && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-cyan-300/5 via-blue-300/3 to-purple-300/5" />
      )}

      <span className="relative z-10 flex items-center gap-3">
        {icon ? (
          <span className={cn(
            "text-lg transition-transform duration-300",
            active && "scale-110",
            !active && "group-hover:scale-110"
          )}>
            {icon}
          </span>
        ) : null}
        <span className="font-medium tracking-wide">{label}</span>
      </span>
      <div className={cn(
        "absolute left-2 top-2 h-2 w-2 border-l border-t transition-colors duration-300",
        active ? "border-cyan-300/60" : "border-white/30 group-hover:border-cyan-300/40"
      )} />
      <div className={cn(
        "absolute right-2 top-2 h-2 w-2 border-r border-t transition-colors duration-300",
        active ? "border-cyan-300/60" : "border-white/30 group-hover:border-cyan-300/40"
      )} />
    </Link>
  );
}

function RoleBadge({ role }: { role?: string | null }) {
  const r = (role || "GUEST").toUpperCase();
  const [isHovered, setIsHovered] = useState(false);

  const toneMap: Record<string, { bg: string; text: string; glow: string }> = {
    ADMIN: {
      bg: "from-emerald-500/30 via-emerald-500/20 to-emerald-500/30",
      text: "text-emerald-100",
      glow: "rgba(16,185,129,0.4)"
    },
    MODERATOR: {
      bg: "from-amber-500/30 via-amber-500/20 to-amber-500/30",
      text: "text-amber-100",
      glow: "rgba(245,158,11,0.4)"
    },
    USER: {
      bg: "from-blue-500/30 via-blue-500/20 to-blue-500/30",
      text: "text-blue-100",
      glow: "rgba(59,130,246,0.4)"
    },
    GUEST: {
      bg: "from-slate-500/30 via-slate-500/20 to-slate-500/30",
      text: "text-slate-100",
      glow: "rgba(100,116,139,0.3)"
    }
  };

  const tone = toneMap[r] || toneMap.GUEST;

  return (
    <div className="relative">
      <div className={cn(
        "absolute -inset-[1px] rounded-full blur transition-opacity duration-300",
        isHovered ? "opacity-70" : "opacity-40"
      )} style={{ background: `radial-gradient(circle, ${tone.glow} 0%, transparent 70%)` }} />
      
      <span
        className={cn(
          "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide",
          "bg-gradient-to-r ring-1 backdrop-blur-sm transition-all duration-300",
          "ring-white/20 hover:ring-white/30",
          tone.bg,
          tone.text,
          isHovered && "scale-105"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
        {r}
      </span>
    </div>
  );
}

function Avatar({ name = "Admin" }: { name?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "absolute -inset-1 rounded-2xl blur transition-all duration-500",
        isHovered 
          ? "bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 opacity-60"
          : "bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-purple-500/15 opacity-30"
      )} />

      <div className={cn(
        "relative grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300",
        "bg-gradient-to-br from-white/10 via-white/8 to-white/5",
        "backdrop-blur-sm ring-1 ring-white/20",
        isHovered && "scale-105 ring-cyan-300/30"
      )}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <span className={cn(
          "relative z-10 text-sm font-bold tracking-wider transition-all duration-300",
          "bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent",
          isHovered && "scale-110"
        )}>
          {initials || "A"}
        </span>
        <div className="absolute left-2 top-2 h-2 w-2 border-l border-t border-cyan-300/40 rounded-tl" />
        <div className="absolute right-2 top-2 h-2 w-2 border-r border-t border-cyan-300/40 rounded-tr" />
        <div className="absolute left-2 bottom-2 h-2 w-2 border-l border-b border-cyan-300/30 rounded-bl" />
        <div className="absolute right-2 bottom-2 h-2 w-2 border-r border-b border-cyan-300/30 rounded-br" />
      </div>
    </div>
  );
}

function FloatingParticles() {
  const [particles] = useState(() => 
    Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
  );

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-cyan-300/20 via-blue-300/15 to-purple-300/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  );
}

function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsOnline(false);
        setTimeout(() => setIsOnline(true), 1000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-white/8 to-white/5 backdrop-blur-sm ring-1 ring-white/10">
      <div className="relative flex h-2 w-2">
        <div className={cn(
          "absolute h-full w-full rounded-full animate-ping",
          isOnline ? "bg-emerald-400/40" : "bg-rose-400/40"
        )} />
        <div className={cn(
          "relative h-2 w-2 rounded-full",
          isOnline ? "bg-emerald-400" : "bg-rose-400"
        )} />
      </div>
      <span className="text-xs font-medium text-slate-300">
        {isOnline ? "CONNECTED" : "RECONNECTING"}
      </span>
    </div>
  );
}

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const isAuthed = Boolean(tokenStore.access);
  if (!isAuthed)
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  function onLogout() {
    tokenStore.clear();
    navigate("/login", { replace: true });
  }

  const role = tokenStore.role || "-";
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="min-h-screen text-slate-100 bg-[#050812]">
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-[#050812] via-[#0A0F1F] to-[#071225]" />
      <div className="fixed inset-0 -z-30 opacity-40">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/15 blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-gradient-to-r from-blue-500/15 to-fuchsia-500/10 blur-3xl"
             style={{ animation: 'float 25s infinite ease-in-out' }} />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/8 blur-3xl"
             style={{ animation: 'float 30s infinite ease-in-out reverse' }} />
      </div>
      <div className="fixed inset-0 -z-20 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34,211,238,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34,211,238,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>
      <FloatingParticles />
      <div className="sticky top-0 z-50 border-b border-white/5 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name="KUNGRAD IT SCHOOL" />
              <div className="min-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur opacity-40"></div>
                    <h1 className="relative text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
                      KUNGRAD IT SCHOOL 
                    </h1>
                  </div>
                  <RoleBadge role={role} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>TECHFLOW</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-cyan-300/80">K.A.R</span>
                </div>
              </div>
              <div className="hidden items-center gap-2 ml-6 sm:flex">
                <NavItem 
                  to="/certificates" 
                  label="Certificates" 
                  icon={<span className="text-cyan-300">📄</span>} 
                />
                <NavItem 
                  to="/courses" 
                  label="Courses" 
                  icon={<span className="text-blue-300">🎓</span>} 
                />
                <NavItem 
                  to="/users" 
                  label="Users" 
                  icon={<span className="text-purple-300">👤</span>} 
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="hidden items-center gap-4 sm:flex">
                <StatusIndicator />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-white/8 to-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <span className="text-xs font-mono text-slate-300">{formattedTime}</span>
                  <span className="text-[10px] text-slate-500 font-mono">UTC</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:hidden">
                <NavItem to="/certificates" label="📄" />
                <NavItem to="/courses" label="🎓" />
                <NavItem to="/users" label="👤" />
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-orange-500/15 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                <Button 
                  variant="danger" 
                  onClick={onLogout}
                  className="relative backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    Logout
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-[32px] bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-500/20 blur-xl opacity-30" />
          <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-r from-cyan-400/15 via-blue-400/10 to-purple-400/15 blur opacity-40" />
          <Card 
            glowing 
            hoverable 
            className="relative rounded-[32px] p-6 md:p-8 border-none bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent"
          >
            <div className="absolute left-0 top-0 h-24 w-24 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent blur-xl" />
            <div className="absolute right-0 bottom-0 h-24 w-24 bg-gradient-to-tl from-purple-500/10 via-transparent to-transparent blur-xl" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage your cosmic resources efficiently
                  </p>
                </div>
                <div className="hidden items-center gap-3 md:flex">
                  <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/8 to-purple-500/10 px-4 py-2 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">Active Sessions</div>
                    <div className="text-lg font-bold text-white">24</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-green-500/8 to-teal-500/10 px-4 py-2 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">Uptime</div>
                    <div className="text-lg font-bold text-white">99.8%</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-transparent p-4 md:p-6 ring-1 ring-white/10">
                <Outlet />
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Cosmic UI v2</span>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <span className="hidden text-slate-400 sm:inline">Built with React + Vite + Quantum CSS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
              <span className="text-slate-400">System Status:</span>
              <span className="text-emerald-300 font-medium">OPTIMAL</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge tone="cosmic" pulsating>
                LIVE
              </Badge>
              <Badge tone="cyan">
                QUANTUM
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 left-6 h-4 w-4 border-l-2 border-b-2 border-cyan-300/30 rounded-bl opacity-60" />
      <div className="fixed bottom-6 right-6 h-4 w-4 border-r-2 border-b-2 border-cyan-300/30 rounded-br opacity-60" />
      <div className="fixed top-6 left-6 h-4 w-4 border-l-2 border-t-2 border-cyan-300/30 rounded-tl opacity-60" />
      <div className="fixed top-6 right-6 h-4 w-4 border-r-2 border-t-2 border-cyan-300/30 rounded-tr opacity-60" />
    </div>
  );
}

const globalStyles = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -20px) rotate(5deg); }
    50% { transform: translate(-15px, 10px) rotate(-5deg); }
    75% { transform: translate(5px, 15px) rotate(3deg); }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
`;
