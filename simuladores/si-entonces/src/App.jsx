import React, { useState, useEffect, useMemo } from 'react';

// ==============================================================
// ARTILAMA · SI... ENTONCES
// Genealogía contingente de un resultado algorítmico
// LAMA — Laboratorio de Mediaciones Algorítmicas
// Universidad del Valle · Cali, Colombia
// v2 — Rediseño visual con paleta LAMA
// ==============================================================

const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..800&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=JetBrains+Mono:wght@400;500;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* ─── PALETA LAMA ─── */
  --bg:              #FDFAF1;
  --bg-alt:          #F4F1E6;
  --card:            #E3E9D8;
  --card-hover:      #D5DFCA;
  --border:          rgba(52, 63, 30, 0.16);
  --border-mid:      rgba(52, 63, 30, 0.32);
  --border-strong:   rgba(52, 63, 30, 0.55);
  --text:            #343F1E;
  --text-muted:      #566038;
  --text-subtle:     #8A9C62;
  --accent:          #5C8607;
  --accent-bright:   #70A309;
  --accent-dim:      #3E5A05;
  --accent-bg:       rgba(92, 134, 7, 0.08);
  --accent-bg-hover: rgba(92, 134, 7, 0.15);
  --dark-header:     #343F1E;
  --darkest:         #050505;

  /* ─── ALIASES INTERNOS ─── */
  --ink-deepest:    #FDFAF1;
  --ink-deep:       #F4F1E6;
  --ink:            #EEF0E8;
  --ink-elevated:   #E3E9D8;
  --ink-raised:     #D8E0C8;
  --hairline:       rgba(52, 63, 30, 0.14);
  --hairline-bright:rgba(52, 63, 30, 0.26);
  --stone:          #6B7A48;
  --bone:           #343F1E;
  --paper:          #FDFAF1;
  --paper-bright:   #FFFFFF;
  --paper-aged:     #EDF0E2;
  --amber:          #5C8607;
  --amber-bright:   #70A309;
  --amber-dim:      #3E5A05;
  --rust:           #5C8607;
  --rust-deep:      #3E5A05;
  --moss:           #70A309;
  --moss-bright:    #8AB40B;
  --ink-text:       #343F1E;
}

html, body, #root {
  background: var(--bg);
  color: var(--text);
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 400;
  font-size: 17px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.se-app { min-height: 100vh; }

/* ─── TIPOGRAFÍA ─── */
.se-display { font-family: 'Fraunces', Georgia, serif; font-variation-settings: 'opsz' 144, 'SOFT' 30; letter-spacing: -0.015em; }
.se-serif   { font-family: 'Newsreader', Georgia, serif; }
.se-mono    { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'ss01'; letter-spacing: -0.01em; }

/* ─── HEADER ─── */
.se-header {
  background: var(--dark-header);
  border-bottom: 1px solid rgba(52, 63, 30, 0.0);
  padding: 16px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}
.se-header-left { display: flex; align-items: baseline; gap: 20px; }
.se-header-mark {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--accent-bright);
  text-transform: uppercase;
}
.se-header-case {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(227, 233, 216, 0.45);
  letter-spacing: 0.08em;
}
.se-header-right { display: flex; align-items: center; gap: 18px; }
.se-phase-indicator {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(227, 233, 216, 0.55);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.se-phase-dots { display: flex; gap: 7px; }
.se-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: rgba(227, 233, 216, 0.18);
  transition: all 0.4s ease;
}
.se-dot.active { background: var(--accent-bright); box-shadow: 0 0 8px rgba(112, 163, 9, 0.55); }
.se-dot.done   { background: rgba(112, 163, 9, 0.45); }

/* ─── CONTENEDORES ─── */
.se-container { max-width: 1100px; margin: 0 auto; padding: 56px 48px 88px; }
.se-narrow    { max-width: 760px; margin: 0 auto; }
@media (max-width: 768px) { .se-container { padding: 32px 20px 60px; } }

/* ─── PANEL EXPEDIENTE ─── */
.se-paper {
  background: #FFFFFF;
  color: var(--ink-text);
  border-radius: 2px;
  padding: 60px 72px 72px;
  position: relative;
  border: 1px solid var(--border);
  box-shadow: 0 6px 32px rgba(52, 63, 30, 0.07), 0 1px 4px rgba(52, 63, 30, 0.04);
}
@media (max-width: 768px) { .se-paper { padding: 36px 24px 48px; } }

.se-paper-corner {
  position: absolute;
  top: 22px; right: 26px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--accent-dim);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border: 1px solid var(--border-mid);
  padding: 4px 11px;
  transform: rotate(-1.5deg);
  background: var(--card);
}

/* ─── APERTURA — ESTRUCTURAS ─── */
.se-opening { display: flex; flex-direction: column; align-items: stretch; }

.se-case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  margin-bottom: 52px;
  border-bottom: 1px solid var(--border-mid);
}
.se-case-meta-left { display: flex; align-items: center; gap: 16px; }
.se-case-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-dim);
  background: var(--card);
  border: 1px solid var(--border-mid);
  padding: 5px 13px;
}
.se-case-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.12em;
}
.se-case-location {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: var(--text-subtle);
  letter-spacing: 0.1em;
}

.se-opening-hero { margin-bottom: 48px; }

.se-artilama-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.26em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.se-artilama-label::before { content: '◆'; font-size: 8px; }

.se-opening-title {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 144, 'SOFT' 0, 'wght' 400;
  font-size: clamp(44px, 5.5vw, 78px);
  line-height: 1.0;
  letter-spacing: -0.025em;
  color: var(--text);
  margin-bottom: 20px;
}
.se-opening-subtitle {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 20px;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 640px;
}

/* Stats row */
.se-opening-stats {
  display: flex;
  margin-bottom: 52px;
  border: 1px solid var(--border);
  overflow: hidden;
  border-radius: 2px;
}
.se-stat-item {
  flex: 1;
  padding: 22px 28px;
  border-right: 1px solid var(--border);
  background: var(--card);
}
.se-stat-item:last-child { border-right: none; }
.se-stat-number {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 72, 'wght' 600;
  font-size: 38px;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 5px;
}
.se-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Fact */
.se-opening-fact-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.24em;
  color: var(--accent-dim);
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.se-opening-fact-label::after {
  content: '';
  height: 1px;
  flex: 1;
  background: var(--border-mid);
}
.se-opening-fact {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 19px;
  line-height: 1.68;
  color: var(--text);
  border-left: 3px solid var(--accent);
  padding: 20px 28px;
  margin-bottom: 52px;
  background: var(--accent-bg);
  max-width: 820px;
}
.se-opening-cta { display: flex; flex-direction: column; gap: 0; }
.se-opening-disclaimer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--text-subtle);
  letter-spacing: 0.1em;
  border-top: 1px solid var(--border);
  padding-top: 18px;
  margin-top: 24px;
}

/* ─── BOTONES ─── */
.se-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 14px 28px;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  cursor: pointer;
  transition: all 0.22s ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.se-btn:hover:not(:disabled) { background: var(--accent); color: var(--bg); }
.se-btn:disabled { opacity: 0.32; cursor: not-allowed; }

.se-btn-paper {
  border-color: var(--text);
  color: var(--text);
  padding: 16px 36px;
  font-size: 12px;
  letter-spacing: 0.18em;
}
.se-btn-paper:hover:not(:disabled) { background: var(--text); color: var(--bg); }

.se-btn-rust {
  border-color: var(--accent-dim);
  color: var(--accent-dim);
}
.se-btn-rust:hover:not(:disabled) { background: var(--accent-dim); color: var(--bg); }

