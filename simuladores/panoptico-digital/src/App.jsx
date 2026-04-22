import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Map, Music, Coffee, BookOpen, ShoppingCart, Tv, Smartphone, 
  Activity, Eye, Network, BookMarked, RefreshCw, AlertTriangle, Lock, Fingerprint, 
  Database, Cpu, ChevronDown, Briefcase, Clock, TrendingUp, MessageSquare, 
  Megaphone, Share2, Search, Video, ShieldAlert, Terminal, Receipt, Download
} from 'lucide-react';

// --- DATA & THEORETICAL ANCHORS (Now with exact autonomy penalties) ---
const SCENARIOS = {
  casual: {
    title: 'Día Casual',
    subtitle: 'Consumo, transporte y ocio',
    theme: 'indigo',
    steps: [
      {
        id: 'desayuno', time: '07:30 AM', icon: <Activity className="w-5 h-5" />,
        question: '¿Qué desayunas hoy?',
        options: [
          { text: 'Avena con frutos rojos (Recomendación de tu app de salud)', isDefault: true, tags: ['PREDICTIBILIDAD: ALTA', 'INFLUENCIA_SPONSOR: EXITOSA'], penalty: 18 },
          { text: 'Huevos revueltos con pan (Lo que solías comer)', isDefault: false, tags: ['HÁBITO_ARRAIGADO', 'RESISTENCIA_NUDGE'], penalty: 5 },
          { text: 'Saltarse el desayuno (Ayuno intermitente)', isDefault: false, tags: ['COMPORTAMIENTO_ATÍPICO', 'ANOMALÍA_DATOS'], penalty: 2 }
        ],
        revelation: 'Tu app de salud prioriza la avena hoy no por tus biomarcadores, sino porque una marca pagó por una campaña de "micromomentos de salud".',
        concept: 'Arquitectura de elección', author: 'Thaler & Sunstein',
        theory: 'Modulación continua: El entorno de opciones se reconfigura dinámicamente según acuerdos comerciales invisibles.'
      },
      {
        id: 'ruta', time: '08:15 AM', icon: <Map className="w-5 h-5" />,
        question: '¿Qué ruta tomas hoy?',
        options: [
          { text: 'Ruta Azul (Sugerida por Maps: "Más rápida, 22 min")', isDefault: true, tags: ['NODO_RUTEABLE: ACTIVO', 'DISPOSICIÓN_A_DESVÍO: ALTA'], penalty: 16 },
          { text: 'Ruta Verde (Conocida por ti: 25 min, menos tráfico)', isDefault: false, tags: ['CONOCIMIENTO_LOCAL', 'SENSITIVIDAD_TIEMPO: BAJA'], penalty: 4 },
          { text: 'Transporte público alternativo', isDefault: false, tags: ['FUERA_DE_SISTEMA_VIAL', 'EVASIÓN_TRACKING'], penalty: 0 }
        ],
        revelation: 'Maps desvió a miles de usuarios por la Ruta Azul para descongestionar una arteria principal. Tu tiempo fue optimizado para el sistema vial macro, no para ti.',
        concept: 'Gubernamentalidad Algorítmica', author: 'Rouvroy & Berns',
        theory: 'Gobernar por datos: Operar sobre perfiles estadísticos agregados. Eres un nodo de datos gestionado para la eficiencia del sistema.'
      },
      {
        id: 'musica', time: '08:30 AM', icon: <Music className="w-5 h-5" />,
        question: '¿Qué escuchas en el camino?',
        options: [
          { text: '"Daily Mix 1" (Hecho para ti)', isDefault: true, tags: ['CONSUMO_PASIVO', 'RENTABILIDAD_REGALÍAS: MAX'], penalty: 15 },
          { text: 'Un disco completo que buscaste manualmente', isDefault: false, tags: ['AGENCIA_ESTÉTICA', 'TIEMPO_EXPLORACIÓN: ALTO'], penalty: 6 },
          { text: 'Un podcast aleatorio', isDefault: false, tags: ['DATA_SEMÁNTICA_INCOMPLETA'], penalty: 3 }
        ],
        revelation: 'El Daily Mix no está optimizado para tu placer estético, sino para la "tasa de retención", intercalando canciones de artistas que cobran menos regalías.',
        concept: 'Conducción de Conductas', author: 'Foucault',
        theory: 'No te obligan a escuchar nada (no hay represión), pero moldean tu campo de posibilidades para que tu elección "libre" coincida con su rentabilidad.'
      },
      {
        id: 'lectura', time: '03:30 PM', icon: <BookOpen className="w-5 h-5" />,
        question: 'Tienes 10 minutos libres. ¿Qué lees?',
        options: [
          { text: 'Haces scroll en tu feed algorítmico principal', isDefault: true, tags: ['SUSCEPTIBILIDAD_DOPAMÍNICA', 'TIEMPO_PANTALLA: +14%'], penalty: 20 },
          { text: 'Abres un artículo largo que guardaste ayer', isDefault: false, tags: ['ATENCIÓN_SOSTENIDA', 'LECTURA_PROFUNDA'], penalty: 4 },
          { text: 'Revisas tu bandeja de entrada', isDefault: false, tags: ['COMPULSIÓN_PRODUCTIVA'], penalty: 8 }
        ],
        revelation: 'El algoritmo priorizó una noticia que te genera leve indignación. Su análisis de sentimiento predice que la rabia aumenta tu tiempo en pantalla en un 14%.',
        concept: 'Personalización Anticipatoria', author: 'Rouvroy & Berns',
        theory: 'El algoritmo te conoce a un nivel sub-representacional. Anticipa y moldea tus afectos antes de que pasen por tu conciencia crítica.'
      },
      {
        id: 'dormir', time: '11:30 PM', icon: <Smartphone className="w-5 h-5" />,
        question: 'Antes de dormir, revisas redes.',
        options: [
          { text: 'Subes una historia con filtro y ubicación', isDefault: true, tags: ['AUTOEXPLOTACIÓN_ACTIVA', 'EXTRACCIÓN_GEOLOCALIZADA'], penalty: 22 },
          { text: 'Subes una foto cruda sin etiquetas', isDefault: false, tags: ['DATA_VISUAL_BRUTA'], penalty: 10 },
          { text: 'Dejas el teléfono lejos y duermes', isDefault: false, tags: ['DESCONEXIÓN_FÍSICA', 'ZONA_CIEGA_ALGORÍTMICA'], penalty: 0 }
        ],
        revelation: 'Al optimizar tu contenido para obtener likes, estás entrenando gratuitamente sus modelos de IA y enriqueciendo el grafo social corporativo.',
        concept: 'Autoexplotación Voluntaria', author: 'Byung-Chul Han',
        theory: 'La vigilancia es deseada. Te auto-optimizas y auto-explotas creyendo que te estás realizando y ejerciendo tu libertad absoluta.'
      }
    ]
  },
  laboral: {
    title: 'Día Laboral',
    subtitle: 'Métricas, vigilancia y rendimiento',
    theme: 'amber',
    steps: [
      {
        id: 'login', time: '08:00 AM', icon: <Briefcase className="w-5 h-5" />,
        question: 'Empiezas tu jornada remota. ¿Cómo gestionas tu inicio?',
        options: [
          { text: 'Activar el tracker de tiempo y poner estado "Focus"', isDefault: true, tags: ['PERFORMANCIA_PRESENTISMO', 'VISIBILIDAD: ALTA'], penalty: 18 },
          { text: 'Abrir los documentos y empezar a trabajar en silencio', isDefault: false, tags: ['RUTINA_INVISIBLE', 'RIESGO_EVALUACIÓN_BAJA'], penalty: 6 },
          { text: 'Poner "Ausente" mientras te preparas un café', isDefault: false, tags: ['TIEMPO_MUERTO_REGISTRADO', 'ALERTA_SUPERVISIÓN'], penalty: 12 }
        ],
        revelation: 'El software corporativo (Bossware) registra tus "teclas por minuto" y apertura de apps. Tu estado "Focus" no es para tu concentración, es una métrica de presentismo digital.',
        concept: 'Panoptismo Corporativo', author: 'Foucault / Zuboff',
        theory: 'La disciplina muta. La mirada del supervisor se automatiza en el código, obligando al trabajador a performar constantemente su productividad.'
      },
      {
        id: 'asignacion', time: '11:30 AM', icon: <Clock className="w-5 h-5" />,
        question: 'El sistema te auto-asigna un nuevo ticket urgente.',
        options: [
          { text: 'Aceptarlo de inmediato para mantener tu SLA en verde', isDefault: true, tags: ['OPTIMIZACIÓN_DESEMPEÑO', 'TOLERANCIA_ESTRÉS: ALTA'], penalty: 20 },
          { text: 'Revisarlo y solicitar que se reasigne por falta de tiempo', isDefault: false, tags: ['NEGOCIACIÓN_FALLIDA', 'MARCA_INEFICIENCIA'], penalty: 8 },
          { text: 'Ignorarlo hasta terminar tu tarea actual', isDefault: false, tags: ['INCUMPLIMIENTO_SLA', 'ALGORITMO_PENALIZADOR'], penalty: 2 }
        ],
        revelation: 'El algoritmo de asignación calculó tu nivel de fatiga histórica y te dio la tarea justo al límite de tu capacidad productiva, maximizando la extracción de valor sin provocar un "burnout" estadístico.',
        concept: 'Gestión Algorítmica', author: 'Rouvroy / Berns',
        theory: 'El manager humano es reemplazado por un algoritmo que opera sobre perfiles de rendimiento, eliminando la negociación política del trabajo.'
      },
      {
        id: 'comunicacion', time: '03:00 PM', icon: <MessageSquare className="w-5 h-5" />,
        question: 'Un colega de otro equipo te pide un favor rápido por chat.',
        options: [
          { text: 'Respondes en menos de 2 minutos', isDefault: true, tags: ['DISPONIBILIDAD_COGNITIVA: 100%', 'GRAFO_CENTRAL'], penalty: 15 },
          { text: 'Respondes una hora después cuando haces una pausa', isDefault: false, tags: ['LATENCIA_COMUNICACIONAL', 'NODO_PERIFÉRICO'], penalty: 5 },
          { text: 'Le pides que levante un ticket formal', isDefault: false, tags: ['RIGIDEZ_BUROCRÁTICA', 'BAJO_ENGAGEMENT'], penalty: 5 }
        ],
        revelation: 'Plataformas corporativas analizan pasivamente tu ONA (Análisis de Redes). Tu tiempo de respuesta cuantifica tu "Engagement" y compañerismo para futuras evaluaciones.',
        concept: 'Cuantificación del Afecto', author: 'Deleuze',
        theory: 'En la sociedad de control, las interacciones sociales y la sociabilidad laboral se codifican como datos extraíbles y evaluables.'
      },
      {
        id: 'cierre', time: '06:30 PM', icon: <TrendingUp className="w-5 h-5" />,
        question: 'Termina tu horario, pero el dashboard muestra que estás al 95% de tu meta.',
        options: [
          { text: 'Te quedas 45 mins extra para alcanzar el 100% y la insignia', isDefault: true, tags: ['AUTOEXPLOTACIÓN_GAMIFICADA', 'PLUSVALÍA_VOLUNTARIA'], penalty: 22 },
          { text: 'Cierras el computador puntualmente', isDefault: false, tags: ['RESISTENCIA_MÉTRICA', 'COMPORTAMIENTO_SUBÓPTIMO'], penalty: 0 },
          { text: 'Dejas el computador encendido moviendo el mouse', isDefault: false, tags: ['EVASIÓN_SISTÉMICA', 'FALSEO_DATOS'], penalty: 4 }
        ],
        revelation: 'El sistema gamificó tu rendimiento. Nadie te obligó a quedarte, la presión provino de una interfaz diseñada para hackear tu sistema de recompensas dopaminérgico.',
        concept: 'Autoexplotación Gamificada', author: 'Byung-Chul Han',
        theory: 'El sujeto del rendimiento se explota a sí mismo bajo el imperativo de la optimización, experimentando el sometimiento como autorrealización.'
      }
    ]
  },
  electoral: {
    title: 'Día Electoral',
    subtitle: 'Polarización y modulación del voto',
    theme: 'rose',
    steps: [
      {
        id: 'titular', time: '09:00 AM', icon: <Megaphone className="w-5 h-5" />,
        question: 'Abres redes sociales y ves un anuncio político.',
        options: [
          { text: 'Lees el titular escandaloso y sientes preocupación', isDefault: true, tags: ['ACTIVACIÓN_AMÍGDALA: ALTA', 'SESGO_NEGATIVIDAD'], penalty: 18 },
          { text: 'Bloqueas el anuncio de inmediato', isDefault: false, tags: ['RESISTENCIA_ADVERTISING', 'PERFIL_OPACO'], penalty: 2 },
          { text: 'Abres otra pestaña para verificar la fuente', isDefault: false, tags: ['FACT_CHECK', 'ALTA_FRICCIÓN_COGNITIVA'], penalty: 0 }
        ],
        revelation: 'El titular fue generado dinámicamente. Basado en tu modelo psicométrico, el sistema te mostró la variante optimizada para activar tu miedo subconsciente.',
        concept: 'Micro-targeting Predictivo', author: 'C. Wylie / Rouvroy',
        theory: 'La propaganda ya no es masiva, es hiper-segmentada. Se atacan vulnerabilidades psicológicas individuales para bypassear la deliberación racional.'
      },
      {
        id: 'viralidad', time: '01:00 PM', icon: <Share2 className="w-5 h-5" />,
        question: 'En el chat familiar de WhatsApp envían un video polarizante.',
        options: [
          { text: 'Lo reproduces y envías un emoji de sorpresa/enojo', isDefault: true, tags: ['CONTAGIO_AFECTIVO: ÉXITO', 'NODO_PROPAGADOR'], penalty: 16 },
          { text: 'Envías un link desmintiendo la información', isDefault: false, tags: ['INTERRUPCIÓN_FLUJO', 'AISLAMIENTO_BURBUJA'], penalty: 4 },
          { text: 'Silencias el grupo temporalmente', isDefault: false, tags: ['RETIRADA_SOCIAL', 'EVASIÓN_CONFLICTO'], penalty: 2 }
        ],
        revelation: 'Los algoritmos de redes premian la fricción. Ese video llegó a tu familia porque las plataformas amplifican el "contagio emocional negativo".',
        concept: 'Contagio Algorítmico', author: 'Tufekci / Deleuze',
        theory: 'Las plataformas no son contenedores neutrales; actúan como arquitecturas de modulación que priorizan el contenido que genera mayor reacción neurológica.'
      },
      {
        id: 'busqueda', time: '05:00 PM', icon: <Search className="w-5 h-5" />,
        question: 'Buscas en Google información sobre el candidato opositor.',
        options: [
          { text: 'Haces clic en los primeros 2 resultados recomendados', isDefault: true, tags: ['CONFIRMACIÓN_SESGO', 'CONFIANZA_SERP: 100%'], penalty: 15 },
          { text: 'Vas directamente a la página de Wikipedia del candidato', isDefault: false, tags: ['BÚSQUEDA_NEUTRAL', 'EVASIÓN_BURBUJA'], penalty: 3 },
          { text: 'Buscas en un medio de investigación independiente', isDefault: false, tags: ['NICHOS_INFORMACIONALES', 'ALTA_AGENCIA'], penalty: 0 }
        ],
        revelation: 'Los resultados de búsqueda están altamente personalizados. El buscador te muestra artículos que confirman tus sesgos preexistentes para maximizar tu confort.',
        concept: 'Burbujas Epistémicas', author: 'Eli Pariser',
        theory: 'La infraestructura de búsqueda aísla al usuario en un ecosistema de información autorreferencial, fragmentando la realidad compartida.'
      },
      {
        id: 'rabbit_hole', time: '08:00 PM', icon: <Video className="w-5 h-5" />,
        question: 'En YouTube, terminas un video de noticias y empieza el siguiente.',
        options: [
          { text: 'Dejas que el Autoplay reproduzca el análisis sugerido', isDefault: true, tags: ['AUTOPLAY_ACEPTADO', 'RADICALIZACIÓN_LATENTE: +1'], penalty: 20 },
          { text: 'Buscas manualmente un canal con visión opuesta', isDefault: false, tags: ['CONSUMO_DIALÉCTICO', 'BAJA_RETENCIÓN_RECOMENDADA'], penalty: 4 },
          { text: 'Apagas la pantalla por hoy', isDefault: false, tags: ['FIN_SESIÓN_PREMATURO', 'ESCAPE_ALGORÍTMICO'], penalty: 0 }
        ],
        revelation: 'El motor de recomendación te empuja hacia el "Rabbit Hole". Te lleva progresivamente de contenido moderado a extremo porque el extremismo retiene más tiempo.',
        concept: 'Radicalización Funcional', author: 'S. Zuboff',
        theory: 'El Capitalismo de Vigilancia instrumentaliza la polarización política no por ideología, sino porque la radicalización es altamente rentable.'
      }
    ]
  }
};

