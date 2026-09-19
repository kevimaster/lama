#!/usr/bin/env python3
"""
medir_paleta.py — mide qué tan cálida o qué tan de plantilla es la paleta de
cada simulador del catálogo.

Existe porque la impresión engaña. Al revisar el catálogo por primera vez se
propuso rediseñar un simulador que resultó ser de los mejor resueltos (3,6 %
de color cálido, paleta validada), mientras el peor —79 %— pasaba inadvertido.
Medir primero cuesta segundos y evita destruir trabajo bueno.

Dos ejes, porque el problema tiene dos formas:
  · cálidos  — el tono ocre/ámbar/arcilla en hexadecimales sueltos
  · plantilla — las familias slate/indigo/blue de Tailwind, que no son cálidas
                pero hacen que simuladores de temas distintos se vean iguales

Uso:
    python3 medir_paleta.py                # todo el catálogo, ordenado
    python3 medir_paleta.py <carpeta>      # un simulador
"""
import colorsys
import re
import sys
from pathlib import Path

EXT = (".jsx", ".tsx", ".html", ".css", ".js", ".ts")
OMITIR = ("node_modules", "dist", ".git")
CALIDOS_TW = {"amber", "orange", "yellow", "stone"}
PLANTILLA_TW = {"slate", "indigo", "blue", "gray", "zinc", "neutral"}
HEX = re.compile(r"#([0-9a-fA-F]{6})\b")
CLASE_TW = re.compile(r"\b(?:bg|text|border|from|to|via|ring)-([a-z]+)-\d{2,3}\b")


def raiz_repo(inicio: Path) -> Path:
    for p in [inicio, *inicio.parents]:
        if (p / "simuladores").is_dir() and (p / "index.html").is_file():
            return p
    sys.exit("No encuentro la raíz del repo (una carpeta con simuladores/ e index.html).")


def archivos(dir_sim: Path):
    for f in dir_sim.rglob("*"):
        if f.is_file() and f.suffix in EXT and not any(o in f.parts for o in OMITIR):
            yield f


def medir(dir_sim: Path):
    calidos = saturados = 0
    familias = {}
    for f in archivos(dir_sim):
        try:
            texto = f.read_text(encoding="utf8", errors="ignore")
        except OSError:
            continue
        for h in HEX.findall(texto):
            r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
            tono, _, sat = colorsys.rgb_to_hls(r, g, b)
            if sat < 0.12:          # gris: no dice nada de la intención
                continue
            saturados += 1
            if 20 <= tono * 360 <= 55:
                calidos += 1
        for fam in CLASE_TW.findall(texto):
            familias[fam] = familias.get(fam, 0) + 1
    return calidos, saturados, familias


def main():
    raiz = raiz_repo(Path.cwd().resolve())
    base = raiz / "simuladores"
    objetivo = sys.argv[1] if len(sys.argv) > 1 else None
    carpetas = [base / objetivo] if objetivo else sorted(
        d for d in base.iterdir() if d.is_dir() and not d.name.startswith("_"))
    if objetivo and not carpetas[0].is_dir():
        sys.exit(f"No existe simuladores/{objetivo}/")

    filas = []
    for d in carpetas:
        calidos, saturados, familias = medir(d)
        tw = sum(familias.values())
        pct_calido = 100 * calidos / saturados if saturados else 0
        pct_plantilla = 100 * sum(v for k, v in familias.items() if k in PLANTILLA_TW) / tw if tw else 0
        pct_calido_tw = 100 * sum(v for k, v in familias.items() if k in CALIDOS_TW) / tw if tw else 0
        top = ", ".join(f"{k}×{v}" for k, v in sorted(familias.items(), key=lambda x: -x[1])[:3])
        filas.append((d.name, saturados, pct_calido, tw, max(pct_calido_tw, 0), pct_plantilla, top))

    filas.sort(key=lambda r: -max(r[2], r[5]))
    print(f"{'simulador':38} {'hex':>5} {'cálido':>7}  {'tw':>4} {'plantilla':>9}  familias")
    print("─" * 104)
    for nombre, sat, pc, tw, _, pp, top in filas:
        c = f"{pc:5.1f}%" if sat else "    —"
        p = f"{pp:7.1f}%" if tw else "      —"
        bandera = " ←" if pc >= 40 or pp >= 60 else ""
        print(f"{nombre:38} {sat:>5} {c:>7}  {tw:>4} {p:>9}  {top}{bandera}")
    print("\n←  candidato a rediseño: paleta cálida dominante, o familias de plantilla dominantes.")
    print("   Un porcentaje bajo en ambas columnas suele significar una paleta ya decidida a propósito:")
    print("   revisa antes de tocarla.")


if __name__ == "__main__":
    main()
