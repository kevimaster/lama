#!/usr/bin/env node
/**
 * Build script for Vercel deployment.
 * Mirrors the logic in .github/workflows/deploy.yml:
 *   - HTML simulators: copied directly (no vite.config)
 *   - React simulators: npm install + npm run build → dist copied
 */

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "_site");
const SIMS = path.join(ROOT, "simuladores");

function cp(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

function isReact(dir) {
  return (
    fs.existsSync(path.join(dir, "vite.config.js")) ||
    fs.existsSync(path.join(dir, "vite.config.ts"))
  );
}

// ── Setup ────────────────────────────────────────────────────────────────────
fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });

// Portal raíz
cp(path.join(ROOT, "index.html"), path.join(SITE, "index.html"));

// CNAME
const cname = path.join(ROOT, "CNAME");
if (fs.existsSync(cname)) cp(cname, path.join(SITE, "CNAME"));

// Assets
const assets = path.join(ROOT, "assets");
if (fs.existsSync(assets)) cp(assets, path.join(SITE, "assets"));

// ── Simulators ───────────────────────────────────────────────────────────────
const entries = fs.readdirSync(SIMS, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith("_"))
  .map(e => e.name);

for (const sim of entries) {
  const simDir  = path.join(SIMS, sim);
  const outDir  = path.join(SITE, "simuladores", sim);

  if (isReact(simDir)) {
    console.log(`[React] Building ${sim}…`);
    execSync("npm install --prefer-offline", { cwd: simDir, stdio: "inherit" });
    execSync("npm run build",               { cwd: simDir, stdio: "inherit" });
    cp(path.join(simDir, "dist"), outDir);
    console.log(`[React] ✓ ${sim}`);
  } else if (fs.existsSync(path.join(simDir, "index.html"))) {
    console.log(`[HTML]  Copying ${sim}…`);
    fs.mkdirSync(outDir, { recursive: true });
    cp(path.join(simDir, "index.html"), path.join(outDir, "index.html"));
    console.log(`[HTML]  ✓ ${sim}`);
  }
}

console.log("\n✅ Site assembled in _site/");
