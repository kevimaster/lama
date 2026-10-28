# Verifica

Simulador de verificación periodística del Laboratorio de Mediaciones Algorítmicas (LAMA), Escuela de Comunicación Social, Universidad del Valle.

Por: Kevin Alexis García. Diseño y desarrollo en colaboración con Claude, de Anthropic.

La portada ofrece tres casos ficticios, cada uno con tiempo simulado: escoges uno, investigas, calificas cada afirmación citando tus pistas y escribes una nota de verificación. El profesor compara los recorridos de cada caso en el panel de plenaria (`index.html#panel`).

- **01 · La cadena del San Rafael** (introductorio): un audio y una foto anuncian el cierre de un hospital tras una réplica.
- **02 · El 38 %** (intermedio): una alcaldesa celebra que los homicidios bajaron 38 %; primero se separa lo verificable de la opinión.
- **03 · La consulta** (avanzado): una campaña segmentada muestra a cada público una versión distinta de la misma consulta popular.

Cada caso tiene su propia dirección (`#caso-01`, `#caso-02`, `#caso-03`) y guarda el progreso por separado.

## Archivos

- `index.html`: el juego completo en un solo archivo, con los tres casos y la foto incluida.
- `Code.gs`: receptor opcional de recorridos en una hoja de Google.

## Recepción automática en Google Sheets (opcional)

Sin este paso, cada estudiante copia el código de su recorrido y lo pega en el chat de la clase; el profesor lo carga en el panel.

1. Crea una hoja de cálculo nueva en Google Drive. Por ejemplo: «Verifica · Recorridos».
2. En la hoja, abre **Extensiones > Apps Script**, borra el contenido del editor y pega `Code.gs`.
3. Cambia `CLAVE_PROFESOR` por una clave propia y guarda.
4. Pulsa **Implementar > Nueva implementación**. Tipo: **Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier persona**. Autoriza los permisos que pide Google.
5. Copia la URL de la aplicación web (termina en `/exec`).
6. En `index.html`, busca `const SHEET_URL = "";` y pega la URL entre las comillas. Sube el archivo.
7. Abre `.../#panel`, escribe la clave y pulsa «Cargar recorridos». El panel se actualiza cada 20 segundos.

Para comprobar que la implementación responde, abre la URL `/exec` en el navegador: debe mostrar `{"ok":true,"servicio":"Verifica"}`.

Si cambias `Code.gs` después, publica una versión nueva desde **Implementar > Gestionar implementaciones** (editar, versión nueva). Así la URL no cambia.

## Notas

- Cualquiera que tenga la URL `/exec` puede enviar recorridos; leerlos exige la clave del profesor.
- Las respuestas correctas viven en el código de la página: un estudiante que lea el código fuente podría verlas.
- El progreso de cada estudiante se guarda en su navegador, por caso.
- `Code.gs` sirve para los tres casos: el registro completo (con el caso) queda en la columna «Registro», que es la que lee el panel. Las columnas A a E guardan las calificaciones por letra de afirmación (el caso 01 usa A–E, el 02 A–D y el 03 A–C); la hoja no tiene columna de caso, así que el caso de cada fila se lee en el campo `"c"` del registro.
- La foto del caso 01 es de EFE / Ernesto Guzmán (Hospital Universitario del Valle, Cali). Se usa con fines pedagógicos dentro de un caso ficticio.
