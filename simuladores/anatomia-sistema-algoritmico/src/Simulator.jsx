import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Eye, AlertTriangle, BarChart3, RefreshCw, BookOpen } from 'lucide-react';

const SearchBiasAnalyzer = () => {
  const [currentQuery, setCurrentQuery] = useState('inteligencia artificial empleos');
  const [selectedProfile, setSelectedProfile] = useState('young-tech');
  const [showComparison, setShowComparison] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Perfiles demográficos simulados
  const profiles = {
    'young-tech': {
      name: 'Joven Tecnología',
      description: 'Estudiante universitario, 22 años, Bogotá',
      icon: '👨‍💻',
      demographics: { age: '18-25', location: 'Bogotá', interests: 'Tecnología, Gaming' }
    },
    'middle-corporate': {
      name: 'Profesional Corporativo',
      description: 'Ejecutiva, 38 años, Medellín',
      icon: '👩‍💼',
      demographics: { age: '35-45', location: 'Medellín', interests: 'Negocios, Finanzas' }
    },
    'rural-teacher': {
      name: 'Educador Rural',
      description: 'Profesor, 45 años, Cauca',
      icon: '👨‍🏫',
      demographics: { age: '40-50', location: 'Cauca', interests: 'Educación, Agricultura' }
    },
    'senior-urban': {
      name: 'Adulto Mayor Urbano',
      description: 'Pensionado, 65 años, Cali',
      icon: '👴',
      demographics: { age: '60+', location: 'Cali', interests: 'Salud, Familia' }
    }
  };

  // Datos simulados de resultados de búsqueda con sesgos
  const searchResults = {
    'inteligencia artificial empleos': {
      'young-tech': [
        {
          title: 'Los 10 empleos mejor pagados en IA para desarrolladores',
          url: 'techcareers.com',
          snippet: 'Descubre las oportunidades más lucrative en machine learning, deep learning y data science. Salarios desde $4M COP.',
          bias: 'Enfoque en salarios altos y roles técnicos'
        },
        {
          title: 'Bootcamps de IA: Tu camino hacia el éxito tecnológico',
          url: 'codingbootcamp.co',
          snippet: 'Cursos intensivos de 6 meses. Aprende Python, TensorFlow y consigue trabajo garantizado.',
          bias: 'Promesas de empleo rápido'
        },
        {
          title: 'Startups colombianas que están contratando en IA',
          url: 'startupjobs.co',
          snippet: 'Rappi, Platzi y otras unicornios buscan talento joven en inteligencia artificial.',
          bias: 'Cultura startup y juventud'
        }
      ],
      'middle-corporate': [
        {
          title: 'Cómo liderar la transformación digital con IA en su empresa',
          url: 'harvard-business.com',
          snippet: 'Estrategias ejecutivas para implementar IA sin perder empleados. ROI garantizado.',
          bias: 'Perspectiva gerencial y ROI'
        },
        {
          title: 'IA y el futuro del management: Curso para ejecutivos',
          url: 'eafit-executive.edu.co',
          snippet: 'MBA especializado para líderes empresariales. Inversión $15M COP.',
          bias: 'Educación ejecutiva costosa'
        },
        {
          title: 'Consultorías en IA para medianas empresas en Colombia',
          url: 'mckinsey.com',
          snippet: 'Implemente IA sin riesgo con nuestros expertos. Cases de éxito en retail y manufactura.',
          bias: 'Soluciones premium y consultorías'
        }
      ],
      'rural-teacher': [
        {
          title: 'IA en el aula rural: Herramientas gratuitas para profesores',
          url: 'mineducacion.gov.co',
          snippet: 'Guía del Ministerio para usar ChatGPT y otras herramientas en colegios rurales.',
          bias: 'Recursos gubernamentales y gratuitos'
        },
        {
          title: 'Capacitación docente: IA para mejorar la educación campesina',
          url: 'universia.co',
          snippet: 'Curso virtual gratuito. Aprenda a usar IA para crear material educativo contextualizado.',
          bias: 'Enfoque en lo gratuito y educativo'
        },
        {
          title: '¿La IA reemplazará a los maestros rurales?',
          url: 'elespectador.com',
          snippet: 'Análisis sobre el futuro del empleo docente en zonas apartadas de Colombia.',
          bias: 'Preocupaciones sobre desplazamiento laboral'
        }
      ],
      'senior-urban': [
        {
          title: 'IA y empleos para personas mayores de 50: Mitos y realidades',
          url: 'aarp-colombia.org',
          snippet: 'La discriminación por edad en trabajos de tecnología. Cómo reinventarse después de los 50.',
          bias: 'Preocupaciones sobre discriminación'
        },
        {
          title: 'Pensiones y automatización: ¿Está su jubilación en riesgo?',
          url: 'portafolio.co',
          snippet: 'Estudio sobre cómo la IA podría afectar los fondos de pensiones en Colombia.',
          bias: 'Enfoque en seguridad financiera'
        },
        {
          title: 'Cursos de IA para adultos mayores: Nunca es tarde para aprender',
          url: 'universidad-tercera-edad.co',
          snippet: 'Programa de alfabetización digital especializado para personas de 60+.',
          bias: 'Paternalismo hacia adultos mayores'
        }
      ]
    },
    'emprendimiento jóvenes': {
      'young-tech': [
        {
          title: 'Startups tech que puedes crear desde tu cuarto',
          url: 'techstars.co',
          snippet: 'Ideas de negocio digital con inversión mínima. Desde apps hasta NFTs.',
          bias: 'Solucionismo tecnológico individual'
        },
        {
          title: 'Fondos de inversión para millennials en Colombia',
          url: 'innpulsa.gov.co',
          snippet: 'Capital semilla hasta $500M COP para emprendimientos innovadores.',
          bias: 'Acceso privilegiado a capital'
        },
        {
          title: 'Unicornios latinos: La nueva generación de CEO jóvenes',
          url: 'forbes.co',
          snippet: 'Historias de éxito de fundadores menores de 30 años en Latinoamérica.',
          bias: 'Mitología del emprendedor joven'
        }
      ],
      'middle-corporate': [
        {
          title: 'Intraemprendimiento: Innove desde dentro de su empresa',
          url: 'harvard-business.com',
          snippet: 'Estrategias para crear nuevas líneas de negocio sin abandonar su trabajo.',
          bias: 'Mantener estabilidad corporativa'
        },
        {
          title: 'Franquicias rentables para ejecutivos en Colombia',
          url: 'franquicias.com.co',
          snippet: 'Inversiones seguras desde $100M COP. Modelos de negocio probados.',
          bias: 'Aversión al riesgo y capital alto'
        },
        {
          title: 'MBA en emprendimiento para profesionales senior',
          url: 'uniandes.edu.co',
          snippet: 'Programa ejecutivo nocturno. Concilie familia, trabajo y nuevo negocio.',
          bias: 'Educación formal costosa'
        }
      ],
      'rural-teacher': [
        {
          title: 'Emprendimiento rural: Agregue valor a productos campesinos',
          url: 'agronet.gov.co',
          snippet: 'Guía para transformar materias primas locales en productos comercializables.',
          bias: 'Enfoque en agricultura tradicional'
        },
        {
          title: 'Cooperativas juveniles: Organización comunitaria para el desarrollo',
          url: 'dansocial.gov.co',
          snippet: 'Modelos asociativos para jóvenes rurales. Apoyo estatal disponible.',
          bias: 'Soluciones colectivas vs individuales'
        },
        {
          title: 'Turismo comunitario: Potencial emprendedor en territorios',
          url: 'mincit.gov.co',
          snippet: 'Cómo aprovechar biodiversidad y cultura local para generar ingresos.',
          bias: 'Recursos territoriales vs capital'
        }
      ],
      'senior-urban': [
        {
          title: 'Emprendimiento senior: Aproveche su experiencia profesional',
          url: 'dinero.com',
          snippet: 'Consultorías y servicios profesionales como segunda carrera exitosa.',
          bias: 'Valoración de experiencia acumulada'
        },
        {
          title: 'Negocios familiares: Involucre a la siguiente generación',
          url: 'revista-empresarial.com',
          snippet: 'Estrategias para transferir conocimiento y asegurar continuidad.',
          bias: 'Estabilidad generacional'
        },
        {
          title: 'Microcréditos para adultos mayores emprendedores',
          url: 'bancoldex.gov.co',
          snippet: 'Líneas especiales de financiación para personas 50+.',
          bias: 'Acceso limitado a financiación'
        }
      ]
    },
    'salud mental jóvenes': {
      'young-tech': [
        {
          title: 'Apps de meditación que están revolucionando el bienestar',
          url: 'headspace.com',
          snippet: 'Desde Calm hasta Insight Timer. La tecnología como solución al estrés.',
          bias: 'Solucionismo digital para problemas psicológicos'
        },
        {
          title: 'Terapia online: Psicólogos a un click de distancia',
          url: 'betterhelp.co',
          snippet: 'Sesiones virtuales 24/7. Más accesible que la terapia tradicional.',
          bias: 'Individualización y mercantilización'
        },
        {
          title: 'Mental health startups: El nuevo boom de inversión',
          url: 'crunchbase.com',
          snippet: 'Empresas que están transformando el cuidado psicológico con IA.',
          bias: 'Narrativa empresarial sobre salud'
        }
      ],
      'middle-corporate': [
        {
          title: 'Burnout ejecutivo: Señales de alarma y prevención',
          url: 'hbr.org',
          snippet: 'Cómo identificar agotamiento laboral antes que afecte productividad.',
          bias: 'Enfoque en rendimiento laboral'
        },
        {
          title: 'Programas de bienestar corporativo: ROI en salud mental',
          url: 'mercer.com',
          snippet: 'Evidencia de que invertir en psicología mejora resultados empresariales.',
          bias: 'Instrumentalización del bienestar'
        },
        {
          title: 'EPS y cobertura en salud mental: Guía para ejecutivos',
          url: 'supersalud.gov.co',
          snippet: 'Navegue el sistema de salud para acceder a tratamiento psicológico.',
          bias: 'Privilegio de seguros premium'
        }
      ],
      'rural-teacher': [
        {
          title: 'Salud mental en territorios: Estrategias comunitarias',
          url: 'minsalud.gov.co',
          snippet: 'Guía para docentes sobre acompañamiento psicosocial en contextos rurales.',
          bias: 'Enfoque en recursos comunitarios'
        },
        {
          title: 'Impacto del conflicto en niños: Pedagogía del cuidado',
          url: 'icbf.gov.co',
          snippet: 'Herramientas para maestros en zonas afectadas por violencia.',
          bias: 'Contextualización del trauma social'
        },
        {
          title: 'Red de apoyo psicológico rural: Telemedicina solidaria',
          url: 'telesalud.co',
          snippet: 'Conexión con psicólogos urbanos para estudiantes de veredas.',
          bias: 'Dependencia de centros urbanos'
        }
      ],
      'senior-urban': [
        {
          title: 'Depresión en adultos mayores: Síntomas y tratamiento',
          url: 'mayoclinic.org',
          snippet: 'Guía médica sobre salud mental en la tercera edad.',
          bias: 'Medicalización del envejecimiento'
        },
        {
          title: 'Aislamiento social post-pandemia: Estrategias de reconexión',
          url: 'who.int',
          snippet: 'Recomendaciones para combatir soledad en personas mayores.',
          bias: 'Problematización de la soledad'
        },
        {
          title: 'Grupos de apoyo para adultos mayores en Cali',
          url: 'secretariasalud.cali.gov.co',
          snippet: 'Espacios comunitarios de encuentro y acompañamiento emocional.',
          bias: 'Soluciones grupales institucionales'
        }
      ]
    },
    'educación virtual': {
      'young-tech': [
        {
          title: 'Coursera vs. Platzi: ¿Cuál plataforma te dará mejores empleos?',
          url: 'techreview.co',
          snippet: 'Comparación de certificaciones que más valoran los reclutadores tech.',
          bias: 'Competencia entre plataformas comerciales'
        },
        {
          title: 'Aprende a programar gratis: GitHub, freeCodeCamp y más',
          url: 'medium.com',
          snippet: 'Roadmap completo para convertirte en developer sin gastar dinero.',
          bias: 'Autoformación individual'
        },
        {
          title: 'NFTs en educación: Certificados blockchain revolucionarios',
          url: 'web3university.co',
          snippet: 'La nueva frontera de credenciales educativas descentralizadas.',
          bias: 'Hype tecnológico aplicado a educación'
        }
      ],
      'middle-corporate': [
        {
          title: 'Executive MBA online: Estudie sin pausar su carrera',
          url: 'ie.edu',
          snippet: 'Programas híbridos para altos ejecutivos. Networking global incluido.',
          bias: 'Educación premium para élites'
        },
        {
          title: 'Upskilling corporativo: Invierta en su equipo remoto',
          url: 'linkedin-learning.com',
          snippet: 'Plataformas empresariales para capacitación continua de empleados.',
          bias: 'Enfoque en productividad empresarial'
        },
        {
          title: 'ROI de la educación virtual: Métricas que importan',
          url: 'trainingindustry.com',
          snippet: 'Cómo medir el retorno de inversión en capacitación online.',
          bias: 'Cuantificación del aprendizaje'
        }
      ],
      'rural-teacher': [
        {
          title: 'Conectividad rural: Desafíos para educación virtual',
          url: 'mintic.gov.co',
          snippet: 'Estrategias para enseñar online en zonas con internet limitado.',
          bias: 'Barreras de infraestructura'
        },
        {
          title: 'Recursos educativos abiertos para colegios rurales',
          url: 'colombiaaprende.edu.co',
          snippet: 'Contenidos gratuitos adaptados al contexto campesino colombiano.',
          bias: 'Dependencia de recursos estatales'
        },
        {
          title: 'Pedagogía híbrida: Combine presencial y virtual efectivamente',
          url: 'compartirpalabramaestra.org',
          snippet: 'Metodologías para docentes que alternan entre modalidades.',
          bias: 'Adaptación forzada a limitaciones'
        }
      ],
      'senior-urban': [
        {
          title: 'Universidad de la tercera edad: Programas virtuales',
          url: 'javeriana.edu.co',
          snippet: 'Cursos online diseñados específicamente para adultos mayores.',
          bias: 'Segregación etaria en educación'
        },
        {
          title: 'Alfabetización digital para seniors: Nunca es tarde',
          url: 'sena.edu.co',
          snippet: 'Cursos gratuitos para aprender computación básica y navegación web.',
          bias: 'Asunción de analfabetismo digital'
        },
        {
          title: 'Brecha digital generacional: Cómo superarla en familia',
          url: 'eltiempo.com',
          snippet: 'Consejos para que abuelos aprendan tecnología con ayuda de nietos.',
          bias: 'Dependencia de familiares jóvenes'
        }
      ]
    },
    'vivienda propia': {
      'young-tech': [
        {
          title: 'Fintech inmobiliario: Apps que facilitan comprar casa',
          url: 'houm.co',
          snippet: 'Plataformas digitales para millennials. Proceso 100% online.',
          bias: 'Solucionismo tecnológico para acceso'
        },
        {
          title: 'Crowdfunding inmobiliario: Invierte desde $500K COP',
          url: 'brickbro.co',
          snippet: 'Democratización de inversión en finca raíz vía tecnología blockchain.',
          bias: 'Financiarización de la vivienda'
        },
        {
          title: 'Apartaestudios inteligentes: La micro-vivienda del futuro',
          url: 'metrocuadrado.com',
          snippet: 'Espacios de 30m² con domótica y diseño optimizado para jóvenes.',
          bias: 'Normalización de espacios mínimos'
        }
      ],
      'middle-corporate': [
        {
          title: 'Leasing habitacional vs. crédito hipotecario: Guía completa',
          url: 'asobancaria.com',
          snippet: 'Análisis financiero de las mejores opciones según su perfil crediticio.',
          bias: 'Acceso a múltiples productos financieros'
        },
        {
          title: 'Inversión en finca raíz: Compre para arrendar',
          url: 'larepublica.co',
          snippet: 'Estrategias para generar ingresos pasivos con propiedades.',
          bias: 'Acumulación de activos inmobiliarios'
        },
        {
          title: 'Barrios premium en Cali: Valorización garantizada',
          url: 'elcolombiano.com',
          snippet: 'Zonas con mayor potencial de crecimiento para inversión residencial.',
          bias: 'Segregación socioespacial'
        }
      ],
      'rural-teacher': [
        {
          title: 'Subsidio de vivienda rural: Guía paso a paso',
          url: 'mivienda.gov.co',
          snippet: 'Requisitos y proceso para acceder a casa propia en el campo.',
          bias: 'Dependencia de subsidios estatales'
        },
        {
          title: 'Autoconstrucción asistida: Técnicas y materiales locales',
          url: 'sena.edu.co',
          snippet: 'Capacitación para construir con guadua, bahareque y otros recursos.',
          bias: 'Autogestión por falta de recursos'
        },
        {
          title: 'Titulación de tierras: Regularice su propiedad rural',
          url: 'agenciadetierras.gov.co',
          snippet: 'Proceso para obtener escrituras de terrenos familiares ancestrales.',
          bias: 'Problemas de formalización histórica'
        }
      ],
      'senior-urban': [
        {
          title: 'Hipoteca reversa: Monetice su casa sin venderla',
          url: 'bancolombia.com',
          snippet: 'Producto financiero para adultos mayores propietarios de vivienda.',
          bias: 'Instrumentalización del patrimonio'
        },
        {
          title: 'Adaptación de vivienda para el envejecimiento',
          url: 'minsalud.gov.co',
          snippet: 'Modificaciones arquitectónicas para mayor seguridad y comodidad.',
          bias: 'Enfoque en limitaciones físicas'
        },
        {
          title: 'Herencias y sucesiones: Planifique el futuro familiar',
          url: 'notariado.org',
          snippet: 'Guía legal para transferir propiedades a la siguiente generación.',
          bias: 'Preocupación por legado patrimonial'
        }
      ]
    },
    'seguridad ciudadana': {
      'young-tech': [
        {
          title: 'Apps de seguridad: Tu smartphone como escudo personal',
          url: 'techo.org',
          snippet: 'Botón de pánico, GPS compartido y alertas comunitarias en tiempo real.',
          bias: 'Individualización tecnológica de la seguridad'
        },
        {
          title: 'Smart cities: Cómo la IA está reduciendo el crimen',
          url: 'semana.com',
          snippet: 'Cámaras inteligentes y algoritmos predictivos en ciudades modernas.',
          bias: 'Solucionismo tecnológico autoritario'
        },
        {
          title: 'Criptomonedas y seguridad: Protege tus activos digitales',
          url: 'coindesk.com',
          snippet: 'Wallets seguros y mejores prácticas contra hackeos y estafas.',
          bias: 'Priorización de patrimonio digital'
        }
      ],
      'middle-corporate': [
        {
          title: 'Seguridad corporativa: Proteja a sus ejecutivos',
          url: 'elespectador.com',
          snippet: 'Servicios de escoltas y blindaje para empresarios en riesgo.',
          bias: 'Seguridad como privilegio de clase'
        },
        {
          title: 'Seguros contra secuestro: Cobertura para altos patrimonios',
          url: 'axa.co',
          snippet: 'Pólizas especializadas para empresarios y sus familias.',
          bias: 'Mercantilización del miedo'
        },
        {
          title: 'Condominios cerrados: La nueva forma de vivir seguro',
          url: 'portafolio.co',
          snippet: 'Urbanizaciones con vigilancia 24/7 y acceso controlado.',
          bias: 'Segregación espacial defensiva'
        }
      ],
      'rural-teacher': [
        {
          title: 'Seguridad escolar en zonas de conflicto: Protocolos',
          url: 'mineducacion.gov.co',
          snippet: 'Guías para docentes en territorios con presencia de grupos armados.',
          bias: 'Normalización de violencia estructural'
        },
        {
          title: 'Guardas rurales: Organización comunitaria para la protección',
          url: 'unp.gov.co',
          snippet: 'Redes de vigilancia vecinal en veredas y corregimientos.',
          bias: 'Autodefensa ante ausencia estatal'
        },
        {
          title: 'Desarme de cultivos ilícitos: Riesgos para comunidades',
          url: 'dejusticia.org',
          snippet: 'Impacto de la erradicación forzada en la seguridad campesina.',
          bias: 'Victimización de comunidades rurales'
        }
      ],
      'senior-urban': [
        {
          title: 'Adultos mayores: Principales víctimas de estafas urbanas',
          url: 'policia.gov.co',
          snippet: 'Modalidades de fraude más comunes y cómo prevenirlas.',
          bias: 'Victimización de vulnerabilidad'
        },
        {
          title: 'Bastones GPS y dispositivos de emergencia para seniors',
          url: 'eltiempo.com',
          snippet: 'Tecnología asistencial para adultos mayores que viven solos.',
          bias: 'Tecnologización del cuidado'
        },
        {
          title: 'Policía comunitaria en barrios residenciales de Cali',
          url: 'cali.gov.co',
          snippet: 'Programas de cooperación entre vecinos y autoridades locales.',
          bias: 'Enfoque en barrios de estratos altos'
        }
      ]
    },
    'cambio climático': {
      'young-tech': [
        {
          title: 'Apps para salvar el planeta: Las mejores soluciones tech verde',
          url: 'gizmodo.com',
          snippet: 'Desde calculadoras de huella de carbono hasta blockchains para energía renovable.',
          bias: 'Solucionismo tecnológico'
        },
        {
          title: 'Startups climáticas que están revolucionando el mundo',
          url: 'techcrunch.com',
          snippet: 'Inversión millonaria en cleantech. Oportunidades para developers ambientales.',
          bias: 'Optimismo tecno-empresarial'
        },
        {
          title: 'Hackathons por el clima: Programa tu futuro sostenible',
          url: 'hackathon.co',
          snippet: 'Eventos donde puedes ganar premios creando soluciones ambientales con código.',
          bias: 'Gamificación del activismo'
        }
      ],
      'middle-corporate': [
        {
          title: 'ESG y reputación empresarial: Invierta en sostenibilidad',
          url: 'semana.com',
          snippet: 'Cómo las políticas ambientales mejoran el valor de las acciones y atraen inversores.',
          bias: 'Enfoque en beneficio económico'
        },
        {
          title: 'Compliance ambiental: Evite multas millonarias',
          url: 'ambito-juridico.com',
          snippet: 'Nuevas regulaciones gubernamentales sobre emisiones. Asesoría legal especializada.',
          bias: 'Miedo a sanciones regulatorias'
        },
        {
          title: 'Certificaciones verdes para empresas: ISO 14001 y más',
          url: 'icontec.org',
          snippet: 'Mejore su competitividad con sellos de sostenibilidad reconocidos internacionalmente.',
          bias: 'Ventajas competitivas'
        }
      ],
      'rural-teacher': [
        {
          title: 'Pedagogía ambiental para colegios rurales: Guía práctica',
          url: 'mineducacion.gov.co',
          snippet: 'Recursos didácticos para enseñar cambio climático usando el entorno local.',
          bias: 'Recursos educativos territoriales'
        },
        {
          title: 'Afectaciones del clima en la agricultura campesina colombiana',
          url: 'eltiempo.com',
          snippet: 'Testimonios de agricultores sobre sequías y lluvias extremas en diferentes regiones.',
          bias: 'Impactos locales y testimoniales'
        },
        {
          title: 'Proyectos ambientales escolares: Huerta y reciclaje',
          url: 'compartirpalabramaestra.org',
          snippet: 'Ideas para que estudiantes rurales lideren iniciativas sostenibles en sus veredas.',
          bias: 'Soluciones comunitarias prácticas'
        }
      ],
      'senior-urban': [
        {
          title: 'Calidad del aire en Cali: Impactos en la salud de adultos mayores',
          url: 'minsalud.gov.co',
          snippet: 'Recomendaciones médicas para protegerse de la contaminación atmosférica.',
          bias: 'Preocupaciones de salud inmediata'
        },
        {
          title: '¿Cómo el cambio climático afecta las pensiones?',
          url: 'colpensiones.gov.co',
          snippet: 'Estudio sobre riesgos financieros del calentamiento global para el sistema pensional.',
          bias: 'Impacto en seguridad económica'
        },
        {
          title: 'Adaptación climática en barrios de Cali: Qué pueden hacer los vecinos',
          url: 'cali.gov.co',
          snippet: 'Iniciativas comunitarias para enfrentar olas de calor y inundaciones urbanas.',
          bias: 'Acciones colectivas locales'
        }
      ]
    }
  };

  const queries = Object.keys(searchResults);

  const simulateSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  const getResults = () => {
    return searchResults[currentQuery]?.[selectedProfile] || [];
  };

  const getAllResults = () => {
    const allProfiles = Object.keys(profiles);
    return allProfiles.map(profileKey => ({
      profile: profiles[profileKey],
      profileKey,
      results: searchResults[currentQuery]?.[profileKey] || []
    }));
  };

  const getBiasAnalysis = () => {
    const results = getResults();
    const biases = results.map(r => r.bias);
    const uniqueBiases = [...new Set(biases)];
    
    return {
      totalBiases: uniqueBiases.length,
      commonPatterns: uniqueBiases.slice(0, 3),
      diversityScore: Math.max(0, 5 - uniqueBiases.length) * 20
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Search className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Analizador de Sesgos en Búsquedas</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explora cómo los algoritmos de búsqueda muestran resultados diferentes según tu perfil demográfico, 
          ubicación e historial. Una herramienta para comprender los filtros burbuja invisibles.
        </p>
      </div>

      {/* Controles principales */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selector de búsqueda */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Término de búsqueda
            </label>
            <select 
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
            >
              {queries.map(query => (
                <option key={query} value={query}>{query}</option>
              ))}
            </select>
          </div>

          {/* Selector de perfil */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Perfil demográfico
            </label>
            <select 
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
            >
              {Object.entries(profiles).map(([key, profile]) => (
                <option key={key} value={key}>
                  {profile.icon} {profile.name} - {profile.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={simulateSearch}
            disabled={isSearching}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
          
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {showComparison ? 'Vista Individual' : 'Comparar Perfiles'}
          </button>
        </div>
      </div>

      {/* Información del perfil actual */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{profiles[selectedProfile].icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{profiles[selectedProfile].name}</h3>
            <p className="text-gray-600">{profiles[selectedProfile].description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(profiles[selectedProfile].demographics).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500 capitalize">{key}</div>
              <div className="font-semibold text-gray-800">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {!showComparison ? (
        // Vista individual
        <div className="space-y-6">
          {/* Resultados de búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Resultados para: "{currentQuery}"
            </h3>
            
            {isSearching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {getResults().map((result, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                      {result.title}
                    </h4>
                    <div className="text-green-600 text-sm mb-1">{result.url}</div>
                    <p className="text-gray-700 text-sm mb-2">{result.snippet}</p>
                    <div className="flex items-center gap-2 text-orange-600 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="font-semibold">Sesgo detectado:</span> {result.bias}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Análisis de sesgos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              <Eye className="w-5 h-5 inline mr-2" />
              Análisis de Sesgos Detectados
            </h3>
            
            {(() => {
              const analysis = getBiasAnalysis();
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{analysis.totalBiases}</div>
                    <div className="text-sm text-red-700">Tipos de sesgo identificados</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{analysis.diversityScore}%</div>
                    <div className="text-sm text-yellow-700">Puntuación de diversidad</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-700 font-semibold mb-1">Patrones principales:</div>
                    <div className="text-xs text-blue-600">
                      {analysis.commonPatterns.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        // Vista comparativa
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Comparación entre Perfiles para: "{currentQuery}"
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getAllResults().map(({ profile, profileKey, results }) => (
              <div key={profileKey} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{profile.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{profile.name}</h4>
                    <p className="text-sm text-gray-600">{profile.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {results.slice(0, 2).map((result, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <h5 className="font-semibold text-sm text-blue-600 mb-1">{result.title}</h5>
                      <p className="text-xs text-gray-600 mb-2">{result.snippet.slice(0, 100)}...</p>
                      <div className="text-xs text-orange-600">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {result.bias}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reflexión crítica */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mt-6 text-white">
        <h3 className="text-xl font-bold mb-4">
          <BookOpen className="w-5 h-5 inline mr-2" />
          Reflexión Crítica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">¿Qué observas?</h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• ¿Los resultados reflejan diferentes prioridades según el perfil?</li>
              <li>• ¿Algunos grupos reciben información más comercial que otros?</li>
              <li>• ¿Hay diferencias en el tono: optimista vs. pesimista?</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Implicaciones para la democracia</h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• ¿Cómo afecta esto el debate público informado?</li>
              <li>• ¿Qué grupos pueden quedar excluidos de cierta información?</li>
              <li>• ¿Cómo podríamos diversificar nuestras fuentes?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBiasAnalyzer;