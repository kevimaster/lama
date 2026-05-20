import React, { useState, useRef, useEffect } from 'react';
import { 
  Info, ChevronDown, ChevronUp, Image as ImageIcon, 
  Trash2, FileText, ArrowRight, ArrowLeft, Printer, 
  BookOpen, Layers, EyeOff, Camera, Sparkles, 
  Search, Compass, Fingerprint, FlaskConical, Map, CheckCircle2, Lightbulb
} from 'lucide-react';

// --- DATOS Y CONTENIDO EXTRAÍDO DEL DOCUMENTO ---
const STEPS_DATA = [
  {
    id: 1,
    icon: <Compass size={24} />,
    title: "Entorno de uso esperado",
    lente: "Ensamblaje sociotécnico (Institucional)",
    question: "¿Para quién fue diseñada esta plataforma y con qué propósito?",
    description: "Antes de tocar la interfaz, investiguen el contexto. Las decisiones de diseño responden a este contexto institucional y económico.",
    observar: [
      "Misión / visión declarada",
      "Modelo de financiación (Membresías, pauta, Estado)",
      "Audiencia declarada vs real",
      "Plataformas de distribución",
      "Posición en el ecosistema (Independiente, conglomerado)"
    ],
    example: {
      title: "Archivo clasificado: La Silla Vacía",
      content: "Nativo digital (2009). Modelo híbrido de financiación (Súperamigos, cooperación internacional), lo que le da independencia de la pauta tradicional. Dirigido a una audiencia de nicho influyente. Opera como un ensamblaje donde la plataforma web, el equipo especializado y el modelo de membresías se sostienen mutuamente."
    }
  },
  {
    id: 2,
    icon: <Fingerprint size={24} />,
    title: "Registro y entrada",
    lente: "Mediación algorítmica y Autonomía",
    question: "¿Qué pide la plataforma antes de dejarme entrar y qué me ofrece a cambio?",
    description: "Cada barrera o invitación de entrada revela prioridades. Documenten el primer contacto y cómo la plataforma convierte usuarios en datos.",
    observar: [
      "Acceso libre vs. restringido (Muros de pago)",
      "Datos solicitados (Registro, redes sociales)",
      "Cookies y políticas de rastreo",
      "Opciones de suscripción / membresía",
      "Invitaciones inmediatas (¿Qué es lo primero que piden?)"
    ],
    example: {
      title: "Archivo clasificado: La Silla Vacía",
      content: "Ofrece acceso libre (prioriza alcance) pero solicita consentimiento de cookies (dataficación pasiva). Invita a suscribirse al newsletter (estrategia de desintermediación algorítmica frente a redes sociales). Ofrece membresía 'Súperamigos' construyendo comunidad sin bloquear contenido."
    }
  },
  {
    id: 3,
    icon: <Map size={24} />,
    title: "Uso cotidiano",
    lente: "Ensamblaje y affordances en acción",
    question: "¿Qué hace visible esta interfaz, qué facilita, qué dificulta?",
    description: "Caminen por la plataforma como lo harían normalmente. Deténganse en cada pantalla y documenten sistemáticamente las jerarquías y affordances.",
    observar: [
      "Jerarquía de contenidos (Cronológico, editorial, algorítmico)",
      "Affordances de interacción (Comentar, compartir, guardar)",
      "Flujos de navegación (¿Retiene o expulsa a redes?)",
      "Elementos visuales y diseño UI",
      "Publicidad y pauta (Ubicación, segmentación)"
    ],
    example: {
      title: "Archivo clasificado: La Silla Vacía",
      content: "Jerarquiza por 'Sillas' temáticas y regionales, materializando una visión descentralizada del poder. Incluye herramientas interactivas (Tarjetón de candidatos) que superan el periodismo narrativo. Hay que observar qué redes prioriza en los botones de compartir."
    }
  },
  {
    id: 4,
    icon: <FlaskConical size={24} />,
    title: "Mediaciones algorítmicas",
    lente: "Mecanismos de Van Dijck y Bucher",
    question: "¿Dónde operan la dataficación, mercantilización y selección?",
    description: "Busquen los indicios de opacidad algorítmica. Recuerden que los algoritmos son prácticas material-discursivas integradas con decisiones editoriales.",
    observar: [
      "Dataficación: Analytics, rastreo, personalización de sesión.",
      "Mercantilización: Pauta segmentada, muros de pago premium.",
      "Selección: 'Lo más leído', 'Recomendados para ti', orden de feeds."
    ],
    example: {
      title: "Pista de investigación",
      content: "Si ven una sección de 'Te podría interesar', pregúntense: ¿Cómo decide el sistema qué mostrarme? ¿Privilegia la novedad, mi historial de clics o los intereses comerciales del medio?"
    }
  },
  {
    id: 5,
    icon: <EyeOff size={24} />,
    title: "Lo ausente",
    lente: "Política del diseño (Winner)",
    question: "¿Qué no está y por qué importa su ausencia?",
    description: "Las ausencias también son decisiones de diseño. Lo que se decide no incluir materializa relaciones de poder y supuestos sobre la audiencia.",
    observar: [
      "Funciones ausentes (ej. comentarios desactivados)",
      "Voces, regiones o comunidades no representadas",
      "Transparencia ausente (opacidad en métricas o algoritmos)",
      "Alternativas posibles"
    ],
    example: {
      title: "Pista de investigación",
      content: "Si un medio no permite comentarios, materializa una posición unidireccional sobre el periodismo. Si no tiene métricas públicas, prioriza el control editorial sobre la validación de la popularidad abierta."
    }
  },
  {
    id: 6,
    icon: <Sparkles size={24} />,
    title: "Síntesis Sociotécnica",
    lente: "Conclusión Analítica",
    question: "¿Qué configuración sociotécnica revela este walkthrough?",
    description: "Redacten un párrafo de cierre (máximo 200 palabras) integrando los hallazgos de los 5 pasos. ¿Qué configuración alternativa sería posible?",
    observar: [
      "Resumen de valores materializados",
      "Principal mecanismo algorítmico detectado",
      "Propuesta de diseño alternativo (Imaginación sociotécnica)"
    ],
    example: {
      title: "Estructura sugerida",
      content: "La plataforma [Nombre] opera como un ensamblaje que prioriza [Valor/Modelo] mediante affordances de [Ejemplo]. Su principal mediación algorítmica es [Mecanismo], lo que revela una autonomía interdependiente frente a [Plataforma/Actor]. Una configuración alternativa podría..."
    }
  }
];

