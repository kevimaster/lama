import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// DATOS
// ─────────────────────────────────────────────

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

const TIPOS_RELACION = [
  { id: "condiciona", label: "Condiciona", color: "#8B5E3C", dash: "0" },
  { id: "posibilita", label: "Posibilita", color: "#2D6A4F", dash: "0" },
  { id: "tensiona",   label: "Tensiona",   color: "#C44B4B", dash: "6,4" },
  { id: "produce",    label: "Produce",    color: "#5C7AEA", dash: "0" },
];

const CATEGORIAS = {
  estructural:    { label: "Estructural",    color: "#8B5E3C", bg: "#FDF3E7", border: "#D4A96A", desc: "Factores del entorno macro: economía, política, tecnología, territorio" },
  relacional:     { label: "Relacional",     color: "#2D6A4F", bg: "#EEF7F2", border: "#74B994", desc: "Vínculos entre actores: alianzas, dependencias, negociaciones" },
  organizacional: { label: "Organizacional", color: "#5C4A8A", bg: "#F2EEF9", border: "#A48BC4", desc: "Factores internos del medio: cultura, capacidades, prácticas" },
};

const PREGUNTAS_CIERRE = [
  "¿Qué elemento del ensamblaje consideras más determinante? ¿Por qué es difícil responder esa pregunta?",
  "¿En qué medida El Faro Verifica tiene autonomía real? ¿Frente a quién depende y de quién?",
  "¿Qué habría que cambiar en el ensamblaje para que El Faro pudiera rechazar el convenio?",
  "¿Qué oculta la lectura determinista que la sociotécnica hace visible? ¿Y al revés?",
];

// ─────────────────────────────────────────────
// LECTURAS PERSONALIZADAS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────

function getId() { return Math.random().toString(36).slice(2, 9); }

const FEEDBACK_COLORS = {
  inicio:    { bg: "#F5EDD8", border: "#D4A96A", icon: "→", color: "#8B5E3C" },
  alerta:    { bg: "#FEF3E7", border: "#E8922A", icon: "!", color: "#C44B4B" },
  accion:    { bg: "#EEF7F2", border: "#74B994", icon: "↑", color: "#2D6A4F" },
  reflexion: { bg: "#F2EEF9", border: "#A48BC4", icon: "?", color: "#5C4A8A" },
  positivo:  { bg: "#EEF7F2", border: "#2D6A4F", icon: "✓", color: "#2D6A4F" },
  neutro:    { bg: "#F5EDD8", border: "#D4A96A", icon: "·", color: "#8B5E3C" },
};

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────

function Badge({ categoria }) {
  const cat = CATEGORIAS[categoria];
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700,
      letterSpacing: "0.06em", color: cat.color,
      background: cat.bg, border: `1px solid ${cat.border}`,
      borderRadius: 4, padding: "2px 6px", fontFamily: "monospace",
    }}>
      {cat.label.toUpperCase()}
    </span>
  );
}