const THEMES = {
  indigo: {
    bgFrom: 'from-indigo-100/50',
    iconBg: 'from-indigo-50 to-purple-50',
    iconText: 'text-indigo-600',
    btnDefault: 'from-indigo-600 to-indigo-500 shadow-sm hover:shadow-md',
    btnForensic: 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-900/30 hover:border-indigo-400',
    accent: 'text-indigo-500',
    borderFocus: 'hover:border-indigo-200',
    progressHigh: 'bg-indigo-500'
  },
  amber: {
    bgFrom: 'from-amber-100/50',
    iconBg: 'from-amber-50 to-orange-50',
    iconText: 'text-amber-600',
    btnDefault: 'from-amber-600 to-amber-500 shadow-sm hover:shadow-md',
    btnForensic: 'border-amber-500/50 text-amber-400 hover:bg-amber-900/30 hover:border-amber-400',
    accent: 'text-amber-500',
    borderFocus: 'hover:border-amber-200',
    progressHigh: 'bg-amber-500'
  },
  rose: {
    bgFrom: 'from-rose-100/50',
    iconBg: 'from-rose-50 to-pink-50',
    iconText: 'text-rose-600',
    btnDefault: 'from-rose-600 to-rose-500 shadow-sm hover:shadow-md',
    btnForensic: 'border-rose-500/50 text-rose-400 hover:bg-rose-900/30 hover:border-rose-400',
    accent: 'text-rose-500',
    borderFocus: 'hover:border-rose-200',
    progressHigh: 'bg-rose-500'
  }
};