/* ─── SECCIONES ─── */
.se-section-title {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 12px;
}
.se-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--accent);
  text-transform: uppercase;
  white-space: nowrap;
}
.se-section-rule { flex: 1; height: 1px; background: var(--border); }

.se-section-heading {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 80, 'SOFT' 50;
  font-size: 38px;
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--text);
  margin-bottom: 14px;
}
.se-section-intro {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 18px;
  color: var(--text-muted);
  max-width: 700px;
  margin-bottom: 40px;
  line-height: 1.65;
}

/* ─── FRAGMENTOS (Cuatro voces) ─── */
.se-fragments-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 52px;
}
@media (max-width: 760px) { .se-fragments-grid { grid-template-columns: 1fr; } }

.se-fragment {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 30px 30px 24px;
  position: relative;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
  border-radius: 2px;
}
.se-fragment:hover {
  border-color: var(--border-mid);
  box-shadow: 0 4px 18px rgba(52, 63, 30, 0.07);
}
.se-fragment-source {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 4px;
}
.se-fragment-attribution {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 18px;
}
/* ★ CLAVE: sin cursiva, tamaño generoso, texto oscuro sobre fondo claro */
.se-fragment-quote {
  font-family: 'Newsreader', Georgia, serif;
  font-style: normal;
  font-size: 18px;
  line-height: 1.68;
  color: var(--text);
  padding-left: 18px;
  border-left: 2px solid var(--border-mid);
}
.se-fragment-meta {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--text-subtle);
  letter-spacing: 0.1em;
}

/* ─── ATRIBUCIÓN INTUITIVA ─── */
.se-attribution-block {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  padding: 36px 40px;
  margin-bottom: 32px;
  border-radius: 2px;
}
.se-attribution-prompt {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 60, 'wght' 400;
  font-size: 22px;
  line-height: 1.42;
  color: var(--text);
  margin-bottom: 28px;
  max-width: 620px;
}
.se-attribution-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 28px;
}
@media (max-width: 700px) { .se-attribution-options { grid-template-columns: 1fr; } }

.se-attribution-option {
  background: #FFFFFF;
  border: 1px solid var(--border);
  padding: 16px 20px;
  cursor: pointer;
  text-align: left;
  color: var(--text);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 15.5px;
  line-height: 1.45;
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-radius: 2px;
}
.se-attribution-option:hover {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.se-attribution-option.selected {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.se-attribution-marker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-subtle);
  letter-spacing: 0.15em;
  flex-shrink: 0;
  padding-top: 3px;
  min-width: 18px;
}
.se-attribution-option.selected .se-attribution-marker { color: var(--accent); }

.se-textarea {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid var(--border);
  padding: 16px 18px;
  color: var(--text);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 16px;
  line-height: 1.55;
  resize: vertical;
  min-height: 88px;
  transition: border-color 0.2s ease;
  border-radius: 1px;
}
.se-textarea:focus { outline: none; border-color: var(--accent); }
.se-textarea::placeholder { color: var(--text-subtle); }

.se-textarea-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* ─── MESA DE DISECCIÓN ─── */
.se-dissection-intro {
  background: var(--card);
  border-left: 3px solid var(--accent);
  padding: 22px 30px;
  margin-bottom: 36px;
}
.se-dissection-instructions {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 17px;
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 700px;
}

.se-result-anchor {
  background: var(--accent-bg);
  border: 1px solid var(--border-mid);
  padding: 24px 32px;
  margin-bottom: 36px;
  position: relative;
  border-radius: 2px;
}
.se-result-anchor-label {
  position: absolute;
  top: -10px; left: 24px;
  background: var(--bg);
  padding: 0 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.22em;
  color: var(--accent);
  text-transform: uppercase;
  border: 1px solid var(--border-mid);
}
.se-result-anchor-text {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 17px;
  line-height: 1.6;
  color: var(--text);
}

.se-nodes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 40px;
}

.se-node {
  background: #FFFFFF;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  border-radius: 2px;
}
.se-node.touched         { border-color: var(--accent); background: rgba(92, 134, 7, 0.02); }
.se-node.hidden-discovered { border-color: var(--accent-bright); }

.se-node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  cursor: pointer;
  gap: 18px;
}
.se-node-header:hover { background: var(--card); }

.se-node-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-subtle);
  letter-spacing: 0.15em;
  flex-shrink: 0;
}
.se-node.touched .se-node-id          { color: var(--accent); }
.se-node.hidden-discovered .se-node-id { color: var(--accent-bright); }

.se-node-title {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 36, 'wght' 500;
  font-size: 18px;
  color: var(--text);
  flex: 1;
  line-height: 1.3;
}

.se-node-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}
.se-node-status.default-state { color: var(--text-subtle); }
.se-node-status.modified      { color: var(--accent); }

.se-chevron { transition: transform 0.3s ease; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-subtle); }
.se-chevron.open { transform: rotate(90deg); }

.se-node-body {
  padding: 4px 24px 24px;
  border-top: 1px solid var(--border);
}
.se-node-description {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 18px 0 22px;
}

.se-node-states { display: flex; flex-direction: column; gap: 8px; }

.se-state-option {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  cursor: pointer;
  text-align: left;
  color: var(--text);
  font-family: 'Newsreader', Georgia, serif;
  transition: all 0.2s ease;
  border-radius: 1px;
}
.se-state-option:hover { border-color: var(--border-mid); background: var(--card); }
.se-state-option.is-default {
  border-style: dashed;
  border-color: var(--border-mid);
  background: rgba(52, 63, 30, 0.03);
}
.se-state-option.is-selected {
  border-style: solid;
  border-color: var(--accent);
  background: var(--accent-bg);
}
.se-state-marker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-subtle);
  flex-shrink: 0;
  padding-top: 3px;
  letter-spacing: 0.15em;
}
.se-state-option.is-selected .se-state-marker { color: var(--accent); }
.se-state-option.is-default  .se-state-marker { color: var(--text-muted); }
.se-state-text { font-size: 15px; line-height: 1.55; flex: 1; }
.se-state-default-badge {
  display: inline-block;
  margin-left: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--accent-dim);
  text-transform: uppercase;
  border: 1px solid var(--border-mid);
  padding: 2px 6px;
  vertical-align: middle;
  background: var(--card);
}

.se-counterfactual {
  margin-top: 16px;
  padding: 20px 26px;
  background: var(--accent-bg);
  border-left: 3px solid var(--accent);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 16px;
  line-height: 1.65;
  color: var(--text);
}
.se-counterfactual-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.22em;
  color: var(--accent-dim);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.se-trace-hint {
  margin-top: 24px;
  padding: 18px 22px;
  background: var(--card);
  border: 1px dashed var(--border-mid);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 2px;
}
.se-trace-hint:hover { background: var(--accent-bg); border-color: var(--accent); }
.se-trace-hint-icon  { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--accent); }
.se-trace-hint-text  { font-family: 'Newsreader', Georgia, serif; font-size: 16px; color: var(--text-muted); line-height: 1.5; flex: 1; }
.se-trace-hint-cta   { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 0.18em; text-transform: uppercase; }

.se-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 0;
  border-top: 1px solid var(--border);
}
.se-progress-stat { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 0.12em; }
.se-progress-stat strong { color: var(--accent); font-weight: 500; }

/* ─── CARTOGRAFÍA Y PERITAJE ─── */
.se-cartography {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 32px;
  margin-bottom: 40px;
}
@media (max-width: 900px) { .se-cartography { grid-template-columns: 1fr; } }

