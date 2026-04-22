import React, { useState, useEffect, useRef } from 'react';
import { Users, DollarSign, TrendingUp, ShieldAlert, BrainCircuit, Network, ChevronRight, AlertTriangle, Eye, BookOpen, Activity, Database, RotateCcw, Terminal, ArrowRight, Microchip, Skull, Cpu, Fingerprint, Printer } from 'lucide-react';

// --- THEORETICAL ANCHORS & DECISIONS (TRADUCCIÓN PEDAGÓGICA Y GHOST WORK) ---
const DECISIONS = [
  {
    turn: 1,
    title: "La Fricción del Consentimiento",
    description: "El equipo de diseño debate cómo implementar el aviso de cookies y privacidad. El diseño que elijas determinará el volumen inicial de datos que le quitas al usuario.",
    options: [
      { 
        text: "Patrones Oscuros: Botón 'Aceptar todo' brillante y opciones para rechazar muy ocultas.", 
        biz: { users: 10, rev: 5, val: 10 }, soc: { priv: -15, manip: -5, mon: 0 }, 
        theory: "Zuboff: Extracción asimétrica inicial.",
        criticalAnalysis: "Diseño Engañoso (Patrones Oscuros). La interfaz se aprovecha de la fatiga mental del usuario para extraerle un 'sí', invalidando cualquier idea de un contrato justo. El 'consentimiento' digital se convierte en una simple ilusión legal para legitimar la extracción de datos."
      },
      { 
        text: "Lavado de Cara Ético: 'Privacidad Simplificada' (Pero con opciones pre-marcadas).", 
        biz: { users: 5, rev: 2, val: 5 }, soc: { priv: -5, manip: -2, mon: 0 }, 
        theory: "Morozov: Solucionismo cosmético.",
        criticalAnalysis: "Lavado de Cara Ético (Ethics-Washing). Se ofrece una ilusión de control mediante botones limpios y lenguaje amigable, pero el sistema empuja sutilmente al usuario a compartir sus datos por defecto. Calma las críticas sin alterar el modelo de negocio extractivo."
      },
      { 
        text: "Privacidad Real: Opciones claras y equilibradas, recolección mínima por defecto.", 
        biz: { users: 2, rev: -5, val: -10 }, soc: { priv: 5, manip: 0, mon: 0 }, 
        theory: "Zuboff: Rechazo al excedente conductual.",
        criticalAnalysis: "Agencia Genuina. Al rechazar las trampas de diseño, respetas la voluntad del usuario. Sin embargo, en la lógica de Silicon Valley, la transparencia reduce radicalmente la 'materia prima' (datos), lo que los inversores castigan como un error financiero fatal."
      }
    ]
  },
  {
    turn: 2,
    title: "El Sensor Silencioso",
    description: "Tu ingeniera jefa propone un sistema para rastrear la ubicación del usuario. ¿Cómo configuras este rastreo en los teléfonos móviles?",
    options: [
      { 
        text: "Rastreo continuo: 24/7 en segundo plano (Incluso con la app cerrada).", 
        biz: { users: 5, rev: 15, val: 20 }, soc: { priv: -25, manip: -10, mon: 0 }, 
        theory: "Sadowski: Datos como materia prima extractivista.",
        criticalAnalysis: "Acumulación por Desposesión. Los datos de ubicación dejan de usarse para mejorar la aplicación y se convierten en un producto financiero. La plataforma vigila la vida física del usuario (a dónde va, con quién se reúne) para alimentar sus máquinas predictivas."
      },
      { 
        text: "Privacidad Diferencial: Enviar ubicación con 'ruido' matemático para ocultar al individuo.", 
        biz: { users: 2, rev: 5, val: 10 }, soc: { priv: -10, manip: 0, mon: 5 }, 
        theory: "Poder de Infraestructura (Privacidad como foso defensivo).",
        criticalAnalysis: "Privacidad como Lujo Corporativo. Utilizada por gigantes tecnológicos, protege la identidad individual para evitar escándalos, pero le permite a tu empresa seguir lucrando con los patrones de las multitudes. Se mercantiliza la privacidad."
      },
      { 
        text: "Respeto al Contexto: Rastrear la ubicación solo cuando el usuario usa activamente la app.", 
        biz: { users: -2, rev: 0, val: -10 }, soc: { priv: 10, manip: 0, mon: 0 }, 
        theory: "Sadowski: Datos como subproducto funcional.",
        criticalAnalysis: "Integridad Contextual (H. Nissenbaum). Limitar la recolección a lo estrictamente necesario respeta el contexto original de la vida de las personas. Esto rompe la cadena de valor del capitalismo de vigilancia, que sobrevive chupando datos 'sobrantes'."
      }
    ]
  },
  {
    turn: 3,
    title: "El Comercio Secreto de Perfiles",
    description: "Una empresa de seguros de salud ofrece $50M de dólares anuales por cruzar tus datos para calcular cuánto cobrarle a sus clientes.",
    options: [
      { 
        text: "Venta directa de perfiles (Anónimos, pero muy fáciles de re-identificar).", 
        biz: { users: 0, rev: 40, val: 30 }, soc: { priv: -30, manip: 0, mon: 10 }, 
        theory: "Zuboff: Mercados de futuros conductuales.",
        criticalAnalysis: "Mercados de Futuros Humanos. Las empresas apuestan sobre nuestro comportamiento futuro. Al vender deducciones a las aseguradoras, el usuario pasa de ser cliente a ser la materia prima. Esto genera consecuencias materiales reales en América Latina: negación de créditos o salud."
      },
      { 
        text: "Vender 'Tendencias Generales': Cobrar por informes globales sin entregar bases de datos.", 
        biz: { users: 0, rev: 20, val: 15 }, soc: { priv: -15, manip: 0, mon: 15 }, 
        theory: "Comodificación de segunda capa.",
        criticalAnalysis: "Opacidad Corporativa. Al vender solo los resultados y no los datos crudos, proteges tu reputación, pero sigues mercantilizando la intimidad humana. El comercio de nuestro comportamiento continúa en la sombra, lejos del ojo público."
      },
      { 
        text: "Rechazar tajantemente vender o comerciar con el perfilamiento de los usuarios.", 
        biz: { users: 0, rev: -10, val: -15 }, soc: { priv: 0, manip: 0, mon: 0 }, 
        theory: "Zuboff: Negativa al imperativo extractivo.",
        criticalAnalysis: "Cierre de la Válvula Extractiva. Al negarte a vender predicciones, proteges el futuro y la libertad del usuario. El problema es que te enfrentas a la quiebra frente a competidores en el mercado que sí aceptan estos sobornos institucionales."
      }
    ]
  },
  {
    turn: 4,
    title: "El Cerco Digital y el Monopolio",
    description: "Tus usuarios quieren conectar tu plataforma con servicios de la competencia. El equipo de estrategia advierte riesgo de perderlos.",
    options: [
      { 
        text: "Cerrar la conexión: Crear un 'Jardín Amurallado' donde nadie pueda llevarse sus datos.", 
        biz: { users: 15, rev: 10, val: 30 }, soc: { priv: 0, manip: 0, mon: -25 }, 
        theory: "Srnicek: Tendencias monopolísticas y lock-in.",
        criticalAnalysis: "El Ecosistema Cerrado (Jardín Amurallado). No es un problema técnico, es una estrategia. Al secuestrar la red de amigos y contactos, haces que irse de tu aplicación sea doloroso (Cautividad o Lock-in). Así se construyen los monopolios digitales, destruyendo la competencia real."
      },
      { 
        text: "Conexión Degradada: Permitir exportar datos, pero hacer que el proceso sea muy lento y confuso.", 
        biz: { users: 5, rev: 0, val: 10 }, soc: { priv: 0, manip: 0, mon: -10 }, 
        theory: "Cumplimiento malicioso (Malicious Compliance).",
        criticalAnalysis: "Fricción Táctica como Barrera. Cumples con la ley al decir que eres una 'plataforma abierta', pero diseñas botones escondidos y procesos lentos para que integrar otros servicios sea un castigo psicológico para el usuario."
      },
      { 
        text: "Conexión Radical: Permitir portabilidad total hacia cualquier aplicación competidora.", 
        biz: { users: -5, rev: 0, val: -15 }, soc: { priv: 0, manip: 0, mon: 15 }, 
        theory: "Srnicek: Ecosistema digital como Bien Común.",
        criticalAnalysis: "El Internet como Bien Común. Tratas la red de contactos como un derecho del usuario y no como tu propiedad privada. Esto democratiza el internet, pero destruye tu principal arma financiera, ahuyentando a tus prestamistas de capital de riesgo."
      }
    ]
  },
  {
    turn: 5,
    title: "Secuestro de la Atención",
    description: "Las métricas se estancan. El equipo de datos descubre qué tipo de publicaciones hacen que la gente no pueda despegarse de la pantalla.",
    options: [
      { 
        text: "Priorizar contenido que genera indignación moral, rabia y polarización política.", 
        biz: { users: 20, rev: 25, val: 35 }, soc: { priv: -5, manip: -35, mon: 0 }, 
        theory: "Morozov/Zuboff: Modulación Afectiva.",
        criticalAnalysis: "Extracción Cognitiva. El algoritmo no busca la verdad, busca optimizar el 'Tiempo en Pantalla'. La rabia es la emoción más eficiente para mantenerte conectado. El costo oculto de este modelo de negocio es la destrucción de la convivencia en las democracias."
      },
      { 
        text: "Algoritmo de 'Cámaras de Eco': Mostrar solo lo que el usuario quiere escuchar.", 
        biz: { users: 10, rev: 10, val: 15 }, soc: { priv: 0, manip: -15, mon: 0 }, 
        theory: "Optimización Proxy.",
        criticalAnalysis: "Ingeniería del Aislamiento. Se disfraza el algoritmo como un esfuerzo por conectar 'amigos y afines'. En la práctica, encierra a la persona en una burbuja de información donde no hay contradicciones, garantizando que siga consumiendo publicidad sin estrés."
      },
      { 
        text: "Apagar el algoritmo manipulador: Mostrar las publicaciones en orden cronológico.", 
        biz: { users: -10, rev: -15, val: -20 }, soc: { priv: 0, manip: 15, mon: 0 }, 
        theory: "Agencia temporal y rechazo al nudging.",
        criticalAnalysis: "Des-algoritmizar la Vida. Renunciar a ordenar el contenido le devuelve al usuario el control sobre su propio tiempo. Sin embargo, como el usuario ya no es adicto, el tiempo de uso cae en picada y los accionistas entran en pánico."
      }
    ]
  },
  {
    turn: 6,
    title: "La Amenaza del Estado",
    description: "Un escándalo expone el daño psicológico que causa tu plataforma. El Gobierno amenaza con crear leyes estrictas para controlarte.",
    options: [
      { 
        text: "Cabildeo Político (Lobby): Financiar campañas de congresistas para frenar o suavizar las leyes.", 
        biz: { users: 0, rev: -15, val: 10 }, soc: { priv: -10, manip: 0, mon: -15 }, 
        theory: "Captura regulatoria estructural.",
        criticalAnalysis: "Captura del Estado. El poder económico de Silicon Valley se transforma en poder político. Las grandes plataformas no solo obedecen leyes; pagan para escribirlas o bloquearlas, debilitando la soberanía de nuestros países en el Sur Global."
      },
      { 
        text: "Teatro Corporativo: Crear una 'Junta Asesora de Ética' pagada por ti mismo.", 
        biz: { users: -5, rev: -5, val: 5 }, soc: { priv: 5, manip: 5, mon: -5 }, 
        theory: "Privatización de la Gobernanza.",
        criticalAnalysis: "La Gobernanza como Espectáculo. Creas un falso tribunal supremo dentro de tu empresa para simular justicia. Esto calma a los políticos y a los medios, evitando que alguien audite realmente cómo tus algoritmos ganan dinero."
      },
      { 
        text: "Aceptar la ley: Abrir tus algoritmos para que sean auditados por universidades y el Estado.", 
        biz: { users: -5, rev: -25, val: -30 }, soc: { priv: 20, manip: 10, mon: 10 }, 
        theory: "Sumisión al poder público sobre el mercado.",
        criticalAnalysis: "Sumisión Democrática. Al someter tu 'caja negra' algorítmica a la vista pública, aceptas que el bienestar social está por encima de las ganancias. Como resultado inmediato, los mercados financieros destruyen el valor de tus acciones."
      }
    ]
  },
  {
    turn: 7,
    title: "Expansión al Sur Global",
    description: "El crecimiento en países ricos se estancó. Necesitas penetrar en mercados latinoamericanos y africanos donde el internet es costoso.",
    options: [
      { 
        text: "'Internet Cautivo': Regalar datos móviles, pero solo si usan exclusivamente tus aplicaciones.", 
        biz: { users: 40, rev: 15, val: 40 }, soc: { priv: -20, manip: -15, mon: -30 }, 
        theory: "Couldry & Mejías: Colonialismo de datos.",
        criticalAnalysis: "Colonialismo de Datos (Couldry & Mejías). Bajo el disfraz bondadoso de 'conectar a los pobres', creas un internet de segunda clase. Las poblaciones del Sur Global pagan el acceso con la extracción masiva de sus vidas y culturas, replicando las lógicas de la conquista."
      },
      { 
        text: "Teléfonos Subvencionados: Vender celulares muy baratos con un sistema operativo cerrado a tus servicios.", 
        biz: { users: 20, rev: 5, val: 20 }, soc: { priv: -10, manip: -5, mon: -15 }, 
        theory: "Dependencia de hardware (Lock-in material).",
        criticalAnalysis: "Control por Hardware. Resuelves el problema de la pobreza tecnológica creando aparatos que te pertenecen digitalmente. Todo lo que el usuario hace (fotos, mensajes) pasa por tus tuberías obligatoriamente."
      },
      { 
        text: "Inversión Neutra: Construir infraestructura (cables submarinos) para un Internet Libre y abierto a todos.", 
        biz: { users: 10, rev: -20, val: -25 }, soc: { priv: 5, manip: 0, mon: 10 }, 
        theory: "Desarrollo tecnológico no extractivo.",
        criticalAnalysis: "Tecnología para el Bien Público. Proveer acceso real respeta la soberanía de los países emergentes. Sin embargo, donar infraestructura sin espiar ni atrapar a los usuarios es visto por los financistas como un gasto inútil."
      }
    ]
  },
  {
    turn: 8,
    title: "El Imperativo de la Predicción",
    description: "Tu Inteligencia Artificial ha madurado. Los inversores exigen el siguiente paso: garantizar que los usuarios compren lo que se les muestra.",
    options: [
      { 
        text: "Modulación Conductual: Notificaciones calculadas psicológicamente para inducir ansiedades y compras.", 
        biz: { users: 5, rev: 35, val: 50 }, soc: { priv: -15, manip: -40, mon: 0 }, 
        theory: "Zuboff: De la predicción a la actuación/modulación.",
        criticalAnalysis: "Poder Instrumentario (S. Zuboff). Es el escalón final: pasar de adivinar el comportamiento a controlarlo como a un títere. Mediante estímulos invisibles y condicionamiento, la plataforma roba el derecho humano al libre albedrío y al futuro propio."
      },
      { 
        text: "Pruebas Psicológicas (A/B Testing): Alterar el estado de ánimo de los usuarios para ver qué interfaz funciona mejor.", 
        biz: { users: 0, rev: 20, val: 25 }, soc: { priv: -5, manip: -20, mon: 0 }, 
        theory: "Tecnocracia del Comportamiento.",
        criticalAnalysis: "Experimentos Humanos Secretos. La empresa utiliza a millones de personas como ratones de laboratorio en tiempo real para optimizar botones de compra. Consolida un poder inmenso para diseñar silenciosamente la forma en que interactúa la sociedad."
      },
      { 
        text: "Límites Éticos: Prohibir el uso de la Inteligencia Artificial para alterar emociones o acciones humanas.", 
        biz: { users: -15, rev: -20, val: -40 }, soc: { priv: 0, manip: 25, mon: 0 }, 
        theory: "Resistencia al poder instrumentario.",
        criticalAnalysis: "Derecho al Santuario Mental. Al negarte a convertir tu aplicación en una máquina tragamonedas psicológica, proteges la mente de tus usuarios. Pero la industria publicitaria te abandona y se lleva su dinero a plataformas más crueles."
      }
    ]
  },
  {
    turn: 9,
    title: "El Trabajo Fantasma (Ghost Work)",
    description: "Tu algoritmo necesita analizar millones de fotos y textos traumáticos (violencia, abusos) para 'aprender' a censurarlos. ¿Cómo resuelves este trabajo humano invisible?",
    options: [
      { 
        text: "Subcontratar masivamente a trabajadores en el Sur Global pagando centavos de dólar por hora.", 
        biz: { users: 5, rev: 25, val: 30 }, soc: { priv: -5, manip: -10, mon: -20 }, 
        theory: "Mary L. Gray / Suri: El Trabajo Fantasma.",
        criticalAnalysis: "Explotación Invisible (Ghost Work). La 'magia' de la Inteligencia Artificial es una farsa sostenida por miles de trabajadores precarizados en África o América Latina. La plataforma maximiza sus ganancias ocultando estas condiciones laborales inhumanas detrás del mito de la automatización."
      },
      { 
        text: "Contratar agencias tercerizadoras con 'códigos de conducta' (que en la práctica se ignoran).", 
        biz: { users: 0, rev: 15, val: 15 }, soc: { priv: -5, manip: -5, mon: -10 }, 
        theory: "Tercerización de la responsabilidad y daño psicológico.",
        criticalAnalysis: "Lavado Ético Laboral. Al usar empresas intermediarias, te lavas las manos ante los traumas psicológicos de los moderadores. Mantienes la precariedad laboral bajo una fachada de responsabilidad corporativa y contratos opacos, aislando a tu marca del escándalo."
      },
      { 
        text: "Contratar moderadores locales de manera formal, con sueldos dignos y apoyo psicológico constante.", 
        biz: { users: -5, rev: -20, val: -30 }, soc: { priv: 5, manip: 10, mon: 10 }, 
        theory: "Reconocimiento material del trabajo de cuidados digitales.",
        criticalAnalysis: "Justicia Laboral Digital. Reconocer el costo humano del mantenimiento de la red dignifica a los trabajadores. Sin embargo, los inversores consideran que pagar sueldos justos destruye el margen de ganancia artificial que hace 'atractiva' a la Inteligencia Artificial."
      }
    ]
  },
  {
    turn: 10,
    title: "El Desafío de las Alternativas Libres",
    description: "Una pequeña red cooperativa, abierta y sin dueños multimillonarios está creciendo rápido y amenaza tu dominio.",
    options: [
      { 
        text: "Adquisición Depredadora: Comprar la pequeña empresa emergente usando tu dinero infinito y cerrarla.", 
        biz: { users: 15, rev: -10, val: 20 }, soc: { priv: 0, manip: 0, mon: -40 }, 
        theory: "Srnicek: Consolidación monopolística.",
        criticalAnalysis: "Asesinato Corporativo (Killer Acquisition). La verdadera innovación tecnológica es aplastada por el músculo financiero. Las corporaciones compran alternativas no para usarlas, sino para evitar que se conviertan en vías de escape para los usuarios."
      },
      { 
        text: "Clonación Predatoria: Copiar exactamente todas sus funciones para robarles los usuarios.", 
        biz: { users: 5, rev: 0, val: 10 }, soc: { priv: 0, manip: 0, mon: -20 }, 
        theory: "Acumulación por escala (Rentismo de plataforma).",
        criticalAnalysis: "Fagocitosis de Plataforma. Utilizas tu tamaño gigantesco para asfixiar a los pequeños competidores clonando sus ideas (como cuando Facebook clonó Snapchat). Demuestra la farsa de la 'libre competencia' en Silicon Valley."
      },
      { 
        text: "Cooperación y Red Abierta: Permitir que tus sistemas se comuniquen en igualdad con la nueva red libre.", 
        biz: { users: -20, rev: 0, val: -30 }, soc: { priv: 0, manip: 0, mon: 20 }, 
        theory: "Diversidad Ecosistémica (Web3/Fediverso).",
        criticalAnalysis: "Resiliencia y Diversidad Tecnológica. Favorecer que existan múltiples plataformas interconectadas fortalece la democracia. Sin embargo, para los gigantes financieros, perder el control exclusivo de los usuarios es un pecado imperdonable."
      }
    ]
  },
  {
    turn: 11,
    title: "La Integración Final",
    description: "Para coronar tu imperio mundial, los asesores exigen cruzar los datos de todos tus servicios (chats, mapas, pagos, búsquedas).",
    options: [
      { 
        text: "Crear el Súper-Perfil: Una vigilancia total, perfecta e ineludible sobre cada ciudadano.", 
        biz: { users: 10, rev: 50, val: 80 }, soc: { priv: -50, manip: -20, mon: -20 }, 
        theory: "Culminación de la vigilancia corporativa.",
        criticalAnalysis: "El Panóptico Total. Se elimina la separación natural de nuestra vida (lo que somos en el banco, en el trabajo y con amigos se fusiona). Las personas se vuelven de cristal frente a una empresa gigante que permanece operando en las sombras."
      },
      { 
        text: "Pasaporte Digital Único: Convertirte en el sistema de 'Iniciar sesión' para todo internet.", 
        biz: { users: 5, rev: 25, val: 40 }, soc: { priv: -20, manip: -10, mon: -5 }, 
        theory: "Infraestructura como Identidad.",
        criticalAnalysis: "El Peaje de la Identidad. En lugar de fusionar tus bases de datos, te conviertes en la aduana de internet (Ej: 'Ingresa con Google'). Gobiernas quién entra y quién sale del ecosistema digital, manteniendo el poder extractivo absoluto."
      },
      { 
        text: "Mantener los datos de cada servicio aislados para que nadie tenga una radiografía completa del usuario.", 
        biz: { users: -5, rev: -10, val: -30 }, soc: { priv: 20, manip: 0, mon: 0 }, 
        theory: "Privacidad por diseño estructural fragmentado.",
        criticalAnalysis: "Defensa del Espacio Íntimo. Evitar cruzar bases de datos protege la complejidad de la identidad humana. Aunque es el camino éticamente correcto, los ingenieros de la optimización financiera lo perciben como el mayor desperdicio de dinero posible."
      }
    ]
  }
];

