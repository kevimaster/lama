---
name: artefactos-lama
description: "Cómo se construyen, despliegan y rediseñan los simuladores (ArtiLamas) del Laboratorio de Mediaciones Algorítmicas de la Universidad del Valle, en el repo kevimaster/lama. Úsala siempre que se trabaje en este repositorio: al recibir código de Gemini/ChatGPT/Claude para convertirlo en simulador, al crear o modificar cualquier carpeta bajo simuladores/, al tocar el catálogo de index.html o el workflow de despliegue, al rediseñar la apariencia de un artefacto, y antes de cualquier push. También cuando se hable de ArtiLamas, LAMA-NN, simuladores.lama.lat, o de por qué un simulador no aparece o sale en blanco tras desplegar. Trae scripts de verificación: úsalos en vez de revisar a mano."
---

# Artefactos LAMA

Los simuladores del laboratorio son piezas pedagógicas: hacen visible cómo
operan los sistemas algorítmicos sobre la vida social. Quien los usa es un
estudiante de periodismo, no un usuario de software. Eso fija dos prioridades
que ordenan todo lo demás: **el contenido analítico manda sobre la interfaz**, y
**un simulador que no despliega no existe**.

El catálogo vive en `simuladores/`, se publica en
https://simuladores.lama.lat y se indexa en `index.html`.

## Antes de cualquier push

```bash
python3 .claude/skills/artefactos-lama/scripts/verificar_simulador.py <carpeta>
```

Comprueba de una vez las cinco formas en que el sitio se ha roto antes: el
simulador React que falta en el matrix del workflow y por eso no se construye,
el `base` equivocado en `vite.config` que sirve una página en blanco, la ficha
marcada `funcional` sin archivos que produce un 404, el desajuste entre el
`tipo` del catálogo y lo que hay en disco, y los íconos de marca de
`lucide-react` que revientan el build. `--todos` revisa el catálogo entero.

Correrlo cuesta un segundo; cada uno de esos fallos costó una sesión.

## Las tres tareas

### 1 · Recibir código de otra herramienta

El flujo habitual es que llegue un archivo suelto generado con Gemini o
ChatGPT, a veces con la extensión equivocada, y haya que convertirlo en un
simulador desplegable.

Lee `references/recepcion-codigo.md` antes de tocarlo. Resume:
cómo identificar si es HTML, JSX o TSX; cómo rescatar código guardado como
`.rtf`; y las dos trampas de `lucide-react` que hacen fallar el build en CI
aunque compile en local.

### 2 · Conectar un simulador al despliegue

Lee `references/despliegue.md`. Hay **dos** mecanismos de publicación
—GitHub Pages y Vercel— y conviene saberlo antes de diagnosticar por qué el
sitio no actualiza. Allí está también el formato exacto de la ficha del
catálogo y qué hay que agregar según el simulador sea HTML o React.

### 3 · Rediseñar la apariencia

Lee `references/diseno.md`. Antes de rediseñar nada:

```bash
python3 .claude/skills/artefactos-lama/scripts/medir_paleta.py
```

Ordena el catálogo por qué tan cálida (ocre/ámbar) o qué tan de plantilla
(slate/indigo de Tailwind) es cada paleta. **Medir antes de proponer**: la
primera vez que se revisó el catálogo a ojo se propuso rediseñar el simulador
mejor resuelto de todos, mientras el peor pasaba inadvertido.

## Tres reglas que no dependen de la tarea

### El texto analítico no se toca en un rediseño

Las funciones que generan lecturas, diagnósticos, preguntas y
retroalimentación son el artefacto. La paleta y la tipografía son su envoltorio.
Un rediseño cambia el envoltorio y deja el contenido byte a byte igual.

Al terminar, verifícalo comparando los bloques de lógica contra la versión
anterior en vez de afirmarlo de memoria: extrae cada función de ambos archivos
y compara las cadenas. Si difieren, es un error, no una mejora — salvo que el
usuario haya pedido explícitamente cambiar el contenido.

### Nunca marcar `funcional` sin archivos

En `index.html` cada simulador lleva `estado:"wip"` o `estado:"funcional"`.
`funcional` pinta un botón «Explorar →». Si la carpeta no existe, ese botón
lleva a un 404 en un sitio público que usan estudiantes. El estado describe lo
que hay en disco, no lo que se planea.

### El artefacto no premia lo que critica

Un simulador sobre desinformación no da puntos por viralizar; uno sobre
vigilancia no recompensa extraer más datos. Si una mecánica hace divertido
justo aquello que el artefacto analiza críticamente, está enseñando lo
contrario de lo que dice enseñar. Cuando se añadan mecánicas de juego,
revisa qué conducta refuerzan.

## Convenciones del repo

- **Todo en español**: interfaz, comentarios del código, mensajes de commit,
  nombres de carpeta. Los identificadores del código pueden ir en inglés si
  siguen la convención del lenguaje.
- **Carpetas** en minúsculas con guiones: `contagio-informacional`.
- **Identificadores** `LAMA-NN` correlativos, asignados en el catálogo.
- **Comentarios con propósito declarado** en los simuladores densos:
  `[PEDAGOGÍA]` para por qué el modelo se comporta así, `[TÉCNICA]` para cómo
  está implementado. Ayuda a quien revisa a saber qué puede tocar.
- **Un simulador, un archivo** cuando sea viable: varios simuladores mantienen
  motor, interfaz y estilos en un solo componente para poder pegarse tal cual
  en un artefacto de Claude o en CodePen. Antes de partir uno en módulos,
  pregunta: la portabilidad suele ser una decisión, no un descuido.

## Herramientas que conviene combinar

Instaladas en `~/.claude/skills/`, fuera de este repo:

| Skill | Para qué en este contexto |
|---|---|
| `theme-factory` | elegir o generar paleta y par tipográfico; el tema `plano-nocturno` salió de aquí |
| `anydesign` | convertir una referencia visual (captura, URL, Figma) en un sistema de diseño documentado |
| `algorithmic-art` | iconografía e ilustración generativa con semilla fija |
| `skill-creator` | editar esta misma skill |

También conviene la skill `dataviz` para validar paletas categóricas, y
`frontend-design` para la dirección estética. Ver `references/diseno.md`.

**No uses `brand-guidelines`**: aplica la paleta ocre de marca de Anthropic,
que es justo el problema que se está corrigiendo en el catálogo.
