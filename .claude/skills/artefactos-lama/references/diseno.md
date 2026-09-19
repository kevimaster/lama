# Rediseñar la apariencia de un artefacto

## Primero medir

```bash
python3 .claude/skills/artefactos-lama/scripts/medir_paleta.py
```

Ordena el catálogo por dos ejes, porque el problema tiene dos formas:

- **cálido** — el ocre/ámbar/arcilla en hexadecimales sueltos
- **plantilla** — las familias `slate` / `indigo` / `blue` / `gray` de Tailwind,
  que no son cálidas pero hacen que simuladores de temas muy distintos se vean
  iguales entre sí

Un porcentaje bajo en ambas columnas suele indicar una paleta decidida a
propósito. Revísala antes de tocarla: la primera vez que se hizo este
diagnóstico a ojo se propuso rediseñar `contagio-informacional`, que resultó
ser de los mejor resueltos —paleta oscura validada contra daltonismo, con
codificación por forma además de color—, mientras `ensamblaje-sociotecnico`,
con 79 % de color cálido, pasaba inadvertido.

## De dónde sale el ocre

Conviene nombrar la causa: **es la paleta de marca de Anthropic**. Es el
default al que deriva el modelo cuando no toma una decisión estética explícita
—fondo crema, tarjetas redondeadas, ámbar de acento, tipografía del sistema—.
No lo pide el material.

Por eso: **no uses la skill `brand-guidelines`** en artefactos LAMA. Aplica
exactamente esa paleta.

## Tomar una decisión estética explícita

Antes de la primera línea de CSS, decidir paleta y tipografía a propósito,
derivadas del tema que el artefacto trata. Un simulador sobre contagio
informacional no debería parecerse a uno sobre reconstrucción tras un sismo.

Herramientas, todas en `~/.claude/skills/` o disponibles en sesión:

- **`anydesign`** — si hay una referencia visual que gusta (captura, URL,
  Figma), la convierte en un `design.md` con tokens, tipografías e inventario
  de componentes. El camino más corto para no improvisar.
- **`theme-factory`** — diez temas listos, o genera uno a medida. El valor real
  para los simuladores está en el modo «a medida», no en los presets.
- **`frontend-design`** — dirección estética; empuja a comprometerse con un
  punto de vista en vez de quedarse en lo genérico.
- **`algorithmic-art`** — iconografía e ilustración generativa con semilla
  fija, para que el resultado sea reproducible entre builds.

El tema `plano-nocturno`, en
`~/.claude/skills/theme-factory/themes/plano-nocturno.md`, salió de este
proceso y sirve de ejemplo de qué debe fijar un tema.

## Validar el color, no elegirlo a ojo

La skill `dataviz` trae un validador ejecutable. Como es un módulo ES, para
correrlo desde Node hay que copiarlo a una carpeta con
`{"type":"module"}` en su `package.json`:

```bash
node validate_palette.js "#24A0CB,#F94D3A,#B166F8" --mode dark --surface "#0B1016"
```

Devuelve PASS/FAIL en cinco chequeos: banda de luminosidad, piso de croma,
separación para daltonismo, piso de visión normal y contraste contra el fondo.

Dos cosas que este validador enseñó y conviene no reaprender:

**La banda de luminosidad cambia según el fondo.** En modo oscuro los colores
categóricos deben caer en L 0.48–0.67 (OKLCH). Una paleta que se ve bien sobre
fondo claro falla sobre fondo oscuro. Si falla, recalcula en OKLCH fijando la
luminosidad y buscando el croma máximo dentro del gamut, en vez de ajustar
hexadecimales a mano.

**Tres hues categóricos, no más.** Un cuarto eje de color hace fallar la
separación para daltonismo: siete colores dieron ΔE 3,4 entre el peor par.
Cuando haga falta un cuarto eje, codifícalo por **forma o patrón**: trazo
continuo, punteado, discontinuo y grueso con punta son cuatro estados legibles
incluso impresos en blanco y negro. Y acompáñalos siempre del rótulo.

## Lo que un rediseño no toca

Las funciones que producen el análisis —lecturas, diagnósticos, puntos ciegos,
preguntas de cierre, retroalimentación— son el artefacto. Cambiarlas en un
rediseño es cambiar la pieza pedagógica sin que nadie lo haya pedido.

Al terminar, compruébalo en vez de afirmarlo. Extrae cada bloque de lógica de
la versión anterior y de la nueva, y compara las cadenas:

```python
def bloque(s, inicio, fin):
    i = s.index(inicio)
    return s[i:s.index(fin, i)]

for nombre, ini, fin in [("generarLectura", "function generarLectura", "function generarCeguera")]:
    print(nombre, "idéntico" if bloque(viejo, ini, fin) == bloque(nuevo, ini, fin) else "DIFIERE")
```

Si algo difiere, es un error que corregir, no una mejora que anunciar.

## Cosas que se rompen al rediseñar

**Mezclar `border` con `borderTop` en el mismo objeto de estilo de React**
produce una advertencia en cada render, porque el orden de aplicación entre
renders no está definido. Usa las propiedades largas:
`borderTop`, `borderRight`, `borderBottom`, `borderLeft`.

**Los rótulos sobre un lienzo pueden quedar tapados.** Si los nodos se dibujan
como elementos posicionados y las aristas en un SVG de fondo, los rótulos de
las aristas desaparecen detrás de los nodos. Dibuja los rótulos en una capa
propia por encima.

**La colocación aleatoria apila las fichas.** Proponer varias posiciones al
azar y quedarse con la que maximiza la distancia al nodo más cercano cuesta
diez líneas y vuelve legible el lienzo justo cuando empieza a tener algo que
leer.

**Los estilos en línea no admiten media queries.** Las rejillas que tienen que
reacomodarse a ancho de teléfono necesitan clases CSS reales. Comprueba que no
haya desbordamiento horizontal a 375 px:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth
```