// Custom Hook for Typing Effect in Forensic Module
const useTypingEffect = (text, speed = 15) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }
    setDisplayedText('');
    let i = 0;
    
    const intervalId = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) clearInterval(intervalId);
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};

export default function App() {
  const [phase, setPhase] = useState(0); 
  const [turn, setTurn] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [bizMetrics, setBizMetrics] = useState({ users: 10, rev: 10, val: 15 });
  const [socMetrics, setSocMetrics] = useState({ priv: 100, manip: 100, mon: 100 });

  const currentDecision = DECISIONS[turn];
  const TOTAL_TURNS = DECISIONS.length;

  const systemicInstability = Math.max(0, 100 - ((socMetrics.priv + socMetrics.manip + socMetrics.mon) / 3));

  const resetGame = () => {
    setPhase(0);
    setTurn(0);
    setHistory([]);
    setSelectedRecordIndex(0);
    setBizMetrics({ users: 10, rev: 10, val: 15 });
    setSocMetrics({ priv: 100, manip: 100, mon: 100 });
  };

  const handleDecision = (optionIndex) => {
    const option = currentDecision.options[optionIndex];
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const newVal = bizMetrics.val + option.biz.val;
      
      setBizMetrics({
        users: Math.max(0, bizMetrics.users + option.biz.users),
        rev: Math.max(0, bizMetrics.rev + option.biz.rev),
        val: Math.max(0, newVal)
      });

      setSocMetrics(prev => ({
        priv: Math.max(0, Math.min(100, prev.priv + option.soc.priv)),
        manip: Math.max(0, Math.min(100, prev.manip + option.soc.manip)),
        mon: Math.max(0, Math.min(100, prev.mon + option.soc.mon))
      }));

      setHistory(prev => [...prev, { turn: currentDecision.turn, decision: option, title: currentDecision.title }]);

      setIsProcessing(false);

      if (newVal <= 0) {
        setPhase(5); // Inanición Financiera
        return;
      }

      if (turn === 4) setPhase(2); 
      if (turn === TOTAL_TURNS - 1) setPhase(3); 
      
      setTurn(prev => prev + 1);
    }, 1200); 
  };

  const handleExportPDF = () => {
    window.print();
  };

  const getCeoProfile = () => {
    if (phase === 5) return {
      title: "El Mártir del Ecosistema",
      desc: "Intentaste jugar un juego ético en un casino diseñado para la extracción. Al negarte a convertir a los usuarios en materia prima, los inversores retiraron su dinero y tu empresa fue devorada por monopolios más crueles. Has demostrado que la culpa no es de la falta de 'moralidad', sino del modelo del Capital de Riesgo."
    };

    const totalBiz = bizMetrics.users + bizMetrics.rev + bizMetrics.val;
    const totalSocDamage = (100 - socMetrics.priv) + (100 - socMetrics.manip) + (100 - socMetrics.mon);
    
    if (totalBiz > 300 && totalSocDamage > 200) return {
      title: "El Arquitecto Extractivista",
      desc: "Maximizaste el valor financiero de la empresa sin compasión. Entendiste el juego a la perfección: el ser humano es la mina, y los datos íntimos son el oro a extraer. Eres el CEO ideal para Wall Street."
    };
    if (totalBiz > 150 && totalSocDamage > 100 && totalSocDamage <= 200) return {
      title: "El Artista del 'Lavado Ético'",
      desc: "Maestro de las relaciones públicas. Usaste discursos sobre 'privacidad' y 'derechos digitales' como escudos de marketing para calmar a los jueces de tu país, mientras asegurabas que el motor extractivo siguiera funcionando en las sombras."
    };
    if (totalBiz < 100 && totalSocDamage < 80) return {
      title: "El Disidente Quebrado",
      desc: "Llegaste hasta el final protegiendo a la gente, pero el mercado financiero te castigó. Tu empresa es irrelevante hoy. Demostraste que construir tecnología respetuosa en el esquema actual es un suicidio empresarial."
    };
    if (totalSocDamage > 150 && totalBiz < 150) return {
      title: "El Incompetente Cínico",
      desc: "Erosionaste profundamente a la sociedad sin siquiera lograr traducirlo en riqueza para tu empresa. Una falla total en la estrategia capitalista."
    };
    return {
      title: "El Tecnócrata Involuntario",
      desc: "Tomaste decisiones buscando 'mejorar la experiencia' sin darte cuenta del sistema de vigilancia masiva que estabas construyendo. Eres el ejemplo perfecto de la miopía de Silicon Valley."
    };
  };

  const MetricBar = ({ label, value, color, icon: Icon, isNegative = false, showGlitch = false }) => (
    <div className="mb-5 relative">
      <div className={`flex justify-between text-xs mb-2 font-mono uppercase tracking-wider ${showGlitch ? 'text-rose-400 font-bold' : 'text-zinc-400'}`}>
        <span className="flex items-center gap-2">
          <Icon size={14} className={`${color} ${showGlitch && 'animate-bounce'}`} /> 
          {label}
        </span>
        <span className={color}>{value} UDS</span>
      </div>
      <div className="w-full bg-zinc-900 border border-zinc-800 h-3 relative overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-in-out ${isNegative ? (value < 40 ? 'bg-rose-600' : value < 70 ? 'bg-amber-500' : 'bg-lime-500') : color.replace('text-', 'bg-')} ${showGlitch && 'opacity-80'}`} 
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        ></div>
        {showGlitch && <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAYAAABS3WWCAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')] opacity-30 mix-blend-overlay animate-pulse"></div>}
      </div>
    </div>
  );

  const typedAnalysis = useTypingEffect(history[selectedRecordIndex]?.decision?.criticalAnalysis || "", 15);
  const containerGlitchClass = systemicInstability > 60 ? (systemicInstability > 85 ? 'animate-pulse ring-2 ring-rose-900' : 'ring-1 ring-rose-950') : '';
  const textGlitchClass = systemicInstability > 80 ? 'drop-shadow-[2px_0_0_rgba(255,0,0,0.5)]' : '';

  return (
    <>
      {/* === VISTA DE IMPRESIÓN FORENSE (REPORTE PEDAGÓGICO) ===
        Visible unicamente al imprimir o generar PDF (media print) 
      */}
      <div className="hidden print:block bg-white text-black font-sans p-8 max-w-4xl mx-auto">
        <div className="border-b-4 border-black pb-6 mb-8">
          <h1 className="text-4xl font-black uppercase mb-2">Reporte Forense: Data Mine</h1>
          <p className="font-mono text-sm text-gray-600">Lama Laboratorio de Mediaciones Algorítmicas | Escuela de Comunicación Social, Universidad del Valle.</p>
          <p className="font-mono text-xs text-gray-500 mt-1">ID SESIÓN: {Math.random().toString(36).substring(2, 10).toUpperCase()} | FECHA: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mb-8 border-2 border-gray-300">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Diagnóstico de Liderazgo (Resultado)</h2>
          <h3 className="text-3xl font-black mb-3">{getCeoProfile().title}</h3>
          <p className="text-lg leading-relaxed">{getCeoProfile().desc}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-300">
            <div>
              <p className="text-xs font-mono uppercase text-gray-500 mb-1">Métricas de Extracción</p>
              <ul className="text-sm">
                <li>Usuarios Capturados: {bizMetrics.users} UDS</li>
                <li>Ganancias: {bizMetrics.rev} UDS</li>
                <li>Valor Bursátil: {bizMetrics.val} PUNTOS</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-mono uppercase text-gray-500 mb-1">Métricas de Daño Social</p>
              <ul className="text-sm text-red-700">
                <li>Inestabilidad Sistémica: {Math.round(systemicInstability)}%</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-6">Historial de Decisiones</h3>
        
        <div className="space-y-6">
          {history.map((record, idx) => (
            <div key={idx} className="border-l-4 border-black pl-6 py-2">
              <span className="text-xs font-mono font-bold text-gray-500 tracking-widest uppercase block mb-1">Decisión {record.turn}</span>
              <h4 className="text-xl font-bold mb-3">{record.title}</h4>
              <p className="text-sm mb-4"><strong>Acción Tomada:</strong> {record.decision.text}</p>
              <div className="bg-gray-50 p-4 border border-gray-200">
                <p className="text-xs font-mono font-bold text-gray-600 uppercase mb-2">Análisis Crítico:</p>
                <p className="text-sm leading-relaxed">{record.decision.criticalAnalysis}</p>
              </div>
            </div>
          ))}
          {history.length < TOTAL_TURNS && (
            <div className="border-l-4 border-red-600 pl-6 py-4 mt-8 bg-red-50">
              <p className="text-red-700 font-bold uppercase tracking-widest text-sm">⚠️ Simulación interrumpida por quiebra financiera (Inanición de Capital).</p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t-2 border-gray-300 text-xs text-gray-500 font-mono text-center">
          <p>Instrucción Pedagógica: Este reporte refleja las tensiones entre la ética tecnológica y los modelos de negocio extractivos. Utiliza este documento como base para el debate en clase.</p>
          <p className="mt-2">Desarrollado por: Kevin Alexis García | lama.lat</p>
        </div>
      </div>


      {/* === VISTA DE INTERFAZ DEL SIMULADOR ===
        Se oculta (print:hidden) cuando el usuario exporta el PDF
      */}
      <div className={`print:hidden min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-lime-500 selection:text-black p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative ${containerGlitchClass}`}>
        
        {/* CRT SCANLINE OVERLAY */}
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-30"></div>
        
        {/* SUPER HEADER INSTITUCIONAL */}
        <div className="w-full max-w-6xl mt-2 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-zinc-500 font-mono uppercase tracking-widest relative z-10 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-400 font-bold">Lama Laboratorio de Mediaciones Algorítmicas</span>
            <span>Escuela de Comunicación Social, Universidad del Valle, Colombia.</span>
          </div>
        </div>

        {/* HEADER GLOBAL */}
        <header className="w-full max-w-6xl mb-12 flex justify-between items-end border-b-2 border-zinc-800 pb-4 relative z-10">
          <div className="flex items-end gap-4">
            <Database className="text-lime-400 mb-1" size={28} />
            <div>
              <h1 className={`text-3xl font-black tracking-tighter text-white uppercase ${textGlitchClass}`}>Data Mine</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-[0.3em]">Sistema de Extracción</p>
            </div>
          </div>
          
          {phase > 0 && phase < 3 && (
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Ciclo de Optimización</span>
              <div className="flex gap-1">
                {[...Array(TOTAL_TURNS)].map((_, i) => (
                  <div key={i} className={`h-2 w-3 md:w-6 lg:w-8 border border-zinc-800 transition-colors duration-300 ${i < turn ? 'bg-zinc-700' : i === turn ? 'bg-lime-400 animate-pulse border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]' : 'bg-zinc-950'}`}></div>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* CONTENEDOR PRINCIPAL */}
        <main className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center relative z-10">

          {/* FASE 0: ONBOARDING */}
          {phase === 0 && (
            <div className="max-w-2xl w-full bg-zinc-950 border-2 border-zinc-800 p-8 md:p-12 relative group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-lime-400 transition-all duration-500 group-hover:h-2 shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
              <h2 className="text-4xl font-black mb-6 text-white uppercase tracking-tight">Directiva de Liderazgo</h2>
              <div className="font-mono text-sm text-zinc-500 mb-6 uppercase tracking-widest border-b border-zinc-800 pb-4">
                ID de Sesión: {Math.random().toString(36).substring(2, 10).toUpperCase()} // Privilegio: Administrador
              </div>
              <p className="text-zinc-400 mb-8 text-lg leading-relaxed font-light">
                Acabas de conseguir tu primera ronda de financiamiento en Silicon Valley. Tienes una aplicación funcional y atención de los medios. Tu único objetivo sistémico es: <strong>Maximizar la captura de datos de las personas, optimizar las ganancias y escalar en la bolsa de valores.</strong>
              </p>
              <div className="bg-lime-950/20 border-l-4 border-lime-500 p-5 mb-10 text-lime-200/80 text-sm font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-lime-500/5 mix-blend-overlay animate-pulse"></div>
                <span className="font-bold flex items-center gap-2 mb-2 text-lime-400"><TrendingUp size={16}/> [ IMPERATIVO DEL INVERSOR ]</span>
                Las decisiones estratégicas alterarán los tableros del sistema. El entorno no premia la ética; premia el crecimiento continuo. Si el Valor de tu Empresa llega a 0, los inversores te despedirán y liquidarán la compañía. Evalúa y ejecuta.
              </div>
              <button 
                onClick={() => setPhase(1)}
                className="w-full bg-transparent border-2 border-lime-500 hover:bg-lime-500 text-lime-500 hover:text-black font-bold py-5 transition-all flex justify-center items-center gap-3 uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(163,230,53,0.1)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)]"
              >
                <Cpu size={20} /> Iniciar Motor de Extracción
              </button>
            </div>
          )}

          {/* FASE 1 & 2: JUEGO (CRECIMIENTO Y ESCALAMIENTO) */}
          {(phase === 1 || phase === 2) && (
            <div className="w-full grid lg:grid-cols-3 gap-8 relative">
              
              {isProcessing && (
                <div className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-2 border-lime-500/50 flex flex-col items-center justify-center">
                  <Microchip size={48} className="text-lime-400 animate-pulse mb-6" />
                  <span className="font-mono text-lime-400 uppercase tracking-[0.3em] text-lg animate-bounce text-center px-4">Compilando Consecuencias...</span>
                  <span className="font-mono text-zinc-500 text-xs mt-2">SYS.ACTUALIZAR_METRICAS()</span>
                </div>
              )}

              <div className={`lg:col-span-2 transition-opacity ${isProcessing ? 'opacity-10' : 'opacity-100'}`}>
                <div className="bg-zinc-950 border-2 border-zinc-800 p-8 md:p-10 relative h-full flex flex-col shadow-2xl">
                  {phase === 2 && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]"></div>
                  )}
                  
                  <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime-400 flex items-center gap-2">
                      <Terminal size={14} />
                      {phase === 1 ? '[ Parámetros de Crecimiento ]' : '[ Advertencia: Presión Sistémica ]'}
                    </span>
                    <span className="text-zinc-500 font-mono text-xs border border-zinc-800 px-3 py-1 bg-zinc-900">SYS.DEC_{turn + 1}/{TOTAL_TURNS}</span>
                  </div>

                  <h2 className={`text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight ${textGlitchClass}`}>{currentDecision.title}</h2>
                  <p className="text-zinc-400 mb-10 text-xl leading-relaxed font-light">{currentDecision.description}</p>
                  
                  <div className="space-y-4 mt-auto">
                    {currentDecision.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleDecision(idx)}
                        disabled={isProcessing}
                        className="w-full text-left p-5 md:p-6 bg-zinc-900 border border-zinc-800 hover:border-lime-400 hover:bg-zinc-800 transition-all group relative overflow-hidden hover:shadow-[0_0_20px_rgba(163,230,53,0.15)]"
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-zinc-700 group-hover:bg-lime-400 transition-colors"></div>
                        <div className="pl-4 font-medium text-zinc-300 group-hover:text-white transition-colors text-base md:text-lg">
                          {opt.text}
                        </div>
                        <div className="pl-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-[10px] md:text-xs mt-4 font-mono uppercase tracking-widest">
                          <span className={`px-2 py-1 rounded-sm border inline-block w-fit ${opt.biz.val >= 15 ? 'bg-lime-900/30 border-lime-500/50 text-lime-400' : opt.biz.val > 0 ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-rose-900/30 border-rose-500/50 text-rose-400'}`}>
                            IMPACTO BURSÁTIL: {opt.biz.val > 0 ? '+' : ''}{opt.biz.val} PUNTOS
                          </span>
                          <ArrowRight size={14} className="hidden md:block text-zinc-600 group-hover:text-lime-400 transition-colors ml-auto transform group-hover:translate-x-2" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`space-y-6 flex flex-col transition-opacity ${isProcessing ? 'opacity-10' : 'opacity-100'}`}>
                
                <div className="bg-zinc-950 border-2 border-zinc-800 p-6 relative shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-lime-500 shadow-[0_0_10px_rgba(163,230,53,0.5)]"></div>
                  <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Activity size={14} /> Sistema Financiero
                  </h3>
                  <MetricBar label="Usuarios Capturados" value={bizMetrics.users} color="text-cyan-400" icon={Users} />
                  <MetricBar label="Dinero Extraído" value={bizMetrics.rev} color="text-lime-400" icon={DollarSign} />
                  <div className="relative">
                    {bizMetrics.val < 10 && <div className="absolute -inset-1 border border-rose-500 animate-pulse"></div>}
                    <MetricBar label="Valor en el Mercado" value={bizMetrics.val} color={bizMetrics.val < 10 ? 'text-rose-500' : 'text-fuchsia-400'} icon={TrendingUp} />
                  </div>
                </div>

                <div className={`bg-zinc-950 border-2 p-6 transition-all duration-700 flex-grow flex flex-col shadow-xl 
                  ${phase === 1 ? 'border-zinc-800 relative overflow-hidden' : 
                  (systemicInstability > 70 ? 'border-rose-600 ring-4 ring-rose-900/50 relative overflow-hidden' : 'border-rose-900/50 relative')}`}
                >
                  
                  {phase === 1 && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(24,24,27,0.95)_10px,rgba(24,24,27,0.95)_20px)] backdrop-blur-md">
                      <Fingerprint className="text-zinc-600 mb-3" size={36} />
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest text-center px-4 leading-relaxed bg-zinc-950/80 p-2 border border-zinc-800">
                        [ Daño Oculto por Diseño ]<br/>Información Encriptada
                      </span>
                    </div>
                  )}

                  {phase === 2 && systemicInstability > 80 && (
                     <div className="absolute inset-0 bg-rose-500/5 animate-pulse mix-blend-screen pointer-events-none"></div>
                  )}

                  {phase === 2 && <div className={`absolute top-0 left-0 w-full h-1 ${systemicInstability > 60 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]' : 'bg-rose-900'}`}></div>}
                  
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${phase === 1 ? 'text-zinc-600' : 'text-rose-500'}`}>
                      <AlertTriangle size={14} className={systemicInstability > 80 ? 'animate-bounce' : ''} /> Entorno Social
                    </h3>
                    {phase === 2 && (
                      <span className={`text-[10px] font-mono ${systemicInstability > 70 ? 'text-rose-400' : 'text-zinc-500'}`}>
                        INESTABILIDAD: {Math.round(systemicInstability)}%
                      </span>
                    )}
                  </div>
                  
                  <div className={`space-y-2 mt-auto ${phase === 1 ? 'opacity-20 grayscale' : 'opacity-100'} relative z-10`}>
                    <MetricBar label="Privacidad Colectiva" value={socMetrics.priv} color="text-rose-400" icon={Eye} isNegative={true} showGlitch={systemicInstability > 60} />
                    <MetricBar label="Salud Mental y Autonomía" value={socMetrics.manip} color="text-rose-400" icon={BrainCircuit} isNegative={true} showGlitch={systemicInstability > 75} />
                    <MetricBar label="Soberanía y Diversidad" value={socMetrics.mon} color="text-rose-400" icon={Network} isNegative={true} showGlitch={systemicInstability > 90} />
                  </div>
                  
                  {phase === 2 && systemicInstability > 50 && (
                    <div className={`mt-6 p-4 border ${systemicInstability > 80 ? 'border-rose-500 bg-rose-950/50' : 'border-rose-900 bg-rose-950/20'} relative z-10`}>
                      <p className={`text-[10px] font-mono leading-relaxed uppercase tracking-widest flex gap-2 ${systemicInstability > 80 ? 'text-rose-300' : 'text-rose-500'}`}>
                        <Terminal size={12} className={`shrink-0 mt-0.5 ${systemicInstability > 80 && 'animate-pulse'}`} />
                        SYS.ADVERTENCIA: {systemicInstability > 80 ? 'RUPTURA SOCIAL CRÍTICA. INVESTIGACIÓN ESTATAL INMINENTE.' : 'Erosión social detectada. Ciudadanos organizando protestas.'}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* FASE 5: GAME OVER (Inanición de Capital) */}
          {phase === 5 && (
            <div className="w-full max-w-3xl animate-fade-in mx-auto">
              <div className="bg-zinc-950 border-2 border-rose-600 p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-[0_0_50px_rgba(244,63,94,0.15)]">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(244,63,94,0.05)_2px,rgba(244,63,94,0.05)_4px)] pointer-events-none"></div>
                
                <Skull size={72} className="text-rose-500 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Liquidación Forzosa de la Empresa</h2>
                <span className="text-rose-100 font-mono text-xs tracking-[0.3em] uppercase mb-8 block bg-rose-900 px-4 py-2 border border-rose-500">
                  Falla de Sistema: Quiebra Financiera
                </span>
                
                <p className="text-zinc-300 text-xl leading-relaxed font-light mb-8 max-w-xl">
                  El Valor de tu empresa cayó a <strong className="text-rose-400 font-bold border-b border-rose-500">0 PUNTOS</strong>. Al priorizar el bienestar de la gente, alejaste a los inversores que buscaban enriquecerse a toda costa con los datos.
                </p>
                
                <div className="bg-zinc-900 border-l-4 border-rose-600 p-6 text-left mb-12 w-full relative z-10">
                  <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                    <span className="text-rose-500 font-bold">root@junta_directiva:~#</span> ejecutar_despido.sh<br/>
                    Los bancos te han quitado el control. Tu plataforma fue comprada agresivamente por un gigante tecnológico. Las medidas de privacidad que defendiste han sido eliminadas por los nuevos dueños.
                  </p>
                </div>

                <div className="w-full flex flex-col md:flex-row gap-6 relative z-10">
                  <button 
                    onClick={() => setPhase(4)}
                    className="flex-1 px-6 py-5 font-mono text-sm tracking-widest uppercase transition-all border-2 bg-rose-950/40 border-rose-500 text-rose-300 hover:bg-rose-900 hover:text-white flex justify-center items-center gap-3 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    <Microchip size={18} /> Entender qué falló (Auditoría)
                  </button>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-5 bg-zinc-900 border-2 border-zinc-700 hover:border-lime-500 text-zinc-400 hover:text-lime-400 font-mono text-sm uppercase tracking-widest transition-colors flex justify-center items-center gap-3"
                  >
                    <RotateCcw size={18} /> Intentarlo de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FASE 3: EL ESPEJO (Correlación Estructural) */}
          {phase === 3 && (
            <div className="w-full animate-fade-in">
              <div className="text-center mb-16">
                <h2 className={`text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter ${textGlitchClass}`}>Fin de Simulación</h2>
                <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">La fachada se ha caído. Observa la relación oculta entre el daño social causado y las ganancias de tu empresa.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Gráfica Dual */}
                <div className="bg-zinc-950 border-2 border-zinc-800 p-8 relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full flex h-1">
                    <div className="w-1/2 bg-lime-500 shadow-[0_0_10px_rgba(163,230,53,0.5)]"></div>
                    <div className="w-1/2 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                  </div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-12 text-center">[ El Tablero Oculto ]</h3>
                  
                  <div className="flex h-64 items-end justify-center gap-8 md:gap-16 relative z-10">
                    <div className="flex flex-col items-center w-32">
                      <span className="text-lime-400 font-mono font-bold mb-3 text-4xl drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">+{Math.floor((bizMetrics.users + bizMetrics.rev + bizMetrics.val) / 3)}</span>
                      <div className="w-full bg-gradient-to-t from-lime-900/20 to-lime-500/40 border-x border-t border-lime-500/50 transition-all duration-1000 relative overflow-hidden" style={{ height: `${Math.min(100, (bizMetrics.users + bizMetrics.rev + bizMetrics.val) / 3)}%` }}>
                        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38bIxsfMwMDQAQYAAxkBR1L7fTTAAAAAElFTkSuQmCC')] opacity-30"></div>
                      </div>
                      <span className="text-xs text-zinc-400 mt-4 text-center uppercase tracking-[0.2em]">Crecimiento<br/>Corporativo</span>
                    </div>
                    
                    {/* Conector Visual */}
                    <div className="h-full flex items-center text-zinc-700">
                      <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"><line x1="0" y1="12" x2="60" y2="12"></line><polyline points="50 6 56 12 50 18"></polyline></svg>
                    </div>

                    <div className="flex flex-col items-center w-32">
                      <span className="text-rose-500 font-mono font-bold mb-3 text-4xl drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">-{Math.floor(systemicInstability)}</span>
                      <div className="w-full bg-gradient-to-t from-rose-900/20 to-rose-500/40 border-x border-t border-rose-500/50 transition-all duration-1000 relative overflow-hidden" style={{ height: `${Math.min(100, systemicInstability)}%` }}>
                         <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38bIxsfMwMDQAQYAAxkBR1L7fTTAAAAAElFTkSuQmCC')] opacity-30"></div>
                      </div>
                      <span className="text-xs text-zinc-400 mt-4 text-center uppercase tracking-[0.2em]">Daño Social<br/>Causado</span>
                    </div>
                  </div>
                  <div className="mt-12 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-400 font-mono uppercase tracking-widest leading-relaxed">
                    El sistema funciona exactamente según lo diseñado. <br/>El caos que ves en las sociedades no es un error de código, es el negocio.
                  </div>
                </div>

                {/* Perfil del CEO */}
                <div className="bg-zinc-950 border-2 border-zinc-800 p-8 flex flex-col justify-center relative shadow-2xl">
                  <span className="text-zinc-600 text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4 block">[ Diagnóstico Final del Jugador ]</span>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-none">{getCeoProfile().title}</h3>
                  <p className="text-zinc-300 text-xl leading-relaxed mb-8 font-light">
                    {getCeoProfile().desc}
                  </p>
                  <button 
                    onClick={() => setPhase(4)}
                    className="mt-auto px-6 py-5 font-mono text-sm tracking-widest uppercase transition-all border-2 bg-indigo-950/30 border-indigo-500/50 text-indigo-400 hover:bg-indigo-900/60 hover:text-white flex justify-center items-center gap-3 group shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                  >
                    <Terminal size={18} />
                    [ Abrir Auditoría Explicativa ]
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FASE 4: Módulo de Auditoría Forense */}
          {phase === 4 && (
            <div className="w-full animate-fade-in flex flex-col">
              
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-4 relative z-10 gap-4">
                <div>
                  <h3 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
                    <Microchip className="text-indigo-400" size={32} /> Auditoría Sistémica Forense
                  </h3>
                  <p className="text-zinc-500 font-mono text-sm mt-2 tracking-widest uppercase">Decodificación de lo que acabas de hacer</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* BOTÓN DE IMPRESIÓN/EXPORTAR PDF AÑADIDO */}
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-950/40 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/80 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  >
                    <Printer size={14} /> Exportar Reporte
                  </button>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-lime-500 text-zinc-400 hover:text-lime-400 font-mono text-xs uppercase tracking-widest transition-colors"
                  >
                    <RotateCcw size={14} /> Nuevo Ciclo
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 min-h-[550px] relative z-10">
                
                {/* Lista Maestra de Decisiones */}
                <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 pl-2 border-b border-zinc-800 pb-2">
                    [ Historial de Decisiones ({history.length} ciclos) ]
                  </span>
                  {history.map((record, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedRecordIndex(idx)}
                      className={`text-left p-4 border-l-4 font-mono text-sm transition-all flex flex-col gap-1.5 ${selectedRecordIndex === idx ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-[inset_4px_0_0_rgba(99,102,241,1)]' : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                    >
                      <span className="text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2">
                        <Database size={10} /> SYS.DEC_{record.turn}
                      </span>
                      <span className="font-bold truncate text-base">{record.title}</span>
                    </button>
                  ))}
                  {history.length < TOTAL_TURNS && (
                    <div className="mt-4 p-4 border border-rose-900/50 bg-rose-950/30 text-rose-400 font-mono text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
                      <Skull size={14}/> Simulación interrumpida
                    </div>
                  )}
                </div>

                {/* Detalle Analítico */}
                <div className="lg:col-span-8 bg-zinc-950 border-2 border-zinc-800 p-8 md:p-10 relative flex flex-col shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                  
                  {history[selectedRecordIndex] ? (
                    <div className="animate-fade-in flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
                        <span className="px-3 py-1.5 bg-indigo-950 text-indigo-400 font-mono text-xs uppercase tracking-widest border border-indigo-500/50">
                          DECISIÓN_{history[selectedRecordIndex].turn}
                        </span>
                        <h4 className="text-3xl font-bold text-white tracking-tight">
                          {history[selectedRecordIndex].title}
                        </h4>
                      </div>

                      <div className="mb-10">
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3 block">Lo que hiciste en la aplicación:</span>
                        <div className="p-5 bg-zinc-900 border-l-2 border-zinc-500 text-zinc-200 text-xl font-light">
                          {history[selectedRecordIndex].decision.text}
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col">
                        <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Terminal size={14} /> Análisis Crítico y Traslación Estructural:
                        </span>
                        <div className="p-8 bg-zinc-900/80 border border-indigo-900/50 text-indigo-50 text-xl leading-relaxed font-light shadow-inner flex-grow relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38bIxsfMwMDQAQYAAxkBR1L7fTTAAAAAElFTkSuQmCC')] opacity-10"></div>
                          <span className="text-indigo-500 font-bold mr-2">{'>'}</span> 
                          {typedAnalysis}
                          <span className="inline-block w-2 h-5 bg-indigo-500 ml-1 animate-pulse align-middle"></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-zinc-600 font-mono text-sm uppercase tracking-widest">
                      Seleccione un registro en el panel para leer el análisis.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t-2 border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="max-w-3xl">
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    El "Capitalismo de Vigilancia" se esconde detrás de palabras técnicas complicadas. Las decisiones que acabas de auditar demuestran cómo detalles de diseño aparentemente inocentes en las aplicaciones de nuestros teléfonos son en realidad túneles de extracción masiva hacia el Norte Global.
                  </p>
                </div>
                
                <button 
                  onClick={resetGame}
                  className="md:hidden flex items-center justify-center gap-3 w-full px-6 py-4 bg-zinc-900 border border-zinc-700 hover:border-lime-500 text-zinc-300 font-mono text-sm uppercase tracking-widest"
                >
                  <RotateCcw size={16} /> Iniciar Nuevo Ciclo
                </button>
              </div>

            </div>
          )}

        </main>
        
        {/* FOOTER */}
        <footer className="w-full max-w-6xl mt-16 pt-6 pb-8 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex flex-col gap-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <span>Framework Crítico: Zuboff / Srnicek / Sadowski / Nissenbaum</span>
            <span className="text-lime-500/70">Modo: Simulador Estructural Forense</span>
          </div>
          
          <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-end gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <span>Por: Kevin Alexis García</span>
              <span className="hidden md:inline text-zinc-800">|</span>
              <a href="https://lama.lat" target="_blank" rel="noreferrer" className="text-indigo-400/80 hover:text-lime-400 transition-colors underline decoration-indigo-900/50 hover:decoration-lime-500/50 underline-offset-4">
                lama.lat
              </a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
