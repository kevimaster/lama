import React, { useState, useRef } from 'react';
import {
  Cpu, DollarSign, Users,
  BookOpen, RefreshCw, Scale,
  Lock, Globe, Award, ChevronRight, Zap, GraduationCap, AlertTriangle
} from 'lucide-react';

// --- TIPOS DE DATOS ---
interface GameState {
  phase: 'intro' | 'playing' | 'gameover';
  editorial: number;
  tecnologica: number;
  economica: number;
  audiencia: number;
  turn: number;
  gameOver: boolean;
  statusMessage: string;
  failReason?: 'editorial' | 'economica' | 'tecnologica' | null;
}

interface Option {
  text: string;
  impact: {
    editorial: number;
    tecnologica: number;
    economica: number;
    audiencia: number;
  };
  feedback: string;
  theoryRef: string;
}

interface Scenario {
  id: number;
  title: string;
  category: string;
  description: string;
  options: Option[];
}

// --- CONTENIDO ---
const scenarios: Scenario[] = [
  // FASE 1: FUNDAMENTOS
  {
    id: 1,
    title: "El dilema del algoritmo",
    category: "Dependencia tecnológica",
    description: "Meta ha cambiado su algoritmo priorizando videos cortos tipo TikTok. Tu tráfico de artículos de fondo ha caído un 40%. La redacción entra en pánico.",
    options: [
      {
        text: "Pivotar a video vertical masivo (Reels/TikTok)",
        impact: { editorial: -15, tecnologica: -10, economica: +10, audiencia: +25 },
        feedback: "El tráfico vuelve, pero es tráfico 'fantasma'. Ahora produces para el algoritmo, no para tu agenda. Tu infraestructura depende de una app extranjera.",
        theoryRef: "3.2: Dimensión tecnológica: Adaptación reactiva vs. soberanía."
      },
      {
        text: "Fortalecer newsletter y comunidad de WhatsApp",
        impact: { editorial: +10, tecnologica: +15, economica: -5, audiencia: -10 },
        feedback: "Audiencia menor pero propia. Construyes un 'jardín vallado' donde tú pones las reglas y nadie te cierra el grifo.",
        theoryRef: "3.3: Construir acceso directo (Modelo La Silla Vacía / Mutante)."
      }
    ]
  },
  {
    id: 2,
    title: "Financiación corporativa",
    category: "Sostenibilidad",
    description: "Una minera multinacional ofrece patrocinar tu sección de 'Regiones'. Prometen no leer los textos antes, pero su logo estará en el header.",
    options: [
      {
        text: "Aceptar el patrocinio",
        impact: { editorial: -20, tecnologica: 0, economica: +25, audiencia: -5 },
        feedback: "Liquidez inmediata para pagar sueldos. Sin embargo, cuando ocurra un derrame ambiental, tu audiencia dudará de cada coma que publiques.",
        theoryRef: "3.2: Dimensión económica: El origen de los recursos condiciona la percepción."
      },
      {
        text: "Buscar micro-mecenazgo (Súper Amigos)",
        impact: { editorial: +15, tecnologica: 0, economica: +5, audiencia: +5 },
        feedback: "Capital social alto, capital financiero bajo. Requiere una campaña desgastante, pero blinda tu independencia ante los poderosos.",
        theoryRef: "3.3: Diversificar para no depender de una sola fuente."
      }
    ]
  },
  {
    id: 3,
    title: "La trampa del clickbait SEO",
    category: "Audiencia",
    description: "Tu consultor SEO sugiere publicar notas sobre 'A qué hora juega la Selección' para atraer tráfico masivo y vender publicidad programática.",
    options: [
      {
        text: "Publicar contenido 'blando' para financiar el 'duro'",
        impact: { editorial: -15, tecnologica: 0, economica: +15, audiencia: +20 },
        feedback: "Estrategia Robin Hood: usas tráfico basura para pagar periodismo serio. El riesgo es que tu marca se diluya y nadie sepa qué eres realmente.",
        theoryRef: "3.1: Negociación de dependencias (tráfico vs. prestigio)."
      },
      {
        text: "Mantenerse en el nicho de análisis",
        impact: { editorial: +10, tecnologica: 0, economica: -10, audiencia: -10 },
        feedback: "Te mantienes puro, pero irrelevante para la masa. Google te castiga por bajo volumen y la caja se resiente.",
        theoryRef: "3.3: Adaptarse sin perder identidad editorial."
      }
    ]
  },
  {
    id: 4,
    title: "Innovación: ¿CMS propio o alquilado?",
    category: "Tecnología",
    description: "Tu web se cae constantemente. WordPress se queda corto y el equipo técnico está desbordado.",
    options: [
      {
        text: "Usar plataforma 'SaaS' externa de un gigante tech",
        impact: { editorial: 0, tecnologica: -20, economica: +10, audiencia: +5 },
        feedback: "Barato y rápido. Pero tus datos ahora viven en servidores ajenos. Si cambian los precios o censuran palabras clave, estás atado de manos.",
        theoryRef: "3.2: Control sobre infraestructuras."
      },
      {
        text: "Desarrollo propio Open Source",
        impact: { editorial: 0, tecnologica: +25, economica: -20, audiencia: 0 },
        feedback: "Una inversión dolorosa y lenta. Pero a largo plazo, eres dueño de tu destino, tu código y los datos de tus usuarios.",
        theoryRef: "3.3: Desarrollo de capacidades propias."
      }
    ]
  },
  {
    id: 5,
    title: "La alianza de medios",
    category: "Ecosistema",
    description: "Te invitan a una alianza de medios independientes para negociar pauta en bloque con agencias.",
    options: [
      {
        text: "Unirse a la alianza",
        impact: { editorial: -5, tecnologica: +10, economica: +10, audiencia: +10 },
        feedback: "La unión hace la fuerza. Pierdes un poco de agilidad individual y debes consensuar, pero ganas peso sistémico ante el mercado.",
        theoryRef: "3.1: Autonomía interdependiente: reconocer relaciones con otros actores."
      },
      {
        text: "Seguir en solitario",
        impact: { editorial: +5, tecnologica: -5, economica: -10, audiencia: -5 },
        feedback: "Autonomía radical que lleva al aislamiento. En un ecosistema interconectado, ser una isla te hace vulnerable.",
        theoryRef: "3.4: La autonomía no es aislamiento."
      }
    ]
  },
  // FASE 2: CONTEXTO
  {
    id: 6,
    title: "Demanda judicial (SLAPP)",
    category: "Legal / Editorial",
    description: "Un congresista poderoso te demanda por injuria tras una investigación. Exige retractación inmediata o un juicio millonario que podría quebrarte.",
    options: [
      {
        text: "Retractarse y conciliar",
        impact: { editorial: -25, tecnologica: 0, economica: +10, audiencia: -15 },
        feedback: "Salvaste el dinero, pero vendiste tu credibilidad. El efecto inhibitorio (chilling effect) ha funcionado: ya saben que te pueden asustar.",
        theoryRef: "3.2: Presiones que condicionan la agenda (Dimensión editorial)."
      },
      {
        text: "Ir a juicio y lanzar campaña de defensa",
        impact: { editorial: +20, tecnologica: -5, economica: -20, audiencia: +15 },
        feedback: "Guerra costosa. Tu audiencia te respalda y te vuelves un símbolo, pero tus recursos se drenan en abogados en vez de periodismo.",
        theoryRef: "3.4: La autonomía es una lucha constante."
      }
    ]
  },
  {
    id: 7,
    title: "Cobertura de estallido social",
    category: "Seguridad / Misión",
    description: "Protestas masivas en el país. Tu equipo quiere transmitir en vivo desde primera línea, pero no tienen chalecos ni seguros.",
    options: [
      {
        text: "Cubrir desde la calle sin protección adecuada",
        impact: { editorial: +10, tecnologica: -10, economica: -5, audiencia: +30 },
        feedback: "Viralidad explosiva y respeto de la calle. Pero un periodista resulta herido y pierdes equipos costosos. La responsabilidad es tuya.",
        theoryRef: "3.2: Condiciones materiales de producción."
      },
      {
        text: "Curaduría digital y verificación remota",
        impact: { editorial: +5, tecnologica: +5, economica: 0, audiencia: -10 },
        feedback: "Menos espectacular, más seguro. Aportas contexto (slow journalism) en lugar de inmediatez caótica.",
        theoryRef: "3.3: Adaptarse sin perder identidad."
      }
    ]
  },
  {
    id: 8,
    title: "Cooperación internacional",
    category: "Financiación",
    description: "Una embajada europea ofrece fondos para cubrir DDHH y Paz. Sectores políticos te acusan de tener 'agenda extranjera'.",
    options: [
      {
        text: "Aceptar los fondos",
        impact: { editorial: -5, tecnologica: +10, economica: +20, audiencia: 0 },
        feedback: "Oxígeno financiero vital. Debes lidiar con el estigma y pasar horas llenando informes burocráticos para el donante.",
        theoryRef: "3.2: Dependencia económica de actores internacionales."
      },
      {
        text: "Rechazar por pureza ideológica",
        impact: { editorial: +10, tecnologica: -10, economica: -15, audiencia: 0 },
        feedback: "Soberanía total, bolsillo vacío. ¿De qué sirve la independencia si no puedes pagar la luz el próximo mes?",
        theoryRef: "3.1: Ningún medio es completamente autónomo."
      }
    ]
  },
  {
    id: 9,
    title: "Suscripción vs. muro de pago",
    category: "Modelo de negocio",
    description: "Necesitas ingresos recurrentes urgentes. El equipo de marketing propone cerrar el contenido.",
    options: [
      {
        text: "Muro de pago rígido (Paywall)",
        impact: { editorial: 0, tecnologica: -5, economica: +20, audiencia: -25 },
        feedback: "Modelo tradicional. Ganas dinero, pero pierdes influencia pública. Tu periodismo solo lo leen quienes pueden pagar.",
        theoryRef: "3.2: Dimensión de audiencia: ¿Acceso directo o restringido?"
      },
      {
        text: "Membresía solidaria (Contenido abierto)",
        impact: { editorial: +5, tecnologica: 0, economica: +5, audiencia: +10 },
        feedback: "Apuestas a que paguen por convicción, no por obligación. Crecimiento lento pero comunidad leal y contenido democrático.",
        theoryRef: "3.3: Construcción de comunidad leal."
      }
    ]
  },
  {
    id: 10,
    title: "Fact-checking electoral",
    category: "Editorial",
    description: "Un candidato presidencial miente descaradamente. Desmentirlo enfurecerá a la mitad de tus lectores, que son fanáticos suyos.",
    options: [
      {
        text: "Publicar el chequeo 'Falso' sin matices",
        impact: { editorial: +20, tecnologica: 0, economica: -5, audiencia: -15 },
        feedback: "Pierdes seguidores y sufres acoso en redes. Ganas prestigio entre pares y la academia, pero duele en el tráfico.",
        theoryRef: "3.2: Autonomía editorial frente a la presión de la propia audiencia."
      },
      {
        text: "Hacer una nota de 'contexto' tibia",
        impact: { editorial: -15, tecnologica: 0, economica: +5, audiencia: +5 },
        feedback: "Evitas el conflicto directo. Tu credibilidad como verificador se erosiona lentamente. Has sido capturado por el miedo.",
        theoryRef: "3.4: Negociación continua de la postura editorial."
      }
    ]
  },
  {
    id: 11,
    title: "Influencer marketing",
    category: "Nuevas narrativas",
    description: "Una agencia propone que un TikToker famoso 'traduzca' tus investigaciones para jóvenes. Pide libertad creativa total.",
    options: [
      {
        text: "Darle libertad total",
        impact: { editorial: -10, tecnologica: 0, economica: -5, audiencia: +25 },
        feedback: "Éxito viral masivo, pero el influencer simplificó tanto que la noticia contiene errores graves. ¿Quién controla el mensaje?",
        theoryRef: "3.2: Mediación de la audiencia a través de terceros."
      },
      {
        text: "Exigir revisión editorial previa",
        impact: { editorial: +10, tecnologica: 0, economica: -5, audiencia: +5 },
        feedback: "El influencer se molesta por el control y el contenido sale menos 'fresco'. Alcance moderado, pero rigor mantenido.",
        theoryRef: "3.3: Adaptación controlada."
      }
    ]
  },
  {
    id: 12,
    title: "Salud mental del equipo",
    category: "Gestión humana",
    description: "Tu redacción está 'quemada' (burnout) tras las elecciones. El ritmo actual es insostenible y hay bajas médicas.",
    options: [
      {
        text: "Bajar el ritmo de publicación un 50%",
        impact: { editorial: +10, tecnologica: 0, economica: -10, audiencia: -15 },
        feedback: "Menos clics, menos ingresos publicitarios. Pero retienes talento y evitas errores fatales por fatiga.",
        theoryRef: "3.3: Construir capacidades propias (humanas) sostenibles."
      },
      {
        text: "Exigir 'ponerse la camiseta' y seguir",
        impact: { editorial: -15, tecnologica: 0, economica: +10, audiencia: +5 },
        feedback: "Mantienes la métrica a corto plazo. Dos periodistas clave renuncian furiosos y se van a la competencia.",
        theoryRef: "3.1: La sostenibilidad humana es parte de la autonomía."
      }
    ]
  },
  // FASE 3: FUTURO
  {
    id: 13,
    title: "Inteligencia artificial en redacción",
    category: "Tecnología / Ética",
    description: "Podrías usar IA para generar refritos de noticias internacionales y liberar a tus periodistas para investigar lo local.",
    options: [
      {
        text: "Automatizar masivamente con IA",
        impact: { editorial: -10, tecnologica: +10, economica: +15, audiencia: -5 },
        feedback: "Eficiencia brutal. La web se llena de contenido genérico. Pierdes tu 'voz' propia y te vuelves un commodity.",
        theoryRef: "3.2: Autonomía tecnológica vs dependencia de modelos de IA opacos."
      },
      {
        text: "IA solo como asistente de investigación",
        impact: { editorial: +5, tecnologica: +5, economica: -5, audiencia: 0 },
        feedback: "Integración ética. Costoso en tiempo de formación, pero mantienes el criterio humano al centro de la operación.",
        theoryRef: "3.1: Negociar la dependencia tecnológica."
      }
    ]
  },
  {
    id: 14,
    title: "Expansión regional",
    category: "Misión",
    description: "Quieres abrir una corresponsalía en el Chocó o la Amazonía (desiertos de información). No hay mercado publicitario allí.",
    options: [
      {
        text: "Abrirla subsidiada con ingresos del centro",
        impact: { editorial: +20, tecnologica: -5, economica: -15, audiencia: +5 },
        feedback: "Cumples tu misión social. Financieramente es un lastre, pero te da una legitimidad nacional invaluable.",
        theoryRef: "3.3: Identidad editorial como valor diferencial."
      },
      {
        text: "Seguir cubriendo desde Bogotá",
        impact: { editorial: -10, tecnologica: 0, economica: +5, audiencia: -5 },
        feedback: "Centralismo cómodo y barato. Te pierdes las historias reales del territorio y tu visión se vuelve miope.",
        theoryRef: "3.2: Agenda condicionada por la ubicación."
      }
    ]
  },
  {
    id: 15,
    title: "Ciberseguridad: secuestro de datos",
    category: "Tecnología",
    description: "Un ransomware ha encriptado tu archivo histórico de 10 años. Piden 1 Bitcoin para liberarlo.",
    options: [
      {
        text: "Pagar el rescate",
        impact: { editorial: -5, tecnologica: -10, economica: -25, audiencia: 0 },
        feedback: "Recuperas los datos, pero financias criminales y sigues siendo vulnerable. Un golpe brutal a la caja.",
        theoryRef: "3.2: Fragilidad de la infraestructura propia."
      },
      {
        text: "No negociar y reconstruir desde backups viejos",
        impact: { editorial: +5, tecnologica: +15, economica: -10, audiencia: -5 },
        feedback: "Pierdes contenido reciente para siempre. Aprovechas para migrar a servidores más seguros y cifrados.",
        theoryRef: "3.3: Resiliencia técnica y aprendizaje."
      }
    ]
  },
  {
    id: 16,
    title: "Consultoría y talleres",
    category: "Diversificación",
    description: "Para no depender de pauta, creas una unidad de negocio para vender talleres de comunicación a grandes empresas.",
    options: [
      {
        text: "Vender servicios a cualquiera que pague",
        impact: { editorial: -15, tecnologica: 0, economica: +25, audiencia: 0 },
        feedback: "Conflicto de interés evidente: ¿Cómo investigas mañana a una empresa que es tu cliente hoy?",
        theoryRef: "3.2: Presiones económicas directas."
      },
      {
        text: "Solo formación académica y a ONGs",
        impact: { editorial: +5, tecnologica: 0, economica: +10, audiencia: +5 },
        feedback: "Ingresos moderados pero 'limpios'. Refuerza tu marca de expertos sin comprometer tu independencia.",
        theoryRef: "3.3: Diversificación coherente."
      }
    ]
  },
  {
    id: 17,
    title: "Alianza con medio tradicional",
    category: "Ecosistema",
    description: "Un gran periódico impreso (el 'establishment') quiere republicar tus investigaciones dominicales. Gran vitrina, cero pago.",
    options: [
      {
        text: "Aceptar por visibilidad",
        impact: { editorial: -5, tecnologica: 0, economica: 0, audiencia: +20 },
        feedback: "Llegas a las élites que toman decisiones. Pero tu marca queda subordinada a la del gigante (te ven como un proveedor).",
        theoryRef: "3.1: Interdependencia asimétrica."
      },
      {
        text: "Negarse: 'Léanlo en mi web'",
        impact: { editorial: +5, tecnologica: 0, economica: 0, audiencia: -10 },
        feedback: "Proteges tu tráfico y el valor de tu marca. Pierdes una oportunidad de marcar agenda nacional masiva.",
        theoryRef: "3.3: Defensa del canal propio."
      }
    ]
  },
  {
    id: 18,
    title: "El podcast narrativo",
    category: "Innovación",
    description: "Quieres lanzar un podcast de crónicas sonoras de alta factura. Es muy caro de producir.",
    options: [
      {
        text: "Invertir en calidad de estudio",
        impact: { editorial: +15, tecnologica: +5, economica: -15, audiencia: +10 },
        feedback: "Producto premium. Fideliza audiencia de nicho y abre puertas a adaptaciones (cine/TV).",
        theoryRef: "3.3: Desarrollo de productos propios distintivos."
      },
      {
        text: "Hacer un 'talk show' barato por Zoom",
        impact: { editorial: -5, tecnologica: -5, economica: +5, audiencia: +5 },
        feedback: "Uno más del montón. Rellena parrilla y es barato, pero no construye valor de marca real.",
        theoryRef: "3.2: Calidad editorial vs recursos."
      }
    ]
  },
  {
    id: 19,
    title: "Venta de datos de usuarios",
    category: "Ética / Negocio",
    description: "Un bróker de datos ofrece comprar la base de correos de tus suscriptores 'anonimizada'. Es mucho dinero.",
    options: [
      {
        text: "Vender la base de datos",
        impact: { editorial: -20, tecnologica: 0, economica: +30, audiencia: -30 },
        feedback: "Traición a la confianza. Si se enteran (y lo harán), tu comunidad muere instantáneamente.",
        theoryRef: "3.2: La audiencia como mercancía vs comunidad."
      },
      {
        text: "Proteger la privacidad a toda costa",
        impact: { editorial: +10, tecnologica: +5, economica: -5, audiencia: +15 },
        feedback: "Activo intangible: Confianza. A largo plazo vale más que el dinero rápido de la venta.",
        theoryRef: "3.3: Relación directa y de confianza con la audiencia."
      }
    ]
  },
  {
    id: 20,
    title: "Cambio de gobierno",
    category: "Política",
    description: "Un nuevo gobierno hostil corta toda la pauta oficial y ataca al medio en redes diariamente.",
    options: [
      {
        text: "Moderar la línea editorial para no provocar",
        impact: { editorial: -30, tecnologica: 0, economica: +10, audiencia: -20 },
        feedback: "Autocensura. Sobrevives económicamente, pero ya no eres necesario para la democracia.",
        theoryRef: "3.4: La autonomía es un proceso de resistencia."
      },
      {
        text: "Resistir y reforzar suscripciones ciudadanas",
        impact: { editorial: +25, tecnologica: 0, economica: -15, audiencia: +25 },
        feedback: "El 'Efecto de resistencia': la prensa atacada crece en suscriptores si se mantiene firme en sus valores.",
        theoryRef: "3.1: Negociar activamente las dependencias políticas."
      }
    ]
  }
];