.se-map-frame {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 22px;
  min-height: 480px;
  position: relative;
  border-radius: 2px;
}
.se-map-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 18px;
}
.se-map-title { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: var(--accent); text-transform: uppercase; }
.se-map-legend { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--text-subtle); letter-spacing: 0.1em; display: flex; gap: 14px; }
.se-legend-item { display: flex; align-items: center; gap: 6px; }
.se-legend-dot  { width: 8px; height: 8px; border-radius: 50%; }

.se-peritaje-frame {
  background: #FFFFFF;
  border: 1px solid var(--border);
  padding: 36px 40px;
  position: relative;
  border-radius: 2px;
}
.se-peritaje-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 14px;
  margin-bottom: 22px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.se-peritaje-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: var(--accent-dim); text-transform: uppercase; }
.se-peritaje-meta  { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-subtle); letter-spacing: 0.1em; }
.se-peritaje-prompt {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 60, 'wght' 400;
  font-size: 19px;
  line-height: 1.45;
  color: var(--text);
  margin-bottom: 22px;
}
.se-peritaje-textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 8px 0;
  color: var(--text);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 16.5px;
  line-height: 1.7;
  resize: vertical;
  min-height: 200px;
  background-image: repeating-linear-gradient(transparent, transparent 27px, var(--border) 27px, var(--border) 28px);
}
.se-peritaje-textarea:focus { outline: none; }
.se-peritaje-textarea::placeholder { color: var(--text-subtle); }
.se-peritaje-counter {
  margin-top: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-subtle);
  letter-spacing: 0.1em;
  display: flex;
  justify-content: space-between;
}
.se-peritaje-counter strong { color: var(--accent); font-weight: 500; }

/* ─── CONFRONTACIÓN FINAL ─── */
.se-confrontation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-bottom: 48px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 2px;
  overflow: hidden;
}
@media (max-width: 800px) { .se-confrontation { grid-template-columns: 1fr; } }

.se-conf-panel { padding: 32px 36px 36px; }
.se-conf-panel.before { background: var(--bg-alt); }
.se-conf-panel.after  { background: var(--card); }

.se-conf-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 8px; }
.se-conf-panel.before .se-conf-label { color: var(--text-muted); }
.se-conf-panel.after  .se-conf-label { color: var(--accent); }

.se-conf-time { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--text-subtle); letter-spacing: 0.12em; margin-bottom: 22px; }
.se-conf-attribution {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 60, 'wght' 500;
  font-size: 22px;
  line-height: 1.3;
  color: var(--text);
  margin-bottom: 14px;
}
.se-conf-reasoning { font-family: 'Newsreader', Georgia, serif; font-size: 15.5px; line-height: 1.6; color: var(--text-muted); font-style: italic; }
.se-conf-peritaje   { font-family: 'Newsreader', Georgia, serif; font-size: 15.5px; line-height: 1.65; color: var(--text); white-space: pre-wrap; }

.se-closing-prompt {
  background: var(--card);
  border: 1px solid var(--border-mid);
  padding: 40px 44px;
  margin-bottom: 32px;
  border-radius: 2px;
}
.se-closing-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px; }
.se-closing-question {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 96, 'wght' 400;
  font-size: 28px;
  line-height: 1.3;
  color: var(--text);
  max-width: 720px;
}
.se-closing-sub { font-family: 'Newsreader', Georgia, serif; font-size: 17px; line-height: 1.65; color: var(--text-muted); margin-top: 18px; max-width: 640px; }

.se-coda {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 17.5px;
  line-height: 1.72;
  color: var(--text-muted);
  max-width: 720px;
}
.se-coda em { font-style: italic; color: var(--text); }
.se-coda-attrib { margin-top: 18px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-subtle); letter-spacing: 0.15em; text-transform: uppercase; }
.se-coda-links {
  display: flex;
  gap: 16px;
  margin-top: 36px;
  flex-wrap: wrap;
}
.se-btn-coda {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 13px 26px;
  background: transparent;
  border: 1px solid var(--border-mid);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.22s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  border-radius: 1px;
}
.se-btn-coda:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

/* ─── ANIMACIONES ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.se-fade-in      { animation: fadeUp 0.6s ease-out; }
.se-fade-in-slow { animation: fadeUp 0.9s ease-out; }

@keyframes pulseGreen {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
.se-pulse { animation: pulseGreen 2.5s ease-in-out infinite; }

/* ─── FOOTER ─── */
.se-footer {
  border-top: 1px solid var(--border);
  padding: 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-subtle);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: var(--bg-alt);
}

