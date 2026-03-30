import React, { useState, useRef, useEffect } from 'react';

// Audio feedback system
const useSound = () => {
  const audioContext = useRef(null);
  
  const playTone = (frequency, duration = 0.08, type = 'sine') => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  return {
    hover: () => playTone(440, 0.05),
    select: () => playTone(523, 0.1),
    navigate: () => playTone(392, 0.06),
  };
};

// Knowledge base - rich content for learning
const systemData = {
  dataCollection: {
    id: 'dataCollection',
    name: 'Recolección de Datos',
    category: 'input',
    description: 'El punto de entrada donde los sesgos históricos y estructurales se codifican en conjuntos de datos.',
    mechanisms: [
      'Sobrerrepresentación de poblaciones dominantes en datos de entrenamiento',
      'Exclusión sistemática de comunidades marginalizadas',
      'Proxies que codifican discriminación histórica (códigos postales, nombres)',
      'Temporalidad sesgada: datos que reflejan inequidades pasadas'
    ],
    cases: [
      {
        title: 'ImageNet y el sesgo visual',
        detail: 'El 45% de las imágenes provienen de Estados Unidos, aunque representa solo el 4% de la población mundial. Esto genera modelos que reconocen mejor rostros caucásicos.'
      },
      {
        title: 'Datos crediticios históricos',
        detail: 'Los modelos entrenados con decisiones de préstamos de décadas pasadas perpetúan el redlining y la discriminación racial en el acceso al crédito.'
      }
    ],
    connections: ['preprocessing', 'feedback'],
    position: { x: 150, y: 200 }
  },
  preprocessing: {
    id: 'preprocessing',
    name: 'Preprocesamiento',
    category: 'process',
    description: 'Decisiones aparentemente técnicas que amplifican o atenúan sesgos existentes.',
    mechanisms: [
      'Selección de features que actúan como proxies discriminatorios',
      'Normalización que invisibiliza variaciones culturales',
      'Imputación de datos faltantes con promedios sesgados',
      'Discretización que crea fronteras artificiales'
    ],
    cases: [
      {
        title: 'Codificación de género binario',
        detail: 'Sistemas que solo permiten M/F excluyen identidades no binarias y perpetúan una ontología reduccionista en todos los análisis posteriores.'
      },
      {
        title: 'Estandarización lingüística',
        detail: 'Modelos de NLP entrenados en inglés "estándar" penalizan sistemáticamente dialectos afroamericanos y variantes del español latinoamericano.'
      }
    ],
    connections: ['model', 'dataCollection'],
    position: { x: 350, y: 120 }
  },
  model: {
    id: 'model',
    name: 'Arquitectura del Modelo',
    category: 'process',
    description: 'La estructura matemática que cristaliza patrones—incluyendo patrones de inequidad.',
    mechanisms: [
      'Funciones de optimización que priorizan precisión agregada sobre equidad',
      'Arquitecturas que amplifican correlaciones espurias',
      'Capacidad del modelo que memoriza sesgos específicos',
      'Regularización insuficiente para casos minoritarios'
    ],
    cases: [
      {
        title: 'COMPAS y predicción de reincidencia',
        detail: 'El algoritmo tenía el doble de probabilidad de etiquetar falsamente a acusados negros como futuros criminales comparado con acusados blancos.'
      },
      {
        title: 'Modelos de lenguaje y estereotipos',
        detail: 'GPT y similares asocian sistemáticamente profesiones de alto estatus con pronombres masculinos y trabajo doméstico con pronombres femeninos.'
      }
    ],
    connections: ['output', 'preprocessing'],
    position: { x: 550, y: 200 }
  },
  output: {
    id: 'output',
    name: 'Producción de Decisiones',
    category: 'output',
    description: 'Donde las predicciones se traducen en consecuencias materiales para personas reales.',
    mechanisms: [
      'Umbrales de decisión calibrados para poblaciones mayoritarias',
      'Interfaces que oscurecen la incertidumbre del modelo',
      'Automatización que elimina supervisión humana',
      'Escalabilidad que amplifica el impacto de cada error'
    ],
    cases: [
      {
        title: 'Contratación automatizada en Amazon',
        detail: 'El sistema de CV penalizaba la palabra "women\'s" (como en "women\'s chess club"), filtrando sistemáticamente candidatas mujeres.'
      },
      {
        title: 'Diagnóstico médico algorítmico',
        detail: 'Algoritmos dermatológicos entrenados principalmente con pieles claras tienen tasas de error 3x mayores en pieles oscuras.'
      }
    ],
    connections: ['impact', 'model'],
    position: { x: 750, y: 120 }
  },
  impact: {
    id: 'impact',
    name: 'Impacto Social',
    category: 'output',
    description: 'Las consecuencias vividas que cierran el ciclo y generan nuevos datos sesgados.',
    mechanisms: [
      'Distribución desigual de oportunidades y recursos',
      'Legitimación de decisiones discriminatorias mediante "objetividad" algorítmica',
      'Erosión de agencia individual frente a sistemas opacos',
      'Normalización de la vigilancia diferencial'
    ],
    cases: [
      {
        title: 'Policiamiento predictivo',
        detail: 'PredPol enviaba más patrullas a barrios de minorías, generando más arrestos, que alimentaban el modelo confirmando el "riesgo" de esas zonas.'
      },
      {
        title: 'Puntuación social',
        detail: 'Sistemas de crédito social crean ciudadanos de segunda clase con acceso restringido a vivienda, empleo y servicios públicos.'
      }
    ],
    connections: ['feedback', 'output'],
    position: { x: 750, y: 320 }
  },
  feedback: {
    id: 'feedback',
    name: 'Bucle de Retroalimentación',
    category: 'system',
    description: 'El mecanismo que convierte sesgos puntuales en estructuras sistémicas auto-reforzantes.',
    mechanisms: [
      'Profecías autocumplidas: predicciones que generan los datos que las confirman',
      'Homogeneización progresiva de outputs que empobrece la diversidad',
      'Bloqueo tecnológico: costos de cambio que perpetúan sistemas sesgados',
      'Opacidad que impide auditoría y corrección'
    ],
    cases: [
      {
        title: 'Recomendación y radicalización',
        detail: 'YouTube optimizaba por engagement, lo que sistemáticamente promovía contenido extremista porque generaba más tiempo de visualización.'
      },
      {
        title: 'Filtros burbuja electorales',
        detail: 'Algoritmos de redes sociales que muestran solo contenido afín reducen exposición a perspectivas diversas, polarizando el discurso público.'
      }
    ],
    connections: ['dataCollection', 'impact'],
    position: { x: 350, y: 320 }
  }
};