// --- COMPONENTES VISUALES ---

const VitalSign = ({ label, value, icon: Icon, colorClass }: { label: string, value: number, icon: React.ElementType, colorClass: string }) => {
  let statusColor = "bg-blue-500";
  if (value < 20) statusColor = "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse";
  else if (value < 50) statusColor = "bg-yellow-500";
  else statusColor = colorClass;

  return (
    <div className="flex flex-col items-center group relative w-full">
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <div className="flex items-center gap-1.5">
          <Icon size={14} className="text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-200">{label}</span>
        </div>
        <span className={`text-xs font-mono font-bold ${value < 20 ? 'text-red-400' : 'text-slate-300'}`}>{value}%</span>
      </div>
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${statusColor}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
};

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black z-0 pointer-events-none opacity-50"></div>

    <div className="z-10 max-w-2xl flex flex-col items-center justify-center flex-grow">
      <div className="mb-6 inline-flex items-center justify-center p-4 bg-slate-800/50 rounded-full border border-slate-700 shadow-xl backdrop-blur-sm">
        <Globe className="text-blue-400 w-12 h-12" />
      </div>

      <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
        Mi apuesta editorial
      </h1>

      <div className="space-y-6 text-lg text-slate-300 font-light leading-relaxed mb-10">
        <p>
          Bienvenido/a colega. Asumes la dirección de un medio nativo digital en un <strong className="text-blue-400 font-medium">ecosistema incierto</strong>.
        </p>
        <p>
          Tu misión es navegar las tensiones entre la supervivencia económica y la integridad editorial.
          Recuerda: no existen decisiones perfectas, solo <strong className="text-white font-medium">negociaciones estratégicas</strong>. Tus cuatro capitales vitales (Editorial, Tecnológico, Económico y Audiencia) dependen de tu capacidad para gestionar la interdependencia.
        </p>
        <p className="italic text-slate-400 text-sm border-l-2 border-slate-700 pl-4 text-left mx-auto max-w-lg">
          La autonomía no es un estado fijo, es una negociación continua.
        </p>
      </div>

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-sans rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900"
      >
        <span>Asumir el cargo</span>
        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    <div className="z-10 w-full text-center pb-4 pt-8 opacity-60 hover:opacity-100 transition-opacity">
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
        Laboratorio de mediaciones algorítmicas Lama
      </p>
      <p className="text-[10px] text-slate-600 font-mono">
        Universidad del Valle • Cali, Colombia • 2026
      </p>
    </div>
  </div>
);

