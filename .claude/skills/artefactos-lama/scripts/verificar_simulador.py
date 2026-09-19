#!/usr/bin/env python3
"""
verificar_simulador.py — comprueba que un simulador esté bien conectado al
despliegue ANTES de hacer push.

Cada chequeo corresponde a una forma concreta en que el sitio se ha roto antes:
un simulador React que no está en el matrix del workflow no se construye; un
`base` equivocado en vite.config sirve una página en blanco; una ficha marcada
como `funcional` sin archivos produce un botón que lleva a un 404.

Uso:
    python3 verificar_simulador.py <carpeta>      # un simulador
    python3 verificar_simulador.py --todos        # el catálogo entero

Se ejecuta desde cualquier sitio dentro del repo. Sin dependencias.
"""
import argparse
import json
import re
import sys
from pathlib import Path

VERDE, ROJO, AMBAR, GRIS, FIN = "\033[32m", "\033[31m", "\033[33m", "\033[90m", "\033[0m"


def raiz_repo(inicio: Path) -> Path:
    for p in [inicio, *inicio.parents]:
        if (p / "simuladores").is_dir() and (p / "index.html").is_file():
            return p
    sys.exit("No encuentro la raíz del repo (una carpeta con simuladores/ e index.html).")


def fichas_catalogo(raiz: Path):
    """Extrae las fichas del array de simuladores incrustado en index.html."""
    texto = (raiz / "index.html").read_text(encoding="utf8")
    fichas = []
    patron = re.compile(
        r'\{\s*id:\s*"(?P<id>[^"]+)".*?tipo:\s*"(?P<tipo>[^"]+)".*?'
        r'estado:\s*"(?P<estado>[^"]+)".*?carpeta:\s*"(?P<carpeta>[^"]+)"',
        re.S,
    )
    for m in patron.finditer(texto):
        fichas.append(m.groupdict())
    return fichas


def matrix_workflow(raiz: Path):
    wf = raiz / ".github/workflows/deploy.yml"
    if not wf.is_file():
        return None
    texto = wf.read_text(encoding="utf8")
    bloque = re.search(r"simulator:\s*\n((?:\s*-\s*\S+\n)+)", texto)
    if not bloque:
        return set()
    return {l.strip().lstrip("- ").strip() for l in bloque.group(1).splitlines() if l.strip()}


def revisar(raiz: Path, ficha, matrix):
    """Devuelve (problemas, avisos) para una ficha del catálogo."""
    carpeta = ficha["carpeta"]
    dir_sim = raiz / "simuladores" / carpeta
    problemas, avisos = [], []

    if not dir_sim.is_dir():
        if ficha["estado"] == "funcional":
            problemas.append(f"marcado 'funcional' pero simuladores/{carpeta}/ no existe → botón a 404")
        else:
            avisos.append("sin carpeta todavía (estado 'wip', correcto)")
        return problemas, avisos

    es_react = any((dir_sim / n).is_file() for n in ("vite.config.js", "vite.config.ts"))
    tipo_real = "react" if es_react else "html"

    if tipo_real != ficha["tipo"]:
        problemas.append(f"el catálogo dice tipo:'{ficha['tipo']}' pero en disco es {tipo_real}")

    if es_react:
        if carpeta not in (matrix or set()):
            problemas.append("NO está en el matrix de deploy.yml → no se construye ni se despliega")
        cfg = next((dir_sim / n for n in ("vite.config.js", "vite.config.ts") if (dir_sim / n).is_file()))
        base = re.search(r"base:\s*['\"]([^'\"]+)['\"]", cfg.read_text(encoding="utf8"))
        esperado = f"/simuladores/{carpeta}/"
        if not base:
            problemas.append(f"vite.config sin `base` → debe ser '{esperado}'")
        elif base.group(1) != esperado:
            problemas.append(f"base es '{base.group(1)}' y debería ser '{esperado}' → página en blanco")
        if not (dir_sim / "package.json").is_file():
            problemas.append("falta package.json")
        else:
            pkg = json.loads((dir_sim / "package.json").read_text(encoding="utf8"))
            lucide = (pkg.get("dependencies") or {}).get("lucide-react")
            if lucide:
                v = re.sub(r"[^0-9.]", "", lucide).split(".")
                try:
                    menor = int(v[1])
                    if menor < 400:
                        avisos.append(f"lucide-react {lucide} es antiguo; los íconos nuevos fallan (usa ^0.469.0)")
                except (IndexError, ValueError):
                    pass
        for src in dir_sim.rglob("*.jsx"):
            if "node_modules" in src.parts or "dist" in src.parts:
                continue
            imports = re.findall(r"import\s*\{([^}]+)\}\s*from\s*['\"]lucide-react['\"]", src.read_text(encoding="utf8"))
            marcas = {"Instagram", "Twitter", "Facebook", "Github", "GitHub", "Linkedin",
                      "LinkedIn", "Youtube", "YouTube", "Tiktok", "TikTok", "Whatsapp", "WhatsApp"}
            usados = {n.strip() for grupo in imports for n in grupo.split(",")}
            if choque := usados & marcas:
                problemas.append(f"{src.name} importa íconos de marca inexistentes en lucide-react: "
                                 f"{', '.join(sorted(choque))} → el build falla")
    else:
        if not (dir_sim / "index.html").is_file():
            problemas.append(f"simulador HTML sin index.html en simuladores/{carpeta}/")

    return problemas, avisos


def main():
    ap = argparse.ArgumentParser(description="Verifica el cableado de un simulador del repo LAMA.")
    ap.add_argument("carpeta", nargs="?", help="nombre de carpeta bajo simuladores/")
    ap.add_argument("--todos", action="store_true", help="revisa el catálogo completo")
    args = ap.parse_args()

    raiz = raiz_repo(Path.cwd().resolve())
    fichas = fichas_catalogo(raiz)
    matrix = matrix_workflow(raiz)
    if matrix is None:
        print(f"{AMBAR}aviso{FIN}  no encuentro .github/workflows/deploy.yml; omito el chequeo del matrix")

    if args.carpeta:
        fichas = [f for f in fichas if f["carpeta"] == args.carpeta]
        if not fichas:
            sys.exit(f"'{args.carpeta}' no aparece en el catálogo de index.html. "
                     f"Si el simulador es nuevo, agrégale su ficha primero.")
    elif not args.todos:
        ap.error("indica una carpeta o pasa --todos")

    total_problemas = 0
    for f in fichas:
        problemas, avisos = revisar(raiz, f, matrix)
        total_problemas += len(problemas)
        # En modo --todos solo se listan las fichas que tienen algo que decir:
        # 32 líneas verdes no informan de nada.
        interesante = problemas or avisos or not args.todos
        if not interesante:
            continue
        marca = f"{ROJO}✗{FIN}" if problemas else f"{VERDE}✓{FIN}"
        cola = "" if (problemas or avisos) else "  sin problemas"
        print(f"{marca} {f['id']} {f['carpeta']}{cola}")
        for p in problemas:
            print(f"    {ROJO}→{FIN} {p}")
        for a in avisos:
            print(f"    {AMBAR}·{FIN} {a}")

    if args.todos:
        print(f"\n{len(fichas)} fichas revisadas · ", end="")
    print(f"{ROJO if total_problemas else VERDE}{total_problemas} problema(s){FIN}")
    return 1 if total_problemas else 0


if __name__ == "__main__":
    sys.exit(main())
