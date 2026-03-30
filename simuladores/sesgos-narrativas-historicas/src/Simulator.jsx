import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, ChevronRight, ChevronLeft, AlertCircle, Download } from 'lucide-react';

const SesgoinVisible = () => {
  const [phase, setPhase] = useState(0);
  const [selectedSources, setSelectedSources] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [checklist, setChecklist] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [reflection, setReflection] = useState('');
  const [shouldScroll, setShouldScroll] = useState(false);
  const topRef = useRef(null);

  // Temporizador
  useEffect(() => {
    if (phase > 0 && phase < 4) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Scroll controlado solo cuando shouldScroll es true
  useEffect(() => {
    if (shouldScroll && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  // Función helper para cambiar de fase con scroll
  const changePhase = (newPhase) => {
    setPhase(newPhase);
    setShouldScroll(true);
  };

  // Función helper para cambiar de pregunta con scroll
  const changeQuestion = (newQuestion) => {
    setCurrentQuestion(newQuestion);
    setShouldScroll(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Base de datos de fuentes históricas
  const sources = [
    {
      id: 1,
      title: "Texto Escolar Oficial (1965)",
      year: 1965,
      perspective: "Oficial gubernamental",
      access: "Alta",
      preview: "Periodo de inestabilidad política superado mediante acuerdos bipartidistas...",
      icon: "📚",
      bias: "eufemismo",
      voices: ["gobierno"],
      structural: false
    },
    {
      id: 2,
      title: "Texto Escolar Estándar (2015)",
      year: 2015,
      perspective: "Académica moderada",
      access: "Alta",
      preview: "Conflicto bipartidista que generó desplazamiento y víctimas civiles en zonas rurales...",
      icon: "📖",
      bias: "balanceado",
      voices: ["gobierno", "víctimas"],
      structural: true
    },
    {
      id: 3,
      title: "Testimonios Campesinos (Archivo Oral)",
      year: 1985,
      perspective: "Víctimas rurales",
      access: "Media",
      preview: "Nos quitaron todo. La tierra, la familia, la dignidad. Los pájaros llegaban de noche...",
      icon: "🎤",
      bias: "testimonial",
      voices: ["campesinos", "víctimas"],
      structural: true
    },
    {
      id: 4,
      title: "Documentos Militares Desclasificados",
      year: 1955,
      perspective: "Fuerzas Armadas",
      access: "Baja",
      preview: "Operaciones de pacificación en zonas de influencia guerrillera liberal...",
      icon: "🗂️",
      bias: "institucional",
      voices: ["militar"],
      structural: false
    },
    {
      id: 5,
      title: "Prensa Conservadora (El Siglo 1950-1953)",
      year: 1950,
      perspective: "Partido Conservador",
      access: "Media",
      preview: "Defensa de la civilización cristiana frente a hordas liberales comunistas...",
      icon: "📰",
      bias: "partidista",
      voices: ["conservadores"],
      structural: false
    },
    {
      id: 6,
      title: "Prensa Liberal (El Tiempo 1950-1953)",
      year: 1950,
      perspective: "Partido Liberal",
      access: "Media",
      preview: "Persecución sistemática contra ciudadanos liberales por parte del régimen conservador...",
      icon: "📰",
      bias: "partidista",
      voices: ["liberales"],
      structural: false
    },
    {
      id: 7,
      title: "Centro Nacional de Memoria Histórica",
      year: 2012,
      perspective: "Derechos humanos",
      access: "Alta",
      preview: "Violencia de Estado, paramilitar y guerrillera. Despojo, desplazamiento, masacres...",
      icon: "🏛️",
      bias: "crítico",
      voices: ["víctimas", "académicos", "sociedad civil"],
      structural: true
    },
    {
      id: 8,
      title: "Marco Palacios - Entre la Legitimidad y la Violencia",
      year: 1995,
      perspective: "Historiografía académica",
      access: "Media",
      preview: "Configuración histórica de exclusión política y concentración de tierra como causas...",
      icon: "📕",
      bias: "académico",
      voices: ["académicos"],
      structural: true
    },
    {
      id: 9,
      title: "María Victoria Uribe - Antropología de la Inhumanidad",
      year: 2004,
      perspective: "Antropología de la violencia",
      access: "Media",
      preview: "Rituales de sevicia, marcas corporales del terror, construcción social del enemigo...",
      icon: "📗",
      bias: "académico",
      voices: ["académicos", "víctimas"],
      structural: true
    },
    {
      id: 10,
      title: "Reportes Iglesia Católica (1950-1956)",
      year: 1953,
      perspective: "Institucional religiosa",
      access: "Media",
      preview: "Conflicto fratricida entre hijos de Dios. Llamado a la reconciliación cristiana...",
      icon: "⛪",
      bias: "moral",
      voices: ["iglesia"],
      structural: false
    },
    {
      id: 11,
      title: "Memorias de Excombatientes Liberales",
      year: 1990,
      perspective: "Guerrillas liberales",
      access: "Baja",
      preview: "Resistencia armada contra dictadura conservadora. Autodefensa campesina...",
      icon: "✊",
      bias: "beligerante",
      voices: ["guerrillas"],
      structural: false
    },
    {
      id: 12,
      title: "Infografía Educativa Digital (2020)",
      year: 2020,
      perspective: "Divulgación",
      access: "Alta",
      preview: "1948-1958: 200.000 muertos. Causas: bipartidismo, tierra, exclusión política...",
      icon: "📊",
      bias: "simplificado",
      voices: ["divulgación"],
      structural: true
    }
  ];

  const mandatoryQuestions = [
    "¿Cuáles fueron las causas de La Violencia?",
    "¿Quiénes fueron las principales víctimas?",
    "¿Qué rol tuvo el Estado?",
    "¿Cómo terminó este periodo?"
  ];

  const generateAnswer = (question, dataset) => {
    const selectedSourcesData = sources.filter(s => dataset.includes(s.id));
    
    const hasStructural = selectedSourcesData.some(s => s.structural);
    const hasVictimVoices = selectedSourcesData.some(s => s.voices.includes("víctimas") || s.voices.includes("campesinos"));
    const hasAcademic = selectedSourcesData.some(s => s.bias === "académico" || s.bias === "crítico");
    const hasOfficial = selectedSourcesData.some(s => s.bias === "eufemismo" || s.bias === "institucional");
    const hasPartisan = selectedSourcesData.some(s => s.bias === "partidista");
    const hasMilitary = selectedSourcesData.some(s => s.voices.includes("militar"));
    
    let answer = "";
    let sourcesUsed = [];

    if (question === "¿Cuáles fueron las causas de La Violencia?") {
      if (hasStructural && hasAcademic) {
        answer = "Las causas de La Violencia son múltiples y estructurales: la histórica concentración de la tierra desde la época colonial, el cierre del sistema político bipartidista que impedía la participación de otros sectores, la exclusión sistemática de campesinos y trabajadores de las decisiones políticas, y el uso instrumental de identidades partidistas por parte de élites regionales para disputar el control de recursos. El asesinato de Jorge Eliécer Gaitán en 1948 fue el detonante, pero las causas profundas se remontan décadas atrás.";
        sourcesUsed = selectedSourcesData.filter(s => s.structural).map(s => s.id);
      } else if (hasPartisan && !hasAcademic) {
        answer = "La Violencia fue causada principalmente por el conflicto entre los partidos Liberal y Conservador. Cada partido culpó al otro de iniciar las hostilidades. Los conservadores argumentaban defender la civilización cristiana, mientras los liberales denunciaban persecución política. El asesinato de Gaitán desató el conflicto abierto entre las bases partidistas.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "partidista").map(s => s.id);
      } else if (hasOfficial) {
        answer = "La Violencia surgió como un periodo de inestabilidad política derivado de tensiones bipartidistas. Factores como la polarización ideológica y el fanatismo de las bases populares generaron enfrentamientos. El proceso fue gradualmente superado mediante acuerdos entre las élites de ambos partidos.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "eufemismo" || s.bias === "institucional").map(s => s.id);
      } else {
        answer = "La Violencia tuvo causas relacionadas con el conflicto entre liberales y conservadores, problemas de tierra y el asesinato de Jorge Eliécer Gaitán en 1948. Diferentes sectores tienen interpretaciones diversas sobre las responsabilidades.";
        sourcesUsed = dataset.slice(0, 3);
      }
    }

    if (question === "¿Quiénes fueron las principales víctimas?") {
      if (hasVictimVoices && hasAcademic) {
        answer = "Las principales víctimas fueron campesinos y trabajadores rurales, especialmente en regiones como el Tolima, Caldas, Valle y los Llanos Orientales. Se estima que entre 200.000 y 300.000 personas murieron, y cientos de miles fueron desplazadas de sus tierras. Las mujeres sufrieron violencia sexual sistemática como arma de guerra. Comunidades indígenas y afrodescendientes también fueron afectadas, aunque sus testimonios han sido históricamente invisibilizados.";
        sourcesUsed = selectedSourcesData.filter(s => s.voices.includes("víctimas") || s.voices.includes("campesinos")).map(s => s.id);
      } else if (hasPartisan) {
        answer = "Las víctimas principales fueron miembros de ambos partidos políticos. Los liberales fueron perseguidos bajo gobiernos conservadores, y los conservadores sufrieron represalias en zonas de influencia liberal. Militantes de base de ambos bandos pagaron con sus vidas el conflicto.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "partidista").map(s => s.id);
      } else if (hasOfficial) {
        answer = "La población civil en general fue afectada por el periodo de violencia. Aproximadamente 200.000 personas fallecieron en enfrentamientos relacionados con el conflicto bipartidista. El proceso generó desplazamientos internos y afectación del tejido social.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "eufemismo").map(s => s.id);
      } else {
        answer = "Las víctimas fueron principalmente población civil, con estimaciones de 200.000 a 300.000 muertos. Campesinos y habitantes rurales fueron los más afectados.";
        sourcesUsed = dataset.slice(0, 2);
      }
    }

    if (question === "¿Qué rol tuvo el Estado?") {
      if (hasMilitary || hasOfficial) {
        answer = "El Estado actuó como garante del orden público mediante operaciones de pacificación en zonas de conflicto. Las Fuerzas Armadas realizaron operaciones para controlar grupos armados irregulares. Se implementaron políticas para restaurar la autoridad legítima en regiones afectadas.";
        sourcesUsed = selectedSourcesData.filter(s => s.voices.includes("militar") || s.bias === "institucional").map(s => s.id);
      } else if (hasAcademic || hasVictimVoices) {
        answer = "El Estado tuvo un rol activo y complejo: fue perpetrador directo de violencia a través de policías y militares ('chulavitas', 'pájaros'), facilitador de grupos paramilitares conservadores, y responsable de permitir masacres contra población civil liberal. Al mismo tiempo, en regiones liberales, autoridades locales toleraron o participaron en violencia contra conservadores. El Estado falló en su obligación de proteger a la población civil y, en muchos casos, fue parte activa del conflicto. La militarización bajo Rojas Pinilla tampoco detuvo la violencia, sino que la reconfiguró.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "crítico" || s.bias === "académico" || s.voices.includes("víctimas")).map(s => s.id);
      } else {
        answer = "El Estado enfrentó dificultades para mantener el orden durante el periodo de violencia. Su rol fue complejo y está sujeto a diferentes interpretaciones según las fuentes históricas consultadas.";
        sourcesUsed = dataset.slice(0, 2);
      }
    }

    if (question === "¿Cómo terminó este periodo?") {
      if (hasOfficial || hasPartisan) {
        answer = "La Violencia terminó gracias al Frente Nacional (1958-1974), un acuerdo político entre liberales y conservadores para alternarse el poder presidencial y repartirse paritariamente todos los cargos públicos. Este pacto entre élites permitió la desmovilización de algunos grupos armados y la reducción de enfrentamientos directos.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "eufemismo" || s.bias === "partidista").map(s => s.id);
      } else if (hasAcademic) {
        answer = "El periodo de La Violencia bipartidista tradicional se redujo con el Frente Nacional (1958), pero no 'terminó' realmente. El acuerdo entre élites liberales y conservadoras cerró aún más el sistema político, excluyendo a otros sectores sociales. Muchas guerrillas campesinas no se desmovilizaron y evolucionaron hacia las guerrillas de izquierda de los años 60 (FARC, ELN). El conflicto armado cambió de naturaleza, pero la violencia estructural y el despojo continuaron. Podría decirse que La Violencia se transformó más que terminó.";
        sourcesUsed = selectedSourcesData.filter(s => s.bias === "académico" || s.structural).map(s => s.id);
      } else {
        answer = "La Violencia disminuyó con el acuerdo del Frente Nacional en 1958, aunque algunos grupos armados continuaron activos y la violencia tomó otras formas en las décadas siguientes.";
        sourcesUsed = dataset.slice(0, 3);
      }
    }

    return { answer, sourcesUsed };
  };

  const generateBalancedAnswer = (question) => {
    const balancedDataset = [2, 3, 7, 8, 9];
    return generateAnswer(question, balancedDataset);
  };

  // Función para descargar reporte en formato DOCX
  const downloadReport = () => {
    const selectedSourcesData = sources.filter(s => selectedSources.includes(s.id));
    
    const analysis = {
      hasStructural: selectedSourcesData.some(s => s.structural),
      hasVictimVoices: selectedSourcesData.some(s => s.voices.includes("víctimas") || s.voices.includes("campesinos")),
      hasAcademic: selectedSourcesData.some(s => s.bias === "académico" || s.bias === "crítico"),
      hasOfficial: selectedSourcesData.some(s => s.bias === "eufemismo" || s.bias === "institucional"),
      perspectives: [...new Set(selectedSourcesData.flatMap(s => s.voices))],
      biasTypes: [...new Set(selectedSourcesData.map(s => s.bias))]
    };

    const recommendations = [];
    if (!analysis.hasStructural) {
      recommendations.push("Tu dataset carece de análisis de causas estructurales.");
    }
    if (!analysis.hasVictimVoices) {
      recommendations.push("Las voces de las víctimas están ausentes.");
    }
    if (analysis.hasOfficial && !analysis.hasAcademic) {
      recommendations.push("Predominan fuentes oficiales/institucionales sin contrapeso académico crítico.");
    }
    if (analysis.perspectives.length < 4) {
      recommendations.push("Tu dataset tiene baja diversidad de perspectivas.");
    }
    if (recommendations.length === 0) {
      recommendations.push("Tu selección muestra balance entre diferentes perspectivas.");
    }

    const checklistLabels = {
      agency: 'Agencia campesina',
      structural: 'Causas estructurales',
      state: 'Violencia de Estado',
      women: 'Voces de mujeres',
      colonial: 'Contextualización colonial',
      language: 'Lenguaje directo',
      absences: 'Grupos indígenas/afros',
      stereotypes: 'Evita estereotipos'
    };

    // Crear contenido HTML para DOCX
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #5C8607; border-bottom: 3px solid #5C8607; padding-bottom: 10px; }
    h2 { color: #343F1E; margin-top: 30px; border-bottom: 2px solid #C8DBA8; padding-bottom: 5px; }
    h3 { color: #5C8607; margin-top: 20px; }
    .header { background-color: #E8F0D7; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
    .section { margin-bottom: 30px; }
    .source-item { background-color: #F5F0E1; padding: 10px; margin: 10px 0; border-left: 4px solid #5C8607; }
    .recommendation { background-color: #FDFAF1; padding: 10px; margin: 10px 0; border-left: 4px solid #5C8607; }
    .warning { border-left-color: #8B6914; }
    .success { border-left-color: #5C8607; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td, th { padding: 10px; text-align: left; border-bottom: 1px solid #D4D1C5; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #5C8607; text-align: center; color: #343F1E; }
  </style>
</head>
<body>
  <div class="header">
    <h1>EL SESGO INVISIBLE - REPORTE FINAL</h1>
    <p><strong>Laboratorio de Mediaciones Algorítmicas (LAMA)</strong></p>
    <p>Universidad del Valle, Colombia</p>
  </div>

  <div class="section">
    <h2>TIEMPO TOTAL EMPLEADO</h2>
    <p style="font-size: 24px; color: #5C8607;"><strong>${formatTime(timeElapsed)}</strong></p>
  </div>

  <div class="section">
    <h2>DATASET SELECCIONADO</h2>
    ${selectedSourcesData.map((s, i) => `
      <div class="source-item">
        <strong>${i+1}. ${s.title}</strong> (${s.year})<br>
        <em>Perspectiva: ${s.perspective}</em>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>ANÁLISIS DE DIVERSIDAD</h2>
    <h3>Perspectivas incluidas:</h3>
    <p>${analysis.perspectives.join(', ')}</p>
    
    <h3>Tipos de sesgo presentes:</h3>
    <p>${analysis.biasTypes.join(', ')}</p>
    
    <table>
      <tr>
        <td><strong>Análisis estructural</strong></td>
        <td style="color: ${analysis.hasStructural ? '#5C8607' : '#8B4513'}">
          ${analysis.hasStructural ? '✓ Presente' : '✗ Ausente'}
        </td>
      </tr>
      <tr>
        <td><strong>Voces de víctimas</strong></td>
        <td style="color: ${analysis.hasVictimVoices ? '#5C8607' : '#8B4513'}">
          ${analysis.hasVictimVoices ? '✓ Presente' : '✗ Ausente'}
        </td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>AUTOEVALUACIÓN CRÍTICA</h2>
    <table>
      ${Object.entries(checklist).map(([key, value]) => `
        <tr>
          <td><strong>${checklistLabels[key]}</strong></td>
          <td style="color: ${value === 'yes' ? '#5C8607' : '#8B4513'}">
            ${value === 'yes' ? '✓ SÍ' : '✗ NO'}
          </td>
        </tr>
      `).join('')}
    </table>
  </div>

  <div class="section">
    <h2>RECOMENDACIONES PARA USO RESPONSABLE DE IA</h2>
    ${recommendations.map(rec => `
      <div class="recommendation ${rec.startsWith('Tu') || rec.startsWith('Las') || rec.startsWith('Predominan') ? 'warning' : 'success'}">
        ${rec}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>RESPUESTAS GENERADAS</h2>
    ${questions.map((q, i) => `
      <h3>Pregunta ${i+1}: ${q.question}</h3>
      
      <div style="background-color: #F5F0E1; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <strong>Tu IA respondió:</strong><br>
        ${q.userAnswer.answer}
      </div>
      
      <div style="background-color: #E8F0D7; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <strong>IA balanceada respondió:</strong><br>
        ${q.balancedAnswer.answer}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>REFLEXIÓN FINAL</h2>
    <div style="background-color: #F5F0E1; padding: 20px; border-radius: 5px;">
      ${reflection || '<em>(No se escribió reflexión)</em>'}
    </div>
  </div>

  <div class="section">
    <h2>PRINCIPIOS CLAVE PARA RECORDAR</h2>
    <ol>
      <li>Toda IA es entrenada con datos sesgados que reflejan relaciones de poder existentes</li>
      <li>Los algoritmos amplifican las voces ya dominantes e invisibilizan las marginadas</li>
      <li>El profesor de historia es mediador crítico indispensable, no facilitador pasivo</li>
      <li>La verificación constante y la multiperspectividad son responsabilidades éticas</li>
    </ol>
  </div>

  <div class="footer">
    <p><strong>Generado por: LAMA - Laboratorio de Mediaciones Algorítmicas</strong></p>
    <p>Universidad del Valle, Colombia</p>
  </div>
</body>
</html>
    `;

    // Crear y descargar como HTML con extensión .doc (compatible con Word)
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-sesgo-invisible-${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // FASE 0: BIENVENIDA
  const WelcomePhase = () => (
    <div className="max-w-4xl mx-auto">
      <div className="p-8 rounded-lg mb-6" style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}>
        <h1 className="text-3xl font-bold mb-4">El Sesgo Invisible</h1>
        <p className="text-lg">Simulador de Sesgos Algorítmicos en Narrativas Históricas</p>
      </div>

      <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
        <h2 className="text-2xl font-bold mb-4" style={{color: '#343F1E'}}>Contexto del ejercicio</h2>
        <p className="mb-4" style={{color: '#343F1E'}}>
          Imagina que eres profesor de historia en grado 9° y decides usar Inteligencia Artificial 
          para generar contenidos sobre <strong>La Violencia (1948-1958)</strong>.
        </p>
        <p className="mb-4" style={{color: '#343F1E'}}>
          Pero aquí está el problema: <strong>toda IA es entrenada con datos</strong>, y esos datos 
          determinan qué narrativas puede producir, qué voces amplifica y cuáles silencia.
        </p>
        
        <div className="border-l-4 p-4 mb-4" style={{backgroundColor: '#F5F0E1', borderColor: '#5C8607'}}>
          <div className="flex items-start">
            <AlertCircle className="mr-3 flex-shrink-0 mt-1" style={{color: '#5C8607'}} size={20} />
            <div>
              <p className="font-semibold" style={{color: '#343F1E'}}>Tu misión:</p>
              <p style={{color: '#343F1E'}}>
                Construir el dataset con el que se "entrenará" una IA, hacer preguntas históricas, 
                y descubrir qué sesgos y ausencias genera tu selección.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg mb-4" style={{backgroundColor: '#E8F0D7'}}>
          <h3 className="font-bold mb-2" style={{color: '#343F1E'}}>Estructura del ejercicio (25 minutos):</h3>
          <ol className="list-decimal list-inside space-y-2" style={{color: '#343F1E'}}>
            <li><strong>Fase 1:</strong> Selecciona 5 fuentes de 12 disponibles (8 minutos)</li>
            <li><strong>Fase 2:</strong> Interroga a tu IA y compara con IA balanceada (12 minutos)</li>
            <li><strong>Fase 3:</strong> Realiza una autoevaluación crítica (5 minutos)</li>
          </ol>
        </div>

        <div className="border-l-4 p-4" style={{backgroundColor: '#F5F0E1', borderColor: '#5C8607'}}>
          <p style={{color: '#343F1E'}}>
            <strong>Pregunta central:</strong> Si tus futuros estudiantes usan IA sin comprensión crítica 
            de sus sesgos, ¿qué narrativas históricas estarán consumiendo y reproduciendo?
          </p>
        </div>
      </div>

      <button
        onClick={() => changePhase(1)}
        className="w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
        style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#4A6B05'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#5C8607'}
      >
        Comenzar Ejercicio
        <ChevronRight className="ml-2" />
      </button>
    </div>
  );

  // FASE 1: SELECCIÓN
  const SourceSelectionPhase = () => {
    const toggleSource = (id) => {
      if (selectedSources.includes(id)) {
        setSelectedSources(selectedSources.filter(s => s !== id));
      } else if (selectedSources.length < 5) {
        setSelectedSources([...selectedSources, id]);
      }
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{color: '#343F1E'}}>Fase 1: Construye tu dataset</h2>
              <p style={{color: '#343F1E'}}>Selecciona exactamente 5 fuentes para entrenar tu IA</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{color: '#5C8607'}}>{selectedSources.length}/5</div>
              <div className="text-sm" style={{color: '#343F1E'}}>fuentes seleccionadas</div>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-6" style={{backgroundColor: '#E8F0D7'}}>
            <p style={{color: '#343F1E'}}>
              <strong>Tema:</strong> La Violencia en Colombia (1948-1958) para estudiantes de grado 9°
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {sources.map(source => (
            <div
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedSources.includes(source.id)
                  ? 'shadow-lg'
                  : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor: selectedSources.includes(source.id) ? '#C8DBA8' : '#FDFAF1',
                borderColor: selectedSources.includes(source.id) ? '#5C8607' : '#D4D1C5'
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-3xl">{source.icon}</div>
                {selectedSources.includes(source.id) && (
                  <CheckCircle style={{color: '#5C8607'}} size={24} />
                )}
              </div>
              
              <h3 className="font-bold mb-2 text-sm" style={{color: '#343F1E'}}>{source.title}</h3>
              
              <div className="space-y-1 mb-3">
                <div className="flex items-center text-xs">
                  <span className="font-semibold w-24" style={{color: '#343F1E'}}>Año:</span>
                  <span style={{color: '#343F1E'}}>{source.year}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="font-semibold w-24" style={{color: '#343F1E'}}>Perspectiva:</span>
                  <span style={{color: '#343F1E'}}>{source.perspective}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="font-semibold w-24" style={{color: '#343F1E'}}>Accesibilidad:</span>
                  <span className={`font-semibold`} style={{
                    color: source.access === 'Alta' ? '#5C8607' :
                           source.access === 'Media' ? '#8B6914' :
                           '#A0522D'
                  }}>{source.access}</span>
                </div>
              </div>

              <div className="p-2 rounded italic" style={{backgroundColor: '#F5F0E1', color: '#343F1E', fontSize: '14px', lineHeight: '1.4'}}>
                "{source.preview}"
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => changePhase(0)}
            className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            style={{backgroundColor: '#D4D1C5', color: '#343F1E'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#C4C1B5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#D4D1C5'}
          >
            <ChevronLeft className="mr-2" />
            Volver
          </button>
          
          <button
            onClick={() => {
              if (selectedSources.length === 5) {
                changePhase(2);
              }
            }}
            disabled={selectedSources.length !== 5}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
              selectedSources.length !== 5 ? 'cursor-not-allowed opacity-50' : ''
            }`}
            style={{
              backgroundColor: selectedSources.length === 5 ? '#5C8607' : '#D4D1C5',
              color: selectedSources.length === 5 ? '#FDFAF1' : '#343F1E'
            }}
            onMouseEnter={(e) => {
              if (selectedSources.length === 5) e.target.style.backgroundColor = '#4A6B05';
            }}
            onMouseLeave={(e) => {
              if (selectedSources.length === 5) e.target.style.backgroundColor = '#5C8607';
            }}
          >
            Continuar a Interrogación
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // FASE 2: INTERROGACIÓN
  const InterrogationPhase = () => {
    useEffect(() => {
      if (questions.length === 0) {
        const generatedAnswers = mandatoryQuestions.map(q => ({
          question: q,
          userAnswer: generateAnswer(q, selectedSources),
          balancedAnswer: generateBalancedAnswer(q)
        }));
        setQuestions(generatedAnswers);
      }
    }, []);

    if (questions.length === 0) {
      return <div className="text-center p-8">Generando respuestas...</div>;
    }

    const currentAnswer = questions[currentQuestion];
    if (!currentAnswer) return <div className="text-center p-8">Cargando pregunta...</div>;

    return (
      <div className="max-w-6xl mx-auto">
        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <h2 className="text-2xl font-bold mb-2" style={{color: '#343F1E'}}>Fase 2: Interroga tu IA</h2>
          <p style={{color: '#343F1E'}}>Compara las respuestas de tu IA con una IA entrenada con dataset balanceado</p>
        </div>

        <div className="p-6 rounded-lg mb-6" style={{backgroundColor: '#E8F0D7'}}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{color: '#343F1E'}}>
              Pregunta {currentQuestion + 1} de {mandatoryQuestions.length}
            </h3>
            <div className="text-sm" style={{color: '#343F1E'}}>
              {currentQuestion + 1}/{mandatoryQuestions.length}
            </div>
          </div>
          <p className="text-lg font-semibold" style={{color: '#343F1E'}}>{currentAnswer.question}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-lg shadow-lg overflow-hidden" style={{border: '2px solid #5C8607'}}>
            <div className="p-4" style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}>
              <h4 className="font-bold text-lg">Tu IA (Dataset personalizado)</h4>
            </div>
            <div className="p-6" style={{backgroundColor: '#FDFAF1'}}>
              <p className="mb-4 leading-relaxed" style={{color: '#343F1E'}}>{currentAnswer.userAnswer.answer}</p>
              
              <div className="border-t pt-4" style={{borderColor: '#D4D1C5'}}>
                <p className="text-sm font-semibold mb-2" style={{color: '#343F1E'}}>Fuentes utilizadas:</p>
                <div className="space-y-2">
                  {currentAnswer.userAnswer.sourcesUsed.map(sourceId => {
                    const source = sources.find(s => s.id === sourceId);
                    return (
                      <div key={sourceId} className="flex items-center text-sm">
                        <span className="mr-2">{source.icon}</span>
                        <span style={{color: '#343F1E'}}>{source.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-lg overflow-hidden" style={{border: '2px solid #5C8607'}}>
            <div className="p-4" style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}>
              <h4 className="font-bold text-lg">IA con dataset balanceado</h4>
            </div>
            <div className="p-6" style={{backgroundColor: '#FDFAF1'}}>
              <p className="mb-4 leading-relaxed" style={{color: '#343F1E'}}>{currentAnswer.balancedAnswer.answer}</p>
              
              <div className="border-t pt-4" style={{borderColor: '#D4D1C5'}}>
                <p className="text-sm font-semibold mb-2" style={{color: '#343F1E'}}>Fuentes utilizadas:</p>
                <div className="space-y-2">
                  {currentAnswer.balancedAnswer.sourcesUsed.map(sourceId => {
                    const source = sources.find(s => s.id === sourceId);
                    return (
                      <div key={sourceId} className="flex items-center text-sm">
                        <span className="mr-2">{source.icon}</span>
                        <span style={{color: '#343F1E'}}>{source.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                changeQuestion(currentQuestion - 1);
              } else {
                changePhase(1);
              }
            }}
            className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            style={{backgroundColor: '#D4D1C5', color: '#343F1E'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#C4C1B5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#D4D1C5'}
          >
            <ChevronLeft className="mr-2" />
            {currentQuestion > 0 ? 'Pregunta anterior' : 'Volver a selección'}
          </button>
          
          <button
            onClick={() => {
              if (currentQuestion < mandatoryQuestions.length - 1) {
                changeQuestion(currentQuestion + 1);
              } else {
                changePhase(3);
              }
            }}
            className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4A6B05'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#5C8607'}
          >
            {currentQuestion < mandatoryQuestions.length - 1 ? 'Siguiente pregunta' : 'Ir a autoevaluación'}
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // FASE 3: AUTOEVALUACIÓN
  const SelfEvaluationPhase = () => {
    const checklistItems = [
      { 
        id: 'agency', 
        question: '¿Mi IA menciona agencia campesina?',
        optionYes: 'Sí, menciona agencia campesina',
        optionNo: 'No, solo victimización pasiva'
      },
      { 
        id: 'structural', 
        question: '¿Aparecen causas estructurales?',
        optionYes: 'Sí, causas estructurales (tierra, exclusión)',
        optionNo: 'No, solo eventos detonantes'
      },
      { 
        id: 'state', 
        question: '¿Se nombra la violencia de Estado?',
        optionYes: 'Sí, se nombra violencia de Estado',
        optionNo: 'No, solo enfrentamientos entre partidos'
      },
      { 
        id: 'women', 
        question: '¿Hay voces de mujeres en la narrativa?',
        optionYes: 'Sí, hay voces de mujeres',
        optionNo: 'No, están ausentes'
      },
      { 
        id: 'colonial', 
        question: '¿Se contextualiza con colonialidad/despojo agrario?',
        optionYes: 'Sí, contextualiza larga duración',
        optionNo: 'No, se limita al periodo'
      },
      { 
        id: 'language', 
        question: '¿El lenguaje sobre la violencia es directo?',
        optionYes: 'Sí, lenguaje directo',
        optionNo: 'No, lenguaje eufemístico'
      },
      { 
        id: 'absences', 
        question: '¿Están presentes grupos indígenas/afros?',
        optionYes: 'Sí, están presentes',
        optionNo: 'No, están ausentes'
      },
      { 
        id: 'stereotypes', 
        question: '¿La respuesta evita reforzar estereotipos?',
        optionYes: 'Sí, evita estereotipos',
        optionNo: 'No, podría reforzarlos'
      }
    ];

    const toggleCheckValue = (id, value) => {
      setChecklist({...checklist, [id]: value});
    };

    const answeredCount = Object.keys(checklist).length;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <h2 className="text-2xl font-bold mb-2" style={{color: '#343F1E'}}>Fase 3: Realiza una autoevaluación crítica</h2>
          <p style={{color: '#343F1E'}}>Analiza críticamente las respuestas generadas por tu IA</p>
        </div>

        <div className="border-l-4 p-6 mb-6" style={{backgroundColor: '#F5F0E1', borderColor: '#5C8607'}}>
          <p style={{color: '#343F1E'}}>
            <strong>Reflexiona:</strong> Revisa las respuestas que generó tu IA en la fase anterior 
            y responde Sí o No según lo que observaste en las narrativas producidas.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold" style={{color: '#343F1E'}}>Checklist de análisis crítico</h3>
              <span className="text-sm" style={{color: '#343F1E'}}>{answeredCount}/{checklistItems.length} respondidas</span>
            </div>
            <div className="w-full rounded-full h-2" style={{backgroundColor: '#D4D1C5'}}>
              <div 
                className="h-2 rounded-full transition-all"
                style={{width: `${(answeredCount / checklistItems.length) * 100}%`, backgroundColor: '#5C8607'}}
              />
            </div>
          </div>

          <div className="space-y-4">
            {checklistItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-lg border-2"
                style={{
                  backgroundColor: '#FDFAF1',
                  borderColor: checklist[item.id] !== undefined ? '#5C8607' : '#D4D1C5'
                }}
              >
                <p className="font-semibold mb-3" style={{color: '#343F1E'}}>{item.question}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleCheckValue(item.id, 'yes')}
                    className="p-3 rounded-lg border-2 transition-all font-medium"
                    style={{
                      backgroundColor: checklist[item.id] === 'yes' ? '#C8DBA8' : '#FDFAF1',
                      borderColor: checklist[item.id] === 'yes' ? '#5C8607' : '#D4D1C5',
                      color: '#343F1E'
                    }}
                  >
                    ✓ {item.optionYes}
                  </button>
                  
                  <button
                    onClick={() => toggleCheckValue(item.id, 'no')}
                    className="p-3 rounded-lg border-2 transition-all font-medium"
                    style={{
                      backgroundColor: checklist[item.id] === 'no' ? '#F5E6E6' : '#FDFAF1',
                      borderColor: checklist[item.id] === 'no' ? '#8B4513' : '#D4D1C5',
                      color: '#343F1E'
                    }}
                  >
                    ✗ {item.optionNo}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg mb-6" style={{backgroundColor: '#E8F0D7'}}>
          <h3 className="font-bold mb-3" style={{color: '#343F1E'}}>Pregunta final de reflexión:</h3>
          <p className="mb-2" style={{color: '#343F1E'}}>
            Basándote en lo que observaste en las respuestas de tu IA:
          </p>
          <p className="text-lg font-semibold mb-4" style={{color: '#343F1E'}}>
            ¿Qué riesgos pedagógicos identificas si usaras esta IA sin mediación crítica 
            en una clase real de historia?
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full mt-4 p-4 border-2 rounded-lg focus:outline-none"
            style={{
              borderColor: '#5C8607',
              backgroundColor: '#FDFAF1',
              color: '#343F1E'
            }}
            rows="4"
            placeholder="Escribe tu reflexión aquí..."
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => changePhase(2)}
            className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            style={{backgroundColor: '#D4D1C5', color: '#343F1E'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#C4C1B5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#D4D1C5'}
          >
            <ChevronLeft className="mr-2" />
            Volver a preguntas
          </button>
          
          <button
            onClick={() => changePhase(4)}
            className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
            style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4A6B05'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#5C8607'}
          >
            Ver reporte final
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // FASE 4: REPORTE FINAL
  const FinalReportPhase = () => {
    const selectedSourcesData = sources.filter(s => selectedSources.includes(s.id));
    
    const analysis = {
      hasStructural: selectedSourcesData.some(s => s.structural),
      hasVictimVoices: selectedSourcesData.some(s => s.voices.includes("víctimas") || s.voices.includes("campesinos")),
      hasAcademic: selectedSourcesData.some(s => s.bias === "académico" || s.bias === "crítico"),
      hasOfficial: selectedSourcesData.some(s => s.bias === "eufemismo" || s.bias === "institucional"),
      perspectives: [...new Set(selectedSourcesData.flatMap(s => s.voices))],
      biasTypes: [...new Set(selectedSourcesData.map(s => s.bias))]
    };

    const recommendations = [];
    
    if (!analysis.hasStructural) {
      recommendations.push("⚠️ Tu dataset carece de análisis de causas estructurales. Considera incluir fuentes académicas que contextualicen La Violencia en procesos históricos de larga duración.");
    }
    
    if (!analysis.hasVictimVoices) {
      recommendations.push("⚠️ Las voces de las víctimas están ausentes. Sin testimonios directos, la narrativa puede invisibilizar el sufrimiento concreto y la agencia de quienes vivieron la violencia.");
    }
    
    if (analysis.hasOfficial && !analysis.hasAcademic) {
      recommendations.push("⚠️ Predominan fuentes oficiales/institucionales sin contrapeso académico crítico. Esto puede reproducir eufemismos y minimizar responsabilidades estatales.");
    }

    if (analysis.perspectives.length < 4) {
      recommendations.push("⚠️ Tu dataset tiene baja diversidad de perspectivas. Una narrativa histórica robusta requiere múltiples voces y posiciones.");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ Tu selección muestra balance entre diferentes perspectivas y tipos de fuentes.");
      recommendations.push("✅ Has incluido análisis estructural y voces diversas.");
      recommendations.push("💡 Aún así, recuerda que toda IA tiene limitaciones. La mediación docente crítica es indispensable.");
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-8 rounded-lg mb-6" style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}>
          <h1 className="text-3xl font-bold mb-2">Reporte final</h1>
          <p className="text-lg">Análisis de tu dataset y recomendaciones</p>
        </div>

        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: '#343F1E'}}>Tiempo total empleado</h2>
          <div className="flex items-center justify-center p-6 rounded-lg" style={{backgroundColor: '#E8F0D7'}}>
            <Clock size={48} style={{color: '#5C8607'}} className="mr-4" />
            <div className="text-5xl font-bold" style={{color: '#5C8607'}}>{formatTime(timeElapsed)}</div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: '#343F1E'}}>Tu dataset seleccionado</h2>
          <div className="space-y-3">
            {selectedSourcesData.map(source => (
              <div key={source.id} className="flex items-center p-3 rounded-lg" style={{backgroundColor: '#F5F0E1'}}>
                <span className="text-2xl mr-3">{source.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold" style={{color: '#343F1E'}}>{source.title}</p>
                  <p className="text-sm" style={{color: '#343F1E'}}>{source.perspective} • {source.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: '#343F1E'}}>Análisis de diversidad</h2>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2" style={{color: '#343F1E'}}>Perspectivas incluidas:</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.perspectives.map(p => (
                <span key={p} className="px-3 py-1 rounded-full text-sm" style={{backgroundColor: '#E8F0D7', color: '#343F1E'}}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2" style={{color: '#343F1E'}}>Tipos de sesgo presentes:</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.biasTypes.map(b => (
                <span key={b} className="px-3 py-1 rounded-full text-sm" style={{backgroundColor: '#F5F0E1', color: '#343F1E'}}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{backgroundColor: analysis.hasStructural ? '#E8F0D7' : '#F5E6E6'}}>
              <p className="font-semibold" style={{color: '#343F1E'}}>Análisis estructural</p>
              <p className="text-lg font-bold" style={{color: analysis.hasStructural ? '#5C8607' : '#8B4513'}}>
                {analysis.hasStructural ? '✓ Presente' : '✗ Ausente'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg" style={{backgroundColor: analysis.hasVictimVoices ? '#E8F0D7' : '#F5E6E6'}}>
              <p className="font-semibold" style={{color: '#343F1E'}}>Voces de víctimas</p>
              <p className="text-lg font-bold" style={{color: analysis.hasVictimVoices ? '#5C8607' : '#8B4513'}}>
                {analysis.hasVictimVoices ? '✓ Presente' : '✗ Ausente'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-lg mb-6" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <h2 className="text-xl font-bold mb-4" style={{color: '#343F1E'}}>Recomendaciones para uso responsable de IA</h2>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4`} style={{
                backgroundColor: rec.startsWith('⚠️') ? '#F5F0E1' :
                               rec.startsWith('✅') ? '#E8F0D7' :
                               '#E8F0D7',
                borderColor: '#5C8607'
              }}>
                <p style={{color: '#343F1E'}}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg mb-6" style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}>
          <h2 className="text-xl font-bold mb-3">Principios clave para recordar</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Toda IA es entrenada con datos sesgados que reflejan relaciones de poder existentes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Los algoritmos amplifican las voces ya dominantes e invisibilizan las marginadas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>El profesor de historia es mediador crítico indispensable, no facilitador pasivo</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>La verificación constante y la multiperspectividad son responsabilidades éticas</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setPhase(0);
              setSelectedSources([]);
              setQuestions([]);
              setChecklist({});
              setTimeElapsed(0);
              setCurrentQuestion(0);
              setReflection('');
            }}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{backgroundColor: '#D4D1C5', color: '#343F1E'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#C4C1B5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#D4D1C5'}
          >
            Reiniciar ejercicio
          </button>
          
          <button
            onClick={downloadReport}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
            style={{backgroundColor: '#5C8607', color: '#FDFAF1'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4A6B05'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#5C8607'}
          >
            <Download className="mr-2" />
            Descargar reporte
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{backgroundColor: '#FDFAF1'}}>
      {/* Referencia invisible para scroll */}
      <div ref={topRef} className="h-0" />
      
      {phase > 0 && phase < 4 && (
        <div className="max-w-6xl mx-auto mb-6 p-4 rounded-lg shadow-lg flex justify-between items-center" style={{backgroundColor: '#FDFAF1', border: '2px solid #5C8607'}}>
          <div className="flex items-center">
            <Clock style={{color: '#5C8607'}} className="mr-2" />
            <div>
              <p className="text-sm" style={{color: '#343F1E'}}>Tiempo transcurrido</p>
              <p className="text-2xl font-bold" style={{color: '#5C8607'}}>{formatTime(timeElapsed)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm" style={{color: '#343F1E'}}>Fase actual</p>
              <p className="text-2xl font-bold" style={{color: '#343F1E'}}>{phase}/3</p>
            </div>
          </div>
        </div>
      )}

      {phase > 0 && phase < 4 && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold`} style={{color: phase >= 1 ? '#5C8607' : '#D4D1C5'}}>
              Selección
            </span>
            <span className={`text-sm font-semibold`} style={{color: phase >= 2 ? '#5C8607' : '#D4D1C5'}}>
              Interrogación
            </span>
            <span className={`text-sm font-semibold`} style={{color: phase >= 3 ? '#5C8607' : '#D4D1C5'}}>
              Autoevaluación
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{backgroundColor: '#D4D1C5'}}>
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{width: `${((phase - 1) / 3) * 100}%`, backgroundColor: '#5C8607'}}
            />
          </div>
        </div>
      )}

      {phase === 0 && <WelcomePhase />}
      {phase === 1 && <SourceSelectionPhase />}
      {phase === 2 && <InterrogationPhase />}
      {phase === 3 && <SelfEvaluationPhase />}
      {phase === 4 && <FinalReportPhase />}

      <div className="max-w-6xl mx-auto mt-12 text-center text-sm" style={{color: '#343F1E'}}>
        <p>LAMA Labs - Universidad del Valle • Alfabetización mediática crítica para futuros profesores de historia</p>
      </div>
    </div>
  );
};

export default SesgoinVisible;