interface FailProfile {
  title: string;
  desc: string;
  advice: string;
  icon: React.ElementType;
  color: string;
}

interface SuccessProfile {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}

type Profile = FailProfile | SuccessProfile;

const ReflectionScreen = ({ gameState, restartGame }: { gameState: GameState, restartGame: () => void }) => {
  const getFailDiagnosis = (): FailProfile | null => {
    if (gameState.failReason === 'editorial') return {
      title: "Crisis de Credibilidad",
      desc: "El medio no cerró por falta de dinero, sino por falta de confianza. La audiencia dejó de creer en ustedes.",
      advice: "En el futuro, protege tu línea editorial como tu activo más valioso. Sin credibilidad, no hay producto.",
      icon: AlertTriangle,
      color: "text-red-400"
    };
    if (gameState.failReason === 'economica') return {
      title: "Insolvencia Financiera",
      desc: "Las ideas eran buenas, pero la caja se agotó. Es la causa de muerte #1 de los medios independientes.",
      advice: "La autonomía requiere recursos. Diversificar ingresos no es 'venderse', es asegurar la supervivencia.",
      icon: DollarSign,
      color: "text-red-400"
    };
    if (gameState.failReason === 'tecnologica') return {
      title: "Apagón Tecnológico",
      desc: "Depender excesivamente de plataformas externas te dejó vulnerable a cambios que no controlabas.",
      advice: "Construir tecnología propia es caro y lento, pero es la única forma de verdadera soberanía.",
      icon: Lock,
      color: "text-red-400"
    };
    return null;
  };

  const getProfile = (): Profile => {
    if (gameState.failReason) return getFailDiagnosis()!;

    if (gameState.editorial > 80 && gameState.economica < 40) return {
      title: "El Quijote Digital",
      desc: "Tu integridad es legendaria. Eres un referente moral, aunque la viabilidad financiera es un reto constante.",
      icon: Award,
      color: "text-purple-400"
    };
    if (gameState.economica > 80 && gameState.editorial < 50) return {
      title: "El Magnate de Contenidos",
      desc: "Has construido una máquina eficiente de tráfico e ingresos. El reto ahora es recuperar la profundidad periodística.",
      icon: DollarSign,
      color: "text-green-400"
    };
    if (gameState.tecnologica < 30) return {
      title: "El Gigante con Pies de Barro",
      desc: "Tienes audiencia masiva, pero construida sobre plataformas ajenas. Eres popular, pero vulnerable.",
      icon: Lock,
      color: "text-orange-400"
    };
    return {
      title: "El Equilibrista Resiliente",
      desc: "Has entendido que la autonomía es negociar. Cedes tácticamente para resistir estratégicamente.",
      icon: Scale,
      color: "text-blue-400"
    };
  };

  const profile = getProfile();

  return (
    <div className="animate-fade-in p-8 max-w-3xl mx-auto text-slate-200">
      <div className="text-center mb-10">
        <div className={`inline-flex p-5 rounded-full mb-6 bg-slate-800 border border-slate-700 shadow-2xl ${profile.color}`}>
          <profile.icon size={64} />
        </div>

        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
          {gameState.failReason ? "Informe de cese de operaciones" : "Consejo Editorial Final"}
        </h2>

        <h3 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${profile.color}`}>{profile.title}</h3>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 max-w-xl mx-auto">
          <p className="text-lg text-slate-300 italic font-light mb-4">"{profile.desc}"</p>
          {'advice' in profile && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 font-bold uppercase mb-1 flex items-center justify-center gap-2">
                <GraduationCap size={16}/> Lección Aprendida
              </p>
              <p className="text-sm text-slate-400">{(profile as FailProfile).advice}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 opacity-80">
        {[
          { l: 'Editorial', v: gameState.editorial, c: 'text-purple-400' },
          { l: 'Económica', v: gameState.economica, c: 'text-green-400' },
          { l: 'Tecnológica', v: gameState.tecnologica, c: 'text-blue-400' },
          { l: 'Audiencia', v: gameState.audiencia, c: 'text-orange-400' }
        ].map((stat) => (
          <div key={stat.l} className="bg-slate-800/30 border border-slate-700 p-3 rounded-lg text-center backdrop-blur-sm">
            <span className={`block text-2xl font-mono font-bold ${stat.c}`}>{stat.v}%</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">{stat.l}</span>
          </div>
        ))}
      </div>

      <button
        onClick={restartGame}
        className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-blue-500 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
      >
        <RefreshCw size={20} />
        {gameState.failReason ? "Intentar nueva estrategia" : "Iniciar nueva gestión"}
      </button>
    </div>
  );
};

// --- APP PRINCIPAL ---

const App = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'intro',
    editorial: 50,
    tecnologica: 50,
    economica: 50,
    audiencia: 50,
    turn: 0,
    gameOver: false,
    statusMessage: "Esperando inicialización...",
    failReason: null
  });

  const [lastFeedback, setLastFeedback] = useState<{text: string, theory: string} | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const currentScenario = scenarios[gameState.turn];

  const handleStart = () => {
    setGameState(prev => ({ ...prev, phase: 'playing', statusMessage: "Sistema online." }));
  };

  const handleOption = (option: Option) => {
    const newEditorial = Math.max(0, Math.min(100, gameState.editorial + option.impact.editorial));
    const newTecnologica = Math.max(0, Math.min(100, gameState.tecnologica + option.impact.tecnologica));
    const newEconomica = Math.max(0, Math.min(100, gameState.economica + option.impact.economica));
    const newAudiencia = Math.max(0, Math.min(100, gameState.audiencia + option.impact.audiencia));

    let isGameOver = false;
    let failReason: GameState['failReason'] = null;

    if (newEditorial <= 0) {
      isGameOver = true;
      failReason = 'editorial';
    } else if (newEconomica <= 0) {
      isGameOver = true;
      failReason = 'economica';
    } else if (newTecnologica <= 0) {
      isGameOver = true;
      failReason = 'tecnologica';
    }

    setLastFeedback({
      text: option.feedback,
      theory: option.theoryRef
    });

    if (isGameOver) {
      setGameState({
        ...gameState,
        phase: 'gameover',
        editorial: newEditorial,
        tecnologica: newTecnologica,
        economica: newEconomica,
        audiencia: newAudiencia,
        gameOver: true,
        failReason: failReason,
        statusMessage: "Operación detenida."
      });
    } else if (gameState.turn + 1 >= scenarios.length) {
      setGameState({
        ...gameState,
        phase: 'gameover',
        editorial: newEditorial,
        tecnologica: newTecnologica,
        economica: newEconomica,
        audiencia: newAudiencia,
        gameOver: true,
        statusMessage: "Ciclo completado."
      });
    } else {
      setGameState({
        ...gameState,
        editorial: newEditorial,
        tecnologica: newTecnologica,
        economica: newEconomica,
        audiencia: newAudiencia,
        turn: gameState.turn + 1,
        statusMessage: "Procesando..."
      });
    }

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const restartGame = () => {
    setGameState({
      phase: 'intro',
      editorial: 50,
      tecnologica: 50,
      economica: 50,
      audiencia: 50,
      turn: 0,
      gameOver: false,
      statusMessage: "Reiniciando...",
      failReason: null
    });
    setLastFeedback(null);
  };

  if (gameState.phase === 'intro') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
        <IntroScreen onStart={handleStart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans transition-colors duration-500 pb-12 flex flex-col" ref={topRef}>

      {/* DASHBOARD HEADER */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${gameState.gameOver ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                <h1 className="text-sm md:text-base font-bold tracking-widest uppercase text-slate-400">Mi apuesta editorial</h1>
             </div>
             <div className="text-xs font-mono text-slate-500">
               {gameState.gameOver ? "FIN" : `SEM ${gameState.turn + 1}/${scenarios.length}`}
             </div>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-8">
            <VitalSign label="Edit" value={gameState.editorial} icon={BookOpen} colorClass="bg-purple-500" />
            <VitalSign label="Tec" value={gameState.tecnologica} icon={Cpu} colorClass="bg-blue-500" />
            <VitalSign label="Eco" value={gameState.economica} icon={DollarSign} colorClass="bg-green-500" />
            <VitalSign label="Aud" value={gameState.audiencia} icon={Users} colorClass="bg-orange-500" />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-6 w-full flex-grow flex flex-col">

        <div className="flex-grow flex flex-col gap-6 mt-4 relative">

          {gameState.phase === 'playing' ? (
            <>
              {/* TARJETA DE ESCENARIO */}
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative group animate-slide-up">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>

                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="px-3 py-1 rounded-md bg-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
                       {currentScenario.category}
                     </span>
                     <div className="h-px bg-slate-800 flex-grow"></div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                    {currentScenario.title}
                  </h2>

                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-10">
                    {currentScenario.description}
                  </p>

                  <div className="grid gap-4 md:gap-6">
                    {currentScenario.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOption(option)}
                        className="group/btn relative text-left p-6 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between">
                           <span className="block font-medium text-lg text-slate-100 group-hover/btn:text-white mb-2">
                             {option.text}
                           </span>
                           <ChevronRight className="text-slate-600 group-hover/btn:text-blue-400 transition-colors" />
                        </div>

                        <div className="flex gap-3 text-[10px] font-mono opacity-0 group-hover/btn:opacity-70 transition-opacity mt-2">
                          {Object.entries(option.impact).map(([key, val]) => (
                            val !== 0 && (
                              <span key={key} className={val > 0 ? 'text-green-400' : 'text-red-400'}>
                                {key.substring(0,3).toUpperCase()} {val > 0 ? '+' : ''}{val}
                              </span>
                            )
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {lastFeedback && (
                <div className="mt-2 animate-slide-up">
                  <div className="bg-slate-900/80 backdrop-blur border-l-4 border-blue-500 p-6 rounded-r-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="text-blue-400" size={18} />
                      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                        Informe de impacto
                      </h3>
                    </div>
                    <p className="text-md text-slate-200 mb-4 font-light">
                      {lastFeedback.text}
                    </p>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                      <p className="text-xs font-mono text-slate-500">
                        <span className="text-slate-400 font-bold">TEORÍA APLICADA:</span> {lastFeedback.theory}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ReflectionScreen gameState={gameState} restartGame={restartGame} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