export default function PanopticoDigital() {
  const [phase, setPhase] = useState('intro');
  const [scenarioType, setScenarioType] = useState('casual');
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [extractedTags, setExtractedTags] = useState([]);
  const [autonomy, setAutonomy] = useState(100);
  const [revealedCurrent, setRevealedCurrent] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const currentScenarioData = SCENARIOS[scenarioType];
  const scenarioSteps = currentScenarioData.steps;
  const currentTheme = THEMES[currentScenarioData.theme];

  const renderCredits = (isDark = false) => (
    <footer className={`mt-8 md:mt-16 pb-8 text-center text-[10px] md:text-xs font-mono tracking-wide ${isDark ? 'text-slate-500 border-slate-800/50' : 'text-slate-400 border-slate-200/60'} w-full border-t pt-8 z-10 relative`}>
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-2 px-4">
        <p className={`uppercase tracking-widest font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          LAMA - Laboratorio de Mediaciones Algorítmicas
        </p>
        <p>Escuela de Comunicación Social, Universidad del Valle, Colombia.</p>
        <div className={`w-8 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'} my-2`}></div>
        <p className="italic">Desarrollo e IA: Google Gemini.</p>
      </div>
    </footer>
  );

  // --- HANDLERS ---
  const handleStart = (type = 'casual') => {
    setScenarioType(type);
    setCurrentStep(0);
    setChoices([]);
    setExtractedTags([]);
    setAutonomy(100);
    setRevealedCurrent(false);
    setPhase('phase1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleChoicePhase1 = (choice) => {
    setChoices([...choices, { step: scenarioSteps[currentStep], choice }]);
    if (choice.tags) {
      setExtractedTags(prev => [...prev, ...choice.tags]);
    }

    if (currentStep < scenarioSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
        setPhase('transition1');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  };

  const startPhase2 = () => {
    setCurrentStep(0);
    setRevealedCurrent(false);
    setPhase('phase2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReveal = () => {
    setRevealedCurrent(true);
    // AGENCIA REAL: El impacto en la autonomía depende de la elección del usuario
    const currentChoicePenalty = choices[currentStep]?.choice?.penalty || 10;
    setAutonomy(prev => Math.max(0, prev - currentChoicePenalty));
  };

  const nextReveal = () => {
    if (currentStep < scenarioSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setRevealedCurrent(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPhase('phase3');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExport = () => {
    if (choices.length === 0) return; // Evita exportar si no hay datos
    
    const content = `=========================================
PANOPTICON INC. - DOSSIER DE EXTRACCIÓN
=========================================
FECHA DE EXTRACCIÓN: ${new Date().toLocaleString()}
TOPOLOGÍA AUDITADA: ${currentScenarioData.title.toUpperCase()}
AUTONOMÍA RESIDUAL: ${autonomy}%

METADATOS CAPTURADOS:
${extractedTags.length > 0 ? extractedTags.map(tag => `> ${tag}`).join('\n') : '> Anomalía: Evasión de captura detectada.'}

HISTORIAL DE DECISIONES:
${choices.map((c, i) => `[Nodo ${i+1}] ${c.choice.text} (Extracción: -${c.choice.penalty}% Voluntad)`).join('\n')}

=========================================
"El producto eres tú."
=========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dossier_extraccion_${Math.random().toString(36).substring(2, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- RENDERERS ---

  const renderIntro = () => (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-[#fafcff] text-slate-800 overflow-hidden font-sans p-6 md:p-12">
      
      {/* Background Orbs (Ethereal calm aesthetic based on the Synnect reference) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Soft floating gradients acting as the "Aletheia" / wellness entry point */}
        <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-200/40 mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-70 animate-blob translate-x-[-20%] translate-y-[-20%]"></div>
        <div className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-teal-200/30 mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-70 animate-blob animation-delay-2000 translate-x-[20%] translate-y-[30%]"></div>
        <div className="absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full bg-[#fdf5e6]/60 mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-60 animate-blob animation-delay-4000 translate-x-[10%] translate-y-[-10%]"></div>
      </div>

      {/* Top Text - Elegance and Typographic contrast */}
      <div className="relative z-10 text-center mt-12 md:mt-20 w-full">
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-light tracking-tight text-slate-800 mb-4">
          Panóptico <em className="font-serif italic text-teal-600/90">Digital</em>
        </h1>
        <h2 className="text-sm md:text-base font-light text-slate-500 tracking-[0.2em] uppercase">
          .... ¿Quién te gobierna?
        </h2>
      </div>

      {/* Central Nexus (Interactive Node mimicking the reference) */}
      <div className="relative z-20 flex-grow flex items-center justify-center w-full my-8">
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          
          {/* Decorative concentric structural lines */}
          <div className="absolute inset-0 rounded-full border border-slate-300/30 scale-100"></div>
          <div className="absolute inset-0 rounded-full border border-slate-200/20 scale-[1.15]"></div>
          <div className="absolute inset-0 rounded-full border border-slate-100/10 scale-[1.3]"></div>

          {/* Core Interactive Button */}
          <button 
            onClick={() => handleStart('casual')}
            className="relative z-30 w-36 h-36 md:w-44 md:h-44 bg-white/80 backdrop-blur-md border border-white/60 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(13,148,136,0.15)] transition-all duration-500 text-slate-600 hover:text-teal-600 group cursor-pointer"
          >
            <Fingerprint className="w-8 h-8 mb-3 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
            <span className="text-[10px] md:text-xs tracking-widest uppercase font-semibold">Generar <br/> Experiencia</span>
          </button>
        </div>
      </div>

      {/* Bottom Content & Credits */}
      <div className="relative z-10 w-full max-w-2xl text-center flex flex-col items-center mt-auto">
        <p className="text-xs md:text-sm leading-relaxed text-slate-500 font-light mb-8 px-4 max-w-lg">
          Simula un día común. Un flujo de decisiones cotidianas diseñadas para tu confort y extracción algorítmica.
        </p>
        {renderCredits(false)}
      </div>
    </div>
  );

  const renderPhase1 = () => {
    const step = scenarioSteps[currentStep];
    
    if (isGlitching) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-mono">
          <div className="text-red-500 text-4xl animate-pulse tracking-tighter mix-blend-screen opacity-90 z-10 flex flex-col items-center">
            <AlertTriangle className="w-16 h-16 mb-4" />
            <span className="mb-2 text-center text-2xl md:text-4xl">EXTRACTION_PROTOCOL_COMPLETE</span>
            <span className="text-sm text-slate-500 font-light text-center">Compilando perfil de dividuo y metadata comportamental...</span>
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
          <div className="absolute top-1/4 left-0 w-full h-1 bg-red-500/50 -translate-y-1/2"></div>
          <div className="absolute top-2/3 left-0 w-full h-4 bg-blue-500/20 -translate-y-1/2 mix-blend-overlay"></div>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 transition-colors duration-500 font-sans relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b ${currentTheme.bgFrom} to-transparent pointer-events-none`}></div>

        <header className="px-8 py-6 flex justify-between items-center relative z-10">
          <div className="flex flex-col">
             <span className={`font-semibold ${currentTheme.iconText} opacity-80 tracking-widest text-xs uppercase`}>
               {currentScenarioData.title}
             </span>
          </div>
          <span className="text-slate-500 font-medium bg-white/60 px-4 py-1.5 rounded-full text-sm shadow-sm backdrop-blur-sm">
            {step.time}
          </span>
        </header>
        
        <main className="flex-grow flex flex-col items-center justify-center p-6 w-full relative z-10">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 transform transition-all hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]">
            
            <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.iconBg} ${currentTheme.iconText} rounded-xl flex items-center justify-center mb-8 shadow-inner border border-white`}>
              {step.icon}
            </div>
            
            <h3 className="text-2xl font-semibold mb-8 text-slate-800 leading-tight">
              {step.question}
            </h3>
            
            <div className="space-y-2">
              {step.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoicePhase1(opt)}
                  className={`group w-full text-left p-4 rounded-xl transition-all duration-300 flex flex-col justify-center border ${
                    opt.isDefault 
                      ? `bg-slate-50 hover:bg-white border-transparent ${currentTheme.borderFocus} shadow-sm`
                      : `bg-transparent border-transparent hover:bg-slate-50/50 text-slate-500 hover:text-slate-700`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`font-medium ${opt.isDefault ? 'text-slate-800' : ''}`}>{opt.text}</span>
                    {opt.isDefault && (
                      <span className={`text-[9px] uppercase tracking-wider ${currentTheme.iconText} bg-white px-2 py-1 rounded-full ml-3 shrink-0 shadow-sm border border-slate-100`}>
                        Sugerido
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex space-x-2">
            {scenarioSteps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? `w-6 ${currentTheme.progressHigh}` : i < currentStep ? 'w-2 bg-slate-400' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
        </main>
      </div>
    );
  };

  const renderTransition1 = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05080f] text-slate-200 p-8 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl text-center space-y-8 p-12 bg-slate-900/40 border border-slate-800 rounded-lg backdrop-blur-md shadow-2xl">
        <Lock className="w-12 h-12 mx-auto text-slate-400 mb-6" strokeWidth={1} />
        <h2 className="text-3xl font-light tracking-tight text-white uppercase">Capa de Interfaz Desactivada</h2>
        
        <div className={`p-6 bg-black/40 border-l-2 ${currentTheme.accent.replace('text-', 'border-')} text-left`}>
          <p className="text-base leading-relaxed text-slate-400 font-sans">
            ¿Sentiste que fluías libremente? Esa ausencia de fricción es el mayor logro del diseño persuasivo. <br/><br/>
            Has operado bajo la <strong className="text-slate-200">Gubernamentalidad Algorítmica</strong>: no fuiste obligado mediante la prohibición, sino que tu campo de acción fue estructurado sutilmente para que tus elecciones "libres" fueran estadísticamente predecibles y rentables.
          </p>
        </div>

        <button 
          onClick={startPhase2}
          className="mt-10 px-8 py-3 bg-transparent border border-rose-500/50 text-rose-400 rounded-md font-mono tracking-widest uppercase hover:bg-rose-950/40 hover:text-rose-300 transition-all flex items-center mx-auto text-sm"
        >
          Acceder al Registro Forense <Terminal className="ml-3 w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderPhase2 = () => {
    const step = scenarioSteps[currentStep];
    const userChoice = choices[currentStep]?.choice;
    const penaltyApplied = userChoice?.penalty || 0;

    return (
      <div className="flex flex-col min-h-screen bg-[#0a0f18] text-slate-300 font-mono relative selection:bg-rose-500/30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <header className="p-4 border-b border-slate-800/80 flex justify-between items-center bg-[#0a0f18] sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <Cpu className={`w-4 h-4 ${currentTheme.accent}`} />
            <span className={`text-[10px] md:text-xs tracking-widest uppercase ${currentTheme.accent}`}>MODO_FORENSE // {currentScenarioData.title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[9px] uppercase text-slate-500 hidden sm:inline tracking-widest">Autonomía Residual</span>
            <div className="w-16 md:w-24 h-1 bg-slate-800 rounded-none overflow-hidden relative">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${autonomy > 50 ? 'bg-slate-400' : autonomy > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${autonomy}%` }}
              />
            </div>
            <span className={`text-[10px] font-mono ${autonomy > 30 ? 'text-slate-400' : 'text-rose-500'}`}>[{autonomy}%]</span>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 max-w-6xl mx-auto w-full relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <div className={`flex flex-col space-y-3 transition-all duration-700 ${revealedCurrent ? 'opacity-30 grayscale' : 'opacity-100'}`}>
              <div className="flex items-center text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                 FRONT-END (Capa de Seducción)
              </div>
              <div className="p-6 border border-slate-800 bg-[#0d121c] rounded-md">
                <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
                  <div className="text-slate-500 opacity-50">{step.icon}</div>
                  <h3 className="text-base font-sans text-slate-400 font-light">{step.question}</h3>
                </div>
                <div className="p-3 bg-black/40 border border-slate-800/50 rounded-sm">
                  <span className="text-[9px] text-slate-600 block mb-1 uppercase tracking-widest">INPUT_USUARIO_REGISTRADO:</span>
                  <div className="font-sans text-sm text-slate-300 pl-2 border-l-2 border-slate-600 flex justify-between items-center">
                    <span>{userChoice?.text || "NULL"}</span>
                    {revealedCurrent && (
                      <span className="text-[10px] text-rose-500 bg-rose-950/30 px-1 ml-2">- {penaltyApplied}% Autonomía</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center text-[10px] text-rose-500/80 uppercase tracking-widest mb-1">
                 BACK-END (Infraestructura de Extracción)
              </div>
              
              {!revealedCurrent ? (
                <div className="flex-grow flex items-center justify-center p-8 border border-dashed border-slate-800 bg-black/20 min-h-[250px] rounded-md">
                  <button 
                    onClick={handleReveal}
                    className="group px-6 py-3 bg-transparent border border-rose-900 text-rose-500 text-xs tracking-widest uppercase hover:bg-rose-950/30 hover:border-rose-700 transition-all flex items-center rounded-sm"
                  >
                    <Terminal className="w-4 h-4 mr-2" /> 
                    Ejecutar Desocultamiento
                  </button>
                </div>
              ) : (
                <div className="flex-grow p-6 bg-[#090c14] border border-rose-900/50 animate-fade-in flex flex-col justify-between rounded-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="relative z-10">
                    <h4 className="text-rose-500 text-[9px] tracking-widest mb-5 flex items-center bg-rose-950/20 inline-block px-2 py-1 border border-rose-900/30 uppercase">
                       LOG_SISTEMA: CAJA_NEGRA_VULNERADA
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6 font-light border-l-2 border-rose-900/50 pl-3">
                      {step.revelation}
                    </p>
                    
                    <div className="bg-black/40 p-4 border border-slate-800/50 rounded-sm">
                      <div className="flex justify-between items-start mb-3 border-b border-slate-800/50 pb-2">
                        <span className={`text-[10px] uppercase tracking-widest ${currentTheme.accent}`}>{step.concept}</span>
                        <span className="text-[9px] text-slate-500 uppercase">REF: {step.author}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{step.theory}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end pt-4 relative z-10">
                    <button 
                      onClick={nextReveal}
                      className={`px-5 py-2 bg-transparent border ${currentTheme.btnForensic} text-[10px] tracking-widest uppercase transition-all flex items-center rounded-sm`}
                    >
                      Siguiente Nodo <ChevronRight className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12 text-center text-[9px] text-slate-600 tracking-widest">
            NODO_PROCESADO: [{currentStep + 1} / {scenarioSteps.length}]
          </div>
        </main>
      </div>
    );
  };

  const renderPhase3 = () => (
    <div className="flex flex-col min-h-screen bg-[#05080f] text-slate-300 p-4 md:p-8 font-mono relative overflow-hidden selection:bg-slate-700">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/20 via-[#05080f] to-[#05080f] pointer-events-none"></div>

      <header className="mb-8 md:mb-12 text-center max-w-4xl mx-auto relative z-10 pt-4 md:pt-8">
        <h2 className="text-2xl md:text-3xl font-light text-white mb-3 tracking-tight font-sans uppercase">Topología del Dispositivo</h2>
        <p className="text-slate-500 font-sans max-w-2xl mx-auto text-sm leading-relaxed font-light">
          Cartografía sistémica de la <strong className="text-slate-300">{currentScenarioData.title}</strong>. Observa cómo tus micro-decisiones fueron empaquetadas en un perfil de rentabilidad ("El Dividuo").
        </p>
      </header>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">
          
          {/* Columna Izquierda: Agencia y Capas (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            {/* Node 1: Sujeto */}
            <div className="flex flex-col space-y-4">
              <div className="border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
                 <span className="text-[9px] text-slate-500 tracking-widest uppercase">01. Polo Subjetivo (Usuario)</span>
              </div>
              <div className="p-6 bg-black/40 border border-slate-800 rounded-sm text-center relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <span className="text-slate-600 block text-sm mb-2 uppercase tracking-widest">Agencia Residual</span>
                  <div className="text-[10px] text-slate-500 font-sans italic max-w-xs">
                    "La ilusión de la elección libre es el lubricante necesario para la extracción de datos sin fricción."
                  </div>
                </div>
                <div className={`shrink-0 flex items-center justify-center w-32 h-32 rounded-full border-4 ${autonomy > 50 ? 'border-slate-500' : autonomy > 30 ? 'border-amber-500' : 'border-rose-500'}`}>
                  <span className={`block font-light text-4xl ${autonomy > 50 ? 'text-slate-300' : autonomy > 30 ? 'text-amber-500' : 'text-rose-500'}`}>{autonomy}%</span>
                </div>
              </div>
            </div>

            {/* Node 2: Interfaces */}
            <div className="flex flex-col space-y-2">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <span className="text-[9px] text-slate-500 tracking-widest uppercase">02. Puntos de Fricción (Cajas Negras)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {scenarioSteps.map((step, idx) => {
                  const userChoicePenalty = choices[idx]?.choice?.penalty || 0;
                  return (
                    <div key={idx} className="flex flex-col p-3 bg-[#090c14] border border-slate-800/60 rounded-sm">
                      <div className="flex items-center mb-2">
                        <div className={`mr-3 p-1.5 bg-black rounded-sm border border-slate-800 ${currentTheme.accent}`}>{step.icon}</div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-300 font-bold truncate uppercase tracking-wide">{step.concept}</div>
                          <div className="text-[8px] text-slate-500 uppercase">{step.id}</div>
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-600 flex justify-between border-t border-slate-800 pt-2 mt-1">
                        <span>Extracción:</span>
                        <span className={userChoicePenalty > 10 ? 'text-rose-500' : 'text-slate-400'}>-{userChoicePenalty}% Voluntad</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Columna Derecha: The Dividual Receipt (Spotify Wrapped from hell) - 5 Cols */}
          <div className="lg:col-span-5 flex flex-col h-full lg:pl-6 lg:border-l border-slate-800/50">
             <div className="border-b border-slate-800 pb-2 mb-4 flex justify-between items-end">
               <span className="text-[9px] text-slate-500 tracking-widest uppercase">03. Perfil de Rentabilidad (Dividuo)</span>
               <span className="text-[8px] text-rose-500 bg-rose-950/30 px-1 border border-rose-900/30 animate-pulse flex items-center"><Activity className="w-3 h-3 mr-1"/> LIVE_SYNC</span>
            </div>
            
            {/* The Receipt UI */}
            <div className="flex-grow flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-[#f4f4f5] text-slate-900 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-1 hover:rotate-0 transition-transform duration-300 relative border-t-8 border-slate-900">
                {/* Zigzag bottom edge using CSS masking or simple borders for effect */}
                <div className="absolute bottom-[-10px] left-0 w-full h-[10px] bg-[radial-gradient(circle,transparent,transparent_50%,#f4f4f5_50%,#f4f4f5)] bg-[length:20px_20px] bg-bottom"></div>

                <div className="text-center mb-6 border-b-2 border-dashed border-slate-300 pb-6">
                  <h3 className="font-bold text-xl uppercase tracking-widest">Panopticon Inc.</h3>
                  <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-widest">Dossier de Extracción Algorítmica</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-2">ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{new Date().toLocaleString()}</p>
                </div>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-1">
                    <span className="text-xs uppercase font-bold text-slate-600">Métrica</span>
                    <span className="text-xs uppercase font-bold text-slate-600">Valor</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-500">Sesiones Evaluadas</span>
                    <span className="text-xs font-mono font-bold">{scenarioSteps.length}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-500">Autonomía Entregada</span>
                    <span className="text-xs font-mono font-bold">{100 - autonomy}%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-500">Resistencia (Agencia)</span>
                    <span className="text-xs font-mono font-bold">{autonomy}%</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs uppercase font-bold text-slate-600 border-b border-slate-200 pb-1 block mb-3">Metadatos Capturados (Tags)</span>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {extractedTags.length > 0 ? (
                      extractedTags.map((tag, idx) => (
                        <div key={idx} className="flex items-start text-slate-700">
                          <span className="mr-2">*</span>
                          <span className="tracking-tight">{tag}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">Anomalía: Evasión de captura.</div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t-2 border-slate-900 border-dashed">
                  <Receipt className="w-8 h-8 mx-auto text-slate-900 mb-2" strokeWidth={1.5}/>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-800 mb-1">El producto eres tú</p>
                  <p className="text-[8px] text-slate-500 uppercase">Gracias por su contribución al sistema.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-16 text-center relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
        <button 
          onClick={() => {
            setPhase('phase4');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-8 py-3 bg-slate-100 text-slate-900 hover:bg-white rounded-sm font-sans font-bold text-xs tracking-widest uppercase transition-all shadow-lg`}
        >
          Decodificación Teórica <BookMarked className="ml-3 w-4 h-4 inline" />
        </button>
      </div>
    </div>
  );

  const renderPhase4 = () => (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-20 px-6 md:px-12 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-20 text-center flex flex-col items-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-indigo-300 mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-800 mb-6 uppercase">
            Estructuras Inconscientes
          </h2>
          <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Has atravesado el velo de la interfaz. Este es el vocabulario crítico necesario para nombrar el poder contemporáneo, más allá de la ilusión de la elección.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400/80 font-mono mb-4 block">01 / Michel Foucault</span>
            <h3 className="text-2xl font-medium text-slate-800 mb-5 tracking-tight">Gubernamentalidad</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-light">
              Gobernar no es usar la represión o la violencia, sino la <strong className="font-medium text-slate-800">"conducción de conductas"</strong>. Es estructurar el campo de acción de los individuos para que sus decisiones "libres" se alineen natural y productivamente con los fines de las instituciones de poder.
            </p>
          </div>

          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-[10px] uppercase tracking-widest text-purple-400/80 font-mono mb-4 block">02 / A. Rouvroy & T. Berns</span>
            <h3 className="text-2xl font-medium text-slate-800 mb-5 tracking-tight">Gobierno Algorítmico</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-light">
              El poder ya no opera sobre sujetos dotados de voluntad, sino sobre <strong className="font-medium text-slate-800">perfiles estadísticos (dividuos)</strong>. Al anticipar y personalizar el entorno, la máquina moldea tus deseos antes de que alcancen el umbral de tu conciencia, cortocircuitando la capacidad crítica.
            </p>
          </div>

          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <span className="text-[10px] uppercase tracking-widest text-rose-400/80 font-mono mb-4 block">03 / Gilles Deleuze</span>
            <h3 className="text-2xl font-medium text-slate-800 mb-5 tracking-tight">Sociedad de Control</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-light">
              Sustituye al antiguo encierro físico de las fábricas. Es una <strong className="font-medium text-slate-800">modulación continua</strong> en espacios biográficos abiertos. Los algoritmos de recomendación, los GPS y los trackers flotan a nuestro alrededor, funcionando como peajes invisibles en tiempo real.
            </p>
          </div>

          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <span className="text-[10px] uppercase tracking-widest text-amber-500/80 font-mono mb-4 block">04 / Byung-Chul Han</span>
            <h3 className="text-2xl font-medium text-slate-800 mb-5 tracking-tight">Psicopolítica</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-light">
              El poder inteligente (smart power) es infinitamente seductor. No te vigila en contra de tu voluntad; <strong className="font-medium text-slate-800">te convence de que te expongas voluntariamente</strong>. La explotación muta en autoexplotación, vivida trágicamente bajo la ilusión de la autorrealización.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 p-12 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h4 className="text-3xl text-slate-100 font-light mb-4 tracking-tight uppercase">Cápsula de Inferencia Crítica</h4>
              <div className="w-12 h-px bg-indigo-500/50 mx-auto mb-6"></div>
              <p className="text-slate-300/80 max-w-3xl mx-auto font-light text-base leading-relaxed">
                La teoría crítica no decreta respuestas cerradas; desestabiliza las certezas asumidas. Basado en tu experiencia de datificación, te invitamos a meditar sobre estas tres tensiones sistémicas:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16">
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative h-full p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl">
                    <span className="text-indigo-300 font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center">
                      <Activity className="w-3 h-3 mr-2"/> 01. Agencia
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      Si la interfaz anticipa tus deseos antes de que los articules (ej. el Autoplay), ¿en qué frontera difusa la "satisfacción" de una necesidad se convierte en la "producción" corporativa de esa misma necesidad?
                    </p>
                  </div>
               </div>
               
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-rose-500/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative h-full p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl">
                    <span className="text-rose-300 font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center">
                      <ShieldAlert className="w-3 h-3 mr-2"/> 02. Privilegio
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      Frecuentemente se propone el "detox digital" individual como solución. En nuestras ciudades datificadas, ¿es el ostracismo digital una verdadera resistencia política o un privilegio material elitista?
                    </p>
                  </div>
               </div>

               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative h-full p-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl">
                    <span className="text-emerald-300 font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center">
                      <Network className="w-3 h-3 mr-2"/> 03. Emancipación
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                      Más allá de la ilusión formal de elegir opciones dentro de un menú prefabricado, ¿cómo luce la libertad sustantiva? ¿Cómo podemos democratizar socialmente estas arquitecturas cerradas?
                    </p>
                  </div>
               </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => {
                  setPhase('phase5');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-sans text-sm font-medium tracking-wide transition-all inline-flex items-center shadow-lg"
              >
                Explorar Hub de Datos Periodísticos <RefreshCw className="ml-3 w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
        {renderCredits(false)}
      </div>
    </div>
  );

  const renderPhase5 = () => (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWUyOTNiIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+')] opacity-50 pointer-events-none"></div>

      <div className="max-w-5xl w-full relative z-10">
        <header className="mb-12 text-center">
          <Database className="w-12 h-12 mx-auto text-slate-500 mb-6" />
          <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Hub de Investigación Periodística</h2>
          <p className="text-slate-400 font-light text-lg max-w-2xl mx-auto">
            La gubernamentalidad algorítmica opera sobre esferas diferenciadas. Como investigador social, selecciona una topología para simular la extracción de datos y auditar el sistema.
          </p>
        </header>

        <div className="space-y-5">
          <div 
            onClick={() => handleStart('casual')}
            className={`group p-6 md:p-8 border ${scenarioType === 'casual' ? 'border-indigo-400 bg-indigo-900/30' : 'border-slate-700/80 bg-slate-800/40'} rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-indigo-900/30 hover:border-indigo-500/60 transition-all cursor-pointer relative overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.05)] hover:shadow-[0_0_25px_rgba(79,70,229,0.15)]`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="mb-4 md:mb-0 pr-6">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-medium text-indigo-100">Día Casual</h3>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono rounded tracking-widest">
                  {scenarioType === 'casual' ? 'ÚLTIMO AUDITADO' : 'DATASET DISPONIBLE'}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Consumo dirigido, transporte urbano optimizado y gestión algorítmica del ocio y el deseo.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 border border-slate-700 group-hover:border-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-lg flex items-center">
              Auditar Capa <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div 
            onClick={() => handleStart('laboral')}
            className={`group p-6 md:p-8 border ${scenarioType === 'laboral' ? 'border-amber-400 bg-amber-900/30' : 'border-slate-700/80 bg-slate-800/40'} rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-amber-900/30 hover:border-amber-500/60 transition-all cursor-pointer relative overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="mb-4 md:mb-0 pr-6">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-medium text-amber-100">Día Laboral</h3>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono rounded tracking-widest">
                  {scenarioType === 'laboral' ? 'ÚLTIMO AUDITADO' : 'DATASET DISPONIBLE'}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Métricas de rendimiento en tiempo real, autoexplotación cuantificada y software de vigilancia (Bossware) como nuevo panoptismo.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 border border-slate-700 group-hover:border-amber-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-lg flex items-center">
               Auditar Capa <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div 
            onClick={() => handleStart('electoral')}
            className={`group p-6 md:p-8 border ${scenarioType === 'electoral' ? 'border-rose-400 bg-rose-900/30' : 'border-slate-700/80 bg-slate-800/40'} rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-rose-900/30 hover:border-rose-500/60 transition-all cursor-pointer relative overflow-hidden shadow-[0_0_15px_rgba(225,29,72,0.05)] hover:shadow-[0_0_25px_rgba(225,29,72,0.15)]`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="mb-4 md:mb-0 pr-6">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-medium text-rose-100">Día Electoral</h3>
                <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono rounded tracking-widest">
                  {scenarioType === 'electoral' ? 'ÚLTIMO AUDITADO' : 'DATASET DISPONIBLE'}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Micro-targeting político predictivo, burbujas epistémicas, polarización algorítmica y modulación afectiva en la arquitectura del voto.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 border border-slate-700 group-hover:border-rose-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-lg flex items-center">
               Auditar Capa <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-slate-800 pt-10 flex flex-col items-center">
           <button 
            onClick={() => {
              setPhase('intro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3 border border-slate-600 text-slate-400 rounded-full font-medium hover:bg-slate-800 hover:text-white transition-all text-sm mb-6"
          >
            Volver a la Pantalla de Inicio
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center text-xs text-slate-500 border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/50 hover:text-slate-300 transition-colors cursor-pointer px-4 py-2 rounded-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Dossier Algorítmico (Solo Lectura)
          </button>
        </div>
        {renderCredits(true)}
      </div>
    </div>
  );

  const phaseMap = {
    'intro': renderIntro,
    'phase1': renderPhase1,
    'transition1': renderTransition1,
    'phase2': renderPhase2,
    'phase3': renderPhase3,
    'phase4': renderPhase4,
    'phase5': renderPhase5,
  };

  return (
    <div className="min-h-screen bg-slate-900 selection:bg-indigo-500/30 selection:text-indigo-200">
      {phaseMap[phase]()}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8); 
        }
      `}} />
    </div>
  );
}