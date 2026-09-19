/**
 * ============================================================================
 * EL ENSAMBLAJE — Cartografía de una decisión periodística
 * LAMA · Laboratorio de Mediaciones Algorítmicas · Universidad del Valle
 * ============================================================================
 *
 * TEMA VISUAL: "Plano Nocturno" (theme-factory)
 *   Mesa de trazado nocturna: tinta fría, trazas de fósforo, rótulos de
 *   máquina. La decisión que el estudiante reconstruye es un acto de
 *   instrumentación —una plataforma midiendo lectores— y la interfaz lo dice:
 *   no es papel sepia de archivo, es un plano de levantamiento bajo luz de
 *   instrumento.
 *
 * REGLAS DE COLOR (verificadas, no improvisadas)
 *   · Tres hues categóricos para las tres dimensiones del ensamblaje, validados
 *     con dataviz/validate_palette.js contra la superficie oscura: banda de
 *     luminosidad, piso de croma, separación CVD, piso de visión normal y
 *     contraste ≥3:1 — los cinco en PASS.
 *   · Los CUATRO tipos de relación NO son un cuarto eje de color: siete hues
 *     categóricos fallan la separación CVD. Se codifican por PATRÓN DE TRAZO
 *     (continuo · punteado · discontinuo · grueso con punta) más el rótulo que
 *     cada arista ya lleva. El color de las aristas es una sola tinta neutra,
 *     salvo "tensiona", que toma el ámbar reservado de advertencia.
 *   · El cálido es señal, nunca superficie.
 * ============================================================================
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ───────────────────────────── TOKENS DEL TEMA ───────────────────────────── */

const T = {
  void:       "#0B1016",
  surface:    "#121A23",
  raised:     "#18222D",
  raisedHi:   "#1E2A37",
  hairline:   "rgba(147,169,196,0.16)",
  grid:       "rgba(147,169,196,0.07)",

  ink:        "#EAF0F6",
  inkSec:     "#A9BACD",
  inkMuted:   "#6F8399",

  trace:      "#93A9C4",
  warn:       "#F2B441",
  good:       "#45C98A",

  display:    "'Bricolage Grotesque', 'Helvetica Neue', sans-serif",
  body:       "'Newsreader', Georgia, serif",
  mono:       "'IBM Plex Mono', ui-monospace, monospace",
};

/* ────────────────── DATOS DEL CASO (sin cambios) ─────────────────── */

const CASO = {
  titulo: "El Faro Verifica y el convenio con VeritasNet",
  contexto: `El Faro Verifica es un medio nativo independiente especializado en verificación de noticias, fundado en 2019 en Medellín. Con seis periodistas, es el único verificador independiente de Antioquia con presencia territorial en zonas de conflicto. En 2023, VeritasNet —la red global de distribución de contenidos de una de las plataformas más grandes del mundo— les ofrece convertirse en verificador oficial para Colombia: recursos económicos, visibilidad y herramientas técnicas a cambio de un acceso: la plataforma podrá rastrear en tiempo real cómo los usuarios interactúan con las verificaciones publicadas en el propio sitio de El Faro —qué verificaciones se leen completas, cuáles se abandonan a mitad, qué tipo de desinformación genera más clics, qué emociones activan las distintas narrativas falsas. El equipo debate: esos datos permitirán a VeritasNet optimizar sus propios sistemas de moderación y, eventualmente, sus algoritmos de amplificación de contenido. El medio estaría trabajando como laboratorio de comportamiento gratuito para la misma empresa que lucra con la desinformación que ellos verifican. Sin embargo, sin el acuerdo, El Faro Verifica no sobrevive el siguiente semestre. Aceptan.`,
  pregunta: "¿Qué configuración de factores produjo esta decisión y a quién beneficia realmente el ensamblaje resultante?",
};

const NODOS_DISPONIBLES = [
  { id: "n1",  categoria: "estructural",    label: "Concentración mediática en Colombia",    descripcion: "8 conglomerados controlan el 78% de la audiencia. Los medios independientes existen en los márgenes de esa estructura.",                                                               icono: "🏛️" },
  { id: "n2",  categoria: "estructural",    label: "Brecha de conectividad territorial",      descripcion: "La cobertura del conflicto en zonas rurales choca con la infraestructura digital que no llega.",                                                                                         icono: "📡" },
  { id: "n3",  categoria: "estructural",    label: "Poder de las plataformas globales",       descripcion: "VeritasNet controla qué contenidos se distribuyen y a quién llegan. No tiene redacción pero actúa como editor silencioso. Sus datos sobre comportamiento de usuarios valen más que cualquier contenido.", icono: "🌐" },
  { id: "n4",  categoria: "estructural",    label: "Precariedad del ecosistema publicitario", descripcion: "La pauta migró a plataformas digitales. Los medios independientes pierden la fuente de ingresos tradicional.",                                                                             icono: "💸" },
  { id: "n5",  categoria: "estructural",    label: "Contexto de democracia deficitaria",      descripcion: "Instituciones formales coexisten con clientelismo. El periodismo crítico opera bajo presión política constante.",                                                                           icono: "⚖️" },
  { id: "n6",  categoria: "relacional",     label: "Red de colaboración con medios regionales", descripcion: "El Faro trabaja con cinco medios pequeños del Eje Cafetero. Comparten fuentes, metodologías y costos.",                                                                                 icono: "🤝" },
  { id: "n7",  categoria: "relacional",     label: "Vínculo con comunidades en conflicto",    descripcion: "Fuentes construidas durante años de trabajo territorial. Confianza no transferible a ningún algoritmo.",                                                                                   icono: "✊" },
  { id: "n8",  categoria: "relacional",     label: "Relación con organismos de cooperación",  descripcion: "Financiamiento de la GIZ y Open Society. Dependencia que diversifica sin colonizar (por ahora).",                                                                                         icono: "🌍" },
  { id: "n9",  categoria: "relacional",     label: "Convenio verificador con VeritasNet",     descripcion: "La plataforma ofrece recursos a cambio de acceso a datos de comportamiento. El medio trabaja como laboratorio gratuito para quien lucra con la desinformación que ellos combaten.",      icono: "🔗" },
  { id: "n10", categoria: "relacional",     label: "Presión de audiencias digitales",          descripcion: "Los lectores esperan contenido en formatos de plataforma. La demanda moldea la producción antes que el algoritmo.",                                                                       icono: "👥" },
  { id: "n11", categoria: "organizacional", label: "Modelo editorial: periodismo lento",       descripcion: "Investigaciones de largo plazo que requieren tiempo y dinero. Tensión permanente con el ciclo noticioso digital.",                                                                         icono: "🗞️" },
  { id: "n12", categoria: "organizacional", label: "Equipo pequeño, contratos inestables",     descripcion: "6 periodistas, solo 2 con contratos indefinidos. La precariedad laboral limita directamente qué periodismo es posible.",                                                                  icono: "👩‍💻" },
  { id: "n13", categoria: "organizacional", label: "Cultura organizacional de independencia",  descripcion: "Principio fundacional: ninguna fuente de financiamiento puede colonizar las decisiones editoriales.",                                                                                     icono: "🧭" },
  { id: "n14", categoria: "organizacional", label: "Imaginario algorítmico del equipo",        descripcion: "Los verificadores empiezan a anticipar qué tipos de desinformación generan más engagement en VeritasNet y priorizan esos casos. El algoritmo ya moldea la agenda de verificación.",      icono: "🧠" },
  { id: "n15", categoria: "organizacional", label: "Capacidad técnica limitada",               descripcion: "Sin desarrollador propio. Dependencia de herramientas externas para análisis de datos y verificación.",                                                                                   icono: "💻" },
];


/* ── Tipos de relación: el patrón de trazo es la codificación primaria ────── */
const TIPOS_RELACION = [
  { id: "condiciona", label: "Condiciona", color: T.trace, dash: "0",   width: 1.4, cap: "butt",  glifo: "───" },
  { id: "posibilita", label: "Posibilita", color: T.trace, dash: "1,5", width: 2.2, cap: "round", glifo: "· · ·" },
  { id: "tensiona",   label: "Tensiona",   color: T.warn,  dash: "7,5", width: 1.6, cap: "butt",  glifo: "– – –" },
  { id: "produce",    label: "Produce",    color: T.ink,   dash: "0",   width: 2.6, cap: "round", glifo: "──▶" },
];

/* ── Dimensiones: tres hues categóricos validados ────────────────────────── */
const CATEGORIAS = {
  estructural: {
    label: "Estructural", color: "#24A0CB",
    bg: "rgba(36,160,203,0.13)", border: "rgba(36,160,203,0.55)",
    desc: "Factores del entorno macro: economía, política, tecnología, territorio",
  },
  relacional: {
    label: "Relacional", color: "#F94D3A",
    bg: "rgba(249,77,58,0.13)", border: "rgba(249,77,58,0.5)",
    desc: "Vínculos entre actores: alianzas, dependencias, negociaciones",
  },
  organizacional: {
    label: "Organizacional", color: "#B166F8",
    bg: "rgba(177,102,248,0.13)", border: "rgba(177,102,248,0.5)",
    desc: "Factores internos del medio: cultura, capacidades, prácticas",
  },
};

const FEEDBACK_COLORS = {
  inicio:    { icon: "→", color: T.trace },
  alerta:    { icon: "!", color: T.warn },
  accion:    { icon: "↑", color: "#24A0CB" },
  reflexion: { icon: "?", color: "#B166F8" },
  positivo:  { icon: "✓", color: T.good },
  neutro:    { icon: "·", color: T.inkMuted },
};

