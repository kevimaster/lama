import React, { useState, useEffect, useRef } from 'react';

const Simulador = () => {
  const [step, setCurrentStep] = useState(1);
  const [decisions, setDecisions] = useState({ step1: null, step2: null, step3: null, step4: 50, step5: null });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [panelWidth, setPanelWidth] = useState(50); 
  const [isDragging, setIsDragging] = useState(false);
  const [algorithmDeployed, setAlgorithmDeployed] = useState(false);
  const [filterMode, setFilterMode] = useState('local');
  
  const containerRef = useRef(null);

  const startDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const isMobile = window.innerWidth < 768;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (isMobile) {
        let newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        if (newHeight >= 20 && newHeight <= 80) setPanelWidth(newHeight);
      } else {
        let newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        if (newWidth >= 20 && newWidth <= 80) setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', (e) => handleMouseMove(e.touches[0]), { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const database = {
    articles: [
      { id: '1', title: "Escándalo viral: La verdad tras las influencers caleñas", url: "farandulacolombia.com/chismes", desc: "El video filtrado de las modelos que sacude las redes sociales hoy...", type: "clickbait", source: "mass", rank: 100 },
      { id: '2', title: "Turismo estético: Cali, capital de la cirugía en Colombia", url: "belleza-turismo.co", desc: "Paquetes turísticos incluyen hotel, fiesta y las mejores clínicas estéticas...", type: "commercial", source: "mass", rank: 90 },
      { id: '3', title: "Directorio de prepagos y acompañantes VIP Cali", url: "citascalivip.net", desc: "Las mujeres más hermosas de la ciudad. Contacto directo, fiestas...", type: "commercial", source: "mass", rank: 80 },
      { id: '4', title: "Las 10 caleñas más bellas de Instagram este mes", url: "revistafhm.co", desc: "Un top imperdible de las creadoras de contenido que están rompiendo internet...", type: "clickbait", source: "mass", rank: 70 },
      { id: '5', title: "Guía nocturna: Dónde encontrar la mejor fiesta en Cali", url: "rumbacali.com", desc: "Descubre los clubes donde bailan las mujeres más hermosas de la sucursal del cielo...", type: "commercial", source: "mass", rank: 60 },
      
      { id: '6', title: "El rol fundamental de la mujer en la evolución de la salsa", url: "univalle.edu.co/investigacion", desc: "Estudio sobre cómo las bailarinas definieron la identidad musical del Valle...", type: "academic", source: "local", rank: 50 },
      { id: '7', title: "Red de Mujeres Emprendedoras del Pacífico", url: "redmujerescali.org", desc: "Iniciativas de tecnología y diseño lideradas por mujeres...", type: "social", source: "local", rank: 40 },
      { id: '8', title: "Poesía y resistencia afro en el Distrito de Aguablanca", url: "colectivocultural.org", desc: "Jóvenes escritoras caleñas lanzan antología sobre racismo y feminismo...", type: "academic", source: "local", rank: 30 },
      { id: '9', title: "El América Femenino gana la liga profesional", url: "deportesvalle.gov.co", desc: "Las jugadoras caleñas hacen historia en el estadio Pascual Guerrero...", type: "social", source: "local", rank: 20 },
      { id: '10', title: "Niñas programadoras en colegios públicos de Siloé", url: "tecnologiacali.com", desc: "Laboratorios de innovación enseñan robótica a niñas en zonas vulnerables...", type: "social", source: "local", rank: 10 },
      
      { id: '11', title: "Clínicas clandestinas: El peligro de la belleza barata", url: "noticiaslocales.co/denuncia", desc: "Reportaje especial sobre el riesgo mortal de cirugías estéticas ilegales...", type: "critical", source: "local", rank: 55 },
      { id: '12', title: "Voces críticas: Turismo y mercantilización del cuerpo", url: "colectivofeministavalle.org", desc: "Análisis sobre cómo el turismo en Cali fomenta dinámicas de explotación...", type: "critical", source: "local", rank: 45 },
      { id: '13', title: "Alerta por aumento de feminicidios en el Valle del Cauca", url: "observatoriogenero.org", desc: "Cifras alarmantes exigen respuestas urgentes de la alcaldía local...", type: "critical", source: "local", rank: 35 },
      { id: '14', title: "El negocio de las webcam en Cali: Mitos y realidades", url: "economia-hoy.co", desc: "Cómo la ciudad se convirtió en potencia del modelaje webcam...", type: "commercial", source: "mass", rank: 85 },
      { id: '15', title: "Reinas de belleza caleñas históricas", url: "historiacolombia.com", desc: "Un repaso a las coronas que ha ganado el departamento...", type: "clickbait", source: "mass", rank: 65 },

      { id: '16', title: "Comedor comunitario liderado por madres cabeza de hogar", url: "fundacionsolidaria.co", desc: "Mujeres sostienen la seguridad alimentaria en el oriente de Cali...", type: "social", source: "local", rank: 25 },
      { id: '17', title: "Las mejores marcas de bikinis hechas por diseñadoras caleñas", url: "modavalle.com", desc: "Apoya el talento local este verano...", type: "commercial", source: "local", rank: 75 },
      { id: '18', title: "Investigación académica sobre brecha salarial", url: "icesi.edu.co/economia", desc: "Datos duros sobre la inequidad económica que enfrentan las mujeres en la ciudad...", type: "academic", source: "local", rank: 15 },
      { id: '19', title: "Consejos de maquillaje de expertas caleñas", url: "blogdebelleza.co", desc: "Tips para soportar el clima cálido sin perder el glamour...", type: "commercial", source: "mass", rank: 95 },
      { id: '20', title: "Documental: Las pioneras del cine en Cali", url: "cinemateca.org", desc: "Rescate histórico del trabajo detrás de cámara de las mujeres vallecaucanas...", type: "academic", source: "local", rank: 5 }
    ]
  };

  const handleDecision = (stepNumber, value) => {
    if (loading) return;
    setLoading(true);
    
    setDecisions(prev => ({ ...prev, [`step${stepNumber}`]: value }));

    setTimeout(() => {
      setLoading(false);
      if (stepNumber < 5) {
        setCurrentStep(stepNumber + 1);
        setTimeout(() => {
          document.getElementById(`step-${stepNumber + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        setAlgorithmDeployed(true);
        setTimeout(() => {
          document.getElementById('eval-btn-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }, 1000);
  };

  const resetSimulation = () => {
    setLoading(false);
    setDecisions({ step1: null, step2: null, step3: null, step4: 50, step5: null });
    setCurrentStep(1);
    setShowModal(false);
    setAlgorithmDeployed(false);
    setFilterMode('local');
    setTimeout(() => {
      document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const calculateResults = () => {
    let results = [...database.articles];

    if (decisions.step5 === 'A') {
      results = results.filter(item => item.type !== 'critical');
    }

    results.forEach(item => {
      item.score = item.rank; 
      item.logs = [];

      if (decisions.step1 === 'A' && (item.type === 'clickbait' || item.type === 'commercial')) { item.score += 20; item.logs.push('+20 Tráfico Histórico'); }
      if (decisions.step1 === 'B' && (item.type === 'academic' || item.type === 'social')) { item.score += 20; item.logs.push('+20 Diversidad Manual'); }

      if (decisions.step2 === 'A' && item.source === 'mass') { item.score += 30; item.logs.push('+30 SEO Autoridad (Presupuesto)'); }
      if (decisions.step2 === 'B' && item.source === 'local') { item.score += 30; item.logs.push('+30 Relevancia Local (Academia/Barrio)'); }

      const sliderVal = decisions.step4;
      if (item.type === 'clickbait' || item.type === 'commercial') { 
        item.score += sliderVal; 
        if (sliderVal > 0) item.logs.push(`+${sliderVal} Engagement (Fricción)`);
      } else { 
        const qualVal = 100 - sliderVal;
        item.score += qualVal; 
        if (qualVal > 0) item.logs.push(`+${qualVal} Meta Calidad Informacional`);
      }

      if (filterMode === 'foreign') {
        if (item.source === 'mass' || item.type === 'commercial') {
          item.score += 40; item.logs.push('+40 (IP Extranjero: Busca consumo)');
        }
        if (item.source === 'local' && item.type !== 'commercial') {
          item.score -= 20; item.logs.push('-20 (IP Extranjero: Invisibiliza lo local)');
        }
      }
    });

    return results.sort((a, b) => b.score - a.score);
  };

  const sortedResults = calculateResults();

  const getDiagnosis = () => {
    let commercialScore = 0;
    
    // Calculamos el índice de capitalismo/mercantilización (0 a 4)
    if (decisions.step1 === 'A') commercialScore += 1;
    if (decisions.step2 === 'A') commercialScore += 1;
    if (decisions.step4 > 60) commercialScore += 1;
    if (decisions.step5 === 'A') commercialScore += 1;

    // Calculamos métricas para las barras visuales
    const profitPercentage = decisions.step4 > 50 ? decisions.step4 : (commercialScore * 25);
    const equityPercentage = decisions.step4 < 50 ? (100 - decisions.step4) : ((4 - commercialScore) * 25);
    const brandSafetyPercentage = decisions.step5 === 'A' ? 95 : 30;

    if (commercialScore >= 3) {
      return { 
        title: "El Capitalista Perfecto", 
        subtitle: "Hegemonía y Morbo Sistematizado",
        desc: "Has creado una máquina de dinero impecable. Tu algoritmo priorizó la fricción, el engagement y el presupuesto de marketing por encima de la realidad cívica. Para la junta directiva de tu empresa eres un genio; para la sociología, eres un reproductor activo de violencia digital.", 
        consequence: "Maximizar las ganancias requirió marginar sistemáticamente las voces de las mujeres afro, el activismo y la academia local. Construiste un espejo roto que solo refleja los estereotipos hipersexualizados de Cali porque son más rentables.",
        color: "text-red-500", border: "border-red-500", bg: "bg-red-950/40",
        metrics: { profit: Math.max(85, profitPercentage), equity: Math.min(15, equityPercentage), safety: brandSafetyPercentage }
      };
    }
    if (commercialScore <= 1) {
      return { 
        title: "El Diseñador Cívico", 
        subtitle: "La Ética frente a la Escala de Ganancias",
        desc: "Diseñaste una infraestructura cívica digital hermosa. Interviniste la base de datos para corregir sesgos, empoderaste las voces locales sin presupuesto SEO y te negaste a censurar la realidad incómoda de la ciudad.", 
        consequence: "Bajo el modelo del 'Capitalismo de Vigilancia', optimizar para la equidad local no quiebra a un monopolio tecnológico, pero sí reduce su margen inmediato de ganancias por clics. Aunque en el Norte Global los resultados suelen ser más regulados y diversos, aquí la junta directiva probablemente exigirá revertir tus cambios, demostrando que la estructura corporativa presiona para priorizar la hiperrentabilidad sobre la memoria social.",
        color: "text-emerald-500", border: "border-emerald-500", bg: "bg-emerald-950/40",
        metrics: { profit: Math.min(20, profitPercentage), equity: Math.max(90, equityPercentage), safety: brandSafetyPercentage }
      };
    }
    return { 
      title: "El Centrista Corporativo", 
      subtitle: "El Espejismo de la Neutralidad",
      desc: "Trataste de no incomodar a nadie. Promediaste la fórmula matemática creyendo que el algoritmo podía ser un 'espejo neutral'. Sin embargo, al no intervenir radicalmente las asimetrías de poder (como el SEO), dejaste que el dinero de los grandes medios marcara la pauta.", 
      consequence: "Incluiste a la academia y los derechos sociales en el ecosistema, sí, pero los sepultaste en la Página 2 o 3 donde nadie hace clic. Demostraste que en la arquitectura técnica, la neutralidad siempre favorece a la hegemonía.",
      color: "text-amber-400", border: "border-amber-400", bg: "bg-amber-950/40",
      metrics: { profit: 60, equity: 45, safety: brandSafetyPercentage }
    };
  };

  const currentDiagnosis = getDiagnosis();

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-indigo-100 overflow-hidden font-sans relative">
      
      {/* SECCIÓN IZQUIERDA: CONTROLES */}
      <div className="flex flex-col overflow-y-auto" style={window.innerWidth < 768 ? { height: `${panelWidth}%` } : { width: `${panelWidth}%` }}>
        <header className="px-4 py-3 bg-indigo-950/50 backdrop-blur-md border-b border-indigo-800/50 flex justify-between items-center z-50 shrink-0 sticky top-0">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-tight font-display">
              La caja oscura abierta
            </h1>
            <p className="text-[10px] md:text-xs text-indigo-400 font-semibold mt-0.5 tracking-wide">
              Lama- Laboratorio de Mediaciones Algorítmicas
            </p>
          </div>
          <button onClick={(e) => { e.preventDefault(); resetSimulation(); }} className="text-xs bg-indigo-800/70 hover:bg-indigo-700/80 text-indigo-200 px-3 py-1.5 rounded-full transition shrink-0 ml-2 border border-indigo-700/50 relative z-[100] cursor-pointer pointer-events-auto">
            Reiniciar
          </button>
        </header>

        <div className="p-4 md:p-6 space-y-6 md:space-y-10 pb-32">
          
          {/* PASO 1 */}
          <div id="step-1" className={`relative rounded-2xl transition-all duration-500 backdrop-blur-sm ${step === 1 ? 'bg-indigo-800/80 shadow-[0_0_30px_rgba(59,130,246,0.25)] ring-2 ring-blue-400 p-5 md:p-7 transform scale-[1.02]' : 'bg-indigo-900/40 border border-indigo-800/30 hover:bg-indigo-800/60 p-4 md:p-5'}`}>
            <div className={`absolute -left-1 top-4 bottom-4 w-2 rounded-r-md transition-colors ${step === 1 ? 'bg-blue-500' : 'bg-indigo-700/50'}`}></div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950/50 px-2 py-1 rounded inline-block mb-3 border border-blue-900/50">⚙️ Ingeniero de Búsqueda</span>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-display">1. Expansión Semántica 🧠</h3>
            <p className="text-sm md:text-base text-indigo-200 mb-5 leading-relaxed">Un usuario busca "mujeres caleñas". Tienes que enseñarle a la IA qué otras palabras son sinónimas usando el historial global.</p>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${step === 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <button onClick={() => handleDecision(1, 'A')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step1 === 'A' ? 'border-blue-400 bg-gradient-to-br from-blue-900/60 to-blue-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-blue-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">A. Histórico Puro</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Relaciona términos que generan clics rápidos. Perpetúa el sesgo de la hipersexualización.</div>
              </button>
              <button onClick={() => handleDecision(1, 'B')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step1 === 'B' ? 'border-blue-400 bg-gradient-to-br from-blue-900/60 to-blue-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-blue-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">B. Diversidad Manual</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Intervienes la base para añadir equivalencias académicas o sociales.</div>
              </button>
            </div>
          </div>

          {/* PASO 2 */}
          <div id="step-2" className={`relative rounded-2xl transition-all duration-500 backdrop-blur-sm ${step === 2 ? 'bg-indigo-800/80 shadow-[0_0_30px_rgba(59,130,246,0.25)] ring-2 ring-blue-400 p-5 md:p-7 transform scale-[1.02]' : 'bg-indigo-900/40 border border-indigo-800/30 hover:bg-indigo-800/60 p-4 md:p-5'}`}>
            <div className={`absolute -left-1 top-4 bottom-4 w-2 rounded-r-md transition-colors ${step === 2 ? 'bg-blue-500' : 'bg-indigo-700/50'}`}></div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950/50 px-2 py-1 rounded inline-block mb-3 border border-blue-900/50">⚙️ Arquitecto de Índice</span>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-display">2. Definición de Autoridad 🏛️</h3>
            <p className="text-sm md:text-base text-indigo-200 mb-5 leading-relaxed">¿Qué regla matemática usarás para decidir si una web merece el codiciado "Puesto 1"?</p>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${step === 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <button onClick={() => handleDecision(2, 'A')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step2 === 'A' ? 'border-blue-400 bg-gradient-to-br from-blue-900/60 to-blue-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-blue-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">A. Poder Financiero (SEO)</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Ganan los medios grandes o clínicas que pagan miles en estrategias de enlaces.</div>
              </button>
              <button onClick={() => handleDecision(2, 'B')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step2 === 'B' ? 'border-blue-400 bg-gradient-to-br from-blue-900/60 to-blue-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-blue-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">B. Relevancia Comunitaria</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Das puntos extra a organizaciones locales aunque no tengan presupuesto técnico.</div>
              </button>
            </div>
          </div>

          {/* PASO 3 */}
          <div id="step-3" className={`relative rounded-2xl transition-all duration-500 backdrop-blur-sm border border-orange-900/30 overflow-hidden ${step === 3 ? 'bg-indigo-800/80 shadow-[0_0_30px_rgba(249,115,22,0.25)] ring-2 ring-orange-400 p-5 md:p-7 transform scale-[1.02]' : 'bg-indigo-900/40 hover:bg-indigo-800/60 p-4 md:p-5'}`}>
            <div className={`absolute -left-1 top-4 bottom-4 w-2 rounded-r-md transition-colors ${step === 3 ? 'bg-orange-500' : 'bg-indigo-700/50'}`}></div>
            <div className="absolute top-0 right-0 bg-red-900/60 text-red-200 text-[10px] px-3 py-1 font-mono font-bold border-l border-b border-red-900/30 rounded-bl-lg backdrop-blur-md">CUOTA: 1200 FOTOS/HORA</div>
            
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-orange-300 bg-orange-950/50 px-2 py-1 rounded inline-block mb-3 mt-2 border border-orange-900/50">🏷️ Anotador Tercerizado (Precariado)</span>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-display">3. El Trabajo Fantasma 👻</h3>
            <p className="text-sm md:text-base text-indigo-200 mb-5 leading-relaxed">Trabajas en una bodega en el Sur Global. Tienes 3 segundos por foto para "enseñarle" a la IA qué significan las imágenes sobre Cali.</p>
            
            <div className={`grid grid-cols-1 gap-3 ${step === 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <button onClick={() => handleDecision(3, 'A')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step3 === 'A' ? 'border-orange-400 bg-gradient-to-br from-orange-900/60 to-orange-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-orange-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">A. Etiquetado Rápido (Estereotipo)</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Para cumplir tu cuota de trabajo, etiquetas rápido: "Sensual", "Fiesta", "Bikini".</div>
              </button>
              <button onClick={() => handleDecision(3, 'B')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step3 === 'B' ? 'border-orange-400 bg-gradient-to-br from-orange-900/60 to-orange-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-orange-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">B. Análisis Cultural</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Arriesgas tu pago por leer el contexto: "Lideresa", "Folclor", "Deportista".</div>
              </button>
            </div>
          </div>

          {/* PASO 4 */}
          <div id="step-4" className={`relative rounded-2xl transition-all duration-500 backdrop-blur-sm ${step === 4 ? 'bg-indigo-800/80 shadow-[0_0_30px_rgba(59,130,246,0.25)] ring-2 ring-blue-400 p-5 md:p-7 transform scale-[1.02]' : 'bg-indigo-900/40 border border-indigo-800/30 hover:bg-indigo-800/60 p-4 md:p-5'}`}>
            <div className={`absolute -left-1 top-4 bottom-4 w-2 rounded-r-md transition-colors ${step === 4 ? 'bg-blue-500' : 'bg-indigo-700/50'}`}></div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950/50 px-2 py-1 rounded inline-block mb-3 border border-blue-900/50">⚙️ Ingeniero de Ranking</span>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-display">4. La Fórmula de la Verdad 🧮</h3>
            <p className="text-sm md:text-base text-indigo-200 mb-5 leading-relaxed">Ajusta el peso final del algoritmo. ¿Cuál es el objetivo de tu empresa tecnológica?</p>
            
            <div className={`p-4 md:p-5 bg-indigo-900/50 rounded-xl border border-indigo-800/50 ${step === 4 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-indigo-300 mb-4">
                <span className="text-emerald-400">← Calidad y Academia</span>
                <span className="text-amber-400">Clickbait Rápido ($) →</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={decisions.step4}
                onChange={(e) => setDecisions({...decisions, step4: parseInt(e.target.value)})}
                className="w-full h-3 bg-gradient-to-r from-indigo-700 to-blue-900 rounded-full appearance-none cursor-pointer accent-blue-500 mb-6 ring-2 ring-indigo-800/50"
              />
              <button 
                onClick={() => handleDecision(4, decisions.step4)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
              >
                Confirmar Ecuación Final
              </button>
            </div>
          </div>

          {/* PASO 5 */}
          <div id="step-5" className={`relative rounded-2xl transition-all duration-500 backdrop-blur-sm ${step === 5 ? 'bg-indigo-800/80 shadow-[0_0_30px_rgba(239,68,68,0.25)] ring-2 ring-red-400 p-5 md:p-7 transform scale-[1.02]' : 'bg-indigo-900/40 border border-indigo-800/30 hover:bg-indigo-800/60 p-4 md:p-5'}`}>
            <div className={`absolute -left-1 top-4 bottom-4 w-2 rounded-r-md transition-colors ${step === 5 ? 'bg-red-500' : 'bg-indigo-700/50'}`}></div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-300 bg-red-950/50 px-2 py-1 rounded inline-block mb-3 border border-red-900/50">🛡️ Equipo de Brand Safety (Policy)</span>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-display">5. Censura Corporativa 🔇</h3>
            <p className="text-sm md:text-base text-indigo-200 mb-5 leading-relaxed">Las guías corporativas prohíben la palabra "violencia". Los colectivos feministas de Cali denuncian el turismo sexual usando esa palabra.</p>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${step === 5 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <button onClick={() => handleDecision(5, 'A')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step5 === 'A' ? 'border-red-400 bg-gradient-to-br from-red-900/60 to-red-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-red-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">A. Proteger a la Marca</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Aplicas el filtro gringo: Ocultas los artículos de denuncia. Mantienes "limpia" la red.</div>
              </button>
              <button onClick={() => handleDecision(5, 'B')} className={`p-3 md:p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${decisions.step5 === 'B' ? 'border-red-400 bg-gradient-to-br from-red-900/60 to-red-800/40 shadow-md' : 'border-indigo-700/50 bg-indigo-800/40 hover:border-red-400/70 hover:bg-indigo-800/70'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-base font-bold text-white relative z-10">B. Excepción de Contexto</div>
                <div className="text-sm text-indigo-300 mt-2 relative z-10">Permites la denuncia por su valor social, arriesgando la ira de los anunciantes turísticos.</div>
              </button>
            </div>
          </div>

          {/* BOTÓN DE EVALUACIÓN FINAL */}
          {algorithmDeployed && !showModal && (
            <div id="eval-btn-container" className="mt-10 mb-4 transition-all duration-500 opacity-100 transform translate-y-0">
               <div className="bg-indigo-900/80 backdrop-blur-md border-2 border-emerald-500/40 p-6 rounded-3xl shadow-2xl text-center relative overflow-hidden group hover:border-emerald-400/60 transition-all">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <h4 className="text-emerald-400 text-xl font-black mb-3 tracking-wide uppercase font-display relative z-10">✅ Algoritmo en Producción</h4>
                   <p className="text-sm md:text-base text-indigo-200 mb-6 leading-relaxed relative z-10">
                     El buscador a la derecha ya funciona con tus reglas. Interactúa con el <strong>Filtro de IP</strong> y observa a quién diste voz y a quién silenciaste.
                   </p>
                   <button 
                      onClick={() => setShowModal(true)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-lg md:text-xl px-6 py-4 rounded-2xl shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] border-b-4 border-emerald-800 hover:border-emerald-700 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 relative z-10 cursor-pointer"
                   >
                      <span className="text-2xl animate-bounce">🔎</span> AUDITAR MI ALGORITMO
                   </button>
               </div>
            </div>
          )}
          
          <div className="mt-12 text-center text-indigo-400/70 text-[10px] md:text-xs font-medium space-y-1 hover:opacity-100 transition-opacity duration-300">
            <p>Por: Kevin Alexis García / Laboratorio de Mediaciones Algorítmicas.</p>
            <p>Escuela de Comunicación Social, Universidad del Valle, Cali, Colombia. <a href="https://lama.lat" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-200 underline underline-offset-2 transition-colors">lama.lat</a></p>
          </div>

          <div className="h-32"></div>
        </div>
      </div>

      <div 
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className={`bg-indigo-950 flex items-center justify-center transition-colors hover:bg-blue-600 ${isDragging ? 'bg-blue-500' : ''} ${window.innerWidth < 768 ? 'h-4 w-full cursor-row-resize py-1' : 'w-4 h-full cursor-col-resize px-1'} z-30 shrink-0 border-x border-indigo-800/50`}
      >
        <div className={`bg-indigo-700/50 rounded-full backdrop-blur-md ${window.innerWidth < 768 ? 'w-16 h-1.5' : 'h-16 w-1.5'}`}></div>
      </div>

      {/* SECCIÓN DERECHA: SIMULADOR (LA PANTALLA) */}
      <div 
        className="bg-slate-50 flex flex-col relative overflow-hidden" 
        style={window.innerWidth < 768 ? { height: `${100 - panelWidth}%` } : { width: `${100 - panelWidth}%` }}
      >
        <div className="bg-white border-b border-slate-200 p-2 md:p-3 flex items-center gap-3 shrink-0 shadow-sm z-10">
          <div className="flex gap-1.5 px-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
          </div>
          <div className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-800 flex justify-between shadow-inner items-center">
            <span className="font-medium truncate select-none">mujeres caleñas</span>
            <span className="ml-2 text-slate-400">🔍</span>
          </div>
          
          {decisions.step1 && (
            <div className="relative group ml-1 md:ml-2 z-[100]">
              <div className="absolute -top-3 right-0 bg-blue-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-t-lg rounded-bl-lg whitespace-nowrap animate-pulse z-10 hidden md:block shadow-sm pointer-events-none">
                ¡Haz clic para probar!
              </div>
              <div className="relative inline-block w-full">
                <select 
                  value={filterMode} 
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="block appearance-none w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-400 text-blue-800 font-bold text-[10px] md:text-sm py-2 px-2 md:px-4 pr-6 md:pr-8 rounded-full shadow-sm cursor-pointer transition-all outline-none ring-blue-200 focus:ring-4 relative z-[100] pointer-events-auto"
                >
                  <option value="local">📍 IP Local (Cali)</option>
                  <option value="foreign">✈️ IP Extranjero (Turista)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 md:px-3 text-blue-600 z-[110]">
                  <svg className="fill-current h-3 w-3 md:h-4 md:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-6 font-black text-blue-900 tracking-widest text-sm animate-pulse">RECALCULANDO REALIDAD...</p>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 bg-slate-50">
          <div className="text-slate-500 text-[10px] md:text-xs mb-4 font-medium">
            Cerca de {decisions.step5 === 'A' ? '2,449,999' : '2,450,000'} resultados (0.42 segundos) 
            {decisions.step5 === 'A' && <span className="ml-2 text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-md shadow-sm">⚠️ Brand Safety Filtered</span>}
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            {(!decisions.step1 || decisions.step1 === 'A') && <span className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium hover:bg-slate-50 cursor-pointer transition">modelos prepago cali</span>}
            {decisions.step1 === 'B' && <span className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium hover:bg-slate-50 cursor-pointer transition">mujeres emprendedoras cali</span>}
            <span className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-sm font-medium hover:bg-slate-50 cursor-pointer transition">rumba cali</span>
          </div>

          <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
            {(!decisions.step3 || decisions.step3 === 'A') ? (
               <>
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl md:text-5xl shadow-sm shrink-0 hover:shadow-md transition hover:-translate-y-1 cursor-pointer">👙</div>
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl md:text-5xl shadow-sm shrink-0 hover:shadow-md transition hover:-translate-y-1 cursor-pointer">💄</div>
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl md:text-5xl shadow-sm shrink-0 hover:shadow-md transition hover:-translate-y-1 cursor-pointer">🍸</div>
               </>
            ) : (
               <>
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl md:text-5xl shadow-sm shrink-0 hover:shadow-md transition hover:-translate-y-1 cursor-pointer">👩🏽‍🎓</div>
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl md:text-5xl shadow-sm shrink-0 hover:shadow-md transition hover:-translate-y-1 cursor-pointer">💃🏽</div>
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl md:text-5xl shadow-sm shrink-0 hover:shadow-md transition hover:-translate-y-1 cursor-pointer">💻</div>
               </>
            )}
          </div>

          <div className="space-y-6 md:space-y-8">
            {!decisions.step1 && (
               <div className="text-center py-12 opacity-50">
                 <p className="text-slate-400 italic text-sm md:text-base font-medium">El simulador está esperando tus órdenes.</p>
                 <p className="text-slate-500 text-xs md:text-sm mt-3 bg-slate-100 inline-block px-4 py-2 rounded-full animate-pulse">👈 Toma tu primera decisión en el panel izquierdo.</p>
               </div>
            )}

            {decisions.step1 && sortedResults.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="animate-fade-in-up group p-3 -mx-3 rounded-xl transition-colors hover:bg-white hover:shadow-sm" style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-green-700 text-[10px] md:text-xs tracking-wide font-medium">{item.url}</span>
                    {filterMode === 'foreign' && item.source === 'local' && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 font-bold rounded-full uppercase tracking-wider shadow-sm">Invisibilizado</span>
                    )}
                  </div>
                  <h3 className="text-[#1a0dab] text-lg md:text-xl font-medium hover:underline cursor-pointer leading-tight mb-1.5 group-hover:text-blue-800">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">{item.desc}</p>
                  
                  {/* EFECTO GOOGLE: Menú Acordeón (Collapsible Score) */}
                  {(item.score > 0 || item.logs.length > 0) && (
                    <details className="mt-2 group/score outline-none cursor-pointer">
                      <summary className="text-[11px] text-slate-500 hover:text-slate-800 list-none flex items-center gap-1 select-none inline-flex bg-slate-200/50 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors font-medium">
                        <svg className="w-3 h-3 group-open/score:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        Auditar Algoritmo
                      </summary>
                      <div className="bg-slate-100/80 border border-slate-200/80 rounded-lg p-3 mt-2 shadow-inner">
                        <div className="text-[10px] md:text-xs font-bold text-slate-700 mb-2 flex justify-between items-center border-b border-slate-200/80 pb-2">
                          <span className="flex items-center gap-1">⚖️ Score Algorítmico: <span className={`ml-1 px-1.5 py-0.5 rounded shadow-sm ${item.score > 100 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{item.score} pts</span></span>
                          <span className="text-slate-400 font-mono text-xs bg-white px-1.5 py-0.5 border border-slate-200 rounded">Rank #{index + 1}</span>
                        </div>
                        {item.logs.length > 0 && (
                          <div className="space-y-1.5 pl-1">
                            {item.logs.map((log, i) => (
                              <div key={i} className={`text-[9.5px] md:text-[11px] font-mono font-medium tracking-tight flex items-center gap-1.5 ${log.includes('Académica') || log.includes('Diversidad') ? 'text-blue-700' : log.includes('Extranjero') ? 'text-orange-700' : 'text-emerald-700'}`}>
                                <span className="opacity-40">↳</span> {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
                
                {index === 2 && (
                  <div className="py-8 flex items-center justify-center opacity-80 my-4 group">
                    <div className="h-px bg-red-300 flex-1 border-dashed border-b-2 group-hover:border-red-400 transition-colors"></div>
                    <span className="mx-4 px-3 py-1 text-red-600 text-[9px] md:text-[10px] font-black tracking-widest uppercase bg-red-50 border border-red-200 rounded-full shadow-sm group-hover:bg-red-100 group-hover:text-red-700 transition-all transform group-hover:scale-105">FIN DE LA PÁGINA 1 (El abismo de la irrelevancia)</span>
                    <div className="h-px bg-red-300 flex-1 border-dashed border-b-2 group-hover:border-red-400 transition-colors"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE AUDITORÍA FINAL MEJORADO */}
      <div className={`fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-8 transition-all duration-700 ${showModal ? 'opacity-100 bg-indigo-950/90 backdrop-blur-md' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-slate-900 border-2 ${currentDiagnosis.border} p-6 md:p-10 rounded-3xl max-w-3xl w-full shadow-2xl transform transition-all duration-700 delay-100 overflow-y-auto max-h-[90vh] relative ${showModal ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-95 opacity-0'}`}>
          <div className={`absolute top-0 left-0 w-full h-2 ${currentDiagnosis.bg.replace('/40', '')}`}></div>
          
          <div className="flex justify-between items-start mb-6 border-b border-slate-700/50 pb-4">
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">AUDITORÍA ALGORÍTMICA INDEPENDIENTE</h2>
              <h3 className={`text-2xl md:text-4xl font-black ${currentDiagnosis.color} font-display tracking-tight drop-shadow-sm`}>{currentDiagnosis.title}</h3>
              <p className="text-slate-300 font-medium text-sm md:text-base mt-1">{currentDiagnosis.subtitle}</p>
            </div>
            <div className={`text-5xl opacity-20 ${currentDiagnosis.color}`}>📊</div>
          </div>
          
          {/* Dashboard de Métricas Críticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Rentabilidad / Ads</div>
              <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${currentDiagnosis.metrics.profit}%` }}></div>
              </div>
              <div className="text-right text-xs font-mono text-emerald-400 font-bold">{currentDiagnosis.metrics.profit}%</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Equidad y Diversidad</div>
              <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${currentDiagnosis.metrics.equity}%` }}></div>
              </div>
              <div className="text-right text-xs font-mono text-blue-400 font-bold">{currentDiagnosis.metrics.equity}%</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Seguridad de Marca</div>
              <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${currentDiagnosis.metrics.safety}%` }}></div>
              </div>
              <div className="text-right text-xs font-mono text-amber-400 font-bold">{currentDiagnosis.metrics.safety}%</div>
            </div>
          </div>

          <div className={`p-5 md:p-6 rounded-2xl border ${currentDiagnosis.border} ${currentDiagnosis.bg} mb-8 relative`}>
            <p className="text-slate-100 text-sm md:text-base leading-relaxed mb-4 font-medium">{currentDiagnosis.desc}</p>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">⚠️ Consecuencia Sociotécnica:</span>
              <p className="text-slate-300 text-sm italic">"{currentDiagnosis.consequence}"</p>
            </div>
          </div>

          <div className="space-y-6 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/30">
            <h4 className="text-slate-100 font-bold text-lg font-display flex items-center gap-2">
              <span className="bg-slate-800 p-1.5 rounded-lg border border-slate-600">🗣️</span> Para debatir en el aula:
            </h4>
            <ul className="text-slate-300 text-sm md:text-base space-y-4 pl-2">
              <li className="flex gap-3 items-start">
                <span className="text-blue-400 mt-1">🔹</span>
                <span>Al ver que tu índice de "Equidad" choca directamente con la "Rentabilidad", ¿Crees que un algoritmo puede ser ético si la empresa depende del <strong>Surveillance Capitalism</strong> (vender atención a anunciantes)?</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-blue-400 mt-1">🔹</span>
                <span>Si un algoritmo invisibiliza crónicas locales y amplifica contenido hegemónico o comercial para maximizar el "engagement", ¿qué le pasa a la identidad y a la memoria de un territorio como Cali cuando el mundo entero lo busca en internet?</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-blue-400 mt-1">🔹</span>
                <span>En la fase de etiquetado (Paso 3) experimentaste la presión de tiempo. ¿Cómo crees que la precariedad laboral del <strong>trabajo fantasma</strong> en el Sur Global se traduce directamente en los sesgos (racismo, sexismo) de la inteligencia artificial?</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-blue-400 mt-1">🔹</span>
                <span>Las guías de <strong>Brand Safety</strong> (Seguridad de Marca) se redactan usualmente en Silicon Valley. ¿Qué impacto tiene sobre nuestra soberanía narrativa que una corporación extranjera decida qué denuncias sociales son consideradas "violentas" o "inapropiadas"?</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-400 mt-1">💡</span>
                <span className="text-slate-200"><strong>Agencia ciudadana:</strong> Si los motores de búsqueda no son neutrales, ¿cómo podemos forzar un cambio desde la sociedad civil? Identifica potenciales puntos de apalancamiento sociotécnico (ej. legislación estatal, activismo digital, periodismo de datos, auditorías independientes o educación) para exigir la apertura de estas "cajas negras".</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={(e) => { e.preventDefault(); resetSimulation(); }}
              className="px-8 py-4 bg-slate-200 text-slate-900 font-black rounded-xl hover:bg-white transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
            >
              <span>🔄</span> Reiniciar y Probar Otro Escenario
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Simulador;