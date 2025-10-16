// analyzer/index.ts
// 👉 Archivo principal del módulo de análisis. Controla todo el proceso:
// abre la página con Playwright, llama a los submódulos (tipografía, color, layout),
// guarda los resultados, genera el reporte PDF y devuelve un resumen.

import { chromium } from 'playwright';             // usamos Playwright para abrir la página
import fs from 'fs/promises';                      // para guardar archivos (JSON, imagen, etc.)
import path from 'path';                           // para manejar rutas de carpetas
import { analyzeTypography } from './typography';  // importa el análisis de tipografía
import { analyzeColor } from './color';            // importa el análisis de color
import { analyzeLayout } from './layout';          // importa el análisis de layout
import { score } from './scoring';                 // función que calcula la puntuación final
import type { AnalysisResult } from './types';     // tipo de datos definido en types.ts
import { generatePdfReport } from '../report/render'; // 🆕 importa la función para generar el PDF

export async function analyzeUrl(url: string) {
  // 1️⃣ Crear una carpeta nueva para este análisis (según fecha/hora)
  const id = Date.now().toString();
  const outDir = path.join(process.cwd(), 'results', id);
  await fs.mkdir(outDir, { recursive: true });

  // 2️⃣ Lanzar el navegador (modo headless)
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(`🔎 Analizando: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });

  // 3️⃣ Capturar una captura de pantalla de la página principal
  const screenshotPath = path.join(outDir, 'homepage.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // 4️⃣ Ejecutar los análisis individuales
  const typography = await analyzeTypography(page);
  const color = await analyzeColor(page);
  const layout = await analyzeLayout(page);

  // 5️⃣ Calcular puntuación total y desglose
  const breakdown = score({ typography, color, layout });

  // 6️⃣ Armar el objeto final con toda la información
  const result: AnalysisResult = {
    id,
    url,
    createdAt: new Date().toISOString(),
    screenshot: 'homepage.png',
    typography,
    color,
    layout,
    breakdown
  };

  // 7️⃣ Guardar los resultados en un archivo JSON
  const jsonPath = path.join(outDir, 'result.json');
  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2));
  console.log(`💾 Datos guardados en: ${jsonPath}`);

  // 🆕 8️⃣ Generar el reporte PDF con los datos analizados
  try {
    const pdfResult = await generatePdfReport(outDir, result);
    console.log(`📄 Reporte PDF creado en: ${pdfResult.pdfPath}`);
  } catch (err: any) {
    console.error('⚠️ Error generando el PDF:', err.message);
  }

  // 9️⃣ Cerrar el navegador
  await browser.close();

  // 🔟 Retornar el resumen general
  return { id, score: breakdown.total, path: outDir };
}