/* ───────────────────── FONDO GENERATIVO CON SEMILLA ──────────────────────
 * [TÉCNICA] Constelación reproducible: misma semilla, mismo dibujo en cada
 * carga y en cada build. No es decoración aleatoria — es la figura del propio
 * objeto de la herramienta (nodos heterogéneos débilmente acoplados) usada
 * como atmósfera, a opacidad que nunca compite con el contenido.
 * ───────────────────────────────────────────────────────────────────────── */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Constelacion({ seed = 1712, n = 46, opacidad = 0.5 }) {
  const { pts, links } = useMemo(() => {
    const rnd = mulberry32(seed);
    const pts = Array.from({ length: n }, () => ({
      x: rnd() * 1000, y: rnd() * 700, r: 0.8 + rnd() * 2.1,
    }));
    const links = [];
    pts.forEach((p, i) => {
      pts.slice(i + 1).forEach((q, j) => {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 165 && rnd() > 0.45) links.push({ a: i, b: i + 1 + j, d });
      });
    });
    return { pts, links };
  }, [seed, n]);

  return (
    <svg
      viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: opacidad, pointerEvents: "none",
        maskImage: "radial-gradient(ellipse 62% 58% at 38% 48%, transparent 25%, #000 78%)",
        WebkitMaskImage: "radial-gradient(ellipse 62% 58% at 38% 48%, transparent 25%, #000 78%)",
      }}
    >
      {links.map((l, i) => (
        <line
          key={i} x1={pts[l.a].x} y1={pts[l.a].y} x2={pts[l.b].x} y2={pts[l.b].y}
          stroke={T.trace} strokeWidth="0.5" strokeOpacity={0.5 * (1 - l.d / 165)}
        />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={T.trace} fillOpacity={0.26} />
      ))}
    </svg>
  );
}

/* ───────────────────────────── ESTILOS GLOBALES ─────────────────────────── */
const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
  margin: 0;
  background: ${T.void};
  color: ${T.ink};
  font-family: ${T.body};
  -webkit-font-smoothing: antialiased;
}

/* La retícula del plano: una sola textura, heredada por todas las pantallas */
.plano {
  background-color: ${T.void};
  background-image:
    linear-gradient(${T.grid} 1px, transparent 1px),
    linear-gradient(90deg, ${T.grid} 1px, transparent 1px);
  background-size: 34px 34px, 34px 34px;
}
.plano-fino {
  background-image:
    linear-gradient(${T.grid} 1px, transparent 1px),
    linear-gradient(90deg, ${T.grid} 1px, transparent 1px),
    radial-gradient(ellipse 60% 50% at 20% 0%, rgba(36,160,203,0.10), transparent 70%),
    radial-gradient(ellipse 50% 45% at 90% 100%, rgba(177,102,248,0.09), transparent 70%);
  background-size: 34px 34px, 34px 34px, 100% 100%, 100% 100%;
}

/* Grano: rompe el plano liso sin pesar. */
.grano::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  opacity: 0.16; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}

.rotulo {
  font-family: ${T.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${T.inkMuted};
}

.btn {
  font-family: ${T.mono}; font-size: 12px; letter-spacing: 0.06em;
  border-radius: 2px; cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}
.btn:focus-visible, .chip:focus-visible, textarea:focus-visible {
  outline: 2px solid #24A0CB; outline-offset: 2px;
}

.chip {
  font-family: ${T.mono}; font-size: 11px; letter-spacing: 0.04em;
  border-radius: 2px; cursor: pointer; background: transparent;
  transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}

/* Entrada escalonada: un solo momento orquestado al cargar. */
@keyframes surge { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.surge { animation: surge 0.62s cubic-bezier(0.22, 1, 0.36, 1) both; }

@keyframes trazo { from { stroke-dashoffset: var(--len); } to { stroke-dashoffset: 0; } }

::-webkit-scrollbar { width: 9px; height: 9px; }
::-webkit-scrollbar-track { background: ${T.void}; }
::-webkit-scrollbar-thumb { background: #27333F; border-radius: 0; }
::-webkit-scrollbar-thumb:hover { background: #33424F; }

textarea::placeholder { color: ${T.inkMuted}; opacity: 0.75; }

/* ── Respuesta a ancho reducido ──────────────────────────────────────────
   Los estilos en línea no admiten media queries, así que las tres rejillas
   que sí tienen que reacomodarse viven aquí. */

.rejilla-portada {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
}
.col-procedimiento {
  border-left: 1px solid ${T.hairline};
  padding-left: clamp(18px, 2.5vw, 30px);
}
@media (max-width: 880px) {
  .rejilla-portada { grid-template-columns: 1fr; gap: 34px; }
  .col-procedimiento {
    border-left: none;
    border-top: 1px solid ${T.hairline};
    padding-left: 0;
    padding-top: 28px;
  }
}

/* El panel de elementos pasa a cajón superpuesto cuando no cabe al lado. */
.mesa-panel {
  width: 288px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid ${T.hairline};
  background: ${T.surface};
  display: flex;
  flex-direction: column;
}
@media (max-width: 820px) {
  .mesa-panel {
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: min(300px, 88vw);
    z-index: 45;
    box-shadow: 18px 0 44px rgba(0,0,0,0.6);
  }
  .mesa-cuerpo { position: relative; }
}

/* Las tres lecturas: el resumen se apila encima cuando el ancho aprieta. */
.analisis-cuerpo { flex: 1; display: flex; overflow: hidden; }
.analisis-lateral {
  width: 264px; flex-shrink: 0;
  border-right: 1px solid ${T.hairline};
  background: ${T.surface}; overflow-y: auto; padding: 18px 16px;
}
@media (max-width: 820px) {
  .analisis-cuerpo { flex-direction: column; overflow-y: auto; }
  .analisis-lateral {
    width: auto; border-right: none;
    border-bottom: 1px solid ${T.hairline};
    overflow-y: visible;
  }
}

@media (prefers-reduced-motion: reduce) {
  .surge { animation: none; }
  * { transition-duration: 0.01ms !important; }
}
`;

function EstilosGlobales() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />;
}

/* ── Rótulo de dimensión ─────────────────────────────────────────────────── */
function Badge({ categoria, mini = false }) {
  const cat = CATEGORIAS[categoria];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: T.mono, fontSize: mini ? 9 : 10, fontWeight: 500,
      letterSpacing: "0.12em", color: cat.color,
      border: `1px solid ${cat.border}`, background: cat.bg,
      borderRadius: 2, padding: mini ? "1px 4px" : "2px 6px",
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 4, height: 4, background: cat.color, borderRadius: "50%" }} />
      {cat.label}
    </span>
  );
}

/* ── Muestra del patrón de trazo (leyenda sin depender del color) ────────── */
function MuestraTrazo({ tipo, activo }) {
  return (
    <svg width="26" height="8" aria-hidden="true" style={{ flexShrink: 0 }}>
      <line
        x1="1" y1="4" x2={tipo.id === "produce" ? 20 : 25} y2="4"
        stroke={activo ? T.void : tipo.color} strokeWidth={tipo.width}
        strokeDasharray={tipo.dash} strokeLinecap={tipo.cap}
      />
      {tipo.id === "produce" && (
        <polygon points="20,1 26,4 20,7" fill={activo ? T.void : tipo.color} />
      )}
    </svg>
  );
}

const PREGUNTAS_CIERRE = [
  "¿Qué elemento del ensamblaje consideras más determinante? ¿Por qué es difícil responder esa pregunta?",
  "¿En qué medida El Faro Verifica tiene autonomía real? ¿Frente a quién depende y de quién?",
  "¿Qué habría que cambiar en el ensamblaje para que El Faro pudiera rechazar el convenio?",
  "¿Qué oculta la lectura determinista que la sociotécnica hace visible? ¿Y al revés?",
];

/* ───────────── LECTURAS Y RETROALIMENTACIÓN (sin cambios) ────────── */

function generarLectura(marco, nodos, conexiones) {
  const ids = nodos.map(n => n.id);
  const cats = {
    e: nodos.filter(n => n.categoria === "estructural").length,
    r: nodos.filter(n => n.categoria === "relacional").length,
    o: nodos.filter(n => n.categoria === "organizacional").length,
  };
  const tieneN3  = ids.includes("n3");
  const tieneN4  = ids.includes("n4");
  const tieneN9  = ids.includes("n9");
  const tieneN12 = ids.includes("n12");
  const tieneN13 = ids.includes("n13");
  const tieneN14 = ids.includes("n14");
  const tieneN7  = ids.includes("n7");
  const tieneN8  = ids.includes("n8");
  const tieneN6  = ids.includes("n6");
  const nTensiones = conexiones.filter(c => c.tipo === "tensiona").length;
  const nPosibilita = conexiones.filter(c => c.tipo === "posibilita").length;
  const dominanteEstructural = cats.e > cats.r && cats.e > cats.o;
  const dominanteOrg = cats.o > cats.e && cats.o > cats.r;
  const total = nodos.length;

  if (marco === "determinismo") {
    let texto = `Desde el determinismo tecnológico, la decisión de El Faro Verifica era inevitable. `;
    if (tieneN3 && tieneN4) {
      texto += `Tu ensamblaje lo ilustra claramente: identificaste tanto el poder de las plataformas globales como la precariedad publicitaria. Desde este marco, esos dos factores son suficientes para explicarlo todo: cuando la distribución y el financiamiento dependen de las mismas plataformas que hay que combatir, el margen de maniobra desaparece. `;
    } else if (tieneN3) {
      texto += `Al incluir el poder de las plataformas globales en tu mapa, este marco diría que ya tienes la causa principal: VeritasNet no negoció con El Faro, simplemente configuró un entorno donde la única opción viable era integrarse o desaparecer. `;
    } else if (dominanteEstructural) {
      texto += `Tu ensamblaje es predominantemente estructural (${cats.e} de ${total} factores). Desde el determinismo, eso confirma su tesis: las condiciones macro lo determinaron todo. Los factores organizacionales que omitiste —valores del equipo, cultura editorial— son irrelevantes frente a esas fuerzas. `;
    } else {
      texto += `Aunque tu mapa no incluye los factores tecnológicos más evidentes, este marco los invocaría de todas formas: la lógica de las plataformas opera aunque no la veamos en el análisis. `;
    }
    if (tieneN14) {
      texto += `Incluso el imaginario algorítmico que incluiste en tu mapa sería leído aquí como síntoma, no como causa: el equipo ya interioriza la lógica de la plataforma porque no puede hacer otra cosa. `;
    }
    texto += `La pregunta que este marco no puede responder: ${tieneN13 ? `si la tecnología lo decide todo, ¿por qué la cultura organizacional de independencia que incluiste en tu mapa generó tensión en el proceso? ¿Por qué no fue una rendición inmediata?` : `¿por qué otros medios verificadores en condiciones estructurales similares rechazaron acuerdos parecidos?`}`;
    return texto;
  }

  if (marco === "instrumentalismo") {
    let texto = `Desde el instrumentalismo, VeritasNet es solo una herramienta. `;
    if (tieneN13 && tieneN12) {
      texto += `Tu ensamblaje contiene una tensión que este marco resolvería así: la cultura organizacional de independencia es el valor que debería garantizar el uso ético de la herramienta, pero la precariedad laboral del equipo erosiona la capacidad de mantenerlo. El instrumentalismo diría que el problema no es la plataforma: es que el equipo no tenía las condiciones para ejercer su autonomía. `;
    } else if (tieneN13) {
      texto += `Incluiste la cultura organizacional de independencia en tu mapa. Para el instrumentalismo, ese es el factor central: si ese principio es sólido, el equipo puede usar VeritasNet sin que esta los colonice. La plataforma es lo que el equipo decida que sea. `;
    } else if (dominanteOrg) {
      texto += `Tu ensamblaje tiene una densidad organizacional notable (${cats.o} factores). El instrumentalismo se sentiría cómodo con eso: si el problema es la voluntad y los valores del equipo, tu análisis va en la dirección correcta. Según este marco, las decisiones internas explican el resultado. `;
    } else {
      texto += `Tu ensamblaje se concentra más en factores externos que en los internos. El instrumentalismo te respondería: si el equipo hubiera tenido principios más sólidos, esos factores externos no habrían sido determinantes. `;
    }
    if (tieneN8) {
      texto += `La relación con organismos de cooperación que incluiste es leída desde aquí como evidencia de que sí había alternativas: si tenían acceso a financiamiento diversificado, la dependencia de VeritasNet era una elección, no una necesidad. `;
    }
    texto += `La pregunta que este marco no puede responder: ${tieneN14 ? `si la autonomía es cuestión de voluntad, ¿cómo explica que el imaginario algorítmico que identificaste en tu mapa empiece a moldear las decisiones editoriales sin que nadie lo haya ordenado explícitamente?` : `¿cómo explica que equipos con principios sólidos terminen reproduciendo las lógicas de la plataforma sin darse cuenta?`}`;
    return texto;
  }

  if (marco === "sociotecnico") {
    let texto = `El convenio con VeritasNet no es el resultado de la tecnología ni de la voluntad del equipo: es el producto de un ensamblaje de ${total} factores heterogéneos que interactúan. `;
    if (cats.e === 0) {
      texto += `Tu cartografía prescinde de factores estructurales, lo que es una decisión analítica legítima —pero el enfoque sociotécnico te preguntaría: ¿puede entenderse la decisión sin considerar el entorno macro que la hace posible o imposible? `;
    } else if (cats.o === 0) {
      texto += `Tu ensamblaje no incluye factores organizacionales, lo que produce un análisis de las condiciones sin agencia: el enfoque sociotécnico señalaría que los valores, la cultura y las capacidades internas también son parte del ensamblaje que produce la decisión. `;
    } else {
      texto += `Tu cartografía articula ${cats.e} factores estructurales, ${cats.r} relacionales y ${cats.o} organizacionales. Eso es lo que el enfoque sociotécnico necesita: no una causa, sino una configuración donde cada elemento condiciona sin determinar. `;
    }
    if (tieneN4 && tieneN12) {
      texto += `La combinación entre la precariedad publicitaria y el equipo pequeño con contratos inestables es especialmente reveladora: la vulnerabilidad financiera estructural y la precariedad laboral organizacional se refuerzan mutuamente, reduciendo el margen de negociación con VeritasNet antes de que la negociación comience. `;
    }
    if (tieneN9 && tieneN13) {
      texto += `Que hayas incluido tanto el convenio con VeritasNet como la cultura de independencia es el corazón analítico del caso: no se trata de que la cultura cedió, sino de que el ensamblaje produjo una negociación donde la cultura pudo limitar los términos pero no rechazar el acuerdo. `;
    }
    if (nTensiones > nPosibilita) {
      texto += `Tu ensamblaje tiene más relaciones de tensión (${nTensiones}) que de posibilidad (${nPosibilita}). Eso no es un error: es una lectura del caso. El ensamblaje que construiste es predominantemente un mapa de fricciones, no de recursos. `;
    } else if (nPosibilita > 0) {
      texto += `Las ${nPosibilita} relaciones de posibilidad que trazaste son analíticamente cruciales: señalan los márgenes de acción real que el ensamblaje habilita. `;
    }
    texto += `Lo más importante que este marco revela: El Faro Verifica creyó estar negociando recursos, pero en realidad estaba cediendo algo más difícil de recuperar —el conocimiento sobre cómo funciona la desinformación en su propio territorio. Ningún factor de tu mapa lo explica solo. Y si cualquiera de los elementos hubiera sido diferente, el ensamblaje habría producido otra decisión.`;
    return texto;
  }

  return "";
}

function generarCeguera(marco, nodos, conexiones) {
  const ids = nodos.map(n => n.id);
  const tieneN14 = ids.includes("n14");
  const tieneN13 = ids.includes("n13");
  const nTensiones = conexiones.filter(c => c.tipo === "tensiona").length;

  if (marco === "determinismo") {
    return tieneN13
      ? `Oculta precisamente lo que incluiste: que la cultura de independencia existía y generó deliberación real. Si la tecnología lo determina todo, ¿por qué hubo debate? El determinismo no puede explicar la deliberación sin contradecirse.`
      : `Invisibiliza la agencia del equipo: el proceso de deliberación, los valores que intentaron poner límites y las decisiones que sí pudieron tomarse de otro modo. No toda rendición es inevitable.`;
  }
  if (marco === "instrumentalismo") {
    return tieneN14
      ? `Ignora el factor que tú mismo incluiste: el imaginario algorítmico opera sin que nadie lo ordene. Si la herramienta es neutral y todo depende de la voluntad, ¿cómo se explica que el equipo anticipe el algoritmo antes de que alguien les pida hacerlo?`
      : `Trata las herramientas como si fueran neutrales. Pero VeritasNet fue diseñada con una lógica específica: maximizar el tiempo de atención y el engagement. Esa lógica opera sobre el equipo editorial aunque nadie la imponga directamente.`;
  }
  if (marco === "sociotecnico") {
    return nTensiones > 3
      ? `Tu ensamblaje tiene muchas tensiones (${nTensiones}), lo que puede producir una lectura del caso como bloqueo inevitable. El enfoque sociotécnico exige también identificar los márgenes de acción: ¿qué elementos del ensamblaje podrían reconfigurarse? No basta con mapear las fricciones.`
      : `Exige más esfuerzo analítico que los otros marcos: no ofrece una causa única ni un responsable claro. Pero es el único que hace visible tanto la agencia como las condiciones estructurales que la limitan. Su riesgo es la parálisis analítica: si todo está interconectado, ¿dónde intervenir?`;
  }
  return "";
}

// ─────────────────────────────────────────────
// PANEL DE RETROALIMENTACIÓN EN TIEMPO REAL
// ─────────────────────────────────────────────

function generarFeedback(nodos, conexiones) {
  const ids = nodos.map(n => n.id);
  const cats = {
    e: nodos.filter(n => n.categoria === "estructural").length,
    r: nodos.filter(n => n.categoria === "relacional").length,
    o: nodos.filter(n => n.categoria === "organizacional").length,
  };
  const total = nodos.length;
  const nConexiones = conexiones.length;

  if (total === 0) return { tipo: "inicio", texto: "Haz clic en cualquier elemento del panel para comenzar a construir tu ensamblaje.", pregunta: null };
  if (total < 3) return { tipo: "inicio", texto: `Has incluido ${total} elemento${total > 1 ? "s" : ""}. Un ensamblaje necesita al menos 4 para que el análisis sea significativo.`, pregunta: null };

  // Ensamblaje muy sesgado hacia lo estructural
  if (cats.e >= 4 && cats.o === 0) {
    return {
      tipo: "alerta",
      texto: `Tu ensamblaje tiene ${cats.e} factores estructurales y ninguno organizacional.`,
      pregunta: `¿Qué factores internos de El Faro —su cultura, sus capacidades, sus decisiones— omites al enfocarte solo en el entorno?`
    };
  }
  // Ensamblaje sin factores relacionales
  if (cats.r === 0 && total >= 4) {
    return {
      tipo: "alerta",
      texto: `Todavía no has incluido ningún factor relacional —los vínculos entre actores.`,
      pregunta: `¿Puede entenderse el convenio sin analizar las relaciones que lo hicieron posible o inevitable?`
    };
  }
  // Solo organizacional
  if (cats.o >= 4 && cats.e === 0) {
    return {
      tipo: "alerta",
      texto: `Tu análisis se concentra en factores internos del medio, sin factores estructurales.`,
      pregunta: `¿El ensamblaje que describes podría existir en cualquier contexto, o hay condiciones externas del ecosistema mediático colombiano que lo configuran?`
    };
  }
  // Muchos nodos sin conexiones
  if (total >= 5 && nConexiones === 0) {
    return {
      tipo: "accion",
      texto: `Tienes ${total} elementos en el mapa pero ninguna relación trazada.`,
      pregunta: `¿Cómo se produce el ensamblaje si los factores no interactúan entre sí? Activa el modo conexión para empezar a trazar relaciones.`
    };
  }
  // Muchas tensiones, pocas posibilidades
  const nTens = conexiones.filter(c => c.tipo === "tensiona").length;
  const nPos = conexiones.filter(c => c.tipo === "posibilita").length;
  if (nTens >= 3 && nPos === 0 && nConexiones >= 3) {
    return {
      tipo: "reflexion",
      texto: `Tu ensamblaje tiene ${nTens} relaciones de tensión y ninguna de posibilidad.`,
      pregunta: `¿Es este un ensamblaje de puras fricciones? ¿Qué factores o relaciones habilitaron la decisión, aunque fuera de forma contradictoria?`
    };
  }
  // Sin n9 (el convenio en sí)
  if (!ids.includes("n9") && total >= 5) {
    return {
      tipo: "reflexion",
      texto: `Tu ensamblaje aún no incluye el convenio verificador con VeritasNet.`,
      pregunta: `¿Puede construirse el ensamblaje de esta decisión sin incluir la relación que se decide? ¿O el convenio es efecto, no causa?`
    };
  }
  // Sin n14 (imaginario algorítmico)
  if (!ids.includes("n14") && total >= 6) {
    return {
      tipo: "reflexion",
      texto: `El imaginario algorítmico no está en tu mapa.`,
      pregunta: `¿Cómo explicas que el equipo anticipe las lógicas de VeritasNet antes de que alguien se lo pida? ¿Dónde entra ese proceso en tu ensamblaje?`
    };
  }
  // Ensamblaje rico y equilibrado
  if (total >= 6 && nConexiones >= 3 && cats.e > 0 && cats.r > 0 && cats.o > 0) {
    return {
      tipo: "positivo",
      texto: `Tu ensamblaje articula las tres dimensiones con ${nConexiones} relaciones trazadas.`,
      pregunta: `¿Cuál de tus relaciones es la más difícil de argumentar? ¿Puedes defenderla frente a alguien que diga que esos dos factores no se conectan?`
    };
  }

  return {
    tipo: "neutro",
    texto: `Ensamblaje en construcción: ${cats.e} estructurales, ${cats.r} relacionales, ${cats.o} organizacionales.`,
    pregunta: total >= 4 && nConexiones === 0 ? `Recuerda trazar relaciones entre los nodos para que el ensamblaje sea analíticamente productivo.` : null
  };
}

function getId() { return Math.random().toString(36).slice(2, 9); }

/* ═══════════════════════════ MESA DE TRAZADO ════════════════════════════ */

function Canvas({ nodosEnCanvas, setNodosEnCanvas, conexiones, setConexiones, tipoRelacionActivo, modoConexion, setModoConexion }) {
  const canvasRef = useRef(null);
  const dragging  = useRef(null);
  const [mouse, setMouse]             = useState({ x: 0, y: 0 });
  const [origenConexion, setOrigen]   = useState(null);
  const [selectedConn, setSelConn]    = useState(null);
  const [hoveredNodo, setHoveredNodo] = useState(null);

  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }, []);

  const onMouseMove = useCallback((e) => {
    const pos = getPos(e);
    setMouse(pos);
    if (dragging.current) {
      setNodosEnCanvas(prev => prev.map(n =>
        n.id === dragging.current.id
          ? { ...n, x: pos.x - dragging.current.ox, y: pos.y - dragging.current.oy }
          : n
      ));
    }
  }, [getPos, setNodosEnCanvas]);

  const onMouseUp = useCallback(() => { dragging.current = null; }, []);

  const handleNodoClick = useCallback((e, nodo) => {
    e.stopPropagation();
    if (!modoConexion) return;
    if (!origenConexion) {
      setOrigen(nodo.id);
    } else if (origenConexion === nodo.id) {
      setOrigen(null);
    } else {
      const existe = conexiones.find(c =>
        (c.from === origenConexion && c.to === nodo.id) ||
        (c.from === nodo.id && c.to === origenConexion)
      );
      if (!existe) {
        setConexiones(prev => [...prev, { id: getId(), from: origenConexion, to: nodo.id, tipo: tipoRelacionActivo }]);
      }
      setOrigen(null);
    }
  }, [modoConexion, origenConexion, conexiones, setConexiones, tipoRelacionActivo]);

  const startDrag = useCallback((e, nodo) => {
    if (modoConexion) return;
    e.stopPropagation();
    const pos = getPos(e);
    dragging.current = { id: nodo.id, ox: pos.x - nodo.x, oy: pos.y - nodo.y };
  }, [getPos, modoConexion]);

  const deleteConexion = useCallback((id) => {
    setConexiones(prev => prev.filter(c => c.id !== id));
    setSelConn(null);
  }, [setConexiones]);

  const handleCanvasClick = useCallback(() => {
    setSelConn(null);
    if (modoConexion && origenConexion) setOrigen(null);
  }, [modoConexion, origenConexion]);

  const getCenter = (id) => {
    const n = nodosEnCanvas.find(n => n.id === id);
    return n ? { x: n.x + 76, y: n.y + 34 } : { x: 0, y: 0 };
  };

  const origenNodo = origenConexion ? nodosEnCanvas.find(n => n.id === origenConexion) : null;
  const tipoActivo = TIPOS_RELACION.find(t => t.id === tipoRelacionActivo);

  return (
    <div
      ref={canvasRef}
      className="plano plano-fino"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={handleCanvasClick}
      style={{
        position: "relative", width: "100%", height: "100%", overflow: "hidden",
        cursor: modoConexion ? (origenConexion ? "crosshair" : "cell") : "default",
      }}
    >
      {/* Marcas de esquina: el plano se anuncia como instrumento */}
      {[["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]].map(([v, h]) => (
        <div key={v + h} style={{
          position: "absolute", [v]: 12, [h]: 12, width: 13, height: 13,
          [`border${v === "top" ? "Top" : "Bottom"}`]: `1px solid ${T.hairline}`,
          [`border${h === "left" ? "Left" : "Right"}`]: `1px solid ${T.hairline}`,
          pointerEvents: "none",
        }} />
      ))}

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
        <defs>
          {TIPOS_RELACION.map(tr => (
            <marker key={tr.id} id={`arr-${tr.id}`} markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill={tr.color} />
            </marker>
          ))}
        </defs>

        {conexiones.map(c => {
          const from = getCenter(c.from);
          const to   = getCenter(c.to);
          const tr   = TIPOS_RELACION.find(t => t.id === c.tipo) || TIPOS_RELACION[0];
          const mx   = (from.x + to.x) / 2;
          const my   = (from.y + to.y) / 2;
          const isSel = selectedConn === c.id;
          const dx = to.x - from.x, dy = to.y - from.y;
          const cx1 = from.x + dx * 0.5, cy1 = from.y + dy * 0.1;
          const cx2 = from.x + dx * 0.5, cy2 = from.y + dy * 0.9;
          const d = `M${from.x},${from.y} C${cx1},${cy1} ${cx2},${cy2} ${to.x},${to.y}`;
          const w = tr.label.length * 6.6 + 16;
          return (
            <g key={c.id}>
              <path d={d} stroke="transparent" strokeWidth="16" fill="none"
                style={{ cursor: "pointer", pointerEvents: "stroke" }}
                onClick={(e) => { e.stopPropagation(); setSelConn(isSel ? null : c.id); }}
              />
              <path d={d} stroke={tr.color} strokeWidth={isSel ? tr.width + 1.1 : tr.width}
                strokeDasharray={tr.dash} strokeLinecap={tr.cap}
                strokeOpacity={isSel ? 1 : 0.8} fill="none"
                markerEnd={tr.id === "produce" ? `url(#arr-${tr.id})` : undefined}
                style={{ transition: "stroke-width 0.16s, stroke-opacity 0.16s", pointerEvents: "none" }}
              />
            </g>
          );
        })}

        {modoConexion && origenNodo && (
          <line
            x1={origenNodo.x + 76} y1={origenNodo.y + 34} x2={mouse.x} y2={mouse.y}
            stroke={tipoActivo?.color || T.trace} strokeWidth={tipoActivo?.width || 1.5}
            strokeDasharray="4,4" opacity="0.85" style={{ pointerEvents: "none" }}
          />
        )}
      </svg>

      {/* Capa de rótulos: por ENCIMA de los nodos. La identidad de una relación
          nunca puede quedar tapada, porque es lo que la hace legible sin color. */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 12 }}>
        {conexiones.map(c => {
          const from = getCenter(c.from);
          const to   = getCenter(c.to);
          const tr   = TIPOS_RELACION.find(t => t.id === c.tipo) || TIPOS_RELACION[0];
          const mx   = (from.x + to.x) / 2;
          const my   = (from.y + to.y) / 2;
          const isSel = selectedConn === c.id;
          const w = tr.label.length * 6.6 + 16;
          return (
            <g key={c.id}>
              <rect x={mx - w / 2} y={my - 9} width={w} height={18} rx={2}
                fill={T.void} stroke={tr.color} strokeWidth="1" strokeOpacity={isSel ? 1 : 0.6}
              />
              <text x={mx} y={my + 4} textAnchor="middle"
                fill={isSel ? T.ink : T.inkSec} fontSize="10" fontFamily={T.mono}
                letterSpacing="0.1em"
              >
                {tr.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Nodos: fichas de instrumento con barra de dimensión */}
      {nodosEnCanvas.map(nodo => {
        const cat     = CATEGORIAS[nodo.categoria];
        const isOrig  = origenConexion === nodo.id;
        const isHover = hoveredNodo === nodo.id;
        return (
          <div
            key={nodo.id}
            onMouseDown={(e) => startDrag(e, nodo)}
            onClick={(e) => handleNodoClick(e, nodo)}
            onMouseEnter={() => setHoveredNodo(nodo.id)}
            onMouseLeave={() => setHoveredNodo(null)}
            style={{
              position: "absolute", left: nodo.x, top: nodo.y,
              width: 152, zIndex: isOrig ? 15 : 10,
              background: isOrig ? T.raisedHi : T.raised,
              borderRight:  `1px solid ${isOrig ? (tipoActivo?.color || cat.color) : (isHover ? cat.border : T.hairline)}`,
              borderBottom: `1px solid ${isOrig ? (tipoActivo?.color || cat.color) : (isHover ? cat.border : T.hairline)}`,
              borderLeft:   `1px solid ${isOrig ? (tipoActivo?.color || cat.color) : (isHover ? cat.border : T.hairline)}`,
              borderTop:    `2px solid ${cat.color}`,
              borderRadius: 2, padding: "9px 11px 8px",
              cursor: modoConexion ? "pointer" : "grab",
              userSelect: "none",
              boxShadow: isOrig
                ? `0 0 0 3px ${(tipoActivo?.color || cat.color)}33, 0 10px 30px rgba(0,0,0,0.5)`
                : isHover ? "0 6px 22px rgba(0,0,0,0.45)" : "0 2px 10px rgba(0,0,0,0.35)",
              transition: "box-shadow 0.16s, border-color 0.16s, transform 0.12s, background 0.16s",
              transform: isOrig ? "translateY(-2px)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <span style={{ fontSize: 14, lineHeight: 1.35, flexShrink: 0, filter: "saturate(0.75)" }}>{nodo.icono}</span>
              <div style={{ fontFamily: T.body, fontSize: 12.5, fontWeight: 400, color: T.ink, lineHeight: 1.4 }}>
                {nodo.label}
              </div>
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge categoria={nodo.categoria} mini />
              {!modoConexion && (
                <button
                  className="btn"
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => {
                    e.stopPropagation();
                    setNodosEnCanvas(prev => prev.filter(n => n.id !== nodo.id));
                    setConexiones(prev => prev.filter(c => c.from !== nodo.id && c.to !== nodo.id));
                  }}
                  style={{ background: "none", border: "none", color: T.inkMuted, fontSize: 14, lineHeight: 1, padding: "0 2px" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#F94D3A"}
                  onMouseLeave={e => e.currentTarget.style.color = T.inkMuted}
                  title="Quitar del mapa"
                  aria-label={`Quitar ${nodo.label} del mapa`}
                >×</button>
              )}
            </div>
          </div>
        );
      })}

      {selectedConn && (() => {
        const c = conexiones.find(x => x.id === selectedConn);
        if (!c) return null;
        const from = getCenter(c.from);
        const to   = getCenter(c.to);
        return (
          <div style={{ position: "absolute", left: (from.x + to.x) / 2 + 46, top: (from.y + to.y) / 2 - 14, zIndex: 30 }}>
            <button
              className="btn"
              onClick={(e) => { e.stopPropagation(); deleteConexion(selectedConn); }}
              style={{
                background: T.raised, color: "#F94D3A", border: "1px solid #F94D3A",
                padding: "5px 11px", fontWeight: 500,
              }}
            >× Eliminar relación</button>
          </div>
        );
      })()}

      {modoConexion && (
        <div style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
          background: T.raised,
          border: `1px solid ${origenConexion ? (tipoActivo?.color || T.trace) : T.hairline}`,
          color: origenConexion ? (tipoActivo?.color || T.ink) : T.inkSec,
          borderRadius: 2, padding: "7px 16px",
          fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
          boxShadow: "0 8px 26px rgba(0,0,0,0.5)",
          zIndex: 20, pointerEvents: "none",
          transition: "border-color 0.2s, color 0.2s",
        }}>
          {origenConexion ? "Origen fijado · marca el destino" : "Modo conexión · marca el origen"}
        </div>
      )}

      {nodosEnCanvas.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", pointerEvents: "none", gap: 18,
        }}>
          <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true" style={{ opacity: 0.5 }}>
            <circle cx="38" cy="38" r="37" fill="none" stroke={T.hairline} />
            <circle cx="38" cy="38" r="24" fill="none" stroke={T.hairline} strokeDasharray="2,4" />
            <line x1="38" y1="4" x2="38" y2="72" stroke={T.hairline} />
            <line x1="4" y1="38" x2="72" y2="38" stroke={T.hairline} />
            <circle cx="38" cy="38" r="3" fill={T.trace} fillOpacity="0.55" />
          </svg>
          <div className="rotulo" style={{ textAlign: "center", lineHeight: 2, letterSpacing: "0.22em" }}>
            Plano vacío<br />
            <span style={{ color: T.inkMuted, opacity: 0.7 }}>elige un elemento del panel</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Estado del análisis ─────────────────────────────────────────────────── */
function PanelFeedback({ nodos, conexiones }) {
  const fb = generarFeedback(nodos, conexiones);
  const pal = FEEDBACK_COLORS[fb.tipo];

  return (
    <div style={{
      background: T.raised,
      borderTop:    `1px solid ${T.hairline}`,
      borderRight:  `1px solid ${T.hairline}`,
      borderBottom: `1px solid ${T.hairline}`,
      borderLeft:   `2px solid ${pal.color}`,
      borderRadius: 2,
      padding: "12px 14px", transition: "border-left-color 0.4s ease",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{
          width: 18, height: 18, borderRadius: 2, flexShrink: 0,
          border: `1px solid ${pal.color}`, color: pal.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontFamily: T.mono, marginTop: 1,
        }} aria-hidden="true">{pal.icon}</div>
        <div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: T.inkSec, lineHeight: 1.6, marginBottom: fb.pregunta ? 9 : 0 }}>
            {fb.texto}
          </div>
          {fb.pregunta && (
            <div style={{
              fontFamily: T.body, fontSize: 13, color: pal.color, lineHeight: 1.65,
              fontStyle: "italic", opacity: 0.92,
            }}>
              {fb.pregunta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ PANTALLA: PORTADA ══════════════════════════ */

function PantallaIntro({ onStart }) {
  const [expanded, setExpanded] = useState(false);
  const preview = CASO.contexto.slice(0, 260) + "…";

  const PASOS = [
    { n: "01", title: "Construye el mapa",  desc: "Selecciona factores del ecosistema y ubícalos en el plano", color: CATEGORIAS.estructural.color },
    { n: "02", title: "Traza relaciones",   desc: "Conecta los nodos: condiciona, posibilita, tensiona, produce", color: CATEGORIAS.relacional.color },
    { n: "03", title: "Lee el ensamblaje",  desc: "El sistema devuelve tres lecturas del mapa que construiste",   color: CATEGORIAS.organizacional.color },
  ];

  return (
    <div className="plano grano" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Constelacion seed={1712} n={52} opacidad={0.42} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1120, margin: "0 auto", padding: "clamp(28px, 6vh, 68px) clamp(16px, 5vw, 56px) 72px",
      }}>
        {/* Cabecera institucional */}
        <div className="surge" style={{
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
          paddingBottom: 22, borderBottom: `1px solid ${T.hairline}`, animationDelay: "0.02s",
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect x="0.5" y="0.5" width="21" height="21" fill="none" stroke={T.trace} strokeOpacity="0.5" />
            <circle cx="6" cy="6" r="2" fill={CATEGORIAS.estructural.color} />
            <circle cx="16" cy="9" r="2" fill={CATEGORIAS.relacional.color} />
            <circle cx="9" cy="16" r="2" fill={CATEGORIAS.organizacional.color} />
            <path d="M6 6 L16 9 L9 16 Z" fill="none" stroke={T.trace} strokeOpacity="0.55" />
          </svg>
          <span className="rotulo" style={{ color: T.inkSec }}>
            LAMA · Universidad del Valle · Periodismo y Sociedad IV
          </span>
          <span className="rotulo" style={{ marginLeft: "auto", opacity: 0.7 }}>
            Herramienta de análisis sociotécnico
          </span>
        </div>

        {/* Título: desbordado a la izquierda, no centrado */}
        <div className="surge" style={{ margin: "clamp(34px, 7vh, 66px) 0 0", animationDelay: "0.1s" }}>
          <h1 style={{
            fontFamily: T.display,
            fontSize: "clamp(56px, 13vw, 148px)",
            fontWeight: 800, lineHeight: 0.84, letterSpacing: "-0.045em",
            margin: 0, color: T.ink, textWrap: "balance",
          }}>
            El<br />Ensamblaje
          </h1>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 16, marginTop: 22, flexWrap: "wrap",
          }}>
            <div style={{ height: 1, width: 64, background: CATEGORIAS.relacional.color, alignSelf: "center" }} />
            <span style={{
              fontFamily: T.body, fontSize: "clamp(17px, 2.1vw, 23px)",
              fontStyle: "italic", fontWeight: 300, color: T.inkSec,
            }}>
              Cartografía de una decisión periodística
            </span>
          </div>
        </div>

        {/* Cuerpo: dos columnas asimétricas */}
        <div className="surge rejilla-portada" style={{
          marginTop: "clamp(38px, 7vh, 72px)", animationDelay: "0.18s",
        }}>
          {/* Expediente */}
          <div>
            <div className="rotulo" style={{ marginBottom: 12 }}>Expediente · el caso</div>
            <h2 style={{
              fontFamily: T.display, fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700,
              letterSpacing: "-0.02em", lineHeight: 1.18, margin: "0 0 18px", color: T.ink,
            }}>
              {CASO.titulo}
            </h2>
            <p style={{
              fontFamily: T.body, fontSize: 16.5, fontWeight: 300, lineHeight: 1.78,
              color: T.inkSec, margin: "0 0 14px", maxWidth: "62ch",
            }}>
              {expanded ? CASO.contexto : preview}
            </p>
            <button
              className="btn"
              onClick={() => setExpanded(!expanded)}
              style={{
                background: "none", border: "none", padding: 0, color: CATEGORIAS.estructural.color,
                borderBottom: `1px solid ${CATEGORIAS.estructural.color}55`,
              }}
            >
              {expanded ? "← Contraer" : "Leer el expediente completo →"}
            </button>

            <blockquote style={{
              margin: "30px 0 0", padding: "18px 0 0",
              borderTop: `1px solid ${T.hairline}`,
            }}>
              <p style={{
                fontFamily: T.body, fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.6,
                color: T.ink, margin: 0, maxWidth: "48ch",
              }}>
                {CASO.pregunta}
              </p>
            </blockquote>
          </div>

          {/* Procedimiento: lista con filete, no tres tarjetas iguales */}
          <div className="col-procedimiento">
            <div className="rotulo" style={{ marginBottom: 18 }}>Procedimiento</div>
            {PASOS.map((p, i) => (
              <div key={p.n} style={{
                display: "grid", gridTemplateColumns: "auto 1fr", gap: 14,
                paddingBottom: 20, marginBottom: 20,
                borderBottom: i < PASOS.length - 1 ? `1px solid ${T.hairline}` : "none",
              }}>
                <div style={{
                  fontFamily: T.mono, fontSize: 12, color: p.color,
                  border: `1px solid ${p.color}55`, borderRadius: 2,
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{p.n}</div>
                <div>
                  <div style={{
                    fontFamily: T.display, fontSize: 15.5, fontWeight: 700,
                    color: T.ink, marginBottom: 5, letterSpacing: "-0.01em",
                  }}>{p.title}</div>
                  <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 300, color: T.inkMuted, lineHeight: 1.62 }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entrada */}
        <div className="surge" style={{ marginTop: "clamp(40px, 7vh, 64px)", animationDelay: "0.26s" }}>
          <button
            className="btn"
            onClick={onStart}
            style={{
              background: T.ink, color: T.void, border: `1px solid ${T.ink}`,
              padding: "16px 40px", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.16em", textTransform: "uppercase",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.void; }}
          >
            Abrir el plano →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ PANTALLA: MESA ═════════════════════════════ */

function PantallaCanvas({ onTerminar }) {
  const [nodosEnCanvas, setNodosEnCanvas] = useState([]);
  const [conexiones, setConexiones]       = useState([]);
  const [tipoRelActivo, setTipoRelActivo] = useState("condiciona");
  const [modoConexion, setModoConexion]   = useState(false);
  const [panelAbierto, setPanelAbierto]   = useState(true);
  const [categoriaFiltro, setCatFiltro]   = useState("all");
  const [tooltipNodo, setTooltipNodo]     = useState(null);
  const canvasAreaRef = useRef(null);

  const puedeTerminar = nodosEnCanvas.length >= 4 && conexiones.length >= 2;

  const nodosUsados      = nodosEnCanvas.map(n => n.id);
  const nodosDisponibles = NODOS_DISPONIBLES.filter(n =>
    !nodosUsados.includes(n.id) &&
    (categoriaFiltro === "all" || n.categoria === categoriaFiltro)
  );

  /* [TÉCNICA] Colocación por mejor-de-N: se proponen candidatos al azar y se
     queda el que maximiza la distancia al nodo más cercano. Sin esto las fichas
     se apilan y el plano deja de ser legible justo cuando empieza a tener algo
     que leer. Barato, determinista en su efecto y suficiente para ~15 nodos. */
  const agregarNodo = (nodo) => {
    const rect = canvasAreaRef.current?.getBoundingClientRect();
    if (!rect) {
      setNodosEnCanvas(prev => [...prev, { ...nodo, x: 120, y: 80 }]);
      return;
    }
    const maxX = Math.max(60, rect.width  - 200);
    const maxY = Math.max(60, rect.height - 140);
    setNodosEnCanvas(prev => {
      let mejor = null, mejorDist = -1;
      for (let i = 0; i < 40; i++) {
        const x = 24 + Math.random() * maxX;
        const y = 24 + Math.random() * maxY;
        const dist = prev.length
          ? Math.min(...prev.map(n => Math.hypot(n.x - x, n.y - y)))
          : Infinity;
        if (dist > mejorDist) { mejorDist = dist; mejor = { x, y }; }
        if (dist > 190) break;
      }
      return [...prev, { ...nodo, ...mejor }];
    });
  };

  return (
    <div style={{ height: "100vh", background: T.void, display: "flex", flexDirection: "column" }}>

      {/* ── Barra superior ─────────────────────────────────────────────── */}
      <div style={{
        padding: "11px 20px", borderBottom: `1px solid ${T.hairline}`,
        background: T.surface, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16, flexShrink: 0, zIndex: 40,
        flexWrap: "wrap", rowGap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <div>
            <div className="rotulo" style={{ fontSize: 10, marginBottom: 2 }}>El Ensamblaje</div>
            <div style={{ fontFamily: T.display, fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: "-0.015em" }}>
              Cartografía de una decisión
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: T.hairline, flexShrink: 0 }} />
          <div style={{
            fontFamily: T.body, fontStyle: "italic", fontWeight: 300, fontSize: 13.5,
            color: T.inkMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{CASO.titulo}</div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", rowGap: 8 }}>
          {/* Contadores: cifras grandes en mono, no un párrafo */}
          <div style={{ display: "flex", gap: 14, marginRight: 4 }}>
            {[["nodos", nodosEnCanvas.length], ["relaciones", conexiones.length]].map(([k, v]) => (
              <div key={k} style={{ textAlign: "right" }}>
                <div style={{ fontFamily: T.mono, fontSize: 17, color: T.ink, lineHeight: 1 }}>
                  {String(v).padStart(2, "0")}
                </div>
                <div className="rotulo" style={{ fontSize: 9, letterSpacing: "0.14em" }}>{k}</div>
              </div>
            ))}
          </div>
          <button
            className="btn"
            onClick={() => setPanelAbierto(!panelAbierto)}
            style={{
              background: "transparent", color: T.inkSec,
              border: `1px solid ${T.hairline}`, padding: "7px 13px",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.trace}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.hairline}
          >{panelAbierto ? "Ocultar panel" : "Ver elementos"}</button>
          <button
            className="btn"
            onClick={() => onTerminar({ nodos: nodosEnCanvas, conexiones })}
            disabled={!puedeTerminar}
            title={!puedeTerminar ? "Agrega al menos 4 nodos y 2 conexiones" : ""}
            style={{
              background: puedeTerminar ? T.good : "transparent",
              color: puedeTerminar ? T.void : T.inkMuted,
              border: `1px solid ${puedeTerminar ? T.good : T.hairline}`,
              padding: "7px 18px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: puedeTerminar ? "pointer" : "not-allowed",
            }}
          >Analizar →</button>
        </div>
      </div>

      {/* ── Barra de relaciones: la leyenda ES el control ──────────────── */}
      <div style={{
        padding: "9px 20px", borderBottom: `1px solid ${T.hairline}`,
        background: modoConexion ? T.raised : T.surface,
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap",
        transition: "background 0.25s",
      }}>
        <button
          className="btn"
          onClick={() => setModoConexion(m => !m)}
          style={{
            background: modoConexion ? T.trace : "transparent",
            color: modoConexion ? T.void : T.inkSec,
            border: `1px solid ${modoConexion ? T.trace : T.hairline}`,
            padding: "6px 14px", fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", flexShrink: 0,
          }}
        >{modoConexion ? "Conectando" : "Modo conexión"}</button>

        <div style={{ width: 1, height: 20, background: T.hairline, flexShrink: 0 }} />

        {TIPOS_RELACION.map(tr => {
          const activo = tipoRelActivo === tr.id;
          return (
            <button
              key={tr.id}
              className="chip"
              onClick={() => { setTipoRelActivo(tr.id); if (!modoConexion) setModoConexion(true); }}
              aria-pressed={activo}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: activo ? tr.color : "transparent",
                color: activo ? T.void : T.inkSec,
                border: `1px solid ${activo ? tr.color : T.hairline}`,
                padding: "5px 12px", letterSpacing: "0.1em", textTransform: "uppercase",
                fontWeight: activo ? 600 : 400,
              }}
              onMouseEnter={e => { if (!activo) e.currentTarget.style.borderColor = tr.color; }}
              onMouseLeave={e => { if (!activo) e.currentTarget.style.borderColor = T.hairline; }}
            >
              <MuestraTrazo tipo={tr} activo={activo} />
              {tr.label}
            </button>
          );
        })}

        <span style={{
          fontFamily: T.body, fontStyle: "italic", fontWeight: 300,
          fontSize: 13, color: T.inkMuted, marginLeft: 4,
        }}>
          {modoConexion ? "① clic en el origen → ② clic en el destino" : "elige un tipo para activar el modo conexión"}
        </span>
      </div>

      {/* ── Cuerpo ─────────────────────────────────────────────────────── */}
      <div className="mesa-cuerpo" style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {panelAbierto && (
          <div className="mesa-panel">
            <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${T.hairline}` }}>
              <div className="rotulo" style={{ marginBottom: 11 }}>Elementos del ensamblaje</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                <button
                  className="chip"
                  onClick={() => setCatFiltro("all")}
                  style={{
                    background: categoriaFiltro === "all" ? T.ink : "transparent",
                    color: categoriaFiltro === "all" ? T.void : T.inkMuted,
                    border: `1px solid ${categoriaFiltro === "all" ? T.ink : T.hairline}`,
                    padding: "4px 9px", textTransform: "uppercase", letterSpacing: "0.1em",
                  }}
                >Todos</button>
                {Object.entries(CATEGORIAS).map(([key, cat]) => {
                  const on = categoriaFiltro === key;
                  return (
                    <button
                      key={key}
                      className="chip"
                      onClick={() => setCatFiltro(key)}
                      style={{
                        background: on ? cat.color : "transparent",
                        color: on ? T.void : cat.color,
                        border: `1px solid ${on ? cat.color : cat.border}`,
                        padding: "4px 9px", textTransform: "uppercase", letterSpacing: "0.1em",
                      }}
                    >{cat.label}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ flex: "1 1 auto", minHeight: 176, overflowY: "auto", padding: "10px 12px" }}>
              {nodosDisponibles.length === 0 && (
                <div style={{
                  fontFamily: T.body, fontStyle: "italic", fontWeight: 300, fontSize: 13,
                  color: T.inkMuted, textAlign: "center", padding: "24px 8px", lineHeight: 1.6,
                }}>
                  Todos los elementos de esta categoría están en el plano
                </div>
              )}
              {nodosDisponibles.map(nodo => {
                const cat = CATEGORIAS[nodo.categoria];
                return (
                  <div key={nodo.id} style={{ position: "relative", marginBottom: 5 }}>
                    <div
                      onClick={() => agregarNodo(nodo)}
                      onMouseEnter={() => setTooltipNodo(nodo.id)}
                      onMouseLeave={() => setTooltipNodo(null)}
                      style={{
                        background: T.raised,
                        borderTop:    `1px solid ${T.hairline}`,
                        borderRight:  `1px solid ${T.hairline}`,
                        borderBottom: `1px solid ${T.hairline}`,
                        borderLeft:   `2px solid ${cat.color}`,
                        borderRadius: 2,
                        padding: "9px 11px", cursor: "pointer",
                        display: "flex", gap: 9, alignItems: "flex-start",
                        transition: "background 0.14s, border-color 0.14s, transform 0.14s",
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = T.raisedHi; e.currentTarget.style.transform = "translateX(2px)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = T.raised; e.currentTarget.style.transform = "none"; }}
                    >
                      <span style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.35, filter: "saturate(0.75)" }}>{nodo.icono}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: T.body, fontSize: 13.5, color: T.ink, lineHeight: 1.42, marginBottom: 6 }}>
                          {nodo.label}
                        </div>
                        <Badge categoria={nodo.categoria} mini />
                      </div>
                    </div>

                    {tooltipNodo === nodo.id && (
                      <div style={{
                        position: "absolute", left: "calc(100% + 10px)", top: 0, width: 232,
                        background: T.raisedHi, border: `1px solid ${cat.border}`, borderRadius: 2,
                        padding: 13, zIndex: 50, boxShadow: "0 14px 40px rgba(0,0,0,0.6)",
                        pointerEvents: "none",
                      }}>
                        <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 13.5, color: T.ink, marginBottom: 7, lineHeight: 1.3 }}>
                          {nodo.label}
                        </div>
                        <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 300, color: T.inkSec, lineHeight: 1.62 }}>
                          {nodo.descripcion}
                        </div>
                        <div className="rotulo" style={{ marginTop: 10, fontSize: 9.5, color: cat.color }}>
                          Clic para fijar en el plano
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: 12, borderTop: `1px solid ${T.hairline}` }}>
              <div className="rotulo" style={{ marginBottom: 9 }}>Estado del análisis</div>
              <PanelFeedback nodos={nodosEnCanvas} conexiones={conexiones} />
            </div>

            <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${T.hairline}` }}>
              <div className="rotulo" style={{ marginBottom: 10 }}>Dimensiones</div>
              {Object.entries(CATEGORIAS).map(([key, cat]) => (
                <div key={key} style={{ display: "flex", gap: 9, marginBottom: 9 }}>
                  <div style={{ width: 3, background: cat.color, flexShrink: 0, borderRadius: 1 }} />
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: cat.color, marginBottom: 3 }}>
                      {cat.label}
                    </div>
                    <div style={{ fontFamily: T.body, fontSize: 12.5, fontWeight: 300, color: T.inkMuted, lineHeight: 1.52 }}>
                      {cat.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={canvasAreaRef} id="canvas-area" style={{ flex: 1, position: "relative", minWidth: 0 }}>
          <Canvas
            nodosEnCanvas={nodosEnCanvas}
            setNodosEnCanvas={setNodosEnCanvas}
            conexiones={conexiones}
            setConexiones={setConexiones}
            tipoRelacionActivo={tipoRelActivo}
            modoConexion={modoConexion}
            setModoConexion={setModoConexion}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ PANTALLA: TRES LECTURAS ════════════════════════ */

function PantallaAnalisis({ resultado, onReflexion }) {
  const [marcoActivo, setMarcoActivo] = useState("determinismo");
  const [fase, setFase]               = useState("marcos");

  const stats = {
    total: resultado.nodos.length,
    conexiones: resultado.conexiones.length,
    porCategoria: {
      estructural:    resultado.nodos.filter(n => n.categoria === "estructural").length,
      relacional:     resultado.nodos.filter(n => n.categoria === "relacional").length,
      organizacional: resultado.nodos.filter(n => n.categoria === "organizacional").length,
    },
    porTipo: TIPOS_RELACION.map(tr => ({
      ...tr,
      count: resultado.conexiones.filter(c => c.tipo === tr.id).length,
    })),
  };

  const MARCOS = {
    determinismo:     { titulo: "Lectura determinista",      subtitulo: "La tecnología lo decidió todo",                  color: CATEGORIAS.estructural.color },
    instrumentalismo: { titulo: "Lectura instrumentalista",   subtitulo: "Los periodistas eligieron bien (o mal)",         color: CATEGORIAS.relacional.color },
    sociotecnico:     { titulo: "Lectura sociotécnica",       subtitulo: "Una configuración que condiciona sin determinar", color: CATEGORIAS.organizacional.color },
  };

  const marco = MARCOS[marcoActivo];

  if (fase === "reflexion") return <PantallaReflexion resultado={resultado} onTerminar={onReflexion} />;

  return (
    <div style={{ minHeight: "100vh", background: T.void, display: "flex", flexDirection: "column" }}>
      <div style={{
        padding: "13px 26px", borderBottom: `1px solid ${T.hairline}`, background: T.surface,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <div>
          <div className="rotulo" style={{ fontSize: 10, marginBottom: 2 }}>Análisis del ensamblaje</div>
          <div style={{ fontFamily: T.display, fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: "-0.018em" }}>
            Tres lecturas del mismo mapa
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[["nodos", stats.total], ["relaciones", stats.conexiones]].map(([k, v]) => (
            <div key={k} style={{ textAlign: "right" }}>
              <div style={{ fontFamily: T.mono, fontSize: 17, color: T.ink, lineHeight: 1 }}>{String(v).padStart(2, "0")}</div>
              <div className="rotulo" style={{ fontSize: 9, letterSpacing: "0.14em" }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="analisis-cuerpo">
        {/* Resumen del mapa */}
        <div className="analisis-lateral">
          <div className="rotulo" style={{ marginBottom: 14 }}>Tu ensamblaje</div>
          {Object.entries(stats.porCategoria).map(([cat, count]) => {
            const c = CATEGORIAS[cat];
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={cat} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.09em", textTransform: "uppercase", color: c.color }}>
                    {c.label}
                  </span>
                  <span style={{ fontFamily: T.mono, fontSize: 13, color: T.ink }}>{count}</span>
                </div>
                <div style={{ height: 3, background: "rgba(147,169,196,0.12)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: c.color, transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
            );
          })}

          <div style={{ borderTop: `1px solid ${T.hairline}`, marginTop: 18, paddingTop: 16 }}>
            <div className="rotulo" style={{ marginBottom: 11 }}>Relaciones</div>
            {stats.porTipo.filter(t => t.count > 0).map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <MuestraTrazo tipo={t} activo={false} />
                  <span style={{ fontFamily: T.body, fontSize: 13, fontWeight: 300, color: T.inkSec }}>{t.label}</span>
                </div>
                <span style={{ fontFamily: T.mono, fontSize: 13, color: T.ink }}>{t.count}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${T.hairline}`, marginTop: 18, paddingTop: 16 }}>
            <div className="rotulo" style={{ marginBottom: 11 }}>Elementos</div>
            {resultado.nodos.map(n => (
              <div key={n.id} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{
                  width: 3, alignSelf: "stretch", background: CATEGORIAS[n.categoria].color,
                  flexShrink: 0, borderRadius: 1,
                }} />
                <div style={{ fontFamily: T.body, fontSize: 12.5, fontWeight: 300, color: T.inkSec, lineHeight: 1.5 }}>
                  {n.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lectura */}
        <div style={{ flex: 1, overflowY: "auto", padding: "30px clamp(24px, 4vw, 52px) 60px", minWidth: 0 }}>
          <div style={{ maxWidth: 780 }}>
            {/* Selector: pestañas con filete, no tres botones de color */}
            <div style={{ display: "flex", gap: 0, marginBottom: 34, borderBottom: `1px solid ${T.hairline}`, flexWrap: "wrap" }}>
              {Object.entries(MARCOS).map(([key, m]) => {
                const on = marcoActivo === key;
                return (
                  <button
                    key={key}
                    className="btn"
                    onClick={() => setMarcoActivo(key)}
                    aria-pressed={on}
                    style={{
                      background: "transparent", border: "none",
                      borderBottom: `2px solid ${on ? m.color : "transparent"}`,
                      padding: "12px 20px 13px", textAlign: "left",
                      color: on ? T.ink : T.inkMuted, marginBottom: -1,
                    }}
                  >
                    <div style={{ fontFamily: T.display, fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.012em", marginBottom: 3 }}>
                      {m.titulo}
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.08em", color: on ? m.color : T.inkMuted, textTransform: "uppercase" }}>
                      {m.subtitulo}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cuerpo de la lectura: medida de lectura, serif, sin tarjeta */}
            <div key={marcoActivo} className="surge">
              <p style={{
                fontFamily: T.body, fontSize: 17.5, fontWeight: 300, lineHeight: 1.82,
                color: T.ink, margin: "0 0 30px", maxWidth: "68ch",
              }}>
                {generarLectura(marcoActivo, resultado.nodos, resultado.conexiones)}
              </p>

              <div style={{
                borderLeft: `2px solid ${marco.color}`, paddingLeft: 20, margin: "0 0 34px",
              }}>
                <div className="rotulo" style={{ color: marco.color, marginBottom: 9 }}>
                  Punto ciego de este marco
                </div>
                <p style={{
                  fontFamily: T.body, fontSize: 15.5, fontWeight: 300, fontStyle: "italic",
                  lineHeight: 1.75, color: T.inkSec, margin: 0, maxWidth: "62ch",
                }}>
                  {generarCeguera(marcoActivo, resultado.nodos, resultado.conexiones)}
                </p>
              </div>
            </div>

            <div style={{
              background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 2,
              padding: "18px 22px", marginBottom: 30,
            }}>
              <p style={{ fontFamily: T.body, fontSize: 14.5, fontWeight: 300, lineHeight: 1.72, color: T.inkSec, margin: 0 }}>
                <strong style={{ color: T.ink, fontWeight: 500 }}>Este análisis es una lectura de tu ensamblaje específico.</strong>{" "}
                Dos estudiantes con mapas distintos recibirán lecturas distintas. Lo que importa no es qué nodos elegiste, sino si puedes argumentar por qué esos factores —y sus relaciones— producen esta configuración y no otra.
              </p>
            </div>

            <button
              className="btn"
              onClick={() => setFase("reflexion")}
              style={{
                background: T.ink, color: T.void, border: `1px solid ${T.ink}`,
                padding: "14px 32px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.void; }}
            >Continuar: reflexión y cierre →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ PANTALLA: REFLEXIÓN Y CIERRE ═══════════════════ */

function PantallaReflexion({ resultado, onTerminar }) {
  const [reflexion, setReflexion]     = useState("");
  const [exportado, setExportado]     = useState(false);
  const [exportError, setExportError] = useState(false);

  const cats = {
    e: resultado.nodos.filter(n => n.categoria === "estructural").length,
    r: resultado.nodos.filter(n => n.categoria === "relacional").length,
    o: resultado.nodos.filter(n => n.categoria === "organizacional").length,
  };


  // Pregunta dinámica según el ensamblaje
  const generarPreguntaReflexion = () => {
    const ids = resultado.nodos.map(n => n.id);
    const nTens = resultado.conexiones.filter(c => c.tipo === "tensiona").length;
    if (ids.includes("n14") && ids.includes("n13")) return "Tu ensamblaje incluye tanto la cultura de independencia como el imaginario algorítmico. ¿Cómo se relacionan esos dos factores en tu análisis? ¿Uno limita al otro, o se refuerzan?";
    if (cats.e > cats.o + cats.r) return "Tu ensamblaje es predominantemente estructural. ¿Dónde queda la agencia del equipo editorial en tu análisis? ¿Qué habrían necesitado para tomar una decisión diferente?";
    if (nTens >= 3) return "Identificaste muchas tensiones en tu ensamblaje. ¿Cuál de esas fricciones fue más determinante para el resultado final? ¿Por qué?";
    if (ids.includes("n9")) return "Incluiste el convenio con VeritasNet en tu mapa. ¿Es el convenio una causa o un efecto en tu ensamblaje? ¿Qué lo hace posible y qué lo hace inevitable?";
    return "Con base en el ensamblaje que construiste: ¿cuál de los tres marcos te resultó más productivo analíticamente? ¿Qué elemento del ensamblaje crees que fue más determinante —y por qué es difícil responder esa pregunta?";
  };

  const handleExportar = () => {
    setExportError(false);
    try {
      const sep1 = "═".repeat(56);
      const sep2 = "─".repeat(42);
      const lineas = [
        "EL ENSAMBLAJE — CARTOGRAFÍA DE UNA DECISIÓN",
        "LAMA · Periodismo y Sociedad IV · Universidad del Valle",
        sep1,
        "",
        "CASO: " + CASO.titulo,
        "",
        sep2,
        `NODOS EN EL ENSAMBLAJE (${resultado.nodos.length})`,
        sep2,
        ...resultado.nodos.map(n =>
          `[${CATEGORIAS[n.categoria].label.toUpperCase()}] ${n.icono} ${n.label}\n   → ${n.descripcion}`
        ),
        "",
        sep2,
        `RELACIONES TRAZADAS (${resultado.conexiones.length})`,
        sep2,
        ...resultado.conexiones.map(c => {
          const from = resultado.nodos.find(n => n.id === c.from);
          const to   = resultado.nodos.find(n => n.id === c.to);
          const tipo = TIPOS_RELACION.find(t => t.id === c.tipo);
          return from && to
            ? `${from.label}\n   [${tipo?.label?.toUpperCase()}] →\n   ${to.label}`
            : null;
        }).filter(Boolean),
        "",
        sep2,
        "REFLEXIÓN PERSONAL",
        sep2,
        reflexion.trim() || "(sin reflexión registrada)",
        "",
        sep2,
        "PREGUNTAS PARA DISCUSIÓN GRUPAL",
        sep2,
        ...PREGUNTAS_CIERRE.map((p, i) => `${i + 1}. ${p}`),
        "",
        sep1,
        `Exportado: ${new Date().toLocaleString("es-CO")}`,
      ];
      const contenido = lineas.join("\n");
      const encoded   = encodeURIComponent(contenido);
      const dataUri   = "data:text/plain;charset=utf-8," + encoded;
      const a = document.createElement("a");
      a.href     = dataUri;
      a.download = "ensamblaje_el-faro-verifica.txt";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); }, 200);
      setExportado(true);
    } catch (err) {
      setExportError(true);
    }
  };


  return (
    <div className="plano grano" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Constelacion seed={904} n={34} opacidad={0.4} />

      <div style={{
        position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto",
        padding: "clamp(36px, 8vh, 76px) clamp(16px, 5vw, 40px) 88px",
      }}>
        <div className="rotulo" style={{ marginBottom: 14 }}>Cierre del análisis</div>
        <h2 style={{
          fontFamily: T.display, fontSize: "clamp(34px, 6vw, 56px)", fontWeight: 700,
          letterSpacing: "-0.035em", lineHeight: 0.98, color: T.ink, margin: "0 0 28px",
        }}>
          Reflexión y<br />transferencia
        </h2>

        {/* Lo que construiste */}
        <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 26, marginBottom: 38 }}>
          <div className="rotulo" style={{ marginBottom: 16 }}>Lo que construiste</div>

          {/* Las cifras primero, como instrumento */}
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              ["elementos", resultado.nodos.length, T.ink],
              ["estructurales", cats.e, CATEGORIAS.estructural.color],
              ["relacionales", cats.r, CATEGORIAS.relacional.color],
              ["organizacionales", cats.o, CATEGORIAS.organizacional.color],
              ["relaciones", resultado.conexiones.length, T.ink],
            ].map(([k, v, c]) => (
              <div key={k}>
                <div style={{ fontFamily: T.mono, fontSize: 30, color: c, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {String(v).padStart(2, "0")}
                </div>
                <div className="rotulo" style={{ fontSize: 9.5, marginTop: 6 }}>{k}</div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: T.body, fontSize: 16.5, fontWeight: 300, lineHeight: 1.8,
            color: T.inkSec, margin: 0, maxWidth: "64ch",
          }}>
            Ningún elemento “causó” la decisión por sí solo. Todos interactúan. Eso es precisamente lo que el enfoque sociotécnico hace visible y que el determinismo y el instrumentalismo no pueden ver por separado.
            {cats.e === 0 && " Tu análisis prescinde de factores estructurales, lo que es una apuesta analítica: implica que el resultado puede explicarse desde las relaciones y la organización interna del medio."}
            {cats.o === 0 && " Tu análisis no incluye factores organizacionales, lo que sitúa la explicación en el entorno externo y los vínculos del medio."}
          </p>
        </div>

        {/* Reflexión */}
        <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 26, marginBottom: 38 }}>
          <div className="rotulo" style={{ marginBottom: 14 }}>Tu reflexión analítica</div>
          <p style={{
            fontFamily: T.body, fontSize: 16.5, fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.72, color: T.ink, marginBottom: 18, maxWidth: "58ch",
          }}>
            {generarPreguntaReflexion()}
          </p>
          <textarea
            value={reflexion}
            onChange={e => setReflexion(e.target.value)}
            placeholder="Escribe tu análisis aquí. No hay respuesta correcta: lo que importa es la coherencia del argumento…"
            style={{
              width: "100%", minHeight: 156, background: T.surface,
              border: `1px solid ${T.hairline}`, borderRadius: 2,
              padding: "15px 17px", fontSize: 15.5, color: T.ink,
              resize: "vertical", boxSizing: "border-box",
              fontFamily: T.body, fontWeight: 300, lineHeight: 1.78, outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = CATEGORIAS.estructural.color}
            onBlur={e => e.target.style.borderColor = T.hairline}
          />
        </div>

        {/* Preguntas */}
        <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 26, marginBottom: 40 }}>
          <div className="rotulo" style={{ marginBottom: 20 }}>Preguntas para discusión grupal</div>
          {PREGUNTAS_CIERRE.map((p, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "auto 1fr", gap: 16,
              paddingBottom: 18, marginBottom: 18,
              borderBottom: i < PREGUNTAS_CIERRE.length - 1 ? `1px solid ${T.hairline}` : "none",
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkMuted, paddingTop: 4 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <p style={{ fontFamily: T.body, fontSize: 16, fontWeight: 300, lineHeight: 1.72, color: T.inkSec, margin: 0, maxWidth: "62ch" }}>
                {p}
              </p>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="btn"
            onClick={handleExportar}
            style={{
              background: exportado ? T.good : T.ink, color: T.void,
              border: `1px solid ${exportado ? T.good : T.ink}`,
              padding: "14px 30px", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase",
            }}
          >
            {exportado ? "✓ Exportado" : "↓ Exportar análisis (.txt)"}
          </button>
          <button
            className="btn"
            onClick={onTerminar}
            style={{
              background: "transparent", color: T.inkSec,
              border: `1px solid ${T.hairline}`, padding: "14px 26px",
              letterSpacing: "0.13em", textTransform: "uppercase",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.trace; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.hairline; e.currentTarget.style.color = T.inkSec; }}
          >Reiniciar →</button>
        </div>

        {exportError && (
          <div style={{ marginTop: 14, fontFamily: T.mono, fontSize: 12, color: CATEGORIAS.relacional.color }}>
            ⚠ No se pudo descargar el archivo. Copia tu reflexión manualmente antes de cerrar.
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ APP ════════════════════════════════ */

export default function App() {
  const [pantalla, setPantalla]   = useState("intro");
  const [resultado, setResultado] = useState(null);

  return (
    <>
      <EstilosGlobales />
      {pantalla === "intro" && <PantallaIntro onStart={() => setPantalla("canvas")} />}
      {pantalla === "canvas" && (
        <PantallaCanvas onTerminar={(res) => { setResultado(res); setPantalla("analisis"); }} />
      )}
      {pantalla === "analisis" && (
        <PantallaAnalisis resultado={resultado} onReflexion={() => setPantalla("intro")} />
      )}
    </>
  );
}
