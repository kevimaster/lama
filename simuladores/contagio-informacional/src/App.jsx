/**
 * ============================================================================
 * CONTAGIO INFORMACIONAL — ¿Por qué la desinformación sobrevive a su corrección?
 * LAMA-32 · Laboratorio de Mediaciones Algorítmicas · Universidad del Valle
 * ============================================================================
 *
 * ARCHIVO ÚNICO A PROPÓSITO: todo el simulador (motor + UI + estilos) vive en
 * este componente para que sea portable tal cual a un artefacto de Claude o a
 * CodePen (solo requiere React + ReactDOM). En el monorepo se envuelve con la
 * plantilla Vite estándar de LAMA.
 *
 * MAPA DEL ARCHIVO
 *   §1  Paleta y constantes visuales (validada con el método de 6 chequeos)
 *   §2  RNG con semilla (reproducibilidad de escenarios comparativos)
 *   §3  Generación de red (comunidades con homofilia, hubs, bots)
 *   §4  Layout de fuerza dirigida (Fruchterman–Reingold, se asienta al generar)
 *   §5  Motor de simulación (SEIZ adaptado + doble decaimiento + disonancia)
 *   §6  Escenarios situados y comparaciones guiadas
 *   §7  Componentes de visualización (grafo, curvas, indicador de disonancia)
 *   §8  Componente App (modos Explorar / Comparar / Guía)
 *   §9  Estilos globales
 *
 * CONVENCIÓN DE COMENTARIOS
 *   [PEDAGOGÍA] — por qué el modelo se comporta así (fundamento del sesgo)
 *   [TÉCNICA]   — cómo está implementado (rendimiento, estructura)
 * ============================================================================
 */