// --- COMPONENTES UI MEJORADOS ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0",
    secondary: "bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-100 shadow-sm hover:-translate-y-0.5",
    ghost: "bg-transparent text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Componente para el marco introductorio
const IntroAccordion = () => {
  const [isOpen, setIsOpen] = useState(false); // Colapsado por defecto para evitar sobrecarga visual

  return (
    <div className="mb-8 rounded-3xl overflow-hidden transition-all duration-300 border border-indigo-200 shadow-lg shadow-indigo-100/50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 md:px-8 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-bold transition-colors"
      >
        <span className="flex items-center gap-3 text-lg md:text-xl tracking-wide">
          <Lightbulb size={24} className="text-emerald-400 flex-shrink-0" />
          ¿Por qué "caminar" una plataforma periodística?
        </span>
        <div className={`p-2 rounded-full bg-white/10 text-white transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-white ${isOpen ? 'max-h-[800px] border-t border-indigo-100' : 'max-h-0'}`}
      >
        <div className="p-6 md:p-8 text-base text-slate-700 leading-relaxed space-y-4 font-medium">
          <p>
            Cada vez que abren un medio o plataforma la interfaz que ven no es una ventana transparente hacia "la información". Es un <strong>entorno diseñado</strong> que pueden aprender a leer: cada botón, cada menú, cada sección, cada elemento que aparece (y cada uno que no aparece) es el resultado de decisiones de diseño que materializan valores, prioridades editoriales, modelos de negocio y relaciones de poder.
          </p>
          <p>
            Cuando un medio pone un muro de pago en la primera página esa decisión técnica materializa un modelo económico. Cuando una app de noticias te muestra "lo más leído" en lugar de "lo más importante", esa jerarquía materializa una lógica algorítmica de popularidad. Cuando el botón de compartir en WhatsApp es más grande que el botón de "leer más", el diseño está priorizando la distribución sobre la lectura profunda.
          </p>
          <p>
            La interfaz es <strong>la parte visible del ensamblaje</strong>. Debajo de lo que vemos hay código, algoritmos, bases de datos, servidores y modelos de negocio. El método de recorrido (<em>walkthrough method</em>) es una técnica sistemática para hacer visibles esas capas ocultas a partir de lo que sí podemos observar: la interfaz misma.
          </p>
        </div>
      </div>
    </div>
  );
};

