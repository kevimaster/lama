import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Clock, Heart, Laugh, ThumbsUp, X, LogOut, Gift, ArrowRight, AlertCircle, RotateCcw, ChevronDown } from "lucide-react";

// --- Utilidades ---
const fmtTime = (s) => {
  const total = Math.floor(s);
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const EMOJIS = [
  "😂","👍","❤️","🔥","⭐️","🎁","🎉","😮","🐶","🍔","💃","🧠","🥇","⚡️","😻","🪙"
];

const FEED_SNIPPETS = [
  "10 hacks para ser más productivo (el #7 te sorprenderá)",
  "Video corto: gato hace parkour en la cocina",
  "¿Deberíamos temer a la IA Generativa? Debate en 30 segundos",
  "Memes del día: colección curada",
  "Reto de baile: aprende 3 pasos en 15s",
  "Top 5 apps para dormir mejor — hilo 🧵",
  "Noticia urgente: algo pasó en algún lugar",
  "Tutorial relámpago: organiza tu vida en 60s",
  "Encuesta: ¿Qué prefieres ver ahora?",
  "Directo: reacciona a reacciones de reacciones"
];

const NOTIF_POOL = [
  { title: "Nuevo Me Gusta", body: "A 12 personas les encantó tu último giro" },
  { title: "Tendencia", body: "Tu racha sube un 15% si haces otro scroll" },
  { title: "Recompensa sorpresa", body: "Desbloquea un sticker si giras ahora" },
  { title: "No te lo pierdas", body: "Quedan 45s para entrar al evento en vivo" },
  { title: "Alerta de streak", body: "Mantén tu racha activa con un toque" }
];

export default function App() {
  // Estado principal
  const [seconds, setSeconds] = useState(0); // tiempo de vida gastado
  const [multiplier, setMultiplier] = useState(1); // aceleración del cronómetro
  const [dopamine, setDopamine] = useState(0); // micro-recompensas acumuladas
  const [streak, setStreak] = useState(0); // racha de interacciones
  const [reels, setReels] = useState(["💤","💤","💤"]);
  const [spinning, setSpinning] = useState(false);
  const [bursts, setBursts] = useState([]); // partículas efímeras
  const [notifs, setNotifs] = useState([]); // notificaciones push internas
  const [showExit, setShowExit] = useState(false); // modal de salida (fricción)
  const [showOpportunity, setShowOpportunity] = useState(false); // modal costo oportunidad
  const [feedItems, setFeedItems] = useState(() => Array.from({ length: 18 }, () => FEED_SNIPPETS[rand(0, FEED_SNIPPETS.length - 1)]));
  const feedRef = useRef(null);

  const captureLevel = Math.min(100, Math.round((multiplier - 1) * 25)); // 0..100

  // Cronómetro con aceleración variable
  useEffect(() => {
    const iv = setInterval(() => {
      setSeconds((s) => s + (0.2 * multiplier));
      // ligera relajación del multiplicador hacia 1
      setMultiplier((m) => (m > 1 ? Math.max(1, m * 0.9985) : 1));
    }, 200);
    return () => clearInterval(iv);
  }, [multiplier]);

  // Generador de notificaciones persuasivas
  useEffect(() => {
    const iv = setInterval(() => {
      // probabilidad aumenta con el nivel de captura
      const p = 0.2 + captureLevel / 200; // 0.2..0.7 aprox
      if (Math.random() < p) {
        const n = { id: crypto.randomUUID(), ...NOTIF_POOL[rand(0, NOTIF_POOL.length - 1)] };
        setNotifs((ns) => [...ns, n]);
      }
    }, 4000);
    return () => clearInterval(iv);
  }, [captureLevel]);

  // Manejo de scroll infinito en el feed
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
      if (nearBottom) {
        setFeedItems((items) => [
          ...items,
          ...Array.from({ length: 10 }, () => FEED_SNIPPETS[rand(0, FEED_SNIPPETS.length - 1)])
        ]);
        // cada “carga” refuerza la captura
        setMultiplier((m) => Math.min(8, m + 0.12));
        setStreak((s) => s + 1);
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setStreak((s) => s + 1);
    setMultiplier((m) => Math.min(8, m + 0.25));

    let t = 0;
    const spinIv = setInterval(() => {
      setReels([EMOJIS[rand(0, EMOJIS.length - 1)], EMOJIS[rand(0, EMOJIS.length - 1)], EMOJIS[rand(0, EMOJIS.length - 1)]]);
      t += 100;
      if (t > 1200 + rand(0, 500)) {
        clearInterval(spinIv);
        setSpinning(false);
        // recompensa efímera
        const rewardBoost = Math.random() < 0.8 ? 1 : 2;
        setDopamine((d) => d + rewardBoost);
        setBursts((bs) => [
          ...bs,
          { id: crypto.randomUUID(), x: rand(10, 90), y: rand(30, 60), emoji: Math.random() < 0.5 ? "❤️" : "😂" }
        ]);
        // limpiar burst luego
        setTimeout(() => setBursts((bs) => bs.slice(1)), 1200);
      }
    }, 100);
  };

  const handleNotifClick = (id) => {
    setNotifs((ns) => ns.filter((n) => n.id !== id));
    setMultiplier((m) => Math.min(8, m + 0.1));
    setStreak((s) => s + 1);
    setDopamine((d) => d + 1);
  };

  const resetAll = () => {
    setSeconds(0);
    setMultiplier(1);
    setDopamine(0);
    setStreak(0);
    setReels(["💤","💤","💤"]);
    setBursts([]);
    setNotifs([]);
    setShowExit(false);
    setShowOpportunity(false);
    setFeedItems(Array.from({ length: 18 }, () => FEED_SNIPPETS[rand(0, FEED_SNIPPETS.length - 1)]));
    if (feedRef.current) feedRef.current.scrollTop = 0;
  };

  // Cálculo del costo de oportunidad
  const opp = useMemo(() => {
    const mins = seconds / 60;
    const pages = Math.floor(mins * 0.8); // ~0.8 pág/min a ritmo tranquilo
    const steps = Math.floor(mins * 100); // ~100 pasos/min
    const pomodoros = (mins / 25).toFixed(1);
    const chats = Math.floor(mins / 15);
    const breaths = Math.floor(mins * 6);
    return { mins: Math.floor(mins), pages, steps, pomodoros, chats, breaths };
  }, [seconds]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Barra superior */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6" aria-hidden />
            <h1 className="text-xl font-semibold">El Casino de la Atención</h1>
            <span className="text-sm text-slate-500">(No se puede ganar)</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2" aria-live="polite" aria-atomic>
              <Clock className="w-5 h-5" aria-hidden />
              <span className="font-mono tabular-nums text-lg" title="Tiempo de vida gastado">{fmtTime(seconds)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2" title="Nivel de captura">
              <span className="text-sm text-slate-500">Captura</span>
              <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={captureLevel} aria-label="Nivel de captura">
                <div className="h-full bg-rose-500" style={{ width: `${captureLevel}%` }} />
              </div>
            </div>
            <button onClick={() => setShowExit(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400" aria-label="Intentar salir">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Intentar salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot machine */}
        <section className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-fuchsia-500" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100"><Bell className="w-4 h-4 text-rose-600" aria-hidden /></span>
                Máquina de micro-recompensas
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1" title="Dopamina acumulada">
                  <Heart className="w-4 h-4 text-rose-600" aria-hidden />
                  <span className="tabular-nums">{dopamine}</span>
                </div>
                <div className="flex items-center gap-1" title="Racha de interacciones">
                  <TrendingIcon />
                  <span className="tabular-nums">{streak}</span>
                </div>
                <div className="flex items-center gap-1" title="Aceleración del tiempo">
                  <ArrowRight className="w-4 h-4" aria-hidden />
                  <span className="tabular-nums">×{multiplier.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Reels */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-200">
              {reels.map((r, i) => (
                <div key={i} className={`aspect-[4/3] rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center text-5xl md:text-6xl select-none ${spinning ? "animate-pulse" : ""}`}
                     aria-label={`Riel ${i+1} ${spinning ? "girando" : "detenido"}`}>
                  <span className="drop-shadow-sm">{r}</span>
                </div>
              ))}
            </div>

            {/* Controles */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={handleSpin} disabled={spinning} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-600 text-white font-semibold shadow hover:bg-rose-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-400">
                <ArrowRight className="w-5 h-5" aria-hidden />
                {spinning ? "Girando…" : "Girar (scroll/like/notify)"}
              </button>
              <button onClick={resetAll} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400">
                <RotateCcw className="w-5 h-5" aria-hidden />
                Reiniciar
              </button>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" aria-hidden />
                <span>La máquina no tiene premio final. Solo gasta tiempo.</span>
              </div>
            </div>

            {/* Bursts (partículas) */}
            <div className="pointer-events-none absolute inset-0">
              {bursts.map((b) => (
                <div key={b.id} className="absolute text-4xl md:text-5xl animate-float" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
                  {b.emoji}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feed infinito (scroll) */}
        <aside className="lg:col-span-1">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm h-[560px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold">Feed infinito</h3>
              <span className="text-xs text-slate-500">Desliza para cargar más</span>
            </div>
            <div ref={feedRef} className="flex-1 overflow-y-auto p-3 space-y-3" aria-label="Feed infinito">
              {feedItems.map((txt, idx) => (
                <article key={idx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
                  <div className="text-sm text-slate-600 mb-2 line-clamp-2">{txt}</div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <button onClick={() => { setDopamine((d)=>d+1); setMultiplier((m)=>Math.min(8,m+0.05)); setStreak((s)=>s+1); }}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-100">
                      <ThumbsUp className="w-3.5 h-3.5" aria-hidden /> Like
                    </button>
                    <button onClick={() => { setMultiplier((m)=>Math.min(8,m+0.06)); setStreak((s)=>s+1); setDopamine((d)=>d+1); }}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-100">
                      <Laugh className="w-3.5 h-3.5" aria-hidden /> Meme
                    </button>
                    <button onClick={() => { setMultiplier((m)=>Math.min(8,m+0.08)); setStreak((s)=>s+1); }}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-100">
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden /> Ver más
                    </button>
                  </div>
                </article>
              ))}
              <div className="py-6 text-center text-xs text-slate-400">Cargando más… sigue bajando</div>
            </div>
          </div>
        </aside>
      </main>

      {/* Notificaciones tipo push */}
      <div className="fixed top-20 right-4 z-40 space-y-2 w-72" aria-live="polite" aria-atomic>
        {notifs.slice(-4).map((n) => (
          <div key={n.id} className="rounded-2xl border border-slate-200 bg-white shadow-lg p-3">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-rose-600 mt-0.5" aria-hidden />
              <div className="flex-1">
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-xs text-slate-600">{n.body}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => handleNotifClick(n.id)} className="text-xs px-2 py-1 rounded-full bg-rose-600 text-white hover:bg-rose-700">Abrir</button>
                  <button onClick={() => setNotifs((ns)=>ns.filter((x)=>x.id!==n.id))} className="text-xs px-2 py-1 rounded-full border border-slate-300 hover:bg-slate-100">Ignorar</button>
                </div>
              </div>
              <button onClick={() => setNotifs((ns)=>ns.filter((x)=>x.id!==n.id))} className="p-1 rounded-full hover:bg-slate-100" aria-label="Cerrar notificación">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de fricción para salir */}
      {showExit && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-rose-600" aria-hidden />
              <h4 className="text-lg font-semibold">¿Seguro que quieres salir?</h4>
            </div>
            <p className="text-slate-600 text-sm">Antes de irte, hay una última sorpresa esperándote. También estás a un paso de batir tu racha. (Este tipo de fricciones son comunes para retener tu atención).</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={() => { setShowExit(false); setMultiplier((m)=>Math.min(8,m+0.4)); setStreak((s)=>s+1); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-600 text-white font-semibold hover:bg-rose-700">
                <Gift className="w-4 h-4" aria-hidden />
                Seguir jugando
              </button>
              <button onClick={() => { setShowExit(false); setShowOpportunity(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-100">
                <LogOut className="w-4 h-4" aria-hidden />
                Salir de verdad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de costo de oportunidad (Giro crítico) */}
      {showOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-semibold mb-1">Giro crítico: el costo de oportunidad</h4>
                <p className="text-slate-600 text-sm">El juego no tiene fin ni premio. Esto es lo que podrías haber hecho en el mundo real con <span className="font-semibold">{opp.mins} minutos</span>:</p>
              </div>
              <button onClick={() => setShowOpportunity(false)} className="p-2 rounded-full hover:bg-slate-100" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OppCard title="Leer" value={`${opp.pages} páginas`} subtitle="(~0.8 pág/min)" emoji="📖" />
              <OppCard title="Caminar" value={`${opp.steps.toLocaleString()} pasos`} subtitle="(~100 pasos/min)" emoji="🚶" />
              <OppCard title="Pomodoros" value={`${opp.pomodoros} × 25 min`} subtitle="profundos" emoji="🍅" />
              <OppCard title="Conversaciones" value={`${opp.chats} charlas`} subtitle="(~15 min c/u)" emoji="🗣️" />
              <OppCard title="Respiraciones conscientes" value={`${opp.breaths.toLocaleString()} ciclos`} subtitle="(~6/min)" emoji="🧘" />
              <OppCard title="Diario personal" value={`${Math.max(1, Math.floor(opp.mins/10))} entradas`} subtitle="(~10 min c/u)" emoji="✍️" />
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Propuesta de acción:</span> activa un minuto de respiración, escribe una idea en tu cuaderno o envía un mensaje afectuoso a alguien. La atención es un recurso finito: decide dónde la inviertes.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 justify-between">
              <button onClick={() => { setShowOpportunity(false); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-100">
                Cerrar
              </button>
              <button onClick={resetAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                Reiniciar con intención
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos auxiliares */}
      <style>{`
        @keyframes floatUp { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-60px); opacity: 0; } }
        .animate-float { animation: floatUp 1.1s ease-out forwards; }
      `}</style>

      {/* Pie de página didáctico */}
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-xs text-slate-500">
        <p>
          Este artefacto pedagógico simula mecanismos de <em>captura de atención</em>: refuerzo variable, fricción de salida, feeds infinitos y notificaciones persuasivas. El objetivo no es ganar, sino <strong>tomar conciencia</strong> del tiempo de vida que se invierte.
        </p>
      </footer>
    </div>
  );
}

function OppCard({ title, value, subtitle, emoji }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
    </div>
  );
}

function TrendingIcon() {
  // icono simple con CSS para evitar dependencia si faltara Lucide específico
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17l6-6 4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