// ─────────────────────────────────────────────
// CANVAS
// ─────────────────────────────────────────────

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
    return n ? { x: n.x + 72, y: n.y + 36 } : { x: 0, y: 0 };
  };

  const origenNodo = origenConexion ? nodosEnCanvas.find(n => n.id === origenConexion) : null;
  const tipoActivo = TIPOS_RELACION.find(t => t.id === tipoRelacionActivo);

  return (
    <div
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={handleCanvasClick}
      style={{
        position: "relative", width: "100%", height: "100%",
        overflow: "hidden",
        cursor: modoConexion ? (origenConexion ? "crosshair" : "cell") : "default",
        backgroundColor: "#FEFAF4",
        backgroundImage: `
          radial-gradient(ellipse at 15% 85%, rgba(139,94,60,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(45,106,79,0.05) 0%, transparent 55%),
          linear-gradient(rgba(139,94,60,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,94,60,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 32px 32px, 32px 32px",
      }}
    >
      {/* SVG conexiones */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
        <defs>
          {TIPOS_RELACION.map(tr => (
            <marker key={tr.id} id={`arr-${tr.id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={tr.color} opacity="0.9" />
            </marker>
          ))}
          <filter id="shadow-soft">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.12" />
          </filter>
        </defs>

        {conexiones.map(c => {
          const from = getCenter(c.from);
          const to   = getCenter(c.to);
          const tr   = TIPOS_RELACION.find(t => t.id === c.tipo) || TIPOS_RELACION[0];
          const mx   = (from.x + to.x) / 2;
          const my   = (from.y + to.y) / 2;
          const isSel = selectedConn === c.id;
          // Curva suave
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const cx1 = from.x + dx * 0.5;
          const cy1 = from.y + dy * 0.1;
          const cx2 = from.x + dx * 0.5;
          const cy2 = from.y + dy * 0.9;
          return (
            <g key={c.id}>
              <path d={`M${from.x},${from.y} C${cx1},${cy1} ${cx2},${cy2} ${to.x},${to.y}`}
                stroke="transparent" strokeWidth="14" fill="none"
                style={{ cursor: "pointer", pointerEvents: "stroke" }}
                onClick={(e) => { e.stopPropagation(); setSelConn(isSel ? null : c.id); }}
              />
              <path d={`M${from.x},${from.y} C${cx1},${cy1} ${cx2},${cy2} ${to.x},${to.y}`}
                stroke={tr.color} strokeWidth={isSel ? 2.5 : 1.5}
                strokeDasharray={tr.dash} strokeOpacity={isSel ? 1 : 0.65}
                fill="none" markerEnd={`url(#arr-${tr.id})`}
                style={{ transition: "all 0.2s", pointerEvents: "none" }}
              />
              {/* Etiqueta */}
              <rect x={mx - 34} y={my - 11} width={68} height={20} rx={5}
                fill="white" stroke={tr.color} strokeWidth="0.8"
                opacity={isSel ? 1 : 0.9} filter="url(#shadow-soft)"
                style={{ pointerEvents: "none" }}
              />
              <text x={mx} y={my + 4} textAnchor="middle"
                fill={tr.color} fontSize="11" fontFamily="monospace" fontWeight="700"
                style={{ pointerEvents: "none" }}
              >
                {tr.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Línea provisional */}
        {modoConexion && origenNodo && (
          <line
            x1={origenNodo.x + 72} y1={origenNodo.y + 36}
            x2={mouse.x} y2={mouse.y}
            stroke={tipoActivo?.color || "#8B5E3C"}
            strokeWidth="2" strokeDasharray="5,4" opacity="0.7"
            style={{ pointerEvents: "none" }}
          />
        )}
      </svg>

      {/* Nodos */}
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
              width: 144, zIndex: isOrig ? 15 : 10,
              background: isOrig ? cat.bg : "rgba(255,255,255,0.92)",
              border: `${isOrig ? "2.5px" : "1.5px"} solid ${isOrig ? (tipoActivo?.color || cat.border) : cat.border}`,
              borderRadius: 10, padding: "9px 11px",
              cursor: modoConexion ? "pointer" : "grab",
              userSelect: "none",
              boxShadow: isOrig
                ? `0 0 0 4px ${tipoActivo?.color || cat.border}33, 0 6px 20px rgba(0,0,0,0.14)`
                : isHover
                ? "0 4px 18px rgba(0,0,0,0.12)"
                : "0 2px 8px rgba(0,0,0,0.07)",
              transition: "box-shadow 0.15s, border 0.15s, transform 0.1s",
              transform: isOrig ? "scale(1.04)" : "scale(1)",
              outline: modoConexion && !isOrig ? `2px dashed ${cat.border}66` : "none",
              outlineOffset: 3,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ fontSize: 17, lineHeight: 1.3, flexShrink: 0 }}>{nodo.icono}</span>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#2C1F0E", lineHeight: 1.4, fontFamily: "'Georgia', serif" }}>
                {nodo.label}
              </div>
            </div>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge categoria={nodo.categoria} />
              {!modoConexion && (
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => {
                    e.stopPropagation();
                    setNodosEnCanvas(prev => prev.filter(n => n.id !== nodo.id));
                    setConexiones(prev => prev.filter(c => c.from !== nodo.id && c.to !== nodo.id));
                  }}
                  style={{ background: "none", border: "none", color: "#C44B4B88", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C44B4B"}
                  onMouseLeave={e => e.currentTarget.style.color = "#C44B4B88"}
                  title="Quitar del mapa"
                >×</button>
              )}
            </div>
          </div>
        );
      })}

      {/* Eliminar conexión seleccionada */}
      {selectedConn && (() => {
        const c = conexiones.find(x => x.id === selectedConn);
        if (!c) return null;
        const from = getCenter(c.from);
        const to   = getCenter(c.to);
        return (
          <div style={{ position: "absolute", left: (from.x + to.x) / 2 + 38, top: (from.y + to.y) / 2 - 18, zIndex: 30 }}>
            <button
              onClick={(e) => { e.stopPropagation(); deleteConexion(selectedConn); }}
              style={{
                background: "#C44B4B", color: "white", border: "none",
                borderRadius: 5, padding: "5px 12px", fontSize: 12,
                cursor: "pointer", fontFamily: "monospace", fontWeight: 700,
                boxShadow: "0 2px 8px rgba(196,75,75,0.4)",
              }}
            >× Eliminar relación</button>
          </div>
        );
      })()}

      {/* Banner modo conexión */}
      {modoConexion && (
        <div style={{
          position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
          background: origenConexion ? (tipoActivo?.color || "#8B5E3C") : "#2C1F0E",
          color: "white", borderRadius: 24,
          padding: "8px 20px", fontSize: 12,
          fontFamily: "monospace", fontWeight: 700,
          boxShadow: "0 3px 16px rgba(0,0,0,0.22)",
          zIndex: 20, pointerEvents: "none", letterSpacing: "0.05em",
          transition: "background 0.2s",
        }}>
          {origenConexion
            ? `▶ Origen listo · Haz clic en el nodo destino`
            : `🔗 Modo conexión · Haz clic en el nodo ORIGEN`}
        </div>
      )}

      {/* Estado vacío */}
      {nodosEnCanvas.length === 0 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "none", gap: 12,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(139,94,60,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
          }}>🗺️</div>
          <div style={{ fontSize: 14, color: "#8B7355", opacity: 0.65, fontFamily: "'Georgia', serif", textAlign: "center", maxWidth: 260, lineHeight: 1.7 }}>
            Haz clic en cualquier elemento<br />del panel para agregarlo al mapa
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PANEL DE RETROALIMENTACIÓN
// ─────────────────────────────────────────────