const ImageUploader = ({ images, onAddImages, onRemoveImage }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));

    onAddImages(newImages);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsDragging(false);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
          <Camera size={18} className="text-indigo-500" /> Tablero de Evidencias (Capturas)
        </label>
        {images.length > 0 && (
          <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="text-sm py-1.5 px-4 rounded-lg">
            <ImageIcon size={16} /> Añadir más
          </Button>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden border-2 border-indigo-50 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm z-10">
                EVID-{idx + 1}
              </div>
              <img src={img.url} alt="Evidencia" className="w-full h-40 object-cover object-top" />
              <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  onClick={() => onRemoveImage(img.id)}
                  className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 hover:scale-110 transition-all shadow-lg"
                  title="Descartar evidencia"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); handleFileChange(e); }}
          className={`border-3 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[200px]
            ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-lg'}`}
        >
          <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600">
            <ImageIcon className="h-8 w-8" />
          </div>
          <p className="text-base font-bold text-slate-700 mb-1">Arrastra tus capturas aquí</p>
          <p className="text-sm text-slate-500">o haz clic para explorar tus archivos</p>
        </div>
      )}
    </div>
  );
};

const AccordionExample = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mt-6 rounded-2xl overflow-hidden transition-all duration-300 border border-fuchsia-200/50 shadow-sm hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r from-fuchsia-50 to-purple-50 text-purple-800 font-bold transition-colors"
      >
        <span className="flex items-center gap-3">
          <BookOpen size={20} className="text-fuchsia-500" /> {title}
        </span>
        <div className={`p-1 rounded-full bg-purple-100 text-purple-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out bg-white ${isOpen ? 'max-h-96 border-t border-fuchsia-100' : 'max-h-0'}`}
      >
        <div className="p-5 text-sm text-slate-700 leading-relaxed">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

