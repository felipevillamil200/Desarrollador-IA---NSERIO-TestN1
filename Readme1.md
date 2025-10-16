
---

## 🧾 **README.md — Test#1 PRUEBA TÉCNICA PLAYWRIGHT**

```markdown
# 🧠 Test#1 - PRUEBA TÉCNICA PLAYWRIGHT

> Proyecto evaluador de diseño web automático: analiza tipografía, color y layout de cualquier sitio web y genera un **reporte PDF visual y numérico** con capturas y recomendaciones.

---

## 📂 Estructura del proyecto

```

SQA-PRUEBA-TECNICA-PLAYWRIGHT/
│
├── .gitattributes
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
├── state.json
├── tsconfig.json
│
├── fixtures/                      # (opcional) archivos de ejemplo o tests
├── public/
│   └── evaluator.html             # interfaz sencilla para ingresar URL y analizar
│
├── 🟩 analyzer/                    # lógica principal del análisis visual
│   ├── index.ts                   # coordina todo el proceso de análisis
│   ├── typography.ts              # analiza fuentes, tamaños y jerarquía
│   ├── color.ts                   # analiza colores, contraste y armonía
│   ├── layout.ts                  # analiza estructura (grid, flex, espaciado)
│   ├── scoring.ts                 # combina resultados en una puntuación (0–100)
│   ├── utils.ts                   # utilidades comunes
│   └── types.ts                   # estructuras de datos y tipos
│
├── 🟩 report/                      # generación de reportes PDF
│   ├── template.html              # plantilla visual del PDF (HTML + CSS)
│   └── render.ts                  # genera el PDF y reemplaza los valores dinámicos
│
├── 🟩 results/                     # resultados generados automáticamente
│   └── (por cada análisis)
│       ├── homepage.png           # captura de pantalla
│       ├── result.json            # datos analíticos en JSON
│       └── report.pdf             # reporte final listo para ver o compartir
│
├── 🟩 routes/
│   └── analyze.route.ts           # define el endpoint POST /api/analyze
│
└── 🟩 server-evaluator.ts          # servidor Express principal

````

---

## ⚙️ Instalación y ejecución

### 1️⃣ Requisitos previos
- Node.js 18+
- npm 9+
- Playwright (instalado automáticamente)

### 2️⃣ Instalar dependencias
```bash
npm ci
````

### 3️⃣ Ejecutar el servidor

```bash
npm run start:evaluator
```

El servidor se inicia en
👉 **[http://localhost:3000/evaluator.html](http://localhost:3000/evaluator.html)**

Desde ahí puedes ingresar cualquier URL para analizar.

---

## 🧪 Pruebas recomendadas

### 🌟 Sitios con diseño profesional (espera puntajes altos)

| #   | URL                                                    | Observaciones                                      |
| --- | ------------------------------------------------------ | -------------------------------------------------- |
| 1️⃣ | [https://www.apple.com](https://www.apple.com)         | Minimalismo y jerarquía tipográfica excelente.     |
| 2️⃣ | [https://www.spotify.com](https://www.spotify.com)     | Colores vivos, contraste alto y diseño moderno.    |
| 3️⃣ | [https://www.airbnb.com](https://www.airbnb.com)       | Limpieza visual, tipografía clara, buen espaciado. |
| 4️⃣ | [https://www.nike.com](https://www.nike.com)           | Grid flexible, imágenes hero, balance visual.      |
| 5️⃣ | [https://www.microsoft.com](https://www.microsoft.com) | Tipografía consistente, paleta profesional.        |

### ⚠️ Sitios con diseño deficiente (espera puntajes bajos)

| #   | URL                                                            | Observaciones                             |
| --- | -------------------------------------------------------------- | ----------------------------------------- |
| 6️⃣ | [https://www.craigslist.org](https://www.craigslist.org)       | Sin color, estructura antigua.            |
| 7️⃣ | [https://www.lingscars.com](https://www.lingscars.com)         | Exceso de colores y animaciones.          |
| 8️⃣ | [https://www.timecube.2enp.com](https://www.timecube.2enp.com) | Ejemplo extremo de mala jerarquía visual. |
| 9️⃣ | [https://www.arngren.net](https://www.arngren.net)             | Saturación visual extrema, sin orden.     |
| 🔟  | [https://www.example.com](https://www.example.com)             | Página sin estilos, base para control.    |

---

## 📊 Resultados esperados

Cada análisis genera una carpeta dentro de `results/`:

```
results/
└── 1718394185000/
    ├── homepage.png
    ├── result.json
    └── report.pdf
```

El PDF incluye:

* Captura del sitio
* Puntajes por categoría
* Gráfico de barras con porcentajes
* Recomendaciones automáticas

---

## 🧱 Tecnologías principales

| Herramienta    | Uso                                       |
| -------------- | ----------------------------------------- |
| **Playwright** | Navegación y captura de pantallas         |
| **TypeScript** | Tipado y estructura del proyecto          |
| **Express**    | Servidor API para el analizador           |
| **HTML/CSS**   | Plantilla del reporte PDF                 |
| **Node.js fs** | Manejo de archivos y almacenamiento local |

---

## 📄 Scripts disponibles

| Comando                   | Descripción                                               |
| ------------------------- | --------------------------------------------------------- |
| `npm run start:evaluator` | Inicia el servidor Express y abre el evaluador.           |
| `npm run build`           | Compila TypeScript a JavaScript.                          |
| `npm run lint`            | Analiza el código con ESLint.                             |
| `npm run clean`           | Limpia `node_modules`, `results` y artefactos temporales. |

---

## 🧹 Limpieza del proyecto (opcional)

Para dejar solo los archivos esenciales:

**Windows (PowerShell)**

```powershell
Remove-Item -Recurse -Force node_modules, playwright-report, .git, .local, fixtures, tests -ErrorAction SilentlyContinue
```

**Linux/macOS**

```bash
rm -rf node_modules playwright-report .git .local fixtures tests
```

---

## 🏁 Estado actual

✅ Cumple todos los requerimientos del PDF:

* Captura automática de la página
* Análisis de tipografía, color y layout
* Cálculo ponderado (0–100)
* Generación de reporte PDF visual
* Resultados almacenados localmente

🧩 Extensible a futuro:

* Envío automático del PDF a Google Drive
* Logging en Google Sheets
* Comparador de versiones de diseño

---

## 👨‍💻 Autor

**Felipe Villamil**
Proyecto de evaluación técnica — *Test #1 / QA Automation con Playwright + Node.js*

📅 Octubre 2025

```
Ejecutar:npm run start:evaluator