function PanelFeedback({ nodos, conexiones }) {
  const fb = generarFeedback(nodos, conexiones);
  const pal = FEEDBACK_COLORS[fb.tipo];

  return (
    <div style={{
      background: pal.bg,
      border: `1.5px solid ${pal.border}`,
      borderRadius: 10, padding: "14px 16px",
      transition: "all 0.4s ease",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: pal.color, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 900, flexShrink: 0, fontFamily: "monospace",
        }}>{pal.icon}</div>
        <div>
          <div style={{ fontSize: 13, color: "#2C1F0E", lineHeight: 1.5, marginBottom: fb.pregunta ? 8 : 0 }}>
            {fb.texto}
          </div>
          {fb.pregunta && (
            <div style={{
              fontSize: 13, color: pal.color, lineHeight: 1.6,
              fontStyle: "italic", borderLeft: `2px solid ${pal.color}55`,
              paddingLeft: 10,
            }}>
              {fb.pregunta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PANTALLA: INTRO
// ─────────────────────────────────────────────

function PantallaIntro({ onStart }) {
  const [expanded, setExpanded] = useState(false);
  const preview = CASO.contexto.slice(0, 220) + "…";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(155deg, #FDF8F0 0%, #F5EDD8 60%, #EDE0C4 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decoración fondo */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(45,106,79,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(139,94,60,0.06)" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B5E3C" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ maxWidth: 700, width: "100%", position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 32, height: 3, background: "#2D6A4F", borderRadius: 2 }} />
          <span style={{ fontSize: 12, letterSpacing: "0.25em", color: "#2D6A4F", fontFamily: "monospace", fontWeight: 700 }}>
            LAMA · Universidad del Valle · Periodismo y Sociedad IV
          </span>
        </div>

        {/* Título */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.18em", color: "#A07840", fontFamily: "monospace", marginBottom: 6 }}>
            HERRAMIENTA DE ANÁLISIS SOCIOTÉCNICO
          </div>
          <h1 style={{ fontSize: 58, fontWeight: 700, color: "#2C1F0E", margin: "0 0 4px", lineHeight: 1, letterSpacing: "-0.03em" }}>
            El Ensamblaje
          </h1>
          <div style={{ fontSize: 20, color: "#8B5E3C", fontWeight: 400, fontStyle: "italic" }}>
            Cartografía de una decisión periodística
          </div>
        </div>

        {/* Caso */}
        <div style={{
          background: "rgba(255,255,255,0.72)",
          border: "1px solid #D4A96A",
          borderLeft: "5px solid #8B5E3C",
          borderRadius: 10, padding: "20px 24px",
          marginBottom: 28, backdropFilter: "blur(6px)",
        }}>
          <div style={{ fontSize: 12, color: "#8B5E3C", letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: 8 }}>EL CASO</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#2C1F0E", marginBottom: 12 }}>{CASO.titulo}</div>
          <p style={{ fontSize: 15, color: "#5C4A30", lineHeight: 1.85, margin: "0 0 8px" }}>
            {expanded ? CASO.contexto : preview}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: "none", color: "#8B5E3C", cursor: "pointer", fontSize: 13, fontFamily: "monospace", padding: 0, textDecoration: "underline" }}
          >
            {expanded ? "← Contraer" : "Leer completo →"}
          </button>
          <p style={{ fontSize: 15, color: "#8B5E3C", fontStyle: "italic", margin: "12px 0 0", borderTop: "1px solid #E8D9B8", paddingTop: 10 }}>
            ❝ {CASO.pregunta} ❞
          </p>
        </div>

        {/* Pasos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36 }}>
          {[
            { n: "01", title: "Construye el mapa", desc: "Selecciona factores del ecosistema y ubícalos en el canvas", color: "#8B5E3C" },
            { n: "02", title: "Traza relaciones", desc: "Conecta los nodos: condiciona, tensiona, posibilita, produce", color: "#2D6A4F" },
            { n: "03", title: "Lee el ensamblaje", desc: "El sistema genera tres lecturas personalizadas de tu mapa", color: "#5C4A8A" },
          ].map(item => (
            <div key={item.n} style={{
              background: "rgba(255,255,255,0.6)",
              border: `1px solid rgba(139,94,60,0.18)`,
              borderTop: `4px solid ${item.color}`,
              borderRadius: 8, padding: "16px 16px 14px",
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: item.color, fontFamily: "monospace", marginBottom: 6, letterSpacing: "-0.03em" }}>{item.n}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#2C1F0E", marginBottom: 5 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "#7A6040", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          style={{
            background: "#2C1F0E", color: "#F5EDD8",
            border: "none", borderRadius: 8,
            padding: "15px 52px", fontSize: 13,
            fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.12em", fontFamily: "monospace",
            transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(44,31,14,0.25)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#8B5E3C"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,94,60,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#2C1F0E"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(44,31,14,0.25)"; }}
        >
          COMENZAR → CONSTRUIR EL ENSAMBLAJE
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PANTALLA: CANVAS PRINCIPAL
// ─────────────────────────────────────────────

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

  const nodosUsados     = nodosEnCanvas.map(n => n.id);
  const nodosDisponibles = NODOS_DISPONIBLES.filter(n =>
    !nodosUsados.includes(n.id) &&
    (categoriaFiltro === "all" || n.categoria === categoriaFiltro)
  );

  const agregarNodo = (nodo) => {
    const rect  = canvasAreaRef.current?.getBoundingClientRect();
    const baseX = rect ? Math.random() * Math.max(100, rect.width  - 220) + 60 : 120;
    const baseY = rect ? Math.random() * Math.max(80,  rect.height - 140) + 50 : 80;
    setNodosEnCanvas(prev => [...prev, { ...nodo, x: baseX, y: baseY }]);
  };

  return (
    <div style={{ height: "100vh", background: "#F5EDD8", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>

      {/* Topbar */}
      <div style={{
        padding: "10px 20px",
        borderBottom: "1px solid #D4A96A",
        background: "rgba(253,248,240,0.97)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#A07840", letterSpacing: "0.2em", fontFamily: "monospace" }}>EL ENSAMBLAJE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#2C1F0E" }}>Cartografía de una decisión</div>
          </div>
          <div style={{ width: 1, height: 32, background: "#D4A96A" }} />
          <div style={{ fontSize: 12, color: "#8B7355", fontStyle: "italic" }}>{CASO.titulo}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "#8B7355", fontFamily: "monospace" }}>
            {nodosEnCanvas.length} nodos · {conexiones.length} relaciones
          </div>
          <button
            onClick={() => setPanelAbierto(!panelAbierto)}
            style={{
              background: panelAbierto ? "#2C1F0E" : "rgba(44,31,14,0.08)",
              color: panelAbierto ? "#F5EDD8" : "#2C1F0E",
              border: "1px solid #8B5E3C", borderRadius: 6,
              padding: "6px 14px", fontSize: 12, fontFamily: "monospace", cursor: "pointer",
            }}
          >{panelAbierto ? "Ocultar panel" : "Ver elementos"}</button>
          <button
            onClick={() => onTerminar({ nodos: nodosEnCanvas, conexiones })}
            disabled={!puedeTerminar}
            title={!puedeTerminar ? "Agrega al menos 4 nodos y 2 conexiones" : ""}
            style={{
              background: puedeTerminar ? "#2D6A4F" : "rgba(45,106,79,0.12)",
              color: puedeTerminar ? "white" : "#6B8B78",
              border: "none", borderRadius: 6,
              padding: "6px 18px", fontSize: 12,
              fontFamily: "monospace", fontWeight: 700,
              cursor: puedeTerminar ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: puedeTerminar ? "0 2px 10px rgba(45,106,79,0.3)" : "none",
            }}
          >Analizar ensamblaje →</button>
        </div>
      </div>

      {/* Barra tipos de relación */}
      <div style={{
        padding: "8px 20px",
        borderBottom: "1px solid #E8D9B8",
        background: modoConexion ? "#FFF8EC" : "#FDF8F0",
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        transition: "background 0.25s",
      }}>
        <button
          onClick={() => setModoConexion(m => !m)}
          style={{
            background: modoConexion ? "#8B5E3C" : "transparent",
            color: modoConexion ? "white" : "#8B5E3C",
            border: `2px solid #8B5E3C`, borderRadius: 6,
            padding: "4px 14px", fontSize: 12, fontFamily: "monospace", fontWeight: 700,
            cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
          }}
        >{modoConexion ? "🔗 Conectando…" : "🔗 Modo conexión"}</button>

        <div style={{ width: 1, height: 22, background: "#D4A96A", flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", flexShrink: 0 }}>TIPO:</span>

        {TIPOS_RELACION.map(tr => (
          <button
            key={tr.id}
            onClick={() => { setTipoRelActivo(tr.id); if (!modoConexion) setModoConexion(true); }}
            style={{
              background: tipoRelActivo === tr.id ? tr.color : "transparent",
              color: tipoRelActivo === tr.id ? "white" : tr.color,
              border: `1.5px solid ${tr.color}`, borderRadius: 20,
              padding: "3px 14px", fontSize: 12, fontFamily: "monospace",
              cursor: "pointer", transition: "all 0.15s",
              fontWeight: tipoRelActivo === tr.id ? 700 : 400,
            }}
          >{tr.label}</button>
        ))}
        <span style={{ fontSize: 12, color: "#B09070", fontStyle: "italic", marginLeft: 4 }}>
          {modoConexion ? "① Clic en origen → ② Clic en destino" : "Selecciona un tipo para activar el modo conexión"}
        </span>
      </div>

      {/* Layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Panel izquierdo */}
        {panelAbierto && (
          <div style={{
            width: 272, borderRight: "1px solid #D4A96A",
            background: "#FDF8F0", overflowY: "auto",
            display: "flex", flexDirection: "column",
          }}>
            {/* Filtros */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #E8D9B8" }}>
              <div style={{ fontSize: 12, color: "#A07840", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 10 }}>
                ELEMENTOS DEL ENSAMBLAJE
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                <button onClick={() => setCatFiltro("all")} style={{ background: categoriaFiltro === "all" ? "#2C1F0E" : "transparent", color: categoriaFiltro === "all" ? "white" : "#8B7355", border: "1px solid #C4A875", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontFamily: "monospace", cursor: "pointer" }}>Todos</button>
                {Object.entries(CATEGORIAS).map(([key, cat]) => (
                  <button key={key} onClick={() => setCatFiltro(key)} style={{ background: categoriaFiltro === key ? cat.color : "transparent", color: categoriaFiltro === key ? "white" : cat.color, border: `1px solid ${cat.border}`, borderRadius: 4, padding: "3px 8px", fontSize: 12, fontFamily: "monospace", cursor: "pointer" }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de nodos */}
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
              {nodosDisponibles.length === 0 && (
                <div style={{ fontSize: 12, color: "#B09070", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                  Todos los elementos de esta categoría están en el mapa
                </div>
              )}
              {nodosDisponibles.map(nodo => {
                const cat = CATEGORIAS[nodo.categoria];
                return (
                  <div key={nodo.id} style={{ position: "relative", marginBottom: 6 }}>
                    <div
                      onClick={() => agregarNodo(nodo)}
                      onMouseEnter={() => setTooltipNodo(nodo.id)}
                      onMouseLeave={() => setTooltipNodo(null)}
                      style={{
                        background: "rgba(255,255,255,0.7)", border: `1px solid ${cat.border}`,
                        borderLeft: `3px solid ${cat.color}`,
                        borderRadius: 7, padding: "9px 10px",
                        cursor: "pointer", transition: "all 0.15s",
                        display: "flex", gap: 8, alignItems: "flex-start",
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = cat.bg; e.currentTarget.style.transform = "translateX(2px)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.3 }}>{nodo.icono}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1F0E", lineHeight: 1.35, marginBottom: 3 }}>{nodo.label}</div>
                        <Badge categoria={nodo.categoria} />
                      </div>
                    </div>
                    {/* Tooltip */}
                    {tooltipNodo === nodo.id && (
                      <div style={{
                        position: "absolute", left: "102%", top: 0,
                        width: 210, background: "white",
                        border: `1px solid ${cat.border}`, borderRadius: 8,
                        padding: 12, zIndex: 50,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                        fontSize: 13, color: "#5C4A30", lineHeight: 1.6,
                        pointerEvents: "none",
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: 5, color: "#2C1F0E" }}>{nodo.label}</div>
                        {nodo.descripcion}
                        <div style={{ marginTop: 8, fontSize: 12, color: "#A07840", fontStyle: "italic" }}>Clic para agregar al mapa →</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Feedback en tiempo real */}
            <div style={{ padding: "12px", borderTop: "1px solid #E8D9B8" }}>
              <div style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 8 }}>
                ESTADO DEL ANÁLISIS
              </div>
              <PanelFeedback nodos={nodosEnCanvas} conexiones={conexiones} />
            </div>

            {/* Leyenda dimensiones */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #E8D9B8" }}>
              <div style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 10 }}>DIMENSIONES</div>
              {Object.entries(CATEGORIAS).map(([key, cat]) => (
                <div key={key} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: cat.color, marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: "#8B7355", lineHeight: 1.4 }}>{cat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div ref={canvasAreaRef} id="canvas-area" style={{ flex: 1, position: "relative" }}>
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

// ─────────────────────────────────────────────
// PANTALLA: ANÁLISIS (tres marcos personalizados)
// ─────────────────────────────────────────────

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
    determinismo:   { titulo: "Lectura determinista",    subtitulo: "La tecnología lo decidió todo",           color: "#C44B4B", icon: "⚙️" },
    instrumentalismo: { titulo: "Lectura instrumentalista", subtitulo: "Los periodistas eligieron bien (o mal)", color: "#E8922A", icon: "🔧" },
    sociotecnico:   { titulo: "Lectura sociotécnica",    subtitulo: "Una configuración que condiciona sin determinar", color: "#2D6A4F", icon: "🕸️" },
  };

  const marco = MARCOS[marcoActivo];

  if (fase === "reflexion") return <PantallaReflexion resultado={resultado} onTerminar={onReflexion} />;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FDF8F0 0%, #F5EDD8 100%)", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 28px", borderBottom: "1px solid #D4A96A", background: "rgba(253,248,240,0.95)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "#A07840", letterSpacing: "0.2em", fontFamily: "monospace" }}>ANÁLISIS DEL ENSAMBLAJE</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#2C1F0E" }}>Tres lecturas del mismo ensamblaje</div>
        </div>
        <div style={{ fontSize: 12, color: "#8B7355", fontFamily: "monospace" }}>
          {stats.total} nodos · {stats.conexiones} relaciones
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Panel izquierdo: resumen */}
        <div style={{ width: 240, borderRight: "1px solid #D4A96A", background: "#FDF8F0", overflowY: "auto", padding: 18, flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 14 }}>TU ENSAMBLAJE</div>
          {Object.entries(stats.porCategoria).map(([cat, count]) => {
            const c = CATEGORIAS[cat];
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 13, color: c.color, fontWeight: 700 }}>{c.label}</span>
                  <span style={{ fontSize: 13, color: c.color, fontFamily: "monospace" }}>{count}</span>
                </div>
                <div style={{ height: 5, background: "#EDE0C8", borderRadius: 2 }}>
                  <div style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`, height: "100%", background: c.color, borderRadius: 2, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}

          <div style={{ borderTop: "1px solid #E8D9B8", marginTop: 14, paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 10 }}>RELACIONES</div>
            {stats.porTipo.filter(t => t.count > 0).map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 18, height: 2, background: t.color, borderRadius: 1 }} />
                  <span style={{ fontSize: 13, color: "#5C4A30" }}>{t.label}</span>
                </div>
                <span style={{ fontSize: 13, color: t.color, fontFamily: "monospace", fontWeight: 700 }}>{t.count}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #E8D9B8", marginTop: 14, paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 10 }}>ELEMENTOS</div>
            {resultado.nodos.map(n => (
              <div key={n.id} style={{ display: "flex", gap: 6, marginBottom: 7, alignItems: "flex-start" }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{n.icono}</span>
                <div>
                  <div style={{ fontSize: 12, color: "#2C1F0E", lineHeight: 1.4 }}>{n.label}</div>
                  <Badge categoria={n.categoria} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel central */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
          {/* Selector marcos */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {Object.entries(MARCOS).map(([key, m]) => (
              <button key={key} onClick={() => setMarcoActivo(key)} style={{
                flex: 1, padding: "14px 10px",
                background: marcoActivo === key ? m.color : "rgba(255,255,255,0.65)",
                border: `2px solid ${m.color}`, borderRadius: 10,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: marcoActivo === key ? `0 4px 16px ${m.color}44` : "none",
              }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{m.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: marcoActivo === key ? "white" : m.color, lineHeight: 1.3 }}>{m.titulo}</div>
              </button>
            ))}
          </div>

          {/* Lectura personalizada */}
          <div style={{
            background: "rgba(255,255,255,0.75)",
            border: `1px solid ${marco.color}44`,
            borderLeft: `5px solid ${marco.color}`,
            borderRadius: 12, padding: "26px 30px",
            marginBottom: 18, backdropFilter: "blur(4px)",
          }}>
            <div style={{ fontSize: 12, color: marco.color, letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: 8 }}>
              {marco.subtitulo.toUpperCase()}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#2C1F0E", margin: "0 0 18px", lineHeight: 1.3 }}>
              {marco.titulo}
            </h3>
            <p style={{ fontSize: 15, color: "#3C2C1A", lineHeight: 1.9, margin: "0 0 20px" }}>
              {generarLectura(marcoActivo, resultado.nodos, resultado.conexiones)}
            </p>
            <div style={{ background: `${marco.color}10`, border: `1px solid ${marco.color}30`, borderRadius: 8, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, color: marco.color, fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 7 }}>
                PUNTO CIEGO DE ESTE MARCO
              </div>
              <p style={{ fontSize: 14, color: "#5C4A30", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                {generarCeguera(marcoActivo, resultado.nodos, resultado.conexiones)}
              </p>
            </div>
          </div>

          {/* Nota */}
          <div style={{ background: "rgba(45,106,79,0.07)", border: "1px solid rgba(45,106,79,0.2)", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: "#2D6A4F", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              ✦ <strong>Este análisis es una lectura de tu ensamblaje específico.</strong> Dos estudiantes con mapas distintos recibirán lecturas distintas. Lo que importa no es qué nodos elegiste, sino si puedes argumentar por qué esos factores —y sus relaciones— producen esta configuración y no otra.
            </p>
          </div>

          <button
            onClick={() => setFase("reflexion")}
            style={{
              background: "#2C1F0E", color: "#F5EDD8", border: "none", borderRadius: 8,
              padding: "13px 36px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "monospace", letterSpacing: "0.08em", transition: "all 0.2s",
              boxShadow: "0 3px 14px rgba(44,31,14,0.2)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#8B5E3C"}
            onMouseLeave={e => e.currentTarget.style.background = "#2C1F0E"}
          >Continuar: reflexión y cierre →</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PANTALLA: REFLEXIÓN Y CIERRE
// ─────────────────────────────────────────────

function PantallaReflexion({ resultado, onTerminar }) {
  const [reflexion, setReflexion] = useState("");
  const [exportado, setExportado] = useState(false);
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FDF8F0 0%, #F0EAD8 100%)",
      fontFamily: "'Georgia', serif",
      padding: "48px 40px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ maxWidth: 740, width: "100%" }}>
        <div style={{ fontSize: 12, color: "#A07840", letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 10 }}>
          CIERRE DEL ANÁLISIS
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 400, color: "#2C1F0E", margin: "0 0 6px", lineHeight: 1.2 }}>
          Reflexión y transferencia
        </h2>
        <div style={{ width: 52, height: 3, background: "#8B5E3C", borderRadius: 2, marginBottom: 36 }} />

        {/* Síntesis */}
        <div style={{
          background: "rgba(255,255,255,0.72)", border: "1px solid #D4A96A",
          borderLeft: "5px solid #2D6A4F", borderRadius: 10, padding: "22px 26px", marginBottom: 28,
        }}>
          <div style={{ fontSize: 12, color: "#2D6A4F", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 12 }}>LO QUE CONSTRUISTE</div>
          <p style={{ fontSize: 15, color: "#3C2C1A", lineHeight: 1.85, margin: 0 }}>
            Tu cartografía incluye <strong>{resultado.nodos.length} elementos</strong> —{cats.e} estructurales, {cats.r} relacionales y {cats.o} organizacionales— conectados por <strong>{resultado.conexiones.length} relaciones</strong>. Ningún elemento "causó" la decisión por sí solo. Todos interactúan. Eso es precisamente lo que el enfoque sociotécnico hace visible que el determinismo y el instrumentalismo no pueden ver por separado.
            {cats.e === 0 && " Tu análisis prescinde de factores estructurales, lo que es una apuesta analítica: implica que el resultado puede explicarse desde las relaciones y la organización interna del medio."}
            {cats.o === 0 && " Tu análisis no incluye factores organizacionales, lo que sitúa la explicación en el entorno externo y los vínculos del medio."}
          </p>
        </div>

        {/* Reflexión dinámica */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "#A07840", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 10 }}>TU REFLEXIÓN ANALÍTICA</div>
          <p style={{ fontSize: 15, color: "#5C4A30", lineHeight: 1.75, marginBottom: 14 }}>
            {generarPreguntaReflexion()}
          </p>
          <textarea
            value={reflexion}
            onChange={e => setReflexion(e.target.value)}
            placeholder="Escribe tu análisis aquí. No hay respuesta correcta: lo que importa es la coherencia del argumento..."
            style={{
              width: "100%", minHeight: 140,
              background: "rgba(255,255,255,0.65)",
              border: "1.5px solid #C4A875", borderRadius: 8,
              padding: "14px 16px", fontSize: 14, color: "#2C1F0E",
              resize: "vertical", boxSizing: "border-box",
              fontFamily: "'Georgia', serif", lineHeight: 1.75, outline: "none",
              transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.border = "1.5px solid #8B5E3C"}
            onBlur={e => e.target.style.border = "1.5px solid #C4A875"}
          />
        </div>

        {/* Preguntas discusión */}
        <div style={{
          background: "rgba(255,255,255,0.65)", border: "1px solid #D4A96A",
          borderRadius: 12, padding: "22px 26px", marginBottom: 32,
        }}>
          <div style={{ fontSize: 12, color: "#8B5E3C", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 18 }}>
            PREGUNTAS PARA DISCUSIÓN GRUPAL
          </div>
          {PREGUNTAS_CIERRE.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "rgba(139,94,60,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 13, color: "#8B5E3C",
                fontFamily: "monospace", fontWeight: 700,
              }}>{i + 1}</div>
              <p style={{ fontSize: 15, color: "#5C4A30", lineHeight: 1.75, margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleExportar}
            style={{
              background: exportado ? "#2D6A4F" : "#2C1F0E",
              color: "#F5EDD8", border: "none", borderRadius: 8,
              padding: "13px 32px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.08em",
              transition: "all 0.2s",
              boxShadow: "0 3px 14px rgba(44,31,14,0.2)",
            }}
            onMouseEnter={e => { if (!exportado) e.currentTarget.style.background = "#8B5E3C"; }}
            onMouseLeave={e => { if (!exportado) e.currentTarget.style.background = "#2C1F0E"; }}
          >
            {exportado ? "✓ Exportado" : "↓ Exportar análisis (.txt)"}
          </button>
          <button
            onClick={onTerminar}
            style={{
              background: "transparent", color: "#8B5E3C",
              border: "1.5px solid #8B5E3C", borderRadius: 8,
              padding: "13px 28px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "monospace",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8B5E3C"; e.currentTarget.style.color = "#F5EDD8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B5E3C"; }}
          >Reiniciar →</button>
        </div>

        {exportError && (
          <div style={{ marginTop: 12, fontSize: 13, color: "#C44B4B", fontFamily: "monospace" }}>
            ⚠ No se pudo descargar el archivo. Copia tu reflexión manualmente antes de cerrar.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  const [pantalla, setPantalla] = useState("intro");
  const [resultado, setResultado] = useState(null);

  if (pantalla === "intro") return <PantallaIntro onStart={() => setPantalla("canvas")} />;
  if (pantalla === "canvas") return (
    <PantallaCanvas
      onTerminar={(res) => { setResultado(res); setPantalla("analisis"); }}
    />
  );
  if (pantalla === "analisis") return (
    <PantallaAnalisis
      resultado={resultado}
      onReflexion={() => setPantalla("intro")}
    />
  );
  return null;
}
