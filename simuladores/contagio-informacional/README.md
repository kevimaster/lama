# Contagio Informacional — LAMA-32

**¿Por qué la desinformación sigue viva después de ser corregida?**

Simulador de contagio informacional para alfabetización crítica frente a la
desinformación digital. Audiencia: estudiantes universitarios de pregrado sin
conocimientos previos de modelado computacional ni teoría de redes.

- **URL:** https://simuladores.lama.lat/simuladores/contagio-informacional/
- **Stack:** React 18 + Vite 5, sin ninguna otra dependencia.
- **Arquitectura:** todo el simulador (motor + UI + estilos) vive en
  `src/App.jsx` como archivo único **a propósito**: es portable tal cual a un
  artefacto de Claude o a CodePen (solo requiere React/ReactDOM). Este proyecto
  Vite es el envoltorio estándar del monorepo.

## Modelo (lógica pedagógica)

Modelo **SEIZ adaptado** (Jin et al., 2013) sobre una red de 132 agentes
humanos + 8 bots opcionales, con **memoria dual por agente**:

| Variable | Qué representa | Dinámica |
|---|---|---|
| `estado` | S susceptible · E expuesto · I creyente · Z escéptico · C corregido | transiciones probabilísticas por contacto |
| `contentRet` | memoria del **contenido** (la afirmación) | decae lento (vida media 140 h) y se **refresca** con cada reexposición |
| `sourceRet` | memoria de la **fuente/contexto** (quién lo dijo, si fue desmentido) | decae rápido (slider, 10–80 h) |
| `disonancia` | tensión creencia ↔ evidencia contradictoria | sube al recibir correcciones; decae 1.5 %/h |

Los dos sesgos del núcleo pedagógico:

1. **Amnesia de la fuente** (Johnson, Hashtroudi & Lindsay, 1993): la brecha
   entre las dos curvas de retención es el objeto visual central. Tiene
   consecuencias mecánicas: un agente corregido con `sourceRet < 0.30` y
   `contentRet > 0.40` puede **recaer** (efecto durmiente / influencia
   continuada, Lewandowsky et al., 2012) — vuelve al estado creyente.
2. **Disonancia cognitiva** (Festinger, 1957): si la disonancia acumulada
   supera `1 − resistencia` (slider), el agente **rechaza** la corrección
   (razonamiento motivado); con afinidad identitaria alta puede haber
   **efecto rebote** (Nyhan & Reifler, 2010): la creencia se refuerza y el
   agente comparte más (`zeal`).

Decisiones de calibración importantes (validadas headless con 8 semillas):

- **El desmentido tiene ciclo de noticia** (`corrVigor = e^(−t/60)`): deja de
  circular a los pocos días, mientras la desinformación sigue viva. Sin esta
  asimetría las recaídas casi no ocurren (la corrección circulando refresca
  `sourceRet` indefinidamente).
- **Ambas topologías tienen el mismo número de aristas**; solo cambia la
  fracción de atajos intercomunitarios (eco 5 % / heterogénea 30 %). Si en
  lugar de recablear se añaden puentes, se confunde mezcla con densidad.
- La **corrección temprana y la tardía convergen en creyentes finales** (la
  amnesia erosiona ambas) pero difieren mucho en pico e inoculados — la
  pregunta de predicción del modo Comparar está formulada para capturar ese
  matiz, no para esconderlo.
- La **versión verificada del mismo hecho** corre como motor sombra en la
  misma red (menos emotiva → menos viral, sin bots, casi sin amplificación).

## Anti-banalización (por diseño)

No hay puntos por viralizar. La única recompensa (insignias 🔍) premia
**predicciones acertadas** en el modo Comparar: análisis, no eficacia
propagandística. Si extiendes el simulador, mantén este principio.

## Estructura del código

`src/App.jsx`, secciones §1–§9 (ver mapa en el encabezado del archivo). Los
comentarios distinguen `[PEDAGOGÍA]` (por qué el modelo se comporta así) de
`[TÉCNICA]` (cómo está implementado). Claves de rendimiento: layout de fuerza
se asienta al generar la red (posiciones fijas después); los enlaces son un
solo `<path>` memoizado; el bucle corre a 12.5 ticks/s con costo medido de
~0.06 ms/tick para 140 nodos.

## Portar a artefacto de Claude / CodePen

Copiar `src/App.jsx` completo; eliminar la línea `import React ...` si el
entorno ya inyecta React; montar con `ReactDOM.createRoot(...).render(<App/>)`.
No usa localStorage, fetch, ni recursos externos.

## Extender

- Escenarios: añadir entradas a `ESCENARIOS` (§6) — parámetros + narrativa.
- Comparaciones guiadas: añadir a `COMPARACIONES` — incluir `evaluar()`, que
  calcula la respuesta correcta **desde los datos observados**, nunca
  hardcodeada.
- Tercer sesgo (verdad ilusoria) ya existe como toggle opcional (`ctl.ilusoria`).

---
LAMA · Laboratorio de Mediaciones Algorítmicas · Universidad del Valle · [lama.lat](https://lama.lat)