import React, {
  useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
 * §1 · PALETA Y CONSTANTES VISUALES
 * [TÉCNICA] Paleta validada contra superficie oscura (#0f1420 fondo de grafo,
 * #161d2b paneles): banda de luminosidad, piso de croma, separación CVD y
 * contraste ≥3:1. El par rojo↔aqua queda en banda CVD 6–8, por eso cada estado
 * lleva codificación secundaria de FORMA además de color (ver §7 GraphView):
 * susceptible = anillo vacío, expuesto = disco pequeño, creyente = disco con
 * halo, escéptico = dona, corregido = dona con núcleo rojo, bot = rombo.
 * ═══════════════════════════════════════════════════════════════════════════ */
const C = {
  bg:        '#0f1420',
  panel:     '#161d2b',
  panelSoft: '#1c2436',
  line:      'rgba(255,255,255,0.08)',
  ink:       '#f1f4f9',
  inkSec:    '#b9c2d4',
  muted:     '#8a93a6',
  grid:      '#252d40',

  // Estados de agente (identidad categórica)
  S: '#57627a',   // susceptible — fuera del canal de color: nodo vacío
  E: '#eda100',   // expuesto (indeciso)
  I: '#e34948',   // creyente de la desinformación
  Z: '#1baf7a',   // escéptico (rechazó / inoculado)
  Corr: '#3987e5',// corregido (creyó y aceptó la corrección)

  veridico: '#008300', // contenido verídico (solo en curvas)
  diss:     '#ec835a', // disonancia — rol de estado "tensión", con ícono + rótulo
};

const MAX_T = 240;         // 240 horas simuladas = 10 días
const N_HUMANOS = 132;
const N_BOTS = 8;

/* ═══════════════════════════════════════════════════════════════════════════
 * §2 · RNG CON SEMILLA
 * [TÉCNICA] mulberry32: rápido y reproducible. La misma semilla genera la
 * misma red y la misma secuencia de azar — requisito para que los escenarios
 * comparativos (A vs. B) difieran SOLO en el factor que se está estudiando.
 * ═══════════════════════════════════════════════════════════════════════════ */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * §3 · GENERACIÓN DE RED
 * [PEDAGOGÍA] La red se construye con 4 comunidades de afinidad ideológica
 * distinta frente al marco del contenido. En modo "cámara de eco" casi todos
 * los enlaces son intracomunitarios (homofilia alta); en modo "heterogénea"
 * se recablea una fracción de enlaces entre comunidades. Los hubs representan
 * cuentas con audiencias grandes (superpropagadores); los bots son cuentas
 * automatizadas ancladas a la comunidad más afín a la desinformación.
 * ═══════════════════════════════════════════════════════════════════════════ */
function buildNetwork(seed, topology, withBots) {
  const rnd = mulberry32(seed);
  const agents = [];
  const edges = [];
  const nCom = 4;
  const perCom = N_HUMANOS / nCom;
  // Afinidad media de cada comunidad con el marco del contenido desinformativo
  const afinidadCom = [0.82, 0.62, 0.38, 0.18];

  for (let i = 0; i < N_HUMANOS; i++) {
    const com = Math.floor(i / perCom);
    agents.push({
      id: i, com,
      afinidad: Math.min(1, Math.max(0, afinidadCom[com] + (rnd() - 0.5) * 0.3)),
      isBot: false, isHub: false, deg: 0,
      x: 0, y: 0, nb: [],
    });
  }

  const addEdge = (a, b) => {
    if (a === b) return;
    if (agents[a].nb.includes(b)) return;
    agents[a].nb.push(b); agents[b].nb.push(a);
    agents[a].deg++; agents[b].deg++;
    edges.push([a, b]);
  };

  // [TÉCNICA] Anillo intracomunitario + atajos. Ambas topologías tienen el
  // MISMO número de aristas: lo que cambia es la MEZCLA (qué fracción de los
  // atajos cruza comunidades). Así la comparación eco/heterogénea aísla la
  // homofilia y no la densidad de la red.
  const pInter = topology === 'eco' ? 0.05 : 0.30;
  const otraComunidad = com => {
    let c2 = Math.floor(rnd() * nCom);
    if (c2 === com) c2 = (c2 + 1) % nCom;
    return c2 * perCom + Math.floor(rnd() * perCom);
  };
  for (let c = 0; c < nCom; c++) {
    const base = c * perCom;
    for (let k = 0; k < perCom; k++) {
      addEdge(base + k, base + ((k + 1) % perCom));
      if (rnd() < 0.85) {
        const target = rnd() < pInter
          ? otraComunidad(c)
          : base + Math.floor(rnd() * perCom);
        addEdge(base + k, target);
      }
    }
  }

  // [PEDAGOGÍA] Superpropagadores: 6 cuentas con muchos más enlaces que el
  // promedio. Su existencia explica por qué unas pocas cuentas concentran
  // gran parte de la difusión (distribución de grado sesgada).
  for (let h = 0; h < 6; h++) {
    const id = Math.floor(rnd() * N_HUMANOS);
    agents[id].isHub = true;
    const extra = 9 + Math.floor(rnd() * 5);
    for (let e = 0; e < extra; e++) {
      // en cámara de eco el hub conecta sobre todo con su comunidad
      const sameCom = topology === 'eco' ? rnd() < 0.8 : rnd() < 0.4;
      const target = sameCom
        ? agents[id].com * perCom + Math.floor(rnd() * perCom)
        : Math.floor(rnd() * N_HUMANOS);
      addEdge(id, target);
    }
  }

  // Bots: anclados a las dos comunidades más afines (donde el contenido "prende")
  if (withBots) {
    for (let b = 0; b < N_BOTS; b++) {
      const id = N_HUMANOS + b;
      agents.push({
        id, com: b % 2, afinidad: 1, isBot: true, isHub: false, deg: 0,
        x: 0, y: 0, nb: [],
      });
      const nLinks = 6 + Math.floor(rnd() * 3);
      for (let e = 0; e < nLinks; e++) {
        const target = (b % 2) * perCom + Math.floor(rnd() * perCom * 2);
        addEdge(id, Math.min(target, N_HUMANOS - 1));
      }
    }
  }

  settleLayout(agents, edges, rnd);
  return { agents, edges, seed, topology, withBots };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * §4 · LAYOUT DE FUERZA DIRIGIDA
 * [TÉCNICA] Fruchterman–Reingold clásico, 260 iteraciones síncronas al generar
 * la red (~150 nodos → <100 ms). Las posiciones quedan FIJAS después: durante
 * la simulación solo cambian colores/formas, nunca posiciones. Esto garantiza
 * fluidez con 100–150 nodos sin necesidad de web workers ni quadtrees.
 * ═══════════════════════════════════════════════════════════════════════════ */
const VIEW_W = 1000, VIEW_H = 720;
function settleLayout(agents, edges, rnd) {
  const W = VIEW_W, H = VIEW_H, n = agents.length;
  // Siembra por comunidad en cuadrantes para que el layout converja rápido
  const cx = [0.28, 0.72, 0.28, 0.72], cy = [0.3, 0.3, 0.7, 0.7];
  agents.forEach(a => {
    a.x = cx[a.com % 4] * W + (rnd() - 0.5) * 160;
    a.y = cy[a.com % 4] * H + (rnd() - 0.5) * 160;
  });
  const k = Math.sqrt((W * H) / n) * 0.72;
  let temp = W * 0.09;
  for (let iter = 0; iter < 260; iter++) {
    const dx = new Float64Array(n), dy = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let vx = agents[i].x - agents[j].x, vy = agents[i].y - agents[j].y;
        let d2 = vx * vx + vy * vy; if (d2 < 1) d2 = 1;
        const d = Math.sqrt(d2), f = (k * k) / d2;
        vx = (vx / d) * f * d; vy = (vy / d) * f * d;
        dx[i] += vx / d; dy[i] += vy / d; dx[j] -= vx / d; dy[j] -= vy / d;
      }
    }
    for (const [a, b] of edges) {
      let vx = agents[a].x - agents[b].x, vy = agents[a].y - agents[b].y;
      const d = Math.sqrt(vx * vx + vy * vy) || 1;
      const f = (d * d) / k / d;
      dx[a] -= vx * f * 0.5 / d * 2; dy[a] -= vy * f * 0.5 / d * 2;
      dx[b] += vx * f * 0.5 / d * 2; dy[b] += vy * f * 0.5 / d * 2;
    }
    for (let i = 0; i < n; i++) {
      // gravedad suave al centro para no perder nodos sueltos
      dx[i] += (W / 2 - agents[i].x) * 0.012;
      dy[i] += (H / 2 - agents[i].y) * 0.012;
      const d = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) || 1;
      const lim = Math.min(d, temp);
      agents[i].x += (dx[i] / d) * lim;
      agents[i].y += (dy[i] / d) * lim;
      agents[i].x = Math.max(24, Math.min(W - 24, agents[i].x));
      agents[i].y = Math.max(24, Math.min(H - 24, agents[i].y));
    }
    temp *= 0.985;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * §5 · MOTOR DE SIMULACIÓN
 *
 * [PEDAGOGÍA] Modelo SEIZ adaptado con memoria dual. Cada agente humano tiene:
 *   estado ∈ {S susceptible, E expuesto, I creyente, Z escéptico, C corregido}
 *   contentRet — retención del CONTENIDO (la afirmación): decae LENTO.
 *   sourceRet  — retención de la FUENTE / del contexto (quién lo dijo, si fue
 *                desmentido): decae RÁPIDO. La brecha entre ambas curvas ES la
 *                amnesia de la fuente (Johnson, Hashtroudi & Lindsay, 1993).
 *   disonancia — tensión entre creencia y evidencia contradictoria
 *                (Festinger, 1957). Si supera el umbral de resistencia, el
 *                agente RECHAZA la corrección (razonamiento motivado) y puede
 *                reforzar su creencia (efecto rebote / backfire).
 *
 * La mecánica clave es la RECAÍDA (efecto durmiente / influencia continuada,
 * Lewandowsky et al., 2012): un agente corregido cuya memoria de la corrección
 * (sourceRet) cae por debajo del umbral mientras el contenido sigue vivo en su
 * memoria (contentRet alto) puede volver a creer: "me suena que eso era cierto".
 * Esto hace que la brecha entre las dos curvas tenga CONSECUENCIAS en la red,
 * no sea solo un gráfico.
 * ═══════════════════════════════════════════════════════════════════════════ */
const CONTENT_HL = 140; // vida media de la memoria del contenido (horas sim.)

class Engine {
  /**
   * @param network  red compartida (se clona el estado dinámico, no la estructura)
   * @param ctl      parámetros vivos (los sliders mutan este objeto)
   * @param content  {viral, adoptBase, emotividad, usaBots} — pieza que circula
   * @param flags    {factCheck, corrTime, amnesia, esSombra}
   */
  constructor(network, ctl, content, flags) {
    this.net = network;
    this.ctl = ctl;
    this.content = content;
    this.flags = { amnesia: true, ...flags };
    this.rnd = mulberry32(network.seed * 7919 + (flags.esSombra ? 13 : 1));
    this.reset();
  }

  reset() {
    this.t = 0;
    this.corrActiva = false;
    this.corrStart = 0;
    this.recaidas = 0;
    this.rechazos = 0;   // correcciones rechazadas por razonamiento motivado
    this.backfires = 0;
    this.st = this.net.agents.map(a => ({
      estado: 'S', contentRet: 0, sourceRet: 0, disonancia: 0,
      exposiciones: 0, zeal: 0, corrAware: false, adoptoAlgunaVez: false,
      isBot: a.isBot,
    }));
    this.history = {
      t: [], pctI: [], pctC: [], pctZ: [], pctE: [],
      meanC: [], meanS: [], diss: [], recaidas: [],
    };
    // [PEDAGOGÍA] Paciente cero: 3 agentes de la comunidad más afín. La
    // desinformación no nace en el "centro" de la red sino donde resuena.
    const seeds = this.net.agents
      .filter(a => !a.isBot && a.com === 0)
      .slice(0, 3);
    seeds.forEach(a => {
      const s = this.st[a.id];
      s.estado = 'I'; s.contentRet = 1; s.sourceRet = 1; s.adoptoAlgunaVez = true;
    });
    this.pushMetrics();
  }

  /* Un tick = una hora simulada */
  step() {
    if (this.t >= MAX_T) return false;
    this.t++;
    const { agents } = this.net;
    const st = this.st;
    const ctl = this.ctl;
    const cont = this.content;
    const rnd = this.rnd;

    const nHum = agents.filter(a => !a.isBot).length;
    const nI = st.filter((s, i) => !agents[i].isBot && s.estado === 'I').length;

    // [PEDAGOGÍA] Amplificación algorítmica: el multiplicador crece con el
    // "engagement" ya logrado (rich-get-richer) y con la emotividad del
    // contenido. Por eso amplifica MÁS a la desinformación (emotiva) que a la
    // versión verificada del mismo hecho.
    const ampOn = ctl.amp && !this.flags.esSombra ? 1 : (ctl.amp ? 0.35 : 0);
    const ampMult = 1 + ampOn * 1.6 * Math.min(1, nI / (0.3 * nHum)) * cont.emotividad;

    const beta = ctl.beta;

    // ── 1) Difusión del contenido ──────────────────────────────────────────
    const exposiciones = [];
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i], s = st[i];
      const esEmisor = s.estado === 'I' || (a.isBot && cont.usaBots && !this.flags.esSombra);
      if (!esEmisor) continue;
      // [PEDAGOGÍA] Bots publican varias veces por hora, sin cansarse; el zeal
      // (celo post-backfire) hace que un creyente reforzado comparta más.
      const intentos = a.isBot ? 3 : 1;
      const boost = s.zeal > 0 ? 1.5 : 1;
      for (let it = 0; it < intentos; it++) {
        for (const nbId of a.nb) {
          if (rnd() < beta * cont.viral * ampMult * boost) exposiciones.push(nbId);
        }
      }
    }
    for (const id of exposiciones) {
      const s = st[id];
      if (s.isBot) continue;
      if (s.estado === 'S') {
        s.estado = 'E'; s.exposiciones = 1;
        s.contentRet = Math.max(s.contentRet, 0.5);
        s.sourceRet = Math.max(s.sourceRet, 0.6);
      } else if (s.estado === 'E') {
        s.exposiciones++;
        s.contentRet = Math.max(s.contentRet, 0.6);
      } else if (s.estado === 'I') {
        s.contentRet = 1; // el contenido sigue circulando: la memoria se refresca
      } else if (s.estado === 'C') {
        // [PEDAGOGÍA] Reexposición de un corregido: refresca la memoria del
        // CONTENIDO pero no la de la corrección → acelera la recaída. Este
        // detalle es el efecto de influencia continuada en miniatura.
        s.contentRet = Math.max(s.contentRet, 0.85);
        s.exposiciones++;
      }
    }

    // ── 2) Adopción o rechazo (E → I | Z) ─────────────────────────────────
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i], s = st[i];
      if (a.isBot || s.estado !== 'E') continue;
      // [PEDAGOGÍA] Razonamiento motivado en la adopción: la probabilidad de
      // creer crece con la afinidad previa al marco del contenido. Verdad
      // ilusoria (opcional): cada exposición repetida suma credibilidad.
      const ilusoria = ctl.ilusoria
        ? Math.min(1.8, 1 + 0.2 * Math.max(0, s.exposiciones - 1))
        : 1;
      const pAdopta = cont.adoptBase * (0.25 + 0.75 * a.afinidad) * ilusoria;
      const pRechaza = 0.05 + 0.09 * (1 - a.afinidad);
      const r = rnd();
      if (r < pAdopta) {
        s.estado = 'I'; s.contentRet = 1; s.sourceRet = 1; s.adoptoAlgunaVez = true;
      } else if (r < pAdopta + pRechaza) {
        s.estado = 'Z';
      }
    }

    // ── 3) Corrección / verificación ──────────────────────────────────────
    if (!this.flags.esSombra && ctl.factCheck && !this.corrActiva && this.t >= this.flags.corrTime) {
      this.sembrarCorreccion();
    }
    if (this.corrActiva) {
      // [PEDAGOGÍA] El desmentido tiene CICLO DE NOTICIA: se comparte con
      // fuerza unos días y luego deja de circular (corrVigor → 0), aunque la
      // desinformación siga viva. Esta asimetría es clave: cuando el desmentido
      // sale del feed, la memoria de la corrección queda sola frente al olvido
      // — y ahí empiezan las recaídas.
      const corrVigor = Math.exp(-(this.t - this.corrStart) / 60);
      if (corrVigor > 0.05) {
        const correcciones = [];
        for (let i = 0; i < agents.length; i++) {
          const a = agents[i], s = st[i];
          const emiteCorr = s.corrAware && (s.estado === 'Z' || s.estado === 'C');
          if (!emiteCorr) continue;
          for (const nbId of a.nb) {
            // [PEDAGOGÍA] Las correcciones son menos "compartibles" que la pieza
            // original (menos emotivas): viralidad 0.55×. La amplificación
            // algorítmica apenas las ayuda (1.15× vs 1.6× de la desinformación).
            if (rnd() < beta * 0.65 * (ctl.amp ? 1.15 : 1) * corrVigor) correcciones.push(nbId);
          }
        }
        for (const id of correcciones) this.corregir(id);
      }
    }

    // ── 4) Decaimiento de memorias, disonancia y RECAÍDA ──────────────────
    const decayC = Math.pow(0.5, 1 / CONTENT_HL);
    // [PEDAGOGÍA] El slider de "olvido de la fuente" controla la vida media de
    // sourceRet. Con amnesia desactivada (solo en comparaciones), la fuente se
    // olvida al mismo ritmo que el contenido: las curvas van en paralelo y la
    // recaída nunca se dispara. Esa diferencia ES el experimento.
    const sourceHL = this.flags.amnesia ? ctl.sourceHL : CONTENT_HL;
    const decayS = Math.pow(0.5, 1 / sourceHL);

    for (let i = 0; i < agents.length; i++) {
      const s = st[i];
      if (s.isBot || s.estado === 'S') continue;
      s.contentRet *= decayC;
      s.sourceRet *= decayS;
      s.disonancia *= 0.985;
      if (s.zeal > 0) s.zeal--;
      if (
        s.estado === 'C' && this.flags.amnesia &&
        s.sourceRet < 0.30 && s.contentRet > 0.40 &&
        rnd() < 0.015 + 0.03 * s.contentRet
      ) {
        // [PEDAGOGÍA] RECAÍDA: olvidó la corrección, recuerda la afirmación.
        // "¿Dónde leí eso? No sé, pero me suena que era cierto."
        s.estado = 'I';
        s.corrAware = false;
        this.recaidas++;
      }
    }

    this.pushMetrics();
    return this.t < MAX_T;
  }

  sembrarCorreccion() {
    // [PEDAGOGÍA] La corrección la inician 5 cuentas verificadoras: agentes de
    // baja afinidad y buen grado (medios / fact-checkers con audiencia).
    this.corrActiva = true;
    this.corrStart = this.t;
    const candidatos = this.net.agents
      .filter(a => !a.isBot && this.st[a.id].estado !== 'I')
      .sort((a, b) => (a.afinidad - b.afinidad) || (b.deg - a.deg))
      .slice(0, 5);
    candidatos.forEach(a => {
      const s = this.st[a.id];
      s.corrAware = true;
      if (s.estado === 'S' || s.estado === 'E') s.estado = 'Z';
    });
  }

  corregir(id) {
    const s = this.st[id];
    if (s.isBot) return; // los bots no se corrigen: no creen nada
    const a = this.net.agents[id];
    if (s.estado === 'S' || s.estado === 'E') {
      // [PEDAGOGÍA] Inoculación (prebunk): recibir la corrección ANTES que la
      // desinformación vacuna al agente. Por eso el timing importa tanto.
      s.estado = 'Z'; s.corrAware = true;
    } else if (s.estado === 'Z') {
      s.corrAware = true;
    } else if (s.estado === 'C') {
      s.sourceRet = Math.max(s.sourceRet, 0.9); // recordatorio de la corrección
    } else if (s.estado === 'I') {
      // [PEDAGOGÍA] Núcleo de la disonancia cognitiva: la corrección genera
      // tensión proporcional a cuánto compromete la identidad (afinidad).
      s.disonancia = Math.min(1, s.disonancia + 0.3 + 0.45 * a.afinidad);
      const umbral = 1 - this.ctl.resistencia; // slider: resistencia a la corrección
      if (s.disonancia < umbral) {
        // Acepta: resuelve la disonancia actualizando la creencia.
        // OJO: contentRet NO se borra — la afirmación sigue en su memoria,
        // solo que ahora etiquetada como falsa... mientras recuerde la etiqueta.
        s.estado = 'C'; s.corrAware = true;
        s.sourceRet = 1;
        s.disonancia *= 0.55;
      } else {
        // Razonamiento motivado: rechaza la corrección para proteger la creencia.
        this.rechazos++;
        if (a.afinidad > 0.55 && this.rnd() < 0.3) {
          // [PEDAGOGÍA] Efecto rebote (backfire): la corrección percibida como
          // ataque identitario REFUERZA la creencia y las ganas de compartirla.
          s.contentRet = Math.min(1, s.contentRet + 0.15);
          s.zeal = 12;
          this.backfires++;
        }
      }
    }
  }

  pushMetrics() {
    const st = this.st;
    const hum = [];
    for (let i = 0; i < st.length; i++) if (!st[i].isBot) hum.push(st[i]);
    const n = hum.length;
    const cnt = { I: 0, C: 0, Z: 0, E: 0 };
    let sumC = 0, sumS = 0, nMem = 0, sumD = 0;
    for (const s of hum) {
      if (cnt[s.estado] !== undefined) cnt[s.estado]++;
      sumD += s.disonancia;
      // Las curvas de memoria se promedian sobre quienes ALGUNA VEZ creyeron:
      // es su memoria la que cuenta para la amnesia de la fuente.
      if (s.adoptoAlgunaVez) { sumC += s.contentRet; sumS += s.sourceRet; nMem++; }
    }
    const h = this.history;
    h.t.push(this.t);
    h.pctI.push(cnt.I / n);
    h.pctC.push(cnt.C / n);
    h.pctZ.push(cnt.Z / n);
    h.pctE.push(cnt.E / n);
    h.meanC.push(nMem ? sumC / nMem : null);
    h.meanS.push(nMem ? sumS / nMem : null);
    h.diss.push(sumD / n);
    h.recaidas.push(this.recaidas);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * §6 · ESCENARIOS SITUADOS Y COMPARACIONES GUIADAS
 * [PEDAGOGÍA] Capa 1 (mecanismos de fabricación) entra como CONTEXTO NARRATIVO:
 * cada escenario encarna una tipología (descontextualización, manipulación de
 * imagen, amplificación automatizada) anclada al ecosistema mediático
 * latinoamericano (WhatsApp, Facebook, X), y ajusta los parámetros del motor.
 * ═══════════════════════════════════════════════════════════════════════════ */
const ESCENARIOS = [
  {
    id: 'whatsapp', icono: '🎙️', plataforma: 'WhatsApp',
    nombre: 'La cadena de WhatsApp',
    tipologia: 'Descontextualización',
    titular: '«Audio filtrado: suben el pasaje del transporte público la próxima semana»',
    historia: 'Un audio real, grabado hace tres años en otro país, vuelve a circular en cadenas familiares como si fuera de esta semana y de tu ciudad. Nada en el audio es falso; lo falso es el contexto. Por eso es tan difícil de desmentir: "yo lo oí con mis propios oídos".',
    params: { viral: 0.95, adoptBase: 0.32, emotividad: 0.9, bots: false, amp: false },
  },
  {
    id: 'facebook', icono: '📷', plataforma: 'Facebook',
    nombre: 'La foto del paro',
    tipologia: 'Manipulación de imagen',
    titular: '«La foto que los medios no quieren que veas de la marcha de ayer»',
    historia: 'Durante un paro nacional circula en grupos de Facebook una imagen editada: se recortó una multitud de otro evento y se le superpuso una consigna. La foto confirma lo que cada grupo ya creía de la protesta — y por eso cada grupo la comparte sin verificarla.',
    params: { viral: 1.0, adoptBase: 0.35, emotividad: 1.0, bots: false, amp: true },
  },
  {
    id: 'x', icono: '🤖', plataforma: 'X',
    nombre: 'La tendencia fabricada',
    tipologia: 'Amplificación automatizada',
    titular: '«#FraudeEnLasUrnas: miles denuncian irregularidades en el conteo»',
    historia: 'Una red de cuentas automatizadas empuja un hashtag electoral hasta volverlo tendencia. El algoritmo, que premia el engagement, hace el resto: personas reales empiezan a verlo "en todas partes" — y verlo en todas partes se siente como evidencia.',
    params: { viral: 1.05, adoptBase: 0.34, emotividad: 1.0, bots: true, amp: true },
  },
];

// La versión verificada del MISMO hecho: menos emotiva → menos viral,
// adopción más lenta, los bots no la empujan y el algoritmo apenas la premia.
const CONTENIDO_VERIDICO = { viral: 0.5, adoptBase: 0.15, emotividad: 0.3, usaBots: false };

const COMPARACIONES = [
  {
    id: 'timing',
    titulo: 'Corrección temprana vs. tardía',
    desc: 'La misma red, la misma pieza. La verificación llega a las 18 horas en un caso y a las 84 en el otro.',
    A: { label: 'Corrección a las 18 h', ov: { factCheck: true, corrTime: 18 } },
    B: { label: 'Corrección a las 84 h', ov: { factCheck: true, corrTime: 84 } },
    pregunta: 'Diez días después, ¿qué diferencia habrá entre los dos escenarios?',
    opciones: [
      'La temprana termina con muchos menos creyentes',
      'Terminan parecido — pero la temprana evitó que mucha más gente llegara a creer alguna vez',
      'Ninguna diferencia relevante: mismo pico y mismo final',
    ],
    evaluar: (A, B) => {
      const fA = A.history.pctI.at(-1), fB = B.history.pctI.at(-1);
      const pA = Math.max(...A.history.pctI), pB = Math.max(...B.history.pctI);
      const zA = A.history.pctZ.at(-1), zB = B.history.pctZ.at(-1);
      const idx = fB - fA > 0.08 ? 0 : (pB - pA > 0.08 ? 1 : 2);
      return {
        idx,
        texto: `Creyentes al final: ${pct(fA)} (temprana) vs. ${pct(fB)} (tardía) — pero el PICO fue ${pct(pA)} vs. ${pct(pB)}, y los escépticos inoculados ${pct(zA)} vs. ${pct(zB)}. La corrección temprana vale menos por lo que desmiente que por lo que PREVIENE (prebunk): protege a quienes aún no habían visto la pieza. Y ojo al final: con el paso de los días la amnesia de la fuente erosiona AMBAS correcciones (${A.recaidas} y ${B.recaidas} recaídas) — llegar temprano no exime de tener que repetir el desmentido.`,
      };
    },
  },
  {
    id: 'red',
    titulo: 'Cámara de eco vs. red heterogénea',
    desc: 'La misma pieza en dos arquitecturas de red: una segregada por afinidad, otra con muchos puentes entre comunidades.',
    A: { label: 'Cámara de eco', ov: { topology: 'eco' } },
    B: { label: 'Red heterogénea', ov: { topology: 'hetero' } },
    pregunta: 'En las primeras 24 horas, ¿dónde se propaga más rápido la desinformación?',
    opciones: [
      'En la cámara de eco: dentro de la burbuja afín no encuentra resistencia',
      'En la heterogénea: más puentes = más alcance desde el inicio',
      'Igual en ambas: la pieza es la misma',
    ],
    evaluar: (A, B) => {
      const a24 = A.history.pctI[24] ?? 0, b24 = B.history.pctI[24] ?? 0;
      const idx = a24 > b24 * 1.15 ? 0 : (b24 > a24 * 1.15 ? 1 : 2);
      return {
        idx,
        texto: `A las 24 h: ${pct(a24)} de creyentes en la cámara de eco vs. ${pct(b24)} en la heterogénea; al final, ${pct(A.history.pctI.at(-1))} vs. ${pct(B.history.pctI.at(-1))}. Resultado incómodo para la intuición: los PUENTES propagan — la red heterogénea da a la pieza acceso a toda la red, mientras la cámara de eco la concentra en su burbuja. El precio de la burbuja es otro: dentro de ella la creencia se vuelve densa y homogénea, y cuando llegue una corrección desde afuera, encontrará la puerta cerrada. La homofilia no acelera el contagio global: lo blinda.`,
      };
    },
  },
  {
    id: 'amnesia',
    titulo: 'Con amnesia de la fuente vs. sin amnesia',
    desc: 'El experimento imposible en la vida real: la misma red, pero en B los agentes recuerdan la corrección tanto tiempo como recuerdan el contenido.',
    A: { label: 'Amnesia de la fuente activa', ov: { factCheck: true, corrTime: 30, amnesia: true } },
    B: { label: 'Sin amnesia (memoria pareja)', ov: { factCheck: true, corrTime: 30, amnesia: false } },
    pregunta: 'La corrección llega a las 30 h en ambos casos. ¿Qué pasará con quienes la aceptaron?',
    opciones: [
      'En A muchos volverán a creer cuando olviden la corrección; en B no',
      'Lo mismo en ambos: una vez corregido, corregido queda',
      'En B habrá más recaídas: recordar la corrección genera más disonancia',
    ],
    evaluar: (A, B) => {
      const rA = A.recaidas, rB = B.recaidas;
      const idx = rA > rB + 2 ? 0 : (rB > rA + 2 ? 2 : 1);
      return {
        idx,
        texto: `Recaídas: ${rA} en A (con amnesia) vs. ${rB} en B (sin amnesia). Cuando la memoria de la corrección decae más rápido que la del contenido, la corrección tiene fecha de vencimiento: el agente recuerda la afirmación, olvida el desmentido, y vuelve a creer. Mira la brecha entre las dos curvas del panel de memoria en A — esa brecha son estas recaídas.`,
      };
    },
  },
  {
    id: 'factcheck',
    titulo: 'Con verificación vs. sin verificación',
    desc: 'Intervención contra no-intervención: en A los verificadores actúan a las 24 h; en B nadie corrige nunca.',
    A: { label: 'Con fact-checking (24 h)', ov: { factCheck: true, corrTime: 24 } },
    B: { label: 'Sin fact-checking', ov: { factCheck: false } },
    pregunta: '¿Cuánto logra reducir la verificación el número final de creyentes?',
    opciones: [
      'Mucho: la corrección casi elimina la creencia',
      'Bastante, pero queda un núcleo que resiste toda corrección',
      'Casi nada: corregir no sirve',
    ],
    evaluar: (A, B) => {
      const fA = A.history.pctI.at(-1), fB = B.history.pctI.at(-1);
      const reduccion = fB > 0 ? 1 - fA / fB : 0;
      const idx = reduccion > 0.75 ? 0 : (reduccion > 0.2 ? 1 : 2);
      return {
        idx,
        texto: `Sin verificación: ${pct(fB)} de creyentes. Con verificación: ${pct(fA)} (${A.rechazos} correcciones fueron rechazadas por razonamiento motivado y hubo ${A.recaidas} recaídas por amnesia). La verificación importa — y aun así nunca borra del todo: entre la disonancia y el olvido de la fuente, siempre queda un residuo. Ese residuo es la lección.`,
      };
    },
  },
];

const pct = v => `${Math.round((v ?? 0) * 100)}%`;

/* Parámetros de control por defecto (los sliders mutan una copia viva) */
const CTL_DEFAULT = {
  beta: 0.05,        // velocidad de propagación por enlace y hora
  sourceHL: 24,      // vida media de la memoria de fuente (horas)
  resistencia: 0.35, // resistencia a la corrección (razonamiento motivado)
  factCheck: true,
  amp: false,
  ilusoria: false,   // efecto de verdad ilusoria (extensión opcional)
};

/* ═══════════════════════════════════════════════════════════════════════════
 * §7 · COMPONENTES DE VISUALIZACIÓN
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Grafo de red. [TÉCNICA] Los enlaces se dibujan como UN solo <path> memoizado
 *  (la estructura no cambia durante la corrida); solo los nodos se re-renderizan
 *  en cada tick visible. Con ≤150 nodos a ~12 fps el costo es despreciable. */
function GraphView({ engine, netVersion, compact = false }) {
  const [hover, setHover] = useState(null);
  const agents = engine.net.agents;

  const edgePath = useMemo(() => {
    let d = '';
    for (const [a, b] of engine.net.edges) {
      d += `M${agents[a].x.toFixed(1)} ${agents[a].y.toFixed(1)}L${agents[b].x.toFixed(1)} ${agents[b].y.toFixed(1)}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netVersion]);

  const fill = s => (
    s.estado === 'E' ? C.E :
    s.estado === 'I' ? C.I :
    s.estado === 'Z' ? C.Z :
    s.estado === 'C' ? C.Corr : 'none'
  );

  const hv = hover != null ? { a: agents[hover], s: engine.st[hover] } : null;

  return (
    <div className="graph-wrap">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="graph-svg"
        role="img"
        aria-label="Grafo de la red de agentes; el color y la forma de cada nodo indican su estado frente al contenido"
      >
        <path d={edgePath} stroke="rgba(160,175,205,0.13)" strokeWidth="1" fill="none" />
        {agents.map(a => {
          const s = engine.st[a.id];
          const r = a.isHub ? 8 : a.isBot ? 5.5 : 5;
          const f = fill(s);
          const conDisonancia = s.disonancia > 0.45;
          if (a.isBot) {
            // Bot: rombo (identidad por FORMA; el relleno sigue su función: difundir)
            return (
              <g key={a.id} transform={`translate(${a.x},${a.y})`}
                 onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}>
                <rect x={-r} y={-r} width={r * 2} height={r * 2}
                      transform="rotate(45)" fill={C.I} stroke="#fff" strokeWidth="1.1" opacity="0.9" />
              </g>
            );
          }
          return (
            <g key={a.id} transform={`translate(${a.x},${a.y})`}
               onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
               className={conDisonancia ? 'nodo-disonante' : undefined}>
              {a.isHub && <circle r={r + 2.5} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />}
              {s.estado === 'S' && <circle r={r} fill="none" stroke={C.S} strokeWidth="1.6" />}
              {s.estado === 'E' && <circle r={r * 0.8} fill={C.E} />}
              {s.estado === 'I' && (
                <circle r={r} fill={C.I} opacity={0.55 + 0.45 * s.contentRet} />
              )}
              {s.estado === 'Z' && (
                // Escéptico: dona (anillo grueso, centro vacío)
                <circle r={r * 0.72} fill="none" stroke={C.Z} strokeWidth={r * 0.55} />
              )}
              {s.estado === 'C' && (
                <>
                  {/* Corregido: dona azul CON NÚCLEO ROJO = el contenido sigue en
                      su memoria; el núcleo se apaga solo si contentRet decae. */}
                  <circle r={r * 0.72} fill="none" stroke={C.Corr} strokeWidth={r * 0.55} />
                  <circle r={r * 0.4} fill={C.I} opacity={s.contentRet} />
                </>
              )}
              {conDisonancia && (
                <circle r={r + 3} fill="none" stroke={C.diss} strokeWidth="1.5" opacity="0.8" />
              )}
            </g>
          );
        })}
      </svg>
      {hv && (
        <div className="tooltip" style={{
          left: `${(hv.a.x / VIEW_W) * 100}%`,
          top: `${(hv.a.y / VIEW_H) * 100}%`,
        }}>
          <strong>
            {hv.a.isBot ? 'Bot (cuenta automatizada)' :
             hv.a.isHub ? 'Superpropagador' : `Agente ${hv.a.id}`}
          </strong>
          {!hv.a.isBot && (
            <>
              <div>Estado: {NOMBRE_ESTADO[hv.s.estado]}</div>
              <div>Memoria del contenido: {pct(hv.s.contentRet)}</div>
              <div>Memoria de la fuente: {pct(hv.s.sourceRet)}</div>
              <div>Disonancia: {pct(hv.s.disonancia)}</div>
              <div>Afinidad con el marco: {pct(hv.a.afinidad)}</div>
            </>
          )}
          {hv.a.isBot && <div>Publica sin creer. No se corrige, no se cansa.</div>}
        </div>
      )}
      {!compact && <Leyenda />}
    </div>
  );
}

const NOMBRE_ESTADO = {
  S: 'No expuesto', E: 'Expuesto (indeciso)', I: 'Cree la desinformación',
  Z: 'Escéptico', C: 'Corregido',
};

function Leyenda() {
  return (
    <div className="leyenda" aria-hidden="false">
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="none" stroke={C.S} strokeWidth="1.6" /></svg> No expuesto</span>
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="4" fill={C.E} /></svg> Expuesto</span>
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="5.5" fill={C.I} /></svg> Cree</span>
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="4" fill="none" stroke={C.Z} strokeWidth="3" /></svg> Escéptico</span>
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="4" fill="none" stroke={C.Corr} strokeWidth="3" /><circle cx="7" cy="7" r="2" fill={C.I} /></svg> Corregido (aún recuerda)</span>
      <span><svg width="14" height="14"><rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill={C.I} stroke="#fff" strokeWidth="1" /></svg> Bot</span>
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="4" fill={C.S} /><circle cx="7" cy="7" r="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" /></svg> Superpropagador</span>
      <span><svg width="14" height="14"><circle cx="7" cy="7" r="3.5" fill={C.I} /><circle cx="7" cy="7" r="5.5" fill="none" stroke={C.diss} strokeWidth="1.5" /></svg> ⚡ En disonancia</span>
    </div>
  );
}

/** Gráfico de líneas genérico con crosshair + tooltip.
 *  [TÉCNICA] SVG puro; los paths se recalculan por tick (≤240 puntos × pocas
 *  series). `banda` sombrea el área entre las series 0 y 1 (la BRECHA de la
 *  amnesia de fuente). `vlines` marca eventos (p. ej. llegada de la corrección). */
function LineChart({
  series, height = 150, yMax = 1, banda = false, vlines = [],
  formatY = v => pct(v), unidadX = 'días', titulo, subtitulo, resumen,
}) {
  const W = 560, H = height, PAD = { l: 38, r: 10, t: 8, b: 20 };
  const [hx, setHx] = useState(null);
  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const n = Math.max(...series.map(s => s.values.length), 2);
  const X = i => PAD.l + (i / (MAX_T)) * iw;
  const Y = v => PAD.t + ih - (Math.min(v, yMax) / yMax) * ih;

  const path = vals => {
    let d = '', pen = false;
    for (let i = 0; i < vals.length; i++) {
      const v = vals[i];
      if (v == null) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  let bandPath = '';
  if (banda && series.length >= 2) {
    const a = series[0].values, b = series[1].values;
    const up = [], down = [];
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] == null || b[i] == null) continue;
      up.push(`${X(i).toFixed(1)} ${Y(a[i]).toFixed(1)}`);
      down.push(`${X(i).toFixed(1)} ${Y(b[i]).toFixed(1)}`);
    }
    if (up.length > 1) bandPath = `M${up.join('L')}L${down.reverse().join('L')}Z`;
  }

  const onMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / iw) * MAX_T);
    setHx(i >= 0 && i <= MAX_T ? i : null);
  };

  const dias = [0, 2, 4, 6, 8, 10];
  return (
    <div className="chart">
      {titulo && <div className="chart-titulo">{titulo}{subtitulo && <span className="chart-sub"> · {subtitulo}</span>}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg"
           onMouseMove={onMove} onMouseLeave={() => setHx(null)}
           role="img" aria-label={titulo}>
        {/* rejilla recesiva */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <g key={f}>
            <line x1={PAD.l} x2={W - PAD.r} y1={Y(f * yMax)} y2={Y(f * yMax)} stroke={C.grid} strokeWidth="1" />
            <text x={PAD.l - 5} y={Y(f * yMax) + 3.5} textAnchor="end" fontSize="9.5" fill={C.muted}>{formatY(f * yMax)}</text>
          </g>
        ))}
        {dias.map(d => (
          <text key={d} x={X(d * 24)} y={H - 6} textAnchor="middle" fontSize="9.5" fill={C.muted}>
            {d === 0 ? '0' : `día ${d}`}
          </text>
        ))}
        {bandPath && <path d={bandPath} fill={C.I} opacity="0.13" />}
        {vlines.map((v, i) => v.t != null && v.t <= MAX_T && (
          <g key={i}>
            <line x1={X(v.t)} x2={X(v.t)} y1={PAD.t} y2={PAD.t + ih} stroke={C.Corr} strokeDasharray="3 3" strokeWidth="1" opacity="0.7" />
            <text x={X(v.t) + 3} y={PAD.t + 9} fontSize="9" fill={C.inkSec}>{v.label}</text>
          </g>
        ))}
        {series.map(s => (
          <path key={s.label} d={path(s.values)} fill="none" stroke={s.color}
                strokeWidth="2" strokeDasharray={s.dash || 'none'} strokeLinejoin="round" />
        ))}
        {/* rótulos directos al final de cada línea, con anticolisión vertical */}
        {(() => {
          const usados = [];
          return series.map(s => {
            let li = s.values.length - 1;
            while (li >= 0 && s.values[li] == null) li--;
            if (li < 2) return null;
            let ly = Y(s.values[li]) + 3;
            while (usados.some(u => Math.abs(u - ly) < 10)) ly += 10;
            usados.push(ly);
            return (
              <text key={`l-${s.label}`} x={Math.min(X(li) + 4, W - 4)} y={ly}
                    fontSize="9.5" fill={s.color} fontWeight="600"
                    textAnchor={X(li) > W - 90 ? 'end' : 'start'}>
                {s.short || s.label}
              </text>
            );
          });
        })()}
        {hx != null && (
          <g>
            <line x1={X(hx)} x2={X(hx)} y1={PAD.t} y2={PAD.t + ih} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            {series.map(s => s.values[hx] != null && (
              <circle key={s.label} cx={X(hx)} cy={Y(s.values[hx])} r="3.5" fill={s.color} stroke={C.panel} strokeWidth="1.5" />
            ))}
          </g>
        )}
      </svg>
      {hx != null && (
        <div className="chart-lectura">
          <span className="muted">Día {(hx / 24).toFixed(1)}:</span>{' '}
          {series.map(s => s.values[hx] != null && (
            <span key={s.label} style={{ color: s.color }}> {s.short || s.label} {formatY(s.values[hx])} </span>
          ))}
        </div>
      )}
      {hx == null && resumen && <div className="chart-lectura muted">{resumen}</div>}
      <div className="chart-leyenda">
        {series.map(s => (
          <span key={s.label}>
            <i style={{ background: s.dash ? 'transparent' : s.color, borderTop: s.dash ? `2px dashed ${s.color}` : 'none' }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Indicador agregado de disonancia + contadores de resistencia.
 *  [PEDAGOGÍA] La disonancia se muestra a nivel de RED: el costo psicológico
 *  colectivo de corregir tarde no se ve en ningún agente individual. */
function PanelDisonancia({ engine }) {
  const d = engine.history.diss.at(-1) ?? 0;
  return (
    <div className="panel diso">
      <div className="panel-titulo">⚡ Disonancia en la red</div>
      <div className="diso-bar-wrap" role="meter" aria-valuenow={Math.round(d * 100)}
           aria-valuemin="0" aria-valuemax="100" aria-label="Disonancia media de la red">
        <div className="diso-bar" style={{ width: `${Math.min(100, d * 100 / 0.5)}%` }} />
      </div>
      <div className="diso-stats">
        <span>media: <strong style={{ color: C.diss }}>{(d * 100).toFixed(1)}</strong>/100</span>
        <span>correcciones rechazadas: <strong>{engine.rechazos}</strong></span>
        <span>efectos rebote: <strong>{engine.backfires}</strong></span>
        <span style={{ color: C.I }}>recaídas por amnesia: <strong>{engine.recaidas}</strong></span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * §8 · APP
 * ═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [modo, setModo] = useState('explora');

  /* ── estado del modo Explorar ─────────────────────────────────────────── */
  const [escenarioId, setEscenarioId] = useState('whatsapp');
  const [titularPropio, setTitularPropio] = useState('');
  const [tipologiaPropia, setTipologiaPropia] = useState('whatsapp');
  const [usaPropio, setUsaPropio] = useState(false);
  const [topology, setTopology] = useState('eco');
  const [bots, setBots] = useState(false);
  const [corrTiming, setCorrTiming] = useState('temprana'); // 18 h vs 84 h
  const [seed, setSeed] = useState(42);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [, repaint] = useReducer(x => x + 1, 0);
  const [netVersion, setNetVersion] = useState(0);

  // Los sliders mutan este objeto y el motor lo lee en vivo (sin reconstruir).
  const ctlRef = useRef({ ...CTL_DEFAULT });
  const [ctlUi, setCtlUi] = useState({ ...CTL_DEFAULT });
  const setCtl = patch => {
    Object.assign(ctlRef.current, patch);
    setCtlUi(u => ({ ...u, ...patch }));
  };

  const enginesRef = useRef(null);

  const escenario = ESCENARIOS.find(e => e.id === (usaPropio ? tipologiaPropia : escenarioId));
  const titular = usaPropio && titularPropio.trim() ? `«${titularPropio.trim()}»` : escenario.titular;

  const construir = useCallback(() => {
    const esc = ESCENARIOS.find(e => e.id === (usaPropio ? tipologiaPropia : escenarioId));
    const conBots = bots || esc.params.bots;
    const net = buildNetwork(seed, topology, conBots);
    const contenido = {
      viral: esc.params.viral, adoptBase: esc.params.adoptBase,
      emotividad: esc.params.emotividad, usaBots: conBots,
    };
    const corrTime = corrTiming === 'temprana' ? 18 : 84;
    enginesRef.current = {
      main: new Engine(net, ctlRef.current, contenido, { corrTime, amnesia: true }),
      // [PEDAGOGÍA] Motor sombra: el MISMO hecho en versión verificada, sobre la
      // misma red. Solo alimenta la curva verde del panel epidémico.
      sombra: new Engine(net, ctlRef.current, CONTENIDO_VERIDICO, { corrTime, amnesia: true, esSombra: true }),
    };
    setNetVersion(v => v + 1);
    setRunning(false);
    repaint();
  }, [escenarioId, usaPropio, tipologiaPropia, topology, bots, corrTiming, seed]);

  // construir al montar y cuando cambian factores estructurales
  useEffect(() => { construir(); }, [construir]);

  // amplificación viene del escenario pero puede togglearse
  useEffect(() => {
    setCtl({ amp: escenario.params.amp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escenarioId, usaPropio, tipologiaPropia]);

  /* ── bucle de simulación ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const eng = enginesRef.current;
      if (!eng) return;
      let alive = true;
      for (let s = 0; s < speed; s++) {
        alive = eng.main.step();
        eng.sombra.step();
      }
      repaint();
      if (!alive) setRunning(false);
    }, 80);
    return () => clearInterval(iv);
  }, [running, speed]);

  const eng = enginesRef.current;

  /* ── estado del modo Comparar ─────────────────────────────────────────── */
  const [comp, setComp] = useState({ fase: 'elegir', presetId: null, prediccion: null, resultado: null });
  const compEnginesRef = useRef(null);
  const [compRunning, setCompRunning] = useState(false);

  const iniciarComparacion = presetId => {
    setComp({ fase: 'predecir', presetId, prediccion: null, resultado: null });
    compEnginesRef.current = null;
  };

  const lanzarComparacion = prediccion => {
    const preset = COMPARACIONES.find(p => p.id === comp.presetId);
    const mk = ov => {
      const topo = ov.topology || 'eco';
      const esc = ESCENARIOS[1]; // pieza de referencia: la foto manipulada
      const net = buildNetwork(seed, topo, false);
      const ctl = {
        ...CTL_DEFAULT,
        amp: true,
        factCheck: ov.factCheck ?? false,
      };
      return new Engine(net, ctl,
        { viral: esc.params.viral, adoptBase: esc.params.adoptBase, emotividad: esc.params.emotividad, usaBots: false },
        { corrTime: ov.corrTime ?? 9999, amnesia: ov.amnesia ?? true });
    };
    compEnginesRef.current = { A: mk(preset.A.ov), B: mk(preset.B.ov) };
    setComp(c => ({ ...c, fase: 'corriendo', prediccion }));
    setCompRunning(true);
  };

  useEffect(() => {
    if (!compRunning) return;
    const iv = setInterval(() => {
      const ce = compEnginesRef.current;
      if (!ce) return;
      let alive = true;
      for (let s = 0; s < 3; s++) {
        alive = ce.A.step();
        ce.B.step();
      }
      repaint();
      if (!alive) {
        setCompRunning(false);
        setComp(c => {
          const preset = COMPARACIONES.find(p => p.id === c.presetId);
          const resultado = preset.evaluar(ce.A, ce.B);
          return { ...c, fase: 'listo', resultado };
        });
      }
    }, 80);
    return () => clearInterval(iv);
  }, [compRunning]);

  const [lentes, setLentes] = useState(0); // insignias por análisis acertado
  useEffect(() => {
    if (comp.fase === 'listo' && comp.resultado && comp.prediccion === comp.resultado.idx) {
      setLentes(l => l + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comp.fase]);

  /* ── render ───────────────────────────────────────────────────────────── */
  return (
    <div className="app">
      <style>{GLOBAL_STYLES}</style>

      <header className="cabecera">
        <div>
          <h1>Contagio informacional</h1>
          <p className="subtitulo">¿Por qué la desinformación sigue viva después de ser corregida?</p>
        </div>
        <nav className="tabs" role="tablist">
          {[['explora', 'Explorar'], ['compara', 'Comparar'], ['guia', 'Guía']].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={modo === id}
                    className={modo === id ? 'tab activo' : 'tab'}
                    onClick={() => setModo(id)}>
              {label}
            </button>
          ))}
          {lentes > 0 && <span className="insignia" title="Predicciones acertadas">🔍 ×{lentes}</span>}
        </nav>
      </header>

      {/* ══════════════ MODO EXPLORAR ══════════════ */}
      {modo === 'explora' && eng && (
        <main className="layout-explora">
          {/* Escenarios (Capa 1 como narrativa) */}
          <section className="escenarios">
            {ESCENARIOS.map(e => (
              <button key={e.id}
                      className={`esc-card ${!usaPropio && escenarioId === e.id ? 'activo' : ''}`}
                      onClick={() => { setUsaPropio(false); setEscenarioId(e.id); }}>
                <span className="esc-icono">{e.icono}</span>
                <span>
                  <strong>{e.nombre}</strong>
                  <em>{e.tipologia} · {e.plataforma}</em>
                </span>
              </button>
            ))}
            <div className={`esc-card propio ${usaPropio ? 'activo' : ''}`}>
              <input
                type="text" maxLength={90}
                placeholder="Escribe tu propio titular y míralo circular…"
                value={titularPropio}
                onChange={e => setTitularPropio(e.target.value)}
                onFocus={() => setUsaPropio(true)}
              />
              <select value={tipologiaPropia} onChange={e => { setTipologiaPropia(e.target.value); setUsaPropio(true); }}
                      aria-label="Tipología de fabricación del titular propio">
                {ESCENARIOS.map(e => <option key={e.id} value={e.id}>{e.tipologia}</option>)}
              </select>
            </div>
          </section>

          <section className="historia panel">
            <div className="titular">{titular}</div>
            <p>{usaPropio ? `Tu titular circulará con la mecánica de "${escenario.tipologia.toLowerCase()}" en ${escenario.plataforma}.` : escenario.historia}</p>
          </section>

          <div className="cuerpo">
            {/* Columna del grafo */}
            <section className="panel col-grafo">
              <div className="barra-tiempo">
                <button className="btn primario" onClick={() => setRunning(r => !r)}>
                  {running ? '⏸ Pausar' : (eng.main.t === 0 ? '▶ Iniciar' : (eng.main.t >= MAX_T ? '● Fin' : '▶ Seguir'))}
                </button>
                <button className="btn" onClick={() => { eng.main.reset(); eng.sombra.reset(); setRunning(false); repaint(); }}>↺ Reiniciar</button>
                <button className="btn" onClick={() => { setSeed(Math.floor(Math.random() * 1e6)); }}>⚄ Nueva red</button>
                <div className="vel">
                  {[1, 2, 4].map(v => (
                    <button key={v} className={`btn mini ${speed === v ? 'activo' : ''}`} onClick={() => setSpeed(v)}>{v}×</button>
                  ))}
                </div>
                <div className="reloj">
                  Día {(eng.main.t / 24).toFixed(1)} <span className="muted">/ 10</span>
                </div>
              </div>
              <GraphView engine={eng.main} netVersion={netVersion} />
              <div className="contadores">
                <span style={{ color: C.I }}>● Creen: {pct(eng.main.history.pctI.at(-1))}</span>
                <span style={{ color: C.Corr }}>● Corregidos: {pct(eng.main.history.pctC.at(-1))}</span>
                <span style={{ color: C.Z }}>● Escépticos: {pct(eng.main.history.pctZ.at(-1))}</span>
                <span style={{ color: C.E }}>● Expuestos: {pct(eng.main.history.pctE.at(-1))}</span>
              </div>
            </section>

            {/* Columna de paneles */}
            <div className="col-paneles">
              {/* [PEDAGOGÍA] EL PANEL CENTRAL: la brecha entre las dos curvas es
                  el objeto visual del simulador, no un detalle. */}
              <div className="panel">
                <LineChart
                  titulo="Memoria dual: la amnesia de la fuente"
                  subtitulo="promedio entre quienes creyeron"
                  banda
                  vlines={[eng.main.corrActiva ? { t: eng.main.flags.corrTime, label: 'corrección' } : {}]}
                  series={[
                    { label: 'Retención del contenido («lo que decía»)', short: 'contenido', color: C.I, values: eng.main.history.meanC },
                    { label: 'Retención de la fuente («quién / si era falso»)', short: 'fuente', color: C.Corr, values: eng.main.history.meanS },
                  ]}
                  resumen="La zona sombreada es la brecha: contenido que se recuerda sin recordar de dónde vino — ni que fue desmentido."
                />
              </div>

              <div className="panel">
                <LineChart
                  titulo="Curva de contagio"
                  subtitulo="desinformación vs. el mismo hecho verificado"
                  height={140}
                  vlines={[eng.main.corrActiva ? { t: eng.main.flags.corrTime, label: 'corrección' } : {}]}
                  series={[
                    { label: 'Creen la desinformación', short: 'desinfo', color: C.I, values: eng.main.history.pctI },
                    { label: 'Creen la versión verificada', short: 'verídico', color: C.veridico, dash: '5 4', values: eng.sombra.history.pctI },
                    { label: 'Corregidos', short: 'corregidos', color: C.Corr, values: eng.main.history.pctC },
                  ]}
                  resumen="La versión verificada del mismo hecho compite en la misma red — observa la diferencia de velocidad."
                />
              </div>

              <PanelDisonancia engine={eng.main} />
            </div>
          </div>

          {/* Controles estratégicos */}
          <section className="panel controles">
            <div className="ctl-grupo">
              <label>Velocidad de propagación <strong>{ctlUi.beta.toFixed(3)}</strong>
                <input type="range" min="0.02" max="0.12" step="0.005" value={ctlUi.beta}
                       onChange={e => setCtl({ beta: +e.target.value })} />
              </label>
              <label>Olvido de la fuente <strong>{ctlUi.sourceHL} h de vida media</strong>
                <input type="range" min="10" max="80" step="2" value={ctlUi.sourceHL}
                       onChange={e => setCtl({ sourceHL: +e.target.value })} />
                <small>El contenido tiene vida media fija de {CONTENT_HL} h — la brecha entre ambos ES la amnesia.</small>
              </label>
              <label>Resistencia a la corrección <strong>{pct(ctlUi.resistencia)}</strong>
                <input type="range" min="0.05" max="0.75" step="0.05" value={ctlUi.resistencia}
                       onChange={e => setCtl({ resistencia: +e.target.value })} />
                <small>Qué tan poca disonancia basta para que un creyente rechace el desmentido.</small>
              </label>
            </div>
            <div className="ctl-grupo toggles">
              <label className="toggle">
                <input type="checkbox" checked={ctlUi.factCheck} onChange={e => setCtl({ factCheck: e.target.checked })} />
                <span>Verificación (fact-checking)</span>
              </label>
              <div className="sub-toggle" style={{ opacity: ctlUi.factCheck ? 1 : 0.4 }}>
                <button className={`btn mini ${corrTiming === 'temprana' ? 'activo' : ''}`} disabled={!ctlUi.factCheck}
                        onClick={() => setCorrTiming('temprana')}>Temprana (18 h)</button>
                <button className={`btn mini ${corrTiming === 'tardia' ? 'activo' : ''}`} disabled={!ctlUi.factCheck}
                        onClick={() => setCorrTiming('tardia')}>Tardía (84 h)</button>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={ctlUi.amp} onChange={e => setCtl({ amp: e.target.checked })} />
                <span>Amplificación algorítmica</span>
              </label>
              <label className="toggle">
                <input type="checkbox" checked={bots} onChange={e => setBots(e.target.checked)} />
                <span>Bots (cuentas automatizadas)</span>
              </label>
              <label className="toggle">
                <input type="checkbox" checked={ctlUi.ilusoria} onChange={e => setCtl({ ilusoria: e.target.checked })} />
                <span>Verdad ilusoria (repetición = credibilidad)</span>
              </label>
              <div className="sub-toggle">
                <button className={`btn mini ${topology === 'eco' ? 'activo' : ''}`}
                        onClick={() => setTopology('eco')}>Cámara de eco</button>
                <button className={`btn mini ${topology === 'hetero' ? 'activo' : ''}`}
                        onClick={() => setTopology('hetero')}>Red heterogénea</button>
              </div>
            </div>
            <p className="nota muted">
              Cambiar escenario, red, bots o el momento de la corrección reinicia la simulación.
              Los sliders actúan en vivo: muévelos durante la corrida y observa el efecto.
            </p>
          </section>
        </main>
      )}

      {/* ══════════════ MODO COMPARAR ══════════════ */}
      {modo === 'compara' && (
        <main className="layout-compara">
          {comp.fase === 'elegir' && (
            <>
              <p className="intro">
                Cada comparación corre <strong>dos veces la misma red con la misma semilla</strong>: solo cambia un factor.
                Antes de ver el resultado, tendrás que <strong>predecirlo</strong>. Las insignias 🔍 premian el análisis, no la viralización.
              </p>
              <div className="comp-grid">
                {COMPARACIONES.map(p => (
                  <button key={p.id} className="comp-card panel" onClick={() => iniciarComparacion(p.id)}>
                    <strong>{p.titulo}</strong>
                    <p>{p.desc}</p>
                    <span className="cta">Predecir y correr →</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {comp.fase === 'predecir' && (() => {
            const preset = COMPARACIONES.find(p => p.id === comp.presetId);
            return (
              <div className="panel prediccion">
                <h2>{preset.titulo}</h2>
                <p>{preset.desc}</p>
                <p className="pregunta">🔮 <strong>{preset.pregunta}</strong></p>
                <div className="opciones">
                  {preset.opciones.map((o, i) => (
                    <button key={i} className="btn opcion" onClick={() => lanzarComparacion(i)}>{o}</button>
                  ))}
                </div>
                <button className="btn mini" onClick={() => setComp({ fase: 'elegir', presetId: null, prediccion: null, resultado: null })}>← Volver</button>
              </div>
            );
          })()}

          {(comp.fase === 'corriendo' || comp.fase === 'listo') && compEnginesRef.current && (() => {
            const preset = COMPARACIONES.find(p => p.id === comp.presetId);
            const ce = compEnginesRef.current;
            return (
              <div className="comp-corrida">
                <div className="comp-cabecera">
                  <h2>{preset.titulo}</h2>
                  <div className="reloj">Día {(ce.A.t / 24).toFixed(1)} / 10</div>
                </div>
                <div className="comp-graphs">
                  {[['A', ce.A, preset.A.label], ['B', ce.B, preset.B.label]].map(([k, e2, label]) => (
                    <div key={k} className="panel comp-panel">
                      <div className="comp-label">{k} · {label}</div>
                      <GraphView engine={e2} netVersion={`${comp.presetId}-${k}`} compact />
                      <div className="contadores mini">
                        <span style={{ color: C.I }}>creen {pct(e2.history.pctI.at(-1))}</span>
                        <span style={{ color: C.Corr }}>corregidos {pct(e2.history.pctC.at(-1))}</span>
                        <span style={{ color: C.diss }}>recaídas {e2.recaidas}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <LineChart
                    titulo="% que cree la desinformación"
                    height={140}
                    vlines={[
                      preset.A.ov.factCheck ? { t: preset.A.ov.corrTime, label: 'corr. A' } : {},
                      preset.B.ov.factCheck && preset.B.ov.corrTime !== preset.A.ov.corrTime ? { t: preset.B.ov.corrTime, label: 'corr. B' } : {},
                    ]}
                    series={[
                      { label: `A · ${preset.A.label}`, short: 'A', color: C.I, values: ce.A.history.pctI },
                      { label: `B · ${preset.B.label}`, short: 'B', color: C.E, values: ce.B.history.pctI },
                    ]}
                  />
                </div>
                {comp.presetId === 'amnesia' && (
                  <div className="comp-graphs">
                    {[['A', ce.A], ['B', ce.B]].map(([k, e2]) => (
                      <div key={k} className="panel comp-panel">
                        <LineChart
                          titulo={`Memoria dual en ${k}`}
                          height={120} banda
                          series={[
                            { label: 'contenido', short: 'contenido', color: C.I, values: e2.history.meanC },
                            { label: 'fuente', short: 'fuente', color: C.Corr, values: e2.history.meanS },
                          ]}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {comp.fase === 'listo' && comp.resultado && (
                  <div className={`panel veredicto ${comp.prediccion === comp.resultado.idx ? 'acierto' : 'fallo'}`}>
                    <h3>{comp.prediccion === comp.resultado.idx ? '🔍 Predicción acertada — insignia ganada' : 'La red te sorprendió'}</h3>
                    <p><em>Tu predicción:</em> «{preset.opciones[comp.prediccion]}»</p>
                    <p><em>Lo observado:</em> «{preset.opciones[comp.resultado.idx]}»</p>
                    <p>{comp.resultado.texto}</p>
                    <div className="veredicto-botones">
                      <button className="btn primario" onClick={() => setComp({ fase: 'elegir', presetId: null, prediccion: null, resultado: null })}>Otra comparación</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </main>
      )}

      {/* ══════════════ MODO GUÍA ══════════════ */}
      {modo === 'guia' && (
        <main className="layout-guia">
          <div className="panel guia-bloque">
            <h2>Qué estás viendo</h2>
            <p>
              Una red de {N_HUMANOS} personas simuladas (más bots opcionales) por la que circula una pieza de
              desinformación y, en paralelo, la versión verificada del mismo hecho. El modelo de contagio es un
              SEIZ adaptado de la epidemiología: <em>Susceptible → Expuesto → Infectado (cree) / Escéptico</em>,
              con un estado adicional — <em>Corregido</em> — que es donde vive la pregunta central del simulador.
            </p>
            <p>
              <strong>La tesis pedagógica:</strong> corregir la desinformación no la elimina, porque los sesgos
              que la sostienen no operan sobre la información sino sobre la <em>memoria</em> y la <em>identidad</em>.
            </p>
          </div>

          <div className="panel guia-bloque">
            <h2>Las tres capas (y cómo se retroalimentan)</h2>
            <p><strong>Capa 1 · Fabricación.</strong> Cada escenario encarna una tipología: descontextualización
            (la cadena de WhatsApp), manipulación de imagen (la foto del paro) y amplificación automatizada
            (la tendencia fabricada). La tipología define los parámetros con los que la pieza entra a la red:
            su emotividad, su viralidad, si la empujan bots.</p>
            <p><strong>Capa 2 · Dinámica de red.</strong> La fabricación habilita la cascada: homofilia
            (dentro de la burbuja la pieza corre sin fricción; hacia afuera, los puentes deciden el alcance),
            superpropagadores (pocas cuentas, mucho alcance), cámaras de eco que blindan la creencia frente a
            la corrección (compara las dos topologías), y el diferencial entre corrección temprana y tardía.</p>
            <p><strong>Capa 3 · Sesgos individuales.</strong> Y la cascada se <em>sostiene</em> porque explota
            sesgos psicológicos concretos. La red amplifica lo que la mente retiene; la mente retiene lo que la
            red repite. Ese círculo es el objeto de estudio.</p>
          </div>

          <div className="panel guia-bloque">
            <h2>Los dos sesgos del núcleo</h2>
            <p><strong>🧠 Amnesia de la fuente</strong> (source monitoring error). Recordamos <em>qué</em> se dijo
            mucho después de olvidar <em>quién</em> lo dijo — o que fue desmentido. En el panel de memoria dual,
            la curva roja (contenido) cae suave; la azul (fuente) se desploma. La zona sombreada entre ambas es
            contenido flotando en la memoria sin etiqueta de origen ni de falsedad. Cuando un agente corregido
            cruza ese umbral, <em>recae</em>: vuelve a creer lo que ya le habían desmentido. En el grafo lo ves
            como donas azules cuyo núcleo rojo nunca se apaga.</p>
            <p><strong>⚡ Disonancia cognitiva y razonamiento motivado.</strong> Cuando la corrección llega a un
            creyente, no encuentra una mente neutra: encuentra una identidad. Si la tensión (disonancia) supera
            su umbral de resistencia, el agente no actualiza la creencia — rechaza al mensajero. Y si la pieza
            toca fibra identitaria, la corrección puede <em>reforzar</em> la creencia (efecto rebote). Sube el
            slider de resistencia y mira el indicador de disonancia de la red: corregir tarde no solo es menos
            eficaz, es psicológicamente más costoso para toda la red.</p>
            <p><strong>➕ Extensión opcional: verdad ilusoria.</strong> Con el toggle activo, cada repetición
            de la pieza aumenta su credibilidad — la familiaridad sustituye a la verificación. Actívalo junto
            con los bots y observa el círculo completo: los bots fabrican repetición, la repetición fabrica verdad.</p>
          </div>

          <div className="panel guia-bloque">
            <h2>Cómo usarlo en clase</h2>
            <ol>
              <li><strong>Predicción antes de observación.</strong> El modo Comparar obliga a apostar antes de ver.
              El momento pedagógico no es el resultado: es la sorpresa (o su ausencia) frente a la propia predicción.</li>
              <li><strong>El mismo escenario, con y sin el sesgo.</strong> La comparación «amnesia activa vs. desactivada»
              aísla el mecanismo: es el experimento contrafáctico que la realidad nunca permite.</li>
              <li><strong>Titular propio.</strong> Pide a cada estudiante escribir un titular verosímil para su
              contexto y observar su trayectoria. La pregunta incómoda: ¿por qué elegiste ESE titular? ¿A qué
              afinidad de qué comunidad le estás apostando?</li>
              <li><strong>Discusión de cierre.</strong> Si la corrección no borra la creencia, ¿qué sí funciona?
              (Pistas del propio modelo: llegar temprano, inocular, reducir la amenaza identitaria del desmentido.)</li>
            </ol>
          </div>

          <div className="panel guia-bloque">
            <h2>Sobre el diseño (nota para docentes y desarrolladores)</h2>
            <p>
              Este simulador evita deliberadamente premiar la viralización: no hay puntos por infectar la red.
              La única recompensa (🔍) premia predicciones acertadas — análisis, no eficacia propagandística.
              Es la resolución explícita de la tensión entre engagement y banalización: el enganche debe venir
              del descubrimiento (ver la brecha, sentir la resistencia del propio agente), no del juego de ganar.
            </p>
            <p className="muted">
              Referencias del modelo: Johnson, Hashtroudi &amp; Lindsay (1993) sobre source monitoring;
              Lewandowsky et al. (2012) sobre influencia continuada; Festinger (1957) sobre disonancia;
              Nyhan &amp; Reifler (2010) sobre backfire; Vosoughi, Roy &amp; Aral (2018) sobre la ventaja
              de velocidad de lo falso; modelo SEIZ de Jin et al. (2013).
            </p>
            <p className="muted">
              LAMA-32 · Laboratorio de Mediaciones Algorítmicas · Universidad del Valle ·
              <a href="https://lama.lat" target="_blank" rel="noreferrer"> lama.lat</a>
            </p>
          </div>
        </main>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * §9 · ESTILOS GLOBALES
 * [TÉCNICA] Inyectados como <style> para conservar la portabilidad de archivo
 * único. Tipografía del sistema; rejillas fluidas; una sola columna en móvil.
 * ═══════════════════════════════════════════════════════════════════════════ */
const GLOBAL_STYLES = `
  .app { max-width: 1280px; margin: 0 auto; padding: 16px 18px 60px; }
  .muted { color: ${C.muted}; }

  .cabecera { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; padding: 6px 0 14px; }
  .cabecera h1 { margin: 0; font-size: 26px; letter-spacing: -0.02em; }
  .subtitulo { margin: 2px 0 0; color: ${C.inkSec}; font-size: 14.5px; }
  .tabs { display: flex; gap: 6px; align-items: center; }
  .tab { background: transparent; border: 1px solid ${C.line}; color: ${C.inkSec}; padding: 7px 16px; border-radius: 999px; cursor: pointer; font-size: 14px; }
  .tab.activo { background: ${C.panelSoft}; color: ${C.ink}; border-color: rgba(255,255,255,0.25); }
  .insignia { margin-left: 6px; background: ${C.panelSoft}; border: 1px solid ${C.line}; border-radius: 999px; padding: 5px 10px; font-size: 13px; }

  .panel { background: ${C.panel}; border: 1px solid ${C.line}; border-radius: 12px; padding: 12px 14px; }
  .panel-titulo { font-size: 13px; font-weight: 600; color: ${C.inkSec}; margin-bottom: 8px; }

  .escenarios { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px; margin-bottom: 10px; }
  .esc-card { display: flex; gap: 10px; align-items: center; text-align: left; background: ${C.panel}; border: 1px solid ${C.line}; border-radius: 12px; padding: 10px 12px; color: ${C.ink}; cursor: pointer; font: inherit; }
  .esc-card.activo { border-color: ${C.E}; box-shadow: 0 0 0 1px ${C.E}; }
  .esc-card strong { display: block; font-size: 13.5px; }
  .esc-card em { display: block; font-style: normal; font-size: 11.5px; color: ${C.muted}; }
  .esc-icono { font-size: 22px; }
  .esc-card.propio { flex-direction: column; align-items: stretch; gap: 6px; cursor: default; }
  .esc-card.propio input { background: ${C.bg}; border: 1px solid ${C.line}; border-radius: 8px; color: ${C.ink}; padding: 7px 9px; font-size: 13px; }
  .esc-card.propio select { background: ${C.bg}; border: 1px solid ${C.line}; border-radius: 8px; color: ${C.inkSec}; padding: 5px 8px; font-size: 12px; }

  .historia { margin-bottom: 10px; }
  .historia .titular { font-size: 15.5px; font-weight: 650; margin-bottom: 4px; }
  .historia p { margin: 0; color: ${C.inkSec}; font-size: 13.5px; line-height: 1.5; }

  .cuerpo { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 10px; align-items: start; }
  .col-paneles { display: grid; gap: 10px; }

  .barra-tiempo { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 8px; }
  .btn { background: ${C.panelSoft}; border: 1px solid ${C.line}; color: ${C.ink}; border-radius: 8px; padding: 7px 12px; cursor: pointer; font: inherit; font-size: 13px; }
  .btn:hover { border-color: rgba(255,255,255,0.3); }
  .btn.primario { background: #24427a; border-color: #3b64ad; }
  .btn.mini { padding: 4px 9px; font-size: 12px; }
  .btn.mini.activo { background: #24427a; border-color: #3b64ad; }
  .btn:disabled { opacity: 0.45; cursor: default; }
  .vel { display: flex; gap: 4px; margin-left: 4px; }
  .reloj { margin-left: auto; font-variant-numeric: tabular-nums; font-size: 14px; color: ${C.inkSec}; }

  .graph-wrap { position: relative; background: ${C.bg}; border-radius: 10px; overflow: hidden; }
  .graph-svg { display: block; width: 100%; height: auto; }
  .nodo-disonante { animation: pulso 1.1s ease-in-out infinite; }
  @keyframes pulso { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
  .tooltip { position: absolute; transform: translate(-50%, calc(-100% - 10px)); background: #0b0f18; border: 1px solid rgba(255,255,255,0.18); border-radius: 8px; padding: 8px 10px; font-size: 12px; line-height: 1.45; pointer-events: none; white-space: nowrap; z-index: 5; }
  .tooltip strong { display: block; margin-bottom: 2px; }

  .leyenda { display: flex; flex-wrap: wrap; gap: 4px 14px; padding: 8px 10px; font-size: 11.5px; color: ${C.inkSec}; }
  .leyenda span { display: inline-flex; align-items: center; gap: 5px; }

  .contadores { display: flex; flex-wrap: wrap; gap: 6px 16px; padding-top: 8px; font-size: 13px; font-variant-numeric: tabular-nums; }
  .contadores.mini { font-size: 12px; gap: 4px 12px; }

  .chart-titulo { font-size: 13px; font-weight: 600; color: ${C.inkSec}; margin-bottom: 6px; }
  .chart-sub { font-weight: 400; color: ${C.muted}; }
  .chart-svg { display: block; width: 100%; height: auto; }
  .chart-lectura { font-size: 12px; min-height: 18px; padding-top: 4px; }
  .chart-leyenda { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 11.5px; color: ${C.inkSec}; padding-top: 4px; }
  .chart-leyenda i { display: inline-block; width: 14px; height: 3px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }

  .diso .diso-bar-wrap { height: 10px; background: ${C.bg}; border-radius: 999px; overflow: hidden; }
  .diso .diso-bar { height: 100%; background: linear-gradient(90deg, #7a3f2b, ${C.diss}); border-radius: 999px; transition: width 0.2s; }
  .diso-stats { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 12.5px; color: ${C.inkSec}; padding-top: 8px; }

  .controles { margin-top: 10px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; }
  .ctl-grupo { display: grid; gap: 10px; align-content: start; }
  .ctl-grupo label { font-size: 13px; color: ${C.inkSec}; display: block; }
  .ctl-grupo label strong { color: ${C.ink}; float: right; font-variant-numeric: tabular-nums; }
  .ctl-grupo input[type=range] { width: 100%; margin-top: 4px; accent-color: #3b64ad; }
  .ctl-grupo small { display: block; color: ${C.muted}; font-size: 11.5px; margin-top: 2px; }
  .toggles .toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .toggles input[type=checkbox] { accent-color: #3b64ad; width: 16px; height: 16px; }
  .sub-toggle { display: flex; gap: 6px; margin-left: 24px; }
  .nota { grid-column: 1 / -1; margin: 0; font-size: 12px; }

  .layout-compara .intro { max-width: 760px; color: ${C.inkSec}; font-size: 14.5px; line-height: 1.55; }
  .comp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; }
  .comp-card { text-align: left; cursor: pointer; color: ${C.ink}; font: inherit; display: flex; flex-direction: column; gap: 6px; }
  .comp-card:hover { border-color: rgba(255,255,255,0.3); }
  .comp-card p { margin: 0; color: ${C.inkSec}; font-size: 13px; line-height: 1.5; }
  .comp-card .cta { color: ${C.E}; font-size: 13px; margin-top: 4px; }

  .prediccion { max-width: 680px; margin: 0 auto; }
  .prediccion h2 { margin-top: 4px; }
  .prediccion .pregunta { font-size: 15.5px; }
  .opciones { display: grid; gap: 8px; margin: 14px 0; }
  .btn.opcion { text-align: left; padding: 12px 14px; font-size: 14px; line-height: 1.4; }
  .btn.opcion:hover { background: #24427a; }

  .comp-cabecera { display: flex; justify-content: space-between; align-items: baseline; }
  .comp-graphs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
  .comp-panel .comp-label { font-size: 13px; font-weight: 600; color: ${C.inkSec}; margin-bottom: 6px; }
  .veredicto { margin-top: 10px; border-left: 4px solid ${C.E}; }
  .veredicto.acierto { border-left-color: ${C.Z}; }
  .veredicto h3 { margin: 2px 0 8px; }
  .veredicto p { margin: 6px 0; font-size: 14px; line-height: 1.55; color: ${C.inkSec}; }
  .veredicto-botones { margin-top: 10px; }

  .layout-guia { display: grid; gap: 10px; max-width: 860px; margin: 0 auto; }
  .guia-bloque h2 { margin: 2px 0 8px; font-size: 18px; }
  .guia-bloque p, .guia-bloque li { font-size: 14px; line-height: 1.6; color: ${C.inkSec}; }
  .guia-bloque a { color: #6ea8ff; }
  .guia-bloque ol { padding-left: 20px; }

  @media (max-width: 900px) {
    .cuerpo { grid-template-columns: 1fr; }
    .controles { grid-template-columns: 1fr; }
    .comp-graphs { grid-template-columns: 1fr; }
    .reloj { margin-left: 0; width: 100%; }
  }
`;
