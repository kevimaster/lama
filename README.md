# LAMA — Laboratorio de Mediaciones Algorítmicas

Repositorio de simuladores pedagógicos del **Laboratorio de Mediaciones Algorítmicas**
Universidad del Valle · Cali, Colombia

🌐 **Portal:** https://kevimaster.github.io/lama

---

## Estructura del repositorio

```
lama/
├── .github/workflows/deploy.yml   ← CI/CD → GitHub Pages
├── simuladores/
│   ├── _template-html/            ← Plantilla HTML autosuficiente
│   ├── _template-react/           ← Plantilla React + Vite
│   └── [nombre-simulador]/        ← Cada simulador en su carpeta
├── index.html                     ← Portal de navegación
├── vercel.json                    ← Configuración Vercel
└── README.md
```

## Tipos de simuladores

| Tipo | Descripción | Build requerido |
|------|-------------|-----------------|
| **HTML** | Un solo `index.html` autosuficiente | No |
| **React** | `src/` + `package.json` + `vite.config.js` | Sí (`npm run build`) |

## Inventario de simuladores

| ID | Nombre | Tipo | Estado |
|----|--------|------|--------|
| LAMA-01 | Red neuronal básica | HTML | En desarrollo |
| LAMA-02 | Red neuronal compleja | HTML | En desarrollo |
| LAMA-03 | Algoritmos en Acción | HTML | Funcional |
| LAMA-04 | Diseño de algoritmos | HTML | Funcional |
| LAMA-05 | Tu feed personalizado | HTML | Funcional |
| LAMA-06 | El Casino de la Atención V1 | HTML | Funcional |
| LAMA-07 | El Casino de la Atención V2 | HTML | Funcional |
| LAMA-08 | Dinámicas de desinformación | HTML | Funcional |
| LAMA-09 | Analizador de Sesgos V1 | HTML | Funcional |
| LAMA-10 | Analizador de Sesgos V2 | HTML | Funcional |
| LAMA-11 | Dashboard de Diversidad Informativa | HTML | Funcional |
| LAMA-12 | Detector de Polarización | HTML | Funcional |
| LAMA-13 | Ecosistema digital sistémico | HTML | Funcional |
| LAMA-14 | El sesgo invisible | React | Funcional |
| LAMA-15 | Viral por grupos sociales | HTML | Funcional |
| LAMA-16 | Radar de capacidades periodísticas | HTML | Funcional |
| LAMA-17 | Cámara de eco interactiva | HTML | Funcional |
| LAMA-18 | Enjambre de datos personal | HTML | Funcional |
| LAMA-19 | Anatomía de un sistema algorítmico | React | En desarrollo |
| LAMA-20 | Ensamblaje sociotécnico | React | En desarrollo |
| LAMA-21 | Sesgos en narrativas históricas | React | En desarrollo |
| LAMA-22 | Algoritmos: el juego de cartas | React | En desarrollo |
| LAMA-23 | Analizador de sesgos en búsquedas | React | En desarrollo |

## Agregar un nuevo simulador

### HTML autosuficiente
1. Copia `simuladores/_template-html/` → `simuladores/mi-simulador/`
2. Edita `index.html` con tu simulador
3. Agrega la entrada en el portal (`index.html` raíz)
4. Commit y push → el CI lo despliega automáticamente

### React + Vite
1. Copia `simuladores/_template-react/` → `simuladores/mi-simulador/`
2. Ajusta `base` en `vite.config.js` al nombre de la carpeta
3. Agrega `mi-simulador` a la lista `REACT_SIMS` en `.github/workflows/deploy.yml`
4. Agrega la entrada en el portal (`index.html` raíz)
5. Commit y push → el CI hace el build y despliega

## Despliegue

- **GitHub Pages:** automático en cada push a `main` vía GitHub Actions
- **Vercel:** conectar el repo en vercel.com → detecta `vercel.json` automáticamente

## Licencia

Ver [LICENSE](LICENSE)