// Main component
export default function AlgorithmicBiasExplorer() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('mechanisms');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animatedConnections, setAnimatedConnections] = useState([]);
  const sound = useSound();
  const svgRef = useRef(null);

  // Animate data flow periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = Object.keys(systemData);
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const connections = systemData[randomNode].connections;
      if (connections.length > 0) {
        const targetNode = connections[Math.floor(Math.random() * connections.length)];
        setAnimatedConnections(prev => [...prev, { from: randomNode, to: targetNode, id: Date.now() }]);
        setTimeout(() => {
          setAnimatedConnections(prev => prev.filter(c => c.id !== Date.now()));
        }, 1500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = (nodeId) => {
    sound.select();
    setSelectedNode(systemData[nodeId]);
    setActiveTab('mechanisms');
  };

  const handleNodeHover = (nodeId) => {
    if (hoveredNode !== nodeId) {
      sound.hover();
      setHoveredNode(nodeId);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      input: { primary: '#8B4513', secondary: '#D2691E', bg: '#FDF5E6' },
      process: { primary: '#4A5568', secondary: '#718096', bg: '#F7FAFC' },
      output: { primary: '#744210', secondary: '#B7791F', bg: '#FFFAF0' },
      system: { primary: '#553C9A', secondary: '#805AD5', bg: '#FAF5FF' }
    };
    return colors[category] || colors.process;
  };

  const renderConnections = () => {
    const connections = [];
    Object.values(systemData).forEach(node => {
      node.connections.forEach(targetId => {
        const target = systemData[targetId];
        if (target) {
          const isAnimated = animatedConnections.some(
            c => (c.from === node.id && c.to === targetId)
          );
          const isHighlighted = selectedNode && 
            (selectedNode.id === node.id || selectedNode.id === targetId);
          
          // Calculate control points for curved lines
          const midX = (node.position.x + target.position.x) / 2;
          const midY = (node.position.y + target.position.y) / 2;
          const dx = target.position.x - node.position.x;
          const dy = target.position.y - node.position.y;
          const offset = Math.sqrt(dx * dx + dy * dy) * 0.2;
          const controlX = midX - dy * 0.3;
          const controlY = midY + dx * 0.3;

          connections.push(
            <g key={`${node.id}-${targetId}`}>
              <path
                d={`M ${node.position.x} ${node.position.y} Q ${controlX} ${controlY} ${target.position.x} ${target.position.y}`}
                fill="none"
                stroke={isHighlighted ? '#805AD5' : '#CBD5E0'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={isAnimated ? '8 4' : 'none'}
                opacity={isHighlighted ? 1 : 0.5}
                style={{
                  transition: 'all 0.3s ease'
                }}
              />
              {isAnimated && (
                <circle r="4" fill="#805AD5">
                  <animateMotion
                    dur="1.5s"
                    repeatCount="1"
                    path={`M ${node.position.x} ${node.position.y} Q ${controlX} ${controlY} ${target.position.x} ${target.position.y}`}
                  />
                </circle>
              )}
            </g>
          );
        }
      });
    });
    return connections;
  };

  const renderNodes = () => {
    return Object.values(systemData).map(node => {
      const colors = getCategoryColor(node.category);
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode === node.id;
      const isConnected = selectedNode?.connections.includes(node.id) || 
                          (selectedNode && node.connections.includes(selectedNode.id));

      return (
        <g
          key={node.id}
          transform={`translate(${node.position.x}, ${node.position.y})`}
          onClick={() => handleNodeClick(node.id)}
          onMouseEnter={() => handleNodeHover(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ cursor: 'pointer' }}
        >
          {/* Outer ring for selected/connected state */}
          {(isSelected || isConnected) && (
            <circle
              r={isSelected ? 52 : 48}
              fill="none"
              stroke={colors.primary}
              strokeWidth={isSelected ? 3 : 1.5}
              strokeDasharray={isConnected && !isSelected ? '4 2' : 'none'}
              opacity={0.6}
            />
          )}
          
          {/* Main circle */}
          <circle
            r={42}
            fill={colors.bg}
            stroke={colors.primary}
            strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
            style={{
              transition: 'all 0.2s ease',
              filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none'
            }}
          />
          
          {/* Inner accent circle */}
          <circle
            r={36}
            fill="none"
            stroke={colors.secondary}
            strokeWidth={0.5}
            opacity={0.4}
          />
          
          {/* Category indicator */}
          <circle
            r={6}
            cy={-30}
            fill={colors.primary}
          />
          
          {/* Label */}
          <text
            textAnchor="middle"
            dy={4}
            style={{
              fontSize: '11px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 500,
              fill: colors.primary,
              pointerEvents: 'none'
            }}
          >
            {node.name.split(' ').map((word, i) => (
              <tspan key={i} x={0} dy={i === 0 ? -6 : 14}>{word}</tspan>
            ))}
          </text>
        </g>
      );
    });
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#FAFAF9',
      minHeight: '100vh',
      color: '#1A202C'
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 32px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF'
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: 400,
          margin: 0,
          color: '#2D3748',
          letterSpacing: '-0.02em'
        }}>
          El Sesgo Invisible
        </h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          color: '#718096',
          margin: '8px 0 0 0',
          maxWidth: '600px',
          lineHeight: 1.5
        }}>
          Anatomía de un sistema algorítmico. Explore los mecanismos que transforman 
          datos históricos en decisiones automatizadas—y las inequidades que perpetúan.
        </p>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        {/* SVG Visualization */}
        <div style={{
          flex: '1 1 55%',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg
            ref={svgRef}
            viewBox="0 0 900 440"
            style={{
              width: '100%',
              maxWidth: '800px',
              height: 'auto'
            }}
          >
            {/* Background pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />
            
            {/* Flow direction indicator */}
            <text x="450" y="30" textAnchor="middle" style={{
              fontSize: '11px',
              fontFamily: 'system-ui',
              fill: '#A0AEC0',
              letterSpacing: '0.1em'
            }}>
              FLUJO DEL SISTEMA
            </text>
            <path
              d="M 200 45 L 700 45"
              stroke="#CBD5E0"
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#CBD5E0" />
              </marker>
            </defs>

            {/* Connections */}
            <g>{renderConnections()}</g>
            
            {/* Nodes */}
            <g>{renderNodes()}</g>

            {/* Legend */}
            <g transform="translate(30, 380)">
              <text style={{ fontSize: '10px', fill: '#718096', fontFamily: 'system-ui' }}>
                <tspan fontWeight="500">Categorías:</tspan>
              </text>
              {[
                { label: 'Entrada', color: '#8B4513', x: 80 },
                { label: 'Proceso', color: '#4A5568', x: 150 },
                { label: 'Salida', color: '#744210', x: 220 },
                { label: 'Sistema', color: '#553C9A', x: 280 }
              ].map(item => (
                <g key={item.label} transform={`translate(${item.x}, -2)`}>
                  <circle r="4" fill={item.color} />
                  <text x="10" style={{ fontSize: '10px', fill: '#4A5568', fontFamily: 'system-ui' }}>
                    {item.label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Information Panel */}
        <aside style={{
          flex: '0 0 380px',
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          overflow: 'auto'
        }}>
          {selectedNode ? (
            <div>
              {/* Node Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: getCategoryColor(selectedNode.category).bg
              }}>
                <div style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: getCategoryColor(selectedNode.category).primary,
                  marginBottom: '8px',
                  fontFamily: 'system-ui'
                }}>
                  {selectedNode.category === 'input' ? 'Entrada' : 
                   selectedNode.category === 'process' ? 'Proceso' :
                   selectedNode.category === 'output' ? 'Salida' : 'Sistema'}
                </div>
                <h2 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '22px',
                  fontWeight: 400,
                  margin: '0 0 12px 0',
                  color: '#2D3748'
                }}>
                  {selectedNode.name}
                </h2>
                <p style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#4A5568',
                  margin: 0
                }}>
                  {selectedNode.description}
                </p>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #E2E8F0'
              }}>
                {[
                  { id: 'mechanisms', label: 'Mecanismos' },
                  { id: 'cases', label: 'Casos' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.navigate();
                      setActiveTab(tab.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      border: 'none',
                      backgroundColor: activeTab === tab.id ? '#FFFFFF' : '#F7FAFC',
                      color: activeTab === tab.id ? '#2D3748' : '#718096',
                      fontSize: '13px',
                      fontWeight: activeTab === tab.id ? 500 : 400,
                      cursor: 'pointer',
                      borderBottom: activeTab === tab.id ? '2px solid #553C9A' : '2px solid transparent',
                      transition: 'all 0.2s ease',
                      fontFamily: 'system-ui'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: '20px 24px' }}>
                {activeTab === 'mechanisms' && (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {selectedNode.mechanisms.map((mechanism, i) => (
                      <li key={i} style={{
                        padding: '12px 0',
                        borderBottom: i < selectedNode.mechanisms.length - 1 ? '1px solid #EDF2F7' : 'none',
                        fontSize: '13px',
                        lineHeight: 1.6,
                        color: '#4A5568',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <span style={{
                          fontFamily: 'SF Mono, Menlo, monospace',
                          fontSize: '11px',
                          color: '#805AD5',
                          backgroundColor: '#FAF5FF',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          flexShrink: 0
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {mechanism}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'cases' && (
                  <div>
                    {selectedNode.cases.map((caseStudy, i) => (
                      <div key={i} style={{
                        marginBottom: i < selectedNode.cases.length - 1 ? '20px' : 0,
                        paddingBottom: i < selectedNode.cases.length - 1 ? '20px' : 0,
                        borderBottom: i < selectedNode.cases.length - 1 ? '1px solid #EDF2F7' : 'none'
                      }}>
                        <h4 style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: '15px',
                          fontWeight: 400,
                          color: '#2D3748',
                          margin: '0 0 8px 0'
                        }}>
                          {caseStudy.title}
                        </h4>
                        <p style={{
                          fontSize: '13px',
                          lineHeight: 1.65,
                          color: '#4A5568',
                          margin: 0
                        }}>
                          {caseStudy.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Connections */}
              <div style={{
                padding: '16px 24px',
                backgroundColor: '#F7FAFC',
                borderTop: '1px solid #E2E8F0'
              }}>
                <div style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#718096',
                  marginBottom: '10px'
                }}>
                  Conecta con
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedNode.connections.map(connId => (
                    <button
                      key={connId}
                      onClick={() => handleNodeClick(connId)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#4A5568',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'system-ui'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#805AD5';
                        e.target.style.color = '#553C9A';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.color = '#4A5568';
                      }}
                    >
                      {systemData[connId].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div style={{
              padding: '48px 32px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                backgroundColor: '#F7FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#805AD5" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: 400,
                color: '#2D3748',
                margin: '0 0 12px 0'
              }}>
                Seleccione un componente
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#718096',
                margin: 0
              }}>
                Haga clic en cualquier nodo del diagrama para explorar sus mecanismos 
                de sesgo y casos documentados.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '16px 32px',
        borderTop: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#A0AEC0',
          fontFamily: 'system-ui'
        }}>
          LAMA · Laboratorio de Mediaciones Algorítmicas
        </span>
        <span style={{
          fontSize: '11px',
          color: '#CBD5E0',
          fontFamily: 'SF Mono, Menlo, monospace'
        }}>
          v1.0 · Herramienta pedagógica para alfabetización algorítmica crítica
        </span>
      </footer>
    </div>
  );
}
