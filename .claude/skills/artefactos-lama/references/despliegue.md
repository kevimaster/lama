# Desplegar un simulador

## El repo publica por dos vías, no una

`simuladores.lama.lat` se sirve desde **GitHub Pages**, vía
`.github/workflows/deploy.yml`. Pero el repo también tiene un `vercel.json`
conectado a **Vercel**, que ejecuta `scripts/build-vercel.js`.

Esto importa al diagnosticar: si el sitio no refleja un cambio, la causa puede
estar en cualquiera de los dos. Hubo un periodo en que `build-vercel.js` no
existía y cada despliegue de Vercel fallaba en silencio mientras Pages servía
bien — el sitio parecía actualizado a ratos y desactualizado a ratos.

Antes de investigar más hondo: comprueba que `scripts/build-vercel.js` existe y
replica lo que hace el workflow.

## HTML o React: el workflow lo decide solo

El script de ensamblado distingue por la presencia de `vite.config.js` o
`vite.config.ts` en la carpeta del simulador:

- **sin** vite config → se copia tal cual
- **con** vite config → `npm install && npm run build`, y se copia `dist/`

## Qué hay que agregar, según el tipo

### Simulador HTML

1. `simuladores/<carpeta>/index.html`
2. Su ficha en el catálogo de `index.html` (abajo)

Nada más. No va al matrix.

### Simulador React

1. La carpeta completa del proyecto Vite
2. `base: '/simuladores/<carpeta>/'` en `vite.config.js` — si falta o está mal,
   el simulador despliega y **sirve una página en blanco**, porque busca sus
   propios assets en la raíz del dominio
3. Su ficha en el catálogo
4. **La carpeta en el matrix de `.github/workflows/deploy.yml`**:

```yaml
    matrix:
      simulator:
        - anatomia-sistema-algoritmico
        - ...
        - tu-simulador-nuevo   ← aquí
```

Sin este paso el código queda en el repo y **nunca se construye**. No hay
error: sencillamente el simulador no aparece. Es el fallo más fácil de pasar
por alto porque todo lo demás parece correcto.

El workflow usa `npm install`, no `npm ci`, así que no hace falta commitear el
`package-lock.json`. Algunos simuladores lo tienen y otros no; sigue lo que
haga la carpeta en la que trabajas.

## La ficha del catálogo

En `index.html` hay un array de objetos, uno por simulador. El formato exacto:

```js
{ id:"LAMA-33", titulo:"Título visible",  tipo:"react",  estado:"funcional", carpeta:"nombre-de-carpeta",  desc:"Una frase que explique qué hace el simulador y qué pone en juego." },
```

- `id` — `LAMA-NN` correlativo
- `tipo` — `"html"` o `"react"`, debe coincidir con lo que hay en disco
- `estado` — `"wip"` o `"funcional"`; **`funcional` solo si los archivos existen**
- `carpeta` — el nombre exacto bajo `simuladores/`
- `desc` — una frase; es lo que lee quien busca en el catálogo

## Inyectar texto en HTML desde CI: no uses sed

El workflow inyecta el snippet de Google Tag Manager en cada página. Ese
snippet contiene `w[l]=w[l]||[]`. Un `sed -i "s|<head>|<head>\n${GTM}|"` se
rompe ahí: el `||` de JavaScript colisiona con el delimitador `|` de sed y
produce `unknown option to 's'`.

Para cualquier inyección de texto en HTML desde CI, usa Python, que no tiene
delimitadores:

```yaml
- name: Inject GTM
  run: |
    python3 << 'PYEOF'
    import glob
    GTM_HEAD = "...snippet completo como string de Python..."
    for path in glob.glob('_site/**/*.html', recursive=True):
        contenido = open(path).read()
        if 'GTM-KSBX4368' in contenido:
            continue
        open(path, 'w').write(contenido.replace('<head>', '<head>\n' + GTM_HEAD, 1))
    PYEOF
```

La regla general: si el texto a insertar puede contener `|`, `&`, `\` o `/`,
`sed` es la herramienta equivocada.

## Después del push

El workflow **Deploy LAMA to GitHub Pages** tarda unos minutos. Para seguirlo:

```bash
gh run list --limit 3
gh run watch <id> --exit-status
```

Cuando termine, abre la URL del simulador y recórrelo de verdad —no solo la
portada— antes de decir que quedó desplegado. El build de producción no es el
de desarrollo: importaciones que el servidor de desarrollo tolera pueden fallar
al empaquetar, y los errores de consola solo aparecen usando la pieza.
