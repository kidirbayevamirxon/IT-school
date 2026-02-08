import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { Button, Badge } from "../Components/ui";

function cn(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

export default function LoginPage() {
  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, size: number}>>([]);
  const [flicker, setFlicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nav = useNavigate();
  const loc = useLocation() as any;

  useEffect(() => {
    if (!containerRef.current) return;

    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
      });
    }
    setParticles(newParticles);
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 50 + Math.random() * 100);
      }
    }, 1000);

    return () => clearInterval(flickerInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx) % 100,
        y: (p.y + p.vy) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      const next = loc?.state?.from || "/certificates";
      nav(next, { replace: true });
    } catch (e: any) {
      setErr(
        e?.response?.data?.detail?.[0]?.msg ||
          e?.response?.data?.detail ||
          "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#04070F]">
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-300/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(34, 211, 238, 0.2)`,
              animation: `twinkle ${1 + Math.random() * 2}s infinite alternate`
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div 
          className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/10 blur-3xl" 
          style={{ animation: 'float 20s infinite ease-in-out' }}
        />
        <div 
          className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-blue-500/15 to-fuchsia-500/15 blur-3xl" 
          style={{ animation: 'float 25s infinite ease-in-out reverse' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#04070F] via-[#0A1120] to-[#071225]" />
      </div>
      <div className={`pointer-events-none absolute inset-0 opacity-[0.03] ${flicker ? 'opacity-[0.06]' : ''}`} 
           style={{ 
             backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(34, 211, 238, 0.1) 1px, rgba(34, 211, 238, 0.1) 2px)`,
             backgroundSize: '100% 4px',
             animation: 'scan 8s linear infinite'
           }} 
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)'
        }} />
      </div>
      <div className="relative z-30 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30"></div>
            <div className="relative h-10 w-10 grid place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 ring-1 ring-cyan-300/30 backdrop-blur-sm"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
              }}
            >
              <span className="text-xs font-extrabold text-cyan-300 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                IT
              </span>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
            </div>
          </div>

          <div className="leading-tight">
            <div className="text-[10px] tracking-[0.35em] text-slate-400 font-mono">
              KUNGRAD IT SCHOOL
            </div>
            <div className="text-sm font-semibold text-white">
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                LOGIN PORTAL
              </span>
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-20"></div>
            <Badge tone="cyan" className="relative backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300"></span>
                </span>
                ONLINE
              </span>
            </Badge>
          </div>
        </div>
      </div>
      <div className="relative z-20 grid min-h-[calc(100vh-96px)] place-items-center px-4 pb-10">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-[3px] rounded-[40px] bg-gradient-to-r from-cyan-500/50 via-blue-500/30 to-purple-500/30 blur-xl opacity-60 animate-pulse" style={{animationDuration: '3s'}} />
          <div className="absolute -inset-[2px] rounded-[40px] bg-gradient-to-r from-cyan-400/40 via-blue-400/20 to-purple-400/20 blur-lg" />
          <form
            onSubmit={submit}
            className={cn(
              "relative overflow-hidden rounded-[40px] p-8 md:p-9",
              "bg-gradient-to-br from-[#071225]/80 via-[#0A1120]/90 to-[#071225]/80",
              "ring-1 ring-white/10 ring-inset",
              "shadow-2xl backdrop-blur-xl",
              "border border-white/5"
            )}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 30% 30%, rgba(34,211,238,0.3) 0px, transparent 50%),
                                 radial-gradient(circle at 70% 70%, rgba(59,130,246,0.2) 0px, transparent 50%)`,
                backgroundSize: '200% 200%',
                animation: 'moveGradient 15s ease infinite'
              }} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent opacity-20" />
            <div className="mb-8 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] tracking-[0.35em] text-cyan-300/70 font-mono">
                    QUANTUM AUTH
                  </div>
                  <div className="mt-3 text-3xl font-bold text-white">
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Access Terminal
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    Enter your credentials to continue
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge tone="cyan" className="backdrop-blur-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300"></span>
                      </span>
                      SECURE
                    </span>
                  </Badge>
                  <div className="text-[10px] text-slate-500 font-mono">v2.1.7</div>
                </div>
              </div>
              <div className="mt-6 relative">
                <div className="absolute -inset-x-1 -inset-y-0.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur rounded-2xl"></div>
                <div className="relative flex items-center justify-between rounded-2xl bg-white/3 px-5 py-3.5 ring-1 ring-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-20"></div>
                      <div className="relative h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-green-400"></div>
                    </div>
                    <div className="text-[12px] text-slate-300 font-mono">
                      session: <span className="text-cyan-300">initializing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {err && (
              <div className="mb-6 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-rose-500/15 to-pink-500/10 p-4 text-sm text-rose-100 ring-1 ring-rose-500/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-rose-400"></div>
                    <span className="font-semibold">ALERT:</span>
                    <span>{err}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-5">
              <CosmicField
                label="login"
                placeholder="your_username"
                value={form.login}
                onChange={(v) => setForm((p) => ({ ...p, login: v }))}
              />
              <CosmicField
                label="password"
                placeholder="••••••••••••"
                type="password"
                value={form.password}
                onChange={(v) => setForm((p) => ({ ...p, password: v }))}
              />
            </div>

            <div className="mt-8 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              <Button 
                className="w-full relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 animate-bounce">SEND</span>
                    <span className="h-2 w-2 rounded-full bg-cyan-300 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="h-2 w-2 rounded-full bg-cyan-300 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    INITIATING...
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent font-semibold">
                    SEND
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                <span className="text-cyan-300/90 hover:text-cyan-200 cursor-pointer transition-colors">Forgot Password?</span>
                <span className="text-slate-700">•</span>
                <span className="text-blue-300/90 hover:text-blue-200 cursor-pointer transition-colors">Create Account</span>
                <span className="text-slate-700">•</span>
                <span className="text-purple-300/90 hover:text-purple-200 cursor-pointer transition-colors">Support</span>
              </div>
            </div>

            <div className="pointer-events-none absolute left-6 top-6 h-4 w-4 border-l-2 border-t-2 border-cyan-300/40" />
            <div className="pointer-events-none absolute right-6 top-6 h-4 w-4 border-r-2 border-t-2 border-cyan-300/40" />
            <div className="pointer-events-none absolute left-6 bottom-6 h-4 w-4 border-l-2 border-b-2 border-cyan-300/30" />
            <div className="pointer-events-none absolute right-6 bottom-6 h-4 w-4 border-r-2 border-b-2 border-cyan-300/30" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 blur-2xl animate-pulse" style={{animationDuration: '4s'}} />
          </form>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span>STATUS: <span className="text-green-400">READY</span></span>
              <span>ENCRYPTION: <span className="text-cyan-400">AES-256</span></span>
              <span>LATENCY: <span className="text-blue-400">12ms</span></span>
            </div>
            <div>
              <span className="text-slate-600">© 2024 COSMIC UI v2</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.9); }
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes moveGradient {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function CosmicField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label className="block group">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[12px] font-semibold tracking-widest text-cyan-300/90 font-mono">
          {label.toUpperCase()}
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          <span className="text-slate-400">required</span>
        </div>
      </div>

      <div className="relative">
        <div className={`absolute -inset-[1px] rounded-[20px] transition-all duration-500 ${isFocused 
          ? 'bg-gradient-to-r from-cyan-500/50 via-blue-500/30 to-purple-500/30 blur-lg opacity-70' 
          : 'bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/10 blur opacity-30'
        }`} />
        <div
          className={`relative overflow-hidden rounded-[20px] transition-all duration-300 ${
            isFocused 
              ? 'bg-gradient-to-br from-white/10 to-white/5 ring-2 ring-cyan-300/30' 
              : 'bg-white/5 ring-1 ring-white/10'
          }`}
          style={{
            clipPath: "polygon(0% 0%, 95% 0%, 100% 25%, 100% 100%, 5% 100%, 0% 75%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
          {isFocused && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-pulse" />
          )}
          <input
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-slate-400/60",
              "font-mono tracking-wide",
              "transition-all duration-300",
              "focus:placeholder:text-cyan-300/30"
            )}
          />
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full transition-all duration-300 ${
            value.length > 0 ? 'bg-gradient-to-r from-green-400 to-cyan-400 shadow-glow' : 'bg-slate-600'
          }`}>
            {value.length > 0 && (
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-cyan-400/30 rounded-full blur" />
            )}
          </div>
          <div className={`pointer-events-none absolute left-4 top-4 h-2.5 w-2.5 border-l border-t transition-colors duration-300 ${
            isFocused ? 'border-cyan-300/60' : 'border-cyan-300/30'
          }`} />
          <div className={`pointer-events-none absolute right-4 top-4 h-2.5 w-2.5 border-r border-t transition-colors duration-300 ${
            isFocused ? 'border-cyan-300/60' : 'border-cyan-300/30'
          }`} />
          <div className={`pointer-events-none absolute left-4 bottom-4 h-2.5 w-2.5 border-l border-b transition-colors duration-300 ${
            isFocused ? 'border-cyan-300/40' : 'border-cyan-300/20'
          }`} />
          <div className={`pointer-events-none absolute right-4 bottom-4 h-2.5 w-2.5 border-r border-b transition-colors duration-300 ${
            isFocused ? 'border-cyan-300/40' : 'border-cyan-300/20'
          }`} />

          <div className="absolute bottom-0 left-1/2 h-px w-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transition-all duration-500 group-hover:w-full group-hover:left-0" />
        </div>

        {type !== 'password' && (
          <div className="absolute -bottom-6 right-2 text-[10px] text-slate-500 font-mono">
            {value.length}/32
          </div>
        )}
      </div>
    </label>
  );
}