// --- APLICACIÓN PRINCIPAL ---

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [isReportMode, setIsReportMode] = useState(false);
  const [platformName, setPlatformName] = useState("");
  const [authors, setAuthors] = useState("");
  
  const [analysisData, setAnalysisData] = useState(() => {
    const initialState = {};
    STEPS_DATA.forEach(step => {
      initialState[step.id] = { text: "", images: [] };
    });
    return initialState;
  });

  const handleTextChange = (stepId, text) => {
    setAnalysisData(prev => ({ ...prev, [stepId]: { ...prev[stepId], text } }));
  };

  const handleAddImages = (stepId, newImages) => {
    setAnalysisData(prev => ({ ...prev, [stepId]: { ...prev[stepId], images: [...prev[stepId].images, ...newImages] } }));
  };

  const handleRemoveImage = (stepId, imageId) => {
    setAnalysisData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], images: prev[stepId].images.filter(img => img.id !== imageId) }
    }));
  };

  const currentStepData = STEPS_DATA.find(s => s.id === activeStep);
  const isLastStep = activeStep === STEPS_DATA.length;

  const getProgress = () => {
    const completed = Object.values(analysisData).filter(d => d.text.trim().length > 20).length;
    return (completed / STEPS_DATA.length) * 100;
  };

  // --- VISTA DE REPORTE (SOBRIA, ACADÉMICA Y LISTA PARA PDF) ---
  if (isReportMode) {
    return (
      <div className="min-h-screen bg-slate-200 p-4 md:p-8 print:p-0 print:bg-white">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm print:shadow-none print:rounded-none">
          <div className="bg-slate-900 p-4 flex justify-between items-center print:hidden">
            <h2 className="text-white font-bold flex items-center gap-2">
              <FileText size={20} /> Vista Previa del Informe Final
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsReportMode(false)}
                className="px-4 py-2 text-sm font-bold text-white border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Volver al Laboratorio
              </button>
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={() => setTimeout(() => window.print(), 150)} 
                  className="px-4 py-2 text-sm font-bold bg-indigo-500 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-400 transition-colors shadow-sm"
                  title="Guardar como PDF o Imprimir"
                >
                  <Printer size={18} /> Guardar PDF
                </button>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  O usa el atajo Ctrl+P / Cmd+P
                </span>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16 print:p-8 text-black font-serif">
            <header className="border-b-2 border-black pb-8 mb-10 text-center">
              <div className="text-xs font-sans font-bold text-gray-500 uppercase tracking-widest mb-6">
                Universidad del Valle · Periodismo y Sociedad IV
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Análisis Sociotécnico: Método Walkthrough
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold mb-8 text-gray-700">
                Plataforma Analizada: {platformName || "[Sin definir]"}
              </h2>
              <div className="font-sans text-sm font-bold text-gray-800">
                Analizado por: <span className="font-normal">{authors || "[Nombres no registrados]"}</span>
              </div>
            </header>

            <div className="space-y-14">
              {STEPS_DATA.map((step) => {
                const data = analysisData[step.id];
                if (!data.text && data.images.length === 0) return null;
                
                return (
                  <section key={step.id} className="break-inside-avoid">
                    <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-5 font-sans uppercase tracking-wide">
                      {step.id}. {step.title}
                    </h3>
                    <div className="prose max-w-none text-gray-900 text-justify leading-relaxed mb-8 whitespace-pre-wrap">
                      {data.text ? data.text : <span className="text-gray-400 italic">Sin observaciones registradas...</span>}
                    </div>

                    {data.images.length > 0 && (
                      <div className="mt-8 mb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 font-sans">Evidencia Recolectada</h4>
                        <div className="grid grid-cols-2 gap-6">
                          {data.images.map((img, idx) => (
                            <div key={img.id} className="border border-gray-200 p-2 bg-gray-50">
                              <img src={img.url} alt={`Evidencia ${step.id}.${idx+1}`} className="w-full h-auto" />
                              <p className="text-[10px] text-center mt-2 text-gray-500 font-sans uppercase">Figura {step.id}.{idx+1}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DE LABORATORIO (LÚDICA Y MODERNA) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-200 selection:text-indigo-900 pb-12 relative overflow-hidden">
      {/* Fondo decorativo abstracto */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-200/40 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/30 blur-[120px] pointer-events-none"></div>

      {/* Navbar Superior tipo "Glassmorphism" */}
      <nav className="sticky top-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-md">
              <FlaskConical size={24} />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 tracking-tight text-lg">Análisis de plataformas <span className="text-indigo-600">periodísticas</span></h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Universidad del Valle</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-xs font-bold text-slate-400 uppercase">Progreso</div>
              <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700 ease-out"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setIsReportMode(true)} className="flex-1 md:flex-none py-2">
              <FileText size={18} /> Previsualizar PDF
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-6 relative z-10">
        
        {/* Cabecera de Metadatos */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Search size={14} /> Medio o Plataforma
            </label>
            <input 
              type="text" 
              placeholder="Ej. La Silla Vacía, Vorágine..." 
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Fingerprint size={14} /> Analizado por:
            </label>
            <input 
              type="text" 
              placeholder="Nombres del equipo..." 
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Acordeón del Marco Teórico (Justo antes del inicio del lab) */}
        <IntroAccordion />

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navegación Lateral (Timeline de Misión) */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-28">
              <h3 className="font-extrabold text-slate-800 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                <Compass size={16} className="text-indigo-500" /> Fases de Análisis
              </h3>
              
              <div className="space-y-2 relative">
                {/* Línea conectora de fondo */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 z-0 hidden md:block"></div>
                
                {STEPS_DATA.map((step) => {
                  const isActive = step.id === activeStep;
                  const isCompleted = analysisData[step.id].text.length > 20;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-4 transition-all duration-300 relative z-10 group
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-900 scale-105 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 shadow-sm
                        ${isActive ? 'bg-indigo-600 text-white shadow-indigo-300' :
                        isCompleted ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-white border border-slate-200 text-slate-400 group-hover:border-indigo-300'
                      }`}>
                        {isCompleted && !isActive ? <CheckCircle2 size={18} /> : step.id}
                      </div>
                      <div>
                        <span className={`block text-sm leading-tight transition-colors ${isActive ? 'font-bold' : 'font-semibold group-hover:text-slate-700'}`}>
                          {step.title}
                        </span>
                        {isCompleted && !isActive && <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Completado</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Área Principal de Trabajo */}
          <section className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/40 border border-slate-100 overflow-hidden flex flex-col h-full transform transition-all duration-500 relative">
              
              {/* Encabezado Dinámico de la Fase */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-8 md:p-10 text-white relative overflow-hidden">
                {/* Elemento gráfico de fondo */}
                <div className="absolute -right-10 -top-10 opacity-10 transform rotate-12 scale-150">
                  {currentStepData.icon}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-extrabold tracking-widest text-indigo-200 border border-white/10">
                      FASE 0{currentStepData.id}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <Layers size={14} /> {currentStepData.lente}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight tracking-tight">
                    {currentStepData.question}
                  </h2>
                </div>
              </div>

              {/* Contenido de la Fase */}
              <div className="p-8 md:p-10 flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                
                {/* Caja de instrucciones estilo "Misión" */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 relative">
                  <div className="absolute -top-4 left-6 bg-emerald-400 text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Search size={12} /> Qué buscar
                  </div>
                  <p className="text-slate-600 mb-5 text-lg leading-relaxed mt-2">{currentStepData.description}</p>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 font-medium">
                    {currentStepData.observar.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="mt-0.5 text-indigo-500"><CheckCircle2 size={16} /></div>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <AccordionExample title={currentStepData.example.title} content={currentStepData.example.content} />
                </div>

                {/* Área de Trabajo del Estudiante */}
                <div className="mt-10">
                  <label className="text-sm font-extrabold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-600" /> Bitácora de Hallazgos
                  </label>
                  <div className="relative">
                    <textarea
                      value={analysisData[activeStep].text}
                      onChange={(e) => handleTextChange(activeStep, e.target.value)}
                      placeholder="Registra aquí tus anotaciones. ¿Qué valores materializa esta interfaz? ¿Qué lógicas operan detrás de escena?..."
                      className="w-full h-56 p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none resize-y text-slate-700 leading-relaxed transition-all text-lg placeholder:text-slate-400"
                    ></textarea>
                    {/* Indicador de estado de llenado */}
                    <div className={`absolute bottom-6 right-6 transition-opacity duration-300 ${analysisData[activeStep].text.length > 20 ? 'opacity-100 text-emerald-500' : 'opacity-0'}`}>
                      <CheckCircle2 size={24} />
                    </div>
                  </div>

                  <ImageUploader 
                    images={analysisData[activeStep].images}
                    onAddImages={(imgs) => handleAddImages(activeStep, imgs)}
                    onRemoveImage={(imgId) => handleRemoveImage(activeStep, imgId)}
                  />
                </div>
              </div>

              {/* Barra Inferior de Navegación */}
              <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center z-10">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  className="!px-3"
                >
                  <ArrowLeft size={20} /> <span className="hidden md:inline">Anterior</span>
                </Button>
                
                {isLastStep ? (
                  <Button onClick={() => setIsReportMode(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-200 hover:shadow-emerald-300 text-white px-8">
                    <FileText size={18} /> Generar Informe Final
                  </Button>
                ) : (
                  <Button onClick={() => setActiveStep(prev => Math.min(STEPS_DATA.length, prev + 1))} className="px-8">
                    Siguiente Fase <ArrowRight size={20} />
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer de Créditos */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 pb-8 text-center relative z-10">
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Por: Kevin Alexis García / Laboratorio de Mediaciones Algorítmicas.<br/>
          Escuela de Comunicación Social, Universidad del Valle, Cali, Colombia.<br/>
          Desarrollo: Google Gemini.
        </p>
      </footer>
    </div>
  );
}