button { font: inherit; }
input, textarea { font: inherit; }
`;

// ──────────────────────────────────────────────────────────────
// CONTENIDO CURADO DEL CASO
// ──────────────────────────────────────────────────────────────

const CASE = {
  id: 'N-CAU-2024-003',
  title: 'La interrupción del Tejido',
  subtitle: 'Desmonetización en cadena de un colectivo de comunicación comunitaria del Norte del Cauca',
  location: 'Norte del Cauca, Colombia',
  date: 'marzo de 2024',
  classification: 'Reconstrucción analítica',
  centralFact:
    'Un reportaje audiovisual de 18 minutos sobre el asesinato de Marcela Quintero, autoridad espiritual del resguardo de Munchique, publicado por el colectivo Tejido Renaciente en su canal de YouTube, fue desmonetizado en tres horas, etiquetado como "contenido no apto para anunciantes" y vio caer su alcance en 87% en las primeras 48 horas. Tres reportajes anteriores del mismo canal recibieron tratamiento equivalente esa semana.',
  disclaimer: 'Caso reconstruido a partir de patrones documentados en literatura académica y reportajes verificados. Nombres de personas y de organizaciones modificados.',
};

const PUBLIC_DISCOURSE = [
  {
    id: 'corp',
    source: 'Comunicado corporativo · YouTube/Google Colombia',
    attribution: '14 de marzo de 2024',
    text: 'Nuestros sistemas aplican consistentemente las Normas para anunciantes a nivel global. Los creadores pueden solicitar una revisión humana cuando consideren que la clasificación automatizada de su contenido no fue la adecuada. La presencia de imágenes que nuestras políticas identifican como sensibles puede afectar la idoneidad publicitaria, con independencia del contexto.',
    meta: 'Tipo de discurso: difusivo / técnico-vacío',
  },
  {
    id: 'collective',
    source: 'Denuncia pública · Colectivo Tejido Renaciente',
    attribution: '15 de marzo de 2024',
    text: 'Llevamos ocho años documentando la vida y la muerte en este territorio. La plataforma nos pide brillo de marca mientras enterramos a nuestras mayoras. Que silencien nuestros videos no es un error técnico: es una decisión sobre qué dolores merecen ser oídos y cuáles deben ser invisibles para que el negocio funcione.',
    meta: 'Tipo de discurso: testimonial / contestatario',
  },
  {
    id: 'expert',
    source: 'Hilo de Twitter · Investigadora en plataformas, Universidad Javeriana',
    attribution: '15 de marzo de 2024',
    text: 'Esto no es censura algorítmica en sentido estricto. Es la operación normal de un sistema de clasificación entrenado en contextos donde la palabra "asesinato" es una anomalía editorial, no una rutina periodística del territorio. El sistema no nos discrimina: hace lo que se le pidió hacer, en otra parte del mundo, para otro tipo de medio.',
    meta: 'Tipo de discurso: experto / analítico',
  },
  {
    id: 'comms',
    source: 'Audio para podcast comunitario · Comunicador del Tejido',
    attribution: '17 de marzo de 2024',
    text: 'A nosotros nadie nos avisó que la lengua del clasificador no era la nuestra. Aprendimos a hablar para una máquina que no estaba escuchándonos. Editamos los títulos, suavizamos los tagueos, dejamos de mostrar ciertos planos. Hicimos todo lo que se hace cuando uno quiere ser oído, pero la conversación ocurría en otra parte.',
    meta: 'Tipo de discurso: práctico / fenomenológico',
  },
];

const ATTRIBUTION_OPTIONS = [
  { id: 'algo',        label: 'El algoritmo de clasificación de contenido',            marker: 'A' },
  { id: 'platform',   label: 'La empresa, por sus decisiones de política y diseño',   marker: 'B' },
  { id: 'team',       label: 'Los equipos de moderación humana subcontratados',        marker: 'C' },
  { id: 'ads',        label: 'Los anunciantes que presionan por "brand safety"',       marker: 'D' },
  { id: 'market',     label: 'La lógica de mercado del ecosistema en su conjunto',    marker: 'E' },
  { id: 'collective', label: 'En parte, las prácticas discursivas del propio canal',  marker: 'F' },
  { id: 'distributed',label: 'No es atribuible a un actor único — agencia distribuida', marker: 'G' },
];

const NODES = [
  {
    id: 'N1',
    title: 'Dataset de entrenamiento del clasificador',
    description: 'El corpus con el que se entrenó el modelo que detecta "contenido inseguro para anunciantes". Define qué patrones visuales y léxicos activan la alerta.',
    states: [
      { key: 'default', text: 'Entrenado principalmente sobre contenido en inglés, con material periodístico anglosajón y europeo. La cobertura latinoamericana de conflicto armado está sub-representada.', isDefault: true },
      { key: 'alt1', text: 'Entrenado con un corpus periodístico latinoamericano que incluye coberturas sostenidas de conflicto, líderes sociales y procesos de paz en español andino.', counterfactual: 'El clasificador habría reconocido el video como periodismo de territorio, no como contenido genérico de violencia. Marcela Quintero habría sido categorizada como sujeto noticioso, no como variable de alerta.' },
      { key: 'alt2', text: 'Entrenado únicamente con contenido corporativo: estudios cinematográficos, deportes, gaming, brand content.', counterfactual: 'La sensibilidad del clasificador habría sido aún más agresiva: cualquier mención periodística habría activado la etiqueta de "no apto". El sesgo es estructural, no un descuido marginal.' },
    ],
  },
  {
    id: 'N2',
    title: 'Política de excepción periodística',
    description: 'La cláusula corporativa que permite que contenido sensible sea apto para anunciantes si tiene "valor periodístico". Define quién accede a esa excepción.',
    states: [
      { key: 'default', text: 'La excepción existe, pero requiere que el canal esté verificado como medio de prensa. Tejido Renaciente no está verificado: opera como "canal de creador".', isDefault: true },
      { key: 'alt1', text: 'La excepción se aplica automáticamente a cualquier canal que documente sistemáticamente eventos verificables de interés público, con o sin verificación corporativa.', counterfactual: 'El reportaje habría sido marcado como sensible pero apto para anunciantes selectivos. La pérdida económica del Tejido habría sido marginal, no del 87% de alcance.' },
      { key: 'alt2', text: 'La excepción no existe. La política aplica idénticamente a todo el contenido, sin distinción periodística.', counterfactual: 'CNN, The Guardian, Reuters habrían sufrido el mismo bloqueo. La política sería inviable comercialmente, lo que sugiere que la excepción no es técnica sino política: protege a unos medios y no a otros.' },
    ],
  },
  {
    id: 'N3',
    title: 'Equipo de revisión humana',
    description: 'Las personas que revisan apelaciones cuando un creador disputa la clasificación automatizada. Su ubicación, idioma y formación condicionan el resultado.',
    states: [
      { key: 'default', text: 'Operación subcontratada en Hyderabad. El equipo no habla español andino ni conoce el contexto colombiano. Trabaja con un checklist visual y un tiempo promedio de 12 segundos por video.', isDefault: true },
      { key: 'alt1', text: 'Equipo regional radicado en Bogotá o Medellín, con conocimiento del conflicto colombiano y formación periodística básica.', counterfactual: 'La apelación del Tejido habría sido escuchada como lo que era: una pieza periodística sobre una líder asesinada. Pero el costo operativo se multiplicaría por veinte, lo que explica la decisión arquitectónica de no tener equipos regionales.' },
      { key: 'alt2', text: 'Sin revisión humana. La clasificación automatizada es final y no admite apelación.', counterfactual: 'No habría diferencia visible con el escenario actual: la apelación del Tejido tardó once días y fue rechazada con un mensaje automático. La revisión humana opera como ritual de legitimación más que como instancia correctiva.' },
    ],
  },
  {
    id: 'N4',
    title: 'Historial y estatus del canal',
    description: 'Lo que la plataforma "sabe" del Tejido como entidad: antigüedad, suscriptores, verificación, comportamiento previo.',
    states: [
      { key: 'default', text: 'Canal de ocho años, 12.400 suscriptores, sin verificación de medio, contenido predominantemente en español con segmentos en nasa yuwe.', isDefault: true },
      { key: 'alt1', text: 'El mismo canal, pero verificado como medio de prensa tras un proceso de seis meses con la plataforma.', counterfactual: 'El video habría pasado por una segunda capa de clasificación que incluye "contexto verificado". Probabilidad de desmonetización: reducida en torno al 60%. Pero la verificación exige una estructura legal e infraestructural que el Tejido no posee — el costo de ser legible.' },
      { key: 'alt2', text: 'Canal nuevo, primer mes de publicación, sin historial previo.', counterfactual: 'La desmonetización habría sido automática y sin posibilidad de apelación, además de un período probatorio de 90 días. La antigüedad del canal le dio al Tejido el privilegio de poder apelar.' },
    ],
  },
  {
    id: 'N5',
    title: 'Anunciantes prioritarios del trimestre',
    description: 'La composición de la cartera comercial de la plataforma en ese trimestre. Define qué tan estricta es la lectura de "brand safety".',
    states: [
      { key: 'default', text: 'Primer trimestre con campañas globales de tres marcas familiares de consumo masivo que exigieron contractualmente "zero proximity to graphic content".', isDefault: true },
      { key: 'alt1', text: 'Cartera diversificada con anunciantes que incluyen ONGs internacionales, medios de prensa y organismos multilaterales, cuyas exigencias de brand safety son más matizadas.', counterfactual: 'La estrictez del filtro se relaja sensiblemente. El video habría sido elegible para una franja de anunciantes específica. La desmonetización total se vuelve improbable, aunque el alcance siga reduciéndose.' },
      { key: 'alt2', text: 'Trimestre sin presión particular: ningún contrato premium en juego.', counterfactual: 'El filtro por defecto se mantiene activo igualmente, pero la prioridad de revisión humana habría sido más alta y la apelación habría tenido posibilidades reales. La temporalidad comercial modifica la temporalidad del juicio.' },
    ],
  },
  {
    id: 'N6',
    title: 'Contexto político-mediático global',
    description: 'El clima de presión sobre las plataformas en el momento del incidente. Las decisiones algorítmicas se calibran respondiendo a este clima.',
    states: [
      { key: 'default', text: 'Mes de creciente cobertura crítica en Estados Unidos sobre la circulación de imágenes violentas en plataformas. Audiencias del Congreso programadas. Presión interna por moderación estricta.', isDefault: true },
      { key: 'alt1', text: 'Periodo de presión inversa: investigaciones sobre censura excesiva de voces minorizadas y movimientos sociales.', counterfactual: 'La política habría operado en sentido cauteloso opuesto. La etiqueta automática se habría aplicado igual, pero la revisión humana habría tenido instrucciones de inclinarse hacia la habilitación. La balanza algorítmica oscila al ritmo del ciclo político en otro hemisferio.' },
      { key: 'alt2', text: 'Periodo neutral: sin ciclo de cobertura crítica activo sobre las plataformas.', counterfactual: 'La política habría operado en modo "rutina": filtro automático con apelación protocolar. Probabilidad de desmonetización igualmente alta, pero menor velocidad y menor cobertura interna del caso.' },
    ],
  },
  {
    id: 'N7',
    title: 'Acciones de otros usuarios sobre el video',
    description: 'Lo que otros hicieron con el video en las primeras horas: reportes, denuncias, comentarios, viralizaciones.',
    states: [
      { key: 'default', text: 'Cuatro reportes anónimos por "violencia gráfica" en las primeras dos horas, ninguno con descripción específica. Comentarios mayoritariamente solidarios pero de baja interacción agregada.', isDefault: true },
      { key: 'alt1', text: 'Sin reportes. Viralización orgánica del video por una cuenta con alcance significativo que lo recomendó como periodismo de calidad.', counterfactual: 'El sistema habría leído la señal de alcance orgánico como "contenido de valor" y habría retrasado la clasificación automática mientras revisaba métricas. El video habría tenido al menos 24 horas antes del filtro. La denuncia anónima funciona como acelerador del juicio algorítmico.' },
      { key: 'alt2', text: 'Comentarios masivos en defensa del video, citaciones por otros medios, hashtag de solidaridad activo desde la primera hora.', counterfactual: 'El video habría sido marcado igualmente, pero la presión visible habría escalado el caso al equipo de Public Affairs en horas, no en semanas. La acción discursiva colectiva no neutraliza al algoritmo, pero cambia los plazos de su revisión.' },
    ],
  },
  {
    id: 'N8',
    title: 'Algoritmo de scoring "anunciante-amigable"',
    description: 'La fórmula concreta que pondera señales para decidir si un contenido es apto para publicidad. No es lo mismo que el clasificador: es la lógica que combina las señales.',
    states: [
      { key: 'default', text: 'Score combinado donde términos léxicos ("asesinato", "sangre", "muerte"), señales visuales (sangre, armas, cuerpos cubiertos) y metadata del canal pesan acumulativamente. Sin variable de "contexto periodístico verificable".', isDefault: true },
      { key: 'alt1', text: 'Score que incluye una señal explícita de "contexto periodístico", derivada de la composición histórica de publicaciones del canal y de su red de citaciones.', counterfactual: 'El score del video habría caído al rango "aceptable con anunciantes selectivos". El reportaje se desmonetizaría sólo parcialmente. La diferencia entre "invisible" y "restringido" es enorme, y depende de una sola variable que la plataforma optó por no incluir.' },
      { key: 'alt2', text: 'Score donde la decisión final es siempre tomada por un humano informado, con el algoritmo proporcionando solo una recomendación inicial.', counterfactual: 'El video probablemente habría sido admitido, dada la facilidad con que una persona con contexto reconoce su valor periodístico. Pero el modelo operativo se volvería económicamente inviable a escala. La automatización no es neutral: encarna la decisión de no pagar por juicios cualificados.' },
    ],
  },
  {
    id: 'N9',
    title: 'Memo interno filtrado · Priorización LATAM Sur',
    description: 'Documento interno de la plataforma, fechado dos semanas antes del incidente, sobre la política operativa para América Latina en el Q1.',
    hidden: true,
    triggerNodes: ['N3', 'N5', 'N6'],
    states: [
      { key: 'default', text: '"En LATAM Sur, priorizar velocidad de decisión sobre matiz cultural para Q1 2024. Tolerancia de error: medio-alto. Costos de reentrenamiento regional: diferidos hasta Q3."', isDefault: true },
      { key: 'alt1', text: '"Reentrenamiento regional priorizado para Q1. Inversión: USD 4.3M. Equipos locales en Bogotá y São Paulo."', counterfactual: 'La decisión sobre Tejido Renaciente habría sido distinta no por mejor algoritmo, sino por inversión deliberada. La opacidad del incidente disuelve cuando aparece la decisión presupuestal. Aquí ya no se trata del algoritmo: se trata de cuánto vale, para esta empresa, este territorio.' },
      { key: 'alt2', text: '"No hay memo. Las decisiones operativas para LATAM Sur se toman caso a caso por el equipo global de Trust & Safety."', counterfactual: 'La opacidad cambia de naturaleza: ya no hay un documento que enmarque la decisión. Lo cual no significa que la decisión sea más justa, sino que es menos rastreable. La ausencia de memo es a veces una decisión, no una omisión.' },
    ],
  },
  {
    id: 'N10',
    title: 'Cambio reciente en Términos de Servicio',
    description: 'Actualización de los TOS publicada seis semanas antes del incidente, que reformuló la sección sobre "contenido relacionado con violencia política".',
    hidden: true,
    triggerNodes: ['N2', 'N6'],
    states: [
      { key: 'default', text: 'Los TOS fueron actualizados el 28 de enero de 2024. La nueva redacción amplía la categoría "violencia política sensible" incluyendo contenido sobre asesinatos de defensores de derechos humanos. La notificación a creadores: un mail genérico de 142 palabras.', isDefault: true },
      { key: 'alt1', text: 'Los TOS se actualizaron, pero con una sub-cláusula que protege explícitamente la cobertura periodística de violencia contra defensores y líderes sociales, con notificación específica a canales que documentan estos temas.', counterfactual: 'El Tejido habría recibido un aviso sobre la reclasificación de su contenido. Habría tenido tiempo para adaptarse, apelar o reorganizar. La diferencia entre opacidad y previsibilidad no es retórica: es la diferencia entre poder anticipar el algoritmo y ser anticipado por él.' },
      { key: 'alt2', text: 'No hubo cambio de TOS. La situación es resultado de la aplicación rutinaria de las políticas vigentes.', counterfactual: 'El incidente deja de ser un evento puntual y se revela como condición estructural: bajo los TOS vigentes, este reportaje habría sido desmonetizado en cualquier momento de los últimos años. La novedad no estaba en la política, sino en que alguien — el Tejido — decidió hacerla pública.' },
    ],
  },
];

const TOTAL_PHASES = 5;

// ──────────────────────────────────────────────────────────────
// COMPONENTE RAÍZ
// ──────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState(1);
  const [initialAttribution, setInitialAttribution] = useState(null);
  const [initialReasoning, setInitialReasoning] = useState('');
  const [nodeStates, setNodeStates] = useState(() => {
    const obj = {};
    NODES.forEach(n => { obj[n.id] = 'default'; });
    return obj;
  });
  const [discoveredHidden, setDiscoveredHidden] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [peritaje, setPeritaje] = useState('');

  // Scroll al tope en cada cambio de fase
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase]);

  useEffect(() => {
    setDiscoveredHidden(prev => {
      const set = new Set(prev);
      const modifiedNodes = Object.entries(nodeStates)
        .filter(([, v]) => v !== 'default')
        .map(([k]) => k);
      NODES.filter(n => n.hidden).forEach(hiddenNode => {
        if (set.has(hiddenNode.id)) return;
        const triggers = hiddenNode.triggerNodes || [];
        const matched = triggers.filter(t => modifiedNodes.includes(t)).length;
        if (matched >= 2) set.add(hiddenNode.id);
      });
      if (set.size === prev.length) return prev;
      return Array.from(set);
    });
  }, [nodeStates]);

  const visibleNodes = NODES.filter(n => !n.hidden || discoveredHidden.includes(n.id));
  const modifiedCount = Object.values(nodeStates).filter(v => v !== 'default').length;
  const wordCount = peritaje.trim().split(/\s+/).filter(Boolean).length;

  const toggleNode = (id) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const setNodeState = (nodeId, stateKey) => {
    setNodeStates(prev => ({ ...prev, [nodeId]: stateKey }));
  };

  const attributionLabel = ATTRIBUTION_OPTIONS.find(o => o.id === initialAttribution)?.label || '';

  return (
    <div className="se-app">
      <style>{GLOBAL_STYLES}</style>
      <Header phase={phase} />
      {phase === 1 && <PhaseOpening onAdvance={() => setPhase(2)} />}
      {phase === 2 && (
        <PhaseDossier
          attribution={initialAttribution}
          setAttribution={setInitialAttribution}
          reasoning={initialReasoning}
          setReasoning={setInitialReasoning}
          onAdvance={() => setPhase(3)}
        />
      )}
      {phase === 3 && (
        <PhaseDissection
          nodes={visibleNodes}
          nodeStates={nodeStates}
          setNodeState={setNodeState}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
          discoveredHidden={discoveredHidden}
          modifiedCount={modifiedCount}
          onAdvance={() => setPhase(4)}
        />
      )}
      {phase === 4 && (
        <PhaseCartography
          nodes={visibleNodes}
          nodeStates={nodeStates}
          peritaje={peritaje}
          setPeritaje={setPeritaje}
          wordCount={wordCount}
          onAdvance={() => setPhase(5)}
        />
      )}
      {phase === 5 && (
        <PhaseConfrontation
          attributionLabel={attributionLabel}
          initialReasoning={initialReasoning}
          peritaje={peritaje}
          modifiedCount={modifiedCount}
          discoveredHidden={discoveredHidden}
        />
      )}
      <Footer />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// HEADER & FOOTER
// ──────────────────────────────────────────────────────────────

function Header({ phase }) {
  const phaseLabels = ['Apertura', 'Dossier', 'Disección', 'Cartografía', 'Confrontación'];
  return (
    <header className="se-header">
      <div className="se-header-left">
        <span className="se-header-mark">ArtiLAMA · Si... Entonces</span>
        <span className="se-header-case">Exp. {CASE.id}</span>
      </div>
      <div className="se-header-right">
        <span className="se-phase-indicator">Fase {phase} de {TOTAL_PHASES} · {phaseLabels[phase - 1]}</span>
        <div className="se-phase-dots">
          {[1,2,3,4,5].map(i => (
            <span key={i} className={`se-dot ${i === phase ? 'active' : ''} ${i < phase ? 'done' : ''}`} />
          ))}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="se-footer">
      <span>LAMA · Laboratorio de Mediaciones Algorítmicas · Univalle</span>
      <span>Periodismo y Sociedad IV</span>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────────
// FASE 1 · APERTURA — rediseñada
// ──────────────────────────────────────────────────────────────

function PhaseOpening({ onAdvance }) {
  return (
    <div className="se-container se-fade-in">
      <div className="se-paper se-opening">
        <div className="se-paper-corner">{CASE.classification}</div>

        {/* Cabecera del expediente */}
        <div className="se-case-header">
          <div className="se-case-meta-left">
            <span className="se-case-badge">ArtiLAMA · SI... ENTONCES</span>
            <span className="se-case-number">Exp. {CASE.id}</span>
          </div>
          <div className="se-case-location">{CASE.location} · {CASE.date}</div>
        </div>

        {/* Hero */}
        <div className="se-opening-hero">
          <div className="se-artilama-label">Genealogía contingente de un resultado algorítmico</div>
          <h1 className="se-opening-title">{CASE.title}</h1>
          <p className="se-opening-subtitle">{CASE.subtitle}</p>
        </div>

        {/* Métricas de la sesión */}
        <div className="se-opening-stats">
          <div className="se-stat-item">
            <div className="se-stat-number">3</div>
            <div className="se-stat-label">movimientos</div>
          </div>
          <div className="se-stat-item">
            <div className="se-stat-number">10</div>
            <div className="se-stat-label">nodos contingentes</div>
          </div>
          <div className="se-stat-item">
            <div className="se-stat-number">1</div>
            <div className="se-stat-label">peritaje al final</div>
          </div>
        </div>

        {/* Hecho central */}
        <div className="se-opening-fact-label">Hecho central documentado</div>
        <p className="se-opening-fact">{CASE.centralFact}</p>

        {/* CTA */}
        <div className="se-opening-cta">
          <div>
            <button className="se-btn se-btn-paper" onClick={onAdvance}>
              Abrir el dossier <span>→</span>
            </button>
          </div>
          <div className="se-opening-disclaimer">{CASE.disclaimer}</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// FASE 2 · DOSSIER + ATRIBUCIÓN INTUITIVA
// ──────────────────────────────────────────────────────────────

function PhaseDossier({ attribution, setAttribution, reasoning, setReasoning, onAdvance }) {
  return (
    <div className="se-container se-fade-in">
      <div className="se-section-title">
        <span className="se-section-label">Movimiento 1 · Reconstrucción de la escena</span>
        <span className="se-section-rule" />
      </div>
      <h2 className="se-section-heading">Cuatro voces sobre el mismo silencio</h2>
      <p className="se-section-intro">
        Lo que sigue son cuatro fragmentos del discurso público que rodeó el caso. Léelos como un periodista de archivo:
        no busques "la verdad" en uno de ellos. Busca cómo cada actor reparte la responsabilidad. Quién dice que fue el algoritmo,
        quién dice que fue una persona, quién dice que fue una decisión, quién dice que fue una práctica.
      </p>

      <div className="se-fragments-grid">
        {PUBLIC_DISCOURSE.map(f => (
          <article key={f.id} className="se-fragment">
            <div className="se-fragment-source">{f.source}</div>
            <div className="se-fragment-attribution">{f.attribution}</div>
            <p className="se-fragment-quote">{f.text}</p>
            <div className="se-fragment-meta">{f.meta}</div>
          </article>
        ))}
      </div>

      <div className="se-attribution-block">
        <div className="se-section-title" style={{ marginBottom: 18 }}>
          <span className="se-section-label">Atribución intuitiva</span>
          <span className="se-section-rule" />
        </div>
        <p className="se-attribution-prompt">
          En este punto del expediente, antes de abrir la mesa de disección, <em>¿a quién atribuirías la responsabilidad principal del resultado?</em>
        </p>
        <div className="se-attribution-options">
          {ATTRIBUTION_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={`se-attribution-option ${attribution === opt.id ? 'selected' : ''}`}
              onClick={() => setAttribution(opt.id)}
            >
              <span className="se-attribution-marker">{opt.marker}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
        <label className="se-textarea-label">Si quieres, justifica brevemente tu elección (opcional)</label>
        <textarea
          className="se-textarea"
          placeholder="Una o dos frases sobre por qué elegiste esa atribución..."
          value={reasoning}
          onChange={e => setReasoning(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.12em' }}>
          Tu respuesta se preservará. Volveremos a ella al final.
        </span>
        <button className="se-btn" onClick={onAdvance} disabled={!attribution}>
          Abrir la mesa de disección <span>→</span>
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// FASE 3 · MESA DE DISECCIÓN
// ──────────────────────────────────────────────────────────────

function PhaseDissection({ nodes, nodeStates, setNodeState, expandedNodes, toggleNode, discoveredHidden, modifiedCount, onAdvance }) {
  const canAdvance = modifiedCount >= 3;
  return (
    <div className="se-container se-fade-in">
      <div className="se-section-title">
        <span className="se-section-label">Movimiento 2 · Mesa de disección</span>
        <span className="se-section-rule" />
      </div>
      <h2 className="se-section-heading">El ensamblaje que produjo el silencio</h2>

      <div className="se-dissection-intro">
        <p className="se-dissection-instructions">
          Frente a ti están los nodos del ensamblaje que sostuvieron el resultado. Cada uno tiene un estado por defecto
          — el que efectivamente operó en este caso — marcado con borde discontinuo. Modifica el estado de los nodos para abrir
          narrativas contrafactuales: <em>si esto hubiera sido distinto, entonces...</em>. Algunos nodos no son visibles desde el principio.
          Tendrás que rastrearlos al cruzar pistas.
        </p>
      </div>

      <div className="se-result-anchor">
        <div className="se-result-anchor-label">Resultado a explicar</div>
        <p className="se-result-anchor-text">
          Reportaje de 18 minutos sobre el asesinato de Marcela Quintero <strong>desmonetizado en 3 horas</strong>,
          alcance reducido en <strong>87%</strong>, tres reportajes anteriores del mismo canal con el mismo destino esa semana.
        </p>
      </div>

      <div className="se-nodes-grid">
        {nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            currentState={nodeStates[node.id]}
            isExpanded={expandedNodes.includes(node.id)}
            isHiddenDiscovered={node.hidden && discoveredHidden.includes(node.id)}
            onToggle={() => toggleNode(node.id)}
            onSetState={(stateKey) => setNodeState(node.id, stateKey)}
          />
        ))}
      </div>

      {discoveredHidden.length === 0 && modifiedCount >= 2 && (
        <div className="se-trace-hint">
          <span className="se-trace-hint-icon">◈</span>
          <span className="se-trace-hint-text">
            Algunas decisiones del caso no aparecen en este tablero. Suelen quedar fuera del discurso público.
            Cruza nodos relacionados para hacerlas emerger.
          </span>
          <span className="se-trace-hint-cta">Rastrear →</span>
        </div>
      )}

      <div className="se-progress-row">
        <span className="se-progress-stat">
          Nodos modificados: <strong>{modifiedCount}</strong> · Ocultos descubiertos: <strong>{discoveredHidden.length}</strong>
        </span>
        <button className="se-btn" onClick={onAdvance} disabled={!canAdvance}>
          {canAdvance ? 'Pasar a la cartografía' : 'Modifica al menos 3 nodos para continuar'}
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

function NodeCard({ node, currentState, isExpanded, isHiddenDiscovered, onToggle, onSetState }) {
  const touched = currentState !== 'default';
  const selectedState = node.states.find(s => s.key === currentState);
  const counterfactualText = selectedState?.counterfactual;

  return (
    <div className={`se-node ${touched ? 'touched' : ''} ${isHiddenDiscovered ? 'hidden-discovered' : ''}`}>
      <div className="se-node-header" onClick={onToggle}>
        <span className="se-node-id">{node.id}</span>
        <h3 className="se-node-title">
          {node.title}
          {isHiddenDiscovered && (
            <span style={{ marginLeft: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent-bright)' }}>
              · RASTREADO
            </span>
          )}
        </h3>
        <span className={`se-node-status ${touched ? 'modified' : 'default-state'}`}>
          {touched ? '◆ Modificado' : '◇ Por defecto'}
        </span>
        <span className={`se-chevron ${isExpanded ? 'open' : ''}`}>▸</span>
      </div>

      {isExpanded && (
        <div className="se-node-body">
          <p className="se-node-description">{node.description}</p>
          <div className="se-node-states">
            {node.states.map(state => (
              <button
                key={state.key}
                className={`se-state-option ${state.isDefault ? 'is-default' : ''} ${currentState === state.key ? 'is-selected' : ''}`}
                onClick={() => onSetState(state.key)}
              >
                <span className="se-state-marker">{state.isDefault ? '·' : '◇'}</span>
                <span className="se-state-text">
                  {state.text}
                  {state.isDefault && <span className="se-state-default-badge">Estado real</span>}
                </span>
              </button>
            ))}
          </div>
          {touched && counterfactualText && (
            <div className="se-counterfactual se-fade-in">
              <span className="se-counterfactual-label">Si... entonces</span>
              {counterfactualText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// FASE 4 · CARTOGRAFÍA + PERITAJE
// ──────────────────────────────────────────────────────────────

function PhaseCartography({ nodes, nodeStates, peritaje, setPeritaje, wordCount, onAdvance }) {
  const canAdvance = wordCount >= 80;
  return (
    <div className="se-container se-fade-in">
      <div className="se-section-title">
        <span className="se-section-label">Movimiento 3 · Cartografía y peritaje</span>
        <span className="se-section-rule" />
      </div>
      <h2 className="se-section-heading">El mapa que dibujaste</h2>
      <p className="se-section-intro">
        A la izquierda, el ensamblaje tal como tú lo manipulaste: los nodos que tocaste irradian con más intensidad,
        las relaciones que abriste se vuelven visibles. A la derecha, una hoja de peritaje en blanco. Es tu turno.
      </p>

      <div className="se-cartography">
        <div className="se-map-frame">
          <div className="se-map-header">
            <span className="se-map-title">Mapa del ensamblaje</span>
            <div className="se-map-legend">
              <span className="se-legend-item"><span className="se-legend-dot" style={{ background: 'var(--accent)' }} /> Modificado</span>
              <span className="se-legend-item"><span className="se-legend-dot" style={{ background: 'var(--accent-bright)' }} /> Rastreado</span>
              <span className="se-legend-item"><span className="se-legend-dot" style={{ background: 'var(--text-subtle)' }} /> Por defecto</span>
            </div>
          </div>
          <NetworkMap nodes={nodes} nodeStates={nodeStates} />
        </div>

        <div className="se-peritaje-frame">
          <div className="se-paper-corner" style={{ top: 18, right: 20 }}>Peritaje</div>
          <div className="se-peritaje-header">
            <span className="se-peritaje-label">Hoja de dictamen</span>
            <span className="se-peritaje-meta">Exp. {CASE.id}</span>
          </div>
          <p className="se-peritaje-prompt">
            Si tuvieras que escribir un análisis sobre este caso, <em>¿cómo atribuirías la responsabilidad y qué elementos considerarías? ¿Qué efectos sociales pueden tener situaciones como ésta en países como el nuestro?</em>{' '}
            Considera lo que viste al manipular el ensamblaje.
          </p>
          <textarea
            className="se-peritaje-textarea"
            placeholder="Escribe aquí tu peritaje. Entre 150 y 300 palabras."
            value={peritaje}
            onChange={e => setPeritaje(e.target.value)}
          />
          <div className="se-peritaje-counter">
            <span>{wordCount} palabras</span>
            <span>{canAdvance ? <strong>Listo para continuar</strong> : `Mínimo sugerido: 80 palabras`}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
        <button className="se-btn" onClick={onAdvance} disabled={!canAdvance}>
          Confrontar el peritaje <span>→</span>
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MAPA SVG · NetworkMap — colores LAMA
// ──────────────────────────────────────────────────────────────

function NetworkMap({ nodes, nodeStates }) {
  const positions = {
    N1:  { x: 130, y: 110 },
    N2:  { x: 290, y: 70  },
    N3:  { x: 530, y: 70  },
    N4:  { x: 670, y: 130 },
    N5:  { x: 700, y: 290 },
    N6:  { x: 570, y: 420 },
    N7:  { x: 220, y: 420 },
    N8:  { x: 100, y: 290 },
    N9:  { x: 400, y: 460 },
    N10: { x: 400, y: 30  },
  };

  const centerX = 400;
  const centerY = 250;

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#5C8607" stopOpacity="0.22" />
          <stop offset="60%"  stopColor="#5C8607" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#5C8607" stopOpacity="0"    />
        </radialGradient>
        <radialGradient id="accentGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#70A309" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#70A309" stopOpacity="0"    />
        </radialGradient>
        <radialGradient id="discoveredGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8AB40B" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8AB40B" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* Halo central */}
      <circle cx={centerX} cy={centerY} r="120" fill="url(#centerGlow)" />

      {/* Líneas de conexión */}
      {nodes.map(node => {
        const pos = positions[node.id];
        if (!pos) return null;
        const modified = nodeStates[node.id] !== 'default';
        const isHidden = node.hidden;
        const stroke     = modified ? '#5C8607' : isHidden ? '#8AB40B' : 'rgba(52,63,30,0.18)';
        const strokeWidth = modified ? 1.8 : 0.8;
        const strokeDash  = modified ? 'none' : '4 4';
        return (
          <line
            key={`l-${node.id}`}
            x1={pos.x} y1={pos.y}
            x2={centerX} y2={centerY}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            opacity={modified ? 0.88 : 0.55}
          />
        );
      })}

      {/* Nodo central */}
      <circle cx={centerX} cy={centerY} r="42" fill="#E3E9D8" stroke="#5C8607" strokeWidth="1.5" />
      <text x={centerX} y={centerY - 5} textAnchor="middle" fill="#3E5A05" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2">
        RESULTADO
      </text>
      <text x={centerX} y={centerY + 10} textAnchor="middle" fill="#343F1E" fontFamily="Newsreader, serif" fontStyle="italic" fontSize="11">
        −87% alcance
      </text>

      {/* Nodos periféricos */}
      {nodes.map(node => {
        const pos = positions[node.id];
        if (!pos) return null;
        const modified   = nodeStates[node.id] !== 'default';
        const isHidden   = node.hidden;
        const fillGlow   = modified ? 'url(#accentGlow)' : isHidden ? 'url(#discoveredGlow)' : 'none';
        const stroke     = modified ? '#5C8607' : isHidden ? '#8AB40B' : 'rgba(52,63,30,0.28)';
        const nodeFill   = modified ? '#E3E9D8' : '#FDFAF1';
        const radius     = modified ? 18 : 13;
        const labelColor = modified ? '#5C8607' : isHidden ? '#8AB40B' : 'rgba(52,63,30,0.45)';

        return (
          <g key={`n-${node.id}`}>
            {(modified || isHidden) && (
              <circle cx={pos.x} cy={pos.y} r={36} fill={fillGlow} />
            )}
            {isHidden && (
              <circle cx={pos.x} cy={pos.y} r={radius + 8} fill="none" stroke="#8AB40B" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.65" />
            )}
            <circle cx={pos.x} cy={pos.y} r={radius} fill={nodeFill} stroke={stroke} strokeWidth={modified ? 1.6 : 1} />
            <text
              x={pos.x} y={pos.y + 4}
              textAnchor="middle"
              fill={labelColor}
              fontFamily="JetBrains Mono, monospace"
              fontSize={modified ? 11 : 9}
              fontWeight={modified ? 600 : 400}
            >
              {node.id}
            </text>
            <text
              x={pos.x}
              y={pos.y + radius + 16}
              textAnchor="middle"
              fill={labelColor}
              fontFamily="Newsreader, serif"
              fontSize="10"
              opacity={modified ? 1 : 0.8}
            >
              {abbreviateLabel(node.title)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function abbreviateLabel(label) {
  const map = {
    'Dataset de entrenamiento del clasificador':         'Dataset',
    'Política de excepción periodística':               'Política',
    'Equipo de revisión humana':                        'Revisión humana',
    'Historial y estatus del canal':                    'Estatus del canal',
    'Anunciantes prioritarios del trimestre':           'Anunciantes',
    'Contexto político-mediático global':               'Contexto político',
    'Acciones de otros usuarios sobre el video':        'Otros usuarios',
    'Algoritmo de scoring "anunciante-amigable"':       'Scoring',
    'Memo interno filtrado · Priorización LATAM Sur':   'Memo interno',
    'Cambio reciente en Términos de Servicio':          'Cambio en TOS',
  };
  return map[label] || label;
}

// ──────────────────────────────────────────────────────────────
// FASE 5 · CONFRONTACIÓN FINAL
// ──────────────────────────────────────────────────────────────

function PhaseConfrontation({ attributionLabel, initialReasoning, peritaje, modifiedCount, discoveredHidden }) {
  return (
    <div className="se-container se-fade-in">
      <div className="se-section-title">
        <span className="se-section-label">Movimiento 4 · Confrontación</span>
        <span className="se-section-rule" />
      </div>
      <h2 className="se-section-heading">Lo que viste, lo que ahora ves</h2>
      <p className="se-section-intro">
        Antes de manipular el ensamblaje, atribuiste la responsabilidad de una manera. Después de manipularlo,
        escribiste un peritaje. Tenerlos lado a lado no es una evaluación: es una pregunta sobre cómo se transformó tu manera de mirar.
      </p>

      <div className="se-confrontation">
        <div className="se-conf-panel before">
          <div className="se-conf-label">Atribución intuitiva</div>
          <div className="se-conf-time">Minuto 8 · antes de la disección</div>
          <p className="se-conf-attribution">{attributionLabel || '(Sin selección)'}</p>
          {initialReasoning && <p className="se-conf-reasoning">"{initialReasoning}"</p>}
        </div>
        <div className="se-conf-panel after">
          <div className="se-conf-label">Peritaje informado</div>
          <div className="se-conf-time">
            Minuto 35 · después de manipular {modifiedCount} nodo{modifiedCount === 1 ? '' : 's'}
            {discoveredHidden.length > 0 && ` y rastrear ${discoveredHidden.length} oculto${discoveredHidden.length === 1 ? '' : 's'}`}
          </div>
          <p className="se-conf-peritaje">{peritaje}</p>
        </div>
      </div>

      <div className="se-closing-prompt">
        <div className="se-closing-label">Pregunta de cierre</div>
        <p className="se-closing-question">
          ¿Qué actor entró en escena que no veías al principio? ¿Y qué actor que parecía central se volvió, después, una pieza entre otras?
        </p>
        <p className="se-closing-sub">
          Lleva esta pregunta a la conversación con el grupo. No es retórica: es la pregunta que un periodista debería poder responder
          cada vez que escribe la frase "el algoritmo decidió".
        </p>
      </div>

      <div className="se-coda">
        <p>
          A medida que cambian las condiciones sociales (los contextos, los usuarios, los datos), cambia el <em>"entonces"</em> (los
          resultados, las exclusiones, las visibilidades). Al reconocer que la agencia está distribuida en esta red compleja,{' '}
          <em>la complejidad hace que la responsabilidad sea obligatoria</em>. Diseñar, entrenar y desplegar algoritmos periodísticos,
          sociales o de Inteligencia Artificial requiere asumir que no existen posiciones neutrales. La pregunta crítica para la
          investigación social y el diseño ético no es cómo los algoritmos determinan el mundo, sino quién y qué logra participar
          en la definición misma de lo que el algoritmo es y hace en un contexto determinado.
        </p>
        <p className="se-coda-attrib">— Cierre de la sesión · LAMA / Univalle</p>

        <div className="se-coda-links">
          <button className="se-btn se-btn-coda" onClick={() => window.location.reload()}>
            ↺ Reiniciar la experiencia
          </button>
          <a className="se-btn se-btn-coda" href="https://lama.lat" target="_blank" rel="noopener noreferrer">
            Ir a lama.lat →
          </a>
        </div>
      </div>
    </div>
  );
}
