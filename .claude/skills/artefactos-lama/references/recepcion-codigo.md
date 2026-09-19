# Recibir código de otra herramienta

Los ArtiLamas suelen nacer fuera de este repo: alguien del laboratorio
prototipa con Gemini o ChatGPT y entrega un archivo. Esta guía cubre el tramo
entre ese archivo y un simulador que despliega.

## Flujo

1. El autor guarda el código con la extensión correcta (ver abajo) y lo deja en
   `Dropbox/02_INVESTIGACION/Proyectos/LAMA/ArtiLamas_<Autor>/`.
2. Se identifica el tipo y se arma la estructura que corresponda.
3. Se corrigen las trampas conocidas (íconos, dependencias, claves).
4. Se agrega al catálogo y al despliegue — ver `despliegue.md`.

## Identificar qué es

| Empieza por | Es | Extensión |
|---|---|---|
| `<!DOCTYPE html>` | página completa | `.html` |
| `import React` / `export default function` | componente React | `.jsx` |
| tipos de TypeScript (`: string`, `interface`, `useState<Tipo>`) | componente tipado | `.tsx` |

Si llegó como `.rtf` —pasa cuando se copia desde un editor de macOS— el código
está ahí dentro pero envuelto en marcado RTF:

```bash
textutil -convert txt -stdout archivo.rtf > salida.jsx
```

Un `.txt` con JSX adentro se renombra y ya.

## Las dos trampas de lucide-react

Aparecen tarde: el código se ve bien, y el build falla en CI.

**1 · No existen los íconos de marcas comerciales.** `lucide-react` los excluye
a propósito por licencia. `Instagram`, `Twitter`, `Facebook`, `GitHub`,
`LinkedIn`, `YouTube`, `TikTok`, `WhatsApp` — ninguno existe, y el import
rompe el build.

Reemplazos que conservan el sentido: `Smartphone`, `Share2`, `Globe`, `Link2`,
`MessageCircle`, `Users`.

**2 · La versión importa.** La plantilla antigua fija `lucide-react@0.263.1`.
Íconos como `BrainCircuit`, `Microchip` o `Skull` no existen ahí y sí en
versiones recientes — que son las que conoce el modelo que generó el código.

Usa `"lucide-react": "^0.469.0"` o superior en los simuladores nuevos.

`verificar_simulador.py` detecta ambas cosas.

## Un `.jsx` suelto no se sirve solo

Un archivo con el componente necesita envoltorio. Dos caminos:

**Proyecto Vite** (preferido si usa dependencias como `lucide-react`). Copia
`simuladores/_template-react/`, que ya trae la estructura, y ajusta:

- `package.json` → `name`, y las dependencias que el componente use de verdad
- `vite.config.js` → `base: '/simuladores/<carpeta>/'`
- `src/App.jsx` → el componente recibido

**HTML con CDN** (si el componente no tiene dependencias externas). React,
ReactDOM y Babel Standalone desde unpkg, con el JSX dentro de
`<script type="text/babel">`. Hay que quitar los `import` de React, quitar el
`export default` y agregar el render:

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

## Tailwind solo si se usa

Si el componente trae sus propios estilos —un string `GLOBAL_STYLES` inyectado
en un `<style>`, o estilos en línea— **no** agregues `tailwindcss` ni
`postcss`. Un `src/index.css` con un reset mínimo basta:

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
```

Incluir Tailwind sin usarlo añade advertencias en el build y a veces lo rompe.

## Llamadas a la API de Anthropic desde el navegador

Un artefacto que llame a `https://api.anthropic.com/v1/messages` sin cabeceras
dará 401 siempre. Necesita una pantalla que pida la clave antes de arrancar, y:

```js
headers: {
  "x-api-key": window.__ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-allow-browser": "true",
}
```

**Nunca escribas una clave en el repositorio.** La clave la pone quien usa el
artefacto, en su propio navegador, y no se guarda. Un simulador público con una
clave incrustada la expone a cualquiera que abra el código fuente.
