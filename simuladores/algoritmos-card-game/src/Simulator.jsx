import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Play, Pause, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const AlgorithmCardGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [selectedCards, setSelectedCards] = useState([]);
  const [socialImpact, setSocialImpact] = useState({
    diversity: 50,
    polarization: 30,
    engagement: 40,
    wellbeing: 60
  });
  const [round, setRound] = useState(1);
  const [scenario, setScenario] = useState(null);

  // Definición de cartas del juego
  const algorithmCards = [
    {
      id: 'engagement',
      name: 'Maximizar Engagement',
      type: 'objetivo',
      description: 'Prioriza contenido que genere más clics, likes y comentarios',
      effects: { engagement: +20, polarization: +15, wellbeing: -10 },
      color: 'bg-red-100 border-red-300',
      icon: '🎯'
    },
    {
      id: 'relevance',
      name: 'Relevancia Personal',
      type: 'objetivo',
      description: 'Muestra contenido similar a las preferencias del usuario',
      effects: { diversity: -15, engagement: +10, wellbeing: +5 },
      color: 'bg-blue-100 border-blue-300',
      icon: '👤'
    },
    {
      id: 'diversity',
      name: 'Diversidad de Fuentes',
      type: 'modificador',
      description: 'Incluye perspectivas variadas en las recomendaciones',
      effects: { diversity: +25, polarization: -10, engagement: -5 },
      color: 'bg-green-100 border-green-300',
      icon: '🌈'
    },
    {
      id: 'trending',
      name: 'Contenido Viral',
      type: 'amplificador',
      description: 'Prioriza contenido que se está compartiendo masivamente',
      effects: { engagement: +15, polarization: +20, diversity: -5 },
      color: 'bg-yellow-100 border-yellow-300',
      icon: '🔥'
    },
    {
      id: 'factcheck',
      name: 'Verificación de Hechos',
      type: 'filtro',
      description: 'Reduce la visibilidad de contenido no verificado',
      effects: { wellbeing: +15, engagement: -5, polarization: -10 },
      color: 'bg-purple-100 border-purple-300',
      icon: '✓'
    },
    {
      id: 'local',
      name: 'Contenido Local',
      type: 'modificador',
      description: 'Prioriza noticias y eventos de la comunidad local',
      effects: { diversity: +10, wellbeing: +10, engagement: +5 },
      color: 'bg-indigo-100 border-indigo-300',
      icon: '🏘️'
    },
    {
      id: 'clickbait',
      name: 'Títulos Llamativos',
      type: 'amplificador',
      description: 'Favorece contenido con títulos sensacionalistas',
      effects: { engagement: +25, wellbeing: -15, polarization: +10 },
      color: 'bg-orange-100 border-orange-300',
      icon: '⚡'
    },
    {
      id: 'timeout',
      name: 'Límites de Tiempo',
      type: 'filtro',
      description: 'Limita el tiempo de exposición a contenido problemático',
      effects: { wellbeing: +20, engagement: -10, polarization: -5 },
      color: 'bg-teal-100 border-teal-300',
      icon: '⏰'
    }
  ];

  const scenarios = [
    {
      id: 'election',
      title: 'Período Electoral',
      description: 'Durante una campaña electoral, tu algoritmo debe manejar contenido político altamente polarizante.',
      challenge: 'Mantener la diversidad informativa sin amplificar desinformación',
      multipliers: { polarization: 1.5, engagement: 1.2 }
    },
    {
      id: 'crisis',
      title: 'Crisis de Salud Pública',
      description: 'Durante una pandemia, la información médica falsa se propaga rápidamente.',
      challenge: 'Priorizar información verificada sin limitar el debate legítimo',
      multipliers: { wellbeing: 1.3, diversity: 0.8 }
    },
    {
      id: 'youth',
      title: 'Audiencia Adolescente',
      description: 'Tu plataforma es muy popular entre jóvenes de 13-17 años.',
      challenge: 'Proteger el bienestar mental mientras mantienes el engagement',
      multipliers: { wellbeing: 1.4, engagement: 0.9 }
    }
  ];

  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setSelectedCards([]);
    setSocialImpact({
      diversity: 50,
      polarization: 30,
      engagement: 40,
      wellbeing: 60
    });
    // Seleccionar escenario aleatorio
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(randomScenario);
  };

  const selectCard = (card) => {
    if (selectedCards.length < 3 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const removeCard = (cardId) => {
    setSelectedCards(selectedCards.filter(c => c.id !== cardId));
  };

  const applyAlgorithm = () => {
    let newImpact = { ...socialImpact };
    
    selectedCards.forEach(card => {
      Object.keys(card.effects).forEach(metric => {
        let effect = card.effects[metric];
        
        // Aplicar multiplicadores del escenario
        if (scenario?.multipliers[metric]) {
          effect *= scenario.multipliers[metric];
        }
        
        newImpact[metric] = Math.max(0, Math.min(100, newImpact[metric] + effect));
      });
    });

    setSocialImpact(newImpact);
    
    if (round < 3) {
      setRound(round + 1);
      setSelectedCards([]);
    } else {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setRound(1);
    setSelectedCards([]);
    setScenario(null);
  };

  const getImpactColor = (value) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactLevel = (value) => {
    if (value >= 80) return 'Excelente';
    if (value >= 60) return 'Bueno';
    if (value >= 40) return 'Regular';
    if (value >= 20) return 'Malo';
    return 'Crítico';
  };

  const calculateFinalScore = () => {
    const weights = { diversity: 0.3, polarization: -0.2, engagement: 0.2, wellbeing: 0.3 };
    return Object.keys(weights).reduce((score, metric) => {
      return score + (socialImpact[metric] * weights[metric]);
    }, 0);
  };

  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎮 Algoritmos en Acción</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Un juego educativo sobre las decisiones algorítmicas y sus consecuencias sociales. 
            Construye tu algoritmo de recomendación y observa cómo afecta a la sociedad.
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">🎯 Cómo Jugar</h2>
            <div className="text-left space-y-3 max-w-2xl mx-auto">
              <p>• <strong>Objetivo:</strong> Diseña un algoritmo balanceado que maximice el bienestar social</p>
              <p>• <strong>Mecánica:</strong> Selecciona 3 cartas por ronda para construir tu algoritmo</p>
              <p>• <strong>Métricas:</strong> Observa cómo tus decisiones afectan diversidad, polarización, engagement y bienestar</p>
              <p>• <strong>Escenarios:</strong> Cada partida presenta un contexto social diferente</p>
              <p>• <strong>Duración:</strong> 3 rondas para construir el algoritmo definitivo</p>
            </div>
          </div>

          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <Play size={24} />
            Comenzar Partida
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const finalScore = calculateFinalScore();
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">📊 Resultados Finales</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Escenario: {scenario?.title}</h2>
            <p className="text-gray-600">{scenario?.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(socialImpact).map(([metric, value]) => (
              <div key={metric} className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold capitalize mb-2">{metric === 'wellbeing' ? 'Bienestar' : metric === 'diversity' ? 'Diversidad' : metric === 'polarization' ? 'Polarización' : 'Engagement'}</h3>
                <div className={`text-2xl font-bold ${getImpactColor(value)}`}>
                  {Math.round(value)}%
                </div>
                <div className="text-sm text-gray-500">
                  {getImpactLevel(value)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Puntuación Final</h3>
            <div className={`text-4xl font-bold ${getImpactColor(finalScore)}`}>
              {Math.round(finalScore)}/100
            </div>
            <p className="text-gray-600 mt-2">
              {finalScore >= 70 ? '🎉 ¡Excelente! Has creado un algoritmo socialmente responsable' :
               finalScore >= 50 ? '👍 Buen trabajo, pero hay margen de mejora' :
               finalScore >= 30 ? '⚠️ Tu algoritmo tiene algunos problemas sociales importantes' :
               '🚨 Tu algoritmo podría tener consecuencias sociales graves'}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">💡 Reflexiones para el Debate</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• ¿Qué trade-offs fueron más difíciles de manejar?</li>
              <li>• ¿Cómo cambiarías tu estrategia para este escenario específico?</li>
              <li>• ¿Qué métricas crees que son más importantes en la vida real?</li>
              <li>• ¿Quién debería tomar estas decisiones algorítmicas en la sociedad?</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <RotateCcw size={20} />
              Jugar de Nuevo
            </button>
            <button 
              onClick={resetGame}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header del juego */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Algoritmos en Acción - Ronda {round}/3</h1>
          <button 
            onClick={resetGame}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        
        {scenario && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold text-amber-800">📋 Escenario: {scenario.title}</h2>
            <p className="text-amber-700 text-sm mt-1">{scenario.description}</p>
            <p className="text-amber-600 text-xs mt-2 italic">Desafío: {scenario.challenge}</p>
          </div>
        )}

        {/* Métricas actuales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(socialImpact).map(([metric, value]) => (
            <div key={metric} className="bg-gray-50 p-3 rounded-lg text-center">
              <h3 className="font-semibold text-sm capitalize mb-1">
                {metric === 'wellbeing' ? 'Bienestar' : metric === 'diversity' ? 'Diversidad' : metric === 'polarization' ? 'Polarización' : 'Engagement'}
              </h3>
              <div className={`text-xl font-bold ${getImpactColor(value)}`}>
                {Math.round(value)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{width: `${value}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cartas disponibles */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🃏 Cartas Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithmCards.map(card => (
              <div 
                key={card.id}
                onClick={() => selectCard(card)}
                className={`${card.color} border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg transform hover:scale-105 ${
                  selectedCards.find(c => c.id === card.id) ? 'opacity-50 cursor-not-allowed' : ''
                } ${selectedCards.length >= 3 && !selectedCards.find(c => c.id === card.id) ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{card.icon}</span>
                  <h3 className="font-semibold">{card.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                <div className="text-xs">
                  <span className="bg-white bg-opacity-60 px-2 py-1 rounded">{card.type}</span>
                </div>
                
                {/* Efectos de la carta */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(card.effects).map(([effect, value]) => (
                    <span 
                      key={effect}
                      className={`text-xs px-2 py-1 rounded ${value > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                    >
                      {effect}: {value > 0 ? '+' : ''}{value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de cartas seleccionadas */}
        <div className="bg-white rounded-xl p-6 shadow-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">⚙️ Tu Algoritmo ({selectedCards.length}/3)</h2>
          
          {selectedCards.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Selecciona hasta 3 cartas para construir tu algoritmo</p>
          ) : (
            <div className="space-y-3">
              {selectedCards.map(card => (
                <div 
                  key={card.id}
                  className={`${card.color} border rounded-lg p-3 relative`}
                >
                  <button 
                    onClick={() => removeCard(card.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{card.icon}</span>
                    <h4 className="font-semibold text-sm">{card.name}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          )}

          {selectedCards.length > 0 && (
            <button 
              onClick={applyAlgorithm}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold mt-4 transition-colors"
              disabled={selectedCards.length === 0}
            >
              {round < 3 ? `Aplicar Ronda ${round}` : 'Finalizar Algoritmo'}
            </button>
          )}

          {selectedCards.length === 3 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Vista previa de efectos:</h4>
              {Object.keys(socialImpact).map(metric => {
                const totalEffect = selectedCards.reduce((sum, card) => {
                  let effect = card.effects[metric] || 0;
                  if (scenario?.multipliers[metric]) {
                    effect *= scenario.multipliers[metric];
                  }
                  return sum + effect;
                }, 0);
                
                if (totalEffect !== 0) {
                  return (
                    <div key={metric} className="text-xs text-blue-700">
                      {metric}: {totalEffect > 0 ? '+' : ''}{Math.round(totalEffect)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <p className="text-sm text-gray-600 text-center">
          💡 <strong>Tip:</strong> Observa cómo cada carta afecta las métricas sociales. En la vida real, 
          estas decisiones algorítmicas impactan a millones de personas diariamente.
        </p>
      </div>
    </div>
  );
};

export default AlgorithmCardGame;