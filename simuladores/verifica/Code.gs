/**
 * Verifica: receptor de recorridos en Google Sheets
 * Laboratorio de Mediaciones Algorítmicas (LAMA), Universidad del Valle
 *
 * Pega este código en Extensiones > Apps Script de una hoja de Google
 * y publícalo como aplicación web (ver README.md).
 */

// Cambia esta clave antes de publicar. El panel del profesor la pide para leer los recorridos.
const CLAVE_PROFESOR = 'cambia-esta-clave';

const NOMBRE_HOJA = 'Recorridos';
const ENCABEZADOS = ['Recibido', 'Nombre', 'Consultas en orden', 'Minutos', 'A', 'B', 'C', 'D', 'E', 'General', 'Nota', 'Registro'];

function doPost(e) {
  try {
    const datos = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (datos.accion === 'guardar') return guardar_(datos.recorrido);
    if (datos.accion === 'listar') return listar_(datos.clave);
    return json_({ ok: false, error: 'accion' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Permite comprobar en el navegador que la implementación responde.
function doGet() {
  return json_({ ok: true, servicio: 'Verifica' });
}

function guardar_(rec) {
  if (!rec || !Array.isArray(rec.t) || !rec.r) return json_({ ok: false, error: 'registro' });
  const r = rec.r || {};
  const fila = [
    new Date(),
    texto_(rec.n, 60),
    texto_(rec.t.join(' > '), 400),
    Number(rec.m) || 0,
    texto_(r.A, 4), texto_(r.B, 4), texto_(r.C, 4), texto_(r.D, 4), texto_(r.E, 4),
    texto_(rec.o, 4),
    texto_(rec.nota, 2000),
    JSON.stringify(rec).slice(0, 45000)
  ];
  const candado = LockService.getScriptLock();
  candado.waitLock(10000);
  try {
    hoja_().appendRow(fila);
  } finally {
    candado.releaseLock();
  }
  return json_({ ok: true });
}

function listar_(clave) {
  if (clave !== CLAVE_PROFESOR) return json_({ ok: false, error: 'clave' });
  const hoja = hoja_();
  const ultima = hoja.getLastRow();
  if (ultima < 2) return json_({ ok: true, recorridos: [] });
  const valores = hoja.getRange(2, ENCABEZADOS.length, ultima - 1, 1).getValues();
  const recorridos = [];
  valores.forEach(function (v) {
    try { recorridos.push(JSON.parse(v[0])); } catch (err) { /* fila editada a mano: se omite */ }
  });
  return json_({ ok: true, recorridos: recorridos });
}

function hoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(ENCABEZADOS);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Recorta el texto y evita que un nombre o una nota se interpreten como fórmula.
function texto_(valor, max) {
  let s = String(valor == null ? '' : valor).slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
