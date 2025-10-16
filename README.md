TEST #1 – Evaluador de diseño web con Playwright

Proyecto que analiza de forma automática el diseño visual de cualquier sitio web.
Evalúa aspectos como tipografía, color y layout, genera una captura de pantalla, calcula una puntuación total (0–100) y crea un reporte PDF visual con gráficos y recomendaciones.

Este test demuestra automatización, análisis visual y generación dinámica de reportes.

🧰 Tecnologías usadas:

Node.js + TypeScript – Lógica principal del sistema

Playwright – Navegación y análisis del DOM real del sitio

Express.js – Servidor local para el evaluador

HTML + CSS + SVG – Plantilla del reporte (report/template.html)

PDFKit / Render.ts – Generación del PDF con resultados

Reglas propias (sin IA) – Sistema de puntuación y recomendaciones basado en métricas del sitio


