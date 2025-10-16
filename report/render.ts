// report/render.ts
// 👉 Carga template.html, reemplaza placeholders con datos reales, agrega recomendaciones automáticas
// y genera el PDF con Playwright.

import fs from 'fs/promises';
import path from 'path';
import { chromium } from 'playwright';
import type { AnalysisResult } from '../analyzer/types';

function toBase64(mime: string, bytes: Buffer) {
  return `data:${mime};base64,${bytes.toString('base64')}`;
}

// Pequeño helper para escapar caracteres HTML
function esc(s: any) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]!));
}

export async function generatePdfReport(outDir: string, result: AnalysisResult) {
  // 1️⃣ Cargar plantilla HTML base
  const templatePath = path.join(__dirname, 'template.html');
  let html = await fs.readFile(templatePath, 'utf8');

  // 2️⃣ Cargar screenshot y convertir a base64
  const shotPath = path.join(outDir, result.screenshot);
  const pngBytes = await fs.readFile(shotPath);
  const shotBase64 = toBase64('image/png', pngBytes);

  // 3️⃣ Preparar tabla de tipografía
  const topFonts: Array<[string, number]> = (result.typography.details?.topFonts ?? []);
  const typoRows = topFonts.slice(0, 3).map(([family, count]) =>
    `<tr><td>${esc(family)}</td><td>${esc(count)} elementos</td></tr>`
  ).join('') || `<tr><td colspan="2">Sin datos</td></tr>`;

  // 4️⃣ Preparar tabla de colores
  const colorPairs: Array<{ fg: string; bg: string }> = (result.color.details ?? []).slice(0, 8);
  const colorRows = colorPairs.map(p => `
    <tr>
      <td><code>${esc(p.fg)}</code> / <code>${esc(p.bg)}</code></td>
      <td>
        <div style="display:flex;gap:6px;align-items:center">
          <span style="display:inline-block;width:24px;height:16px;border:1px solid #ddd;background:${esc(p.fg)}"></span>
          <span style="display:inline-block;width:24px;height:16px;border:1px solid #ddd;background:${esc(p.bg)}"></span>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="2">Sin datos</td></tr>`;

  // 5️⃣ Preparar las barras de puntuación
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const T = clamp(result.breakdown.typography);
  const C = clamp(result.breakdown.color);
  const L = clamp(result.breakdown.layout);
  const toH = (v: number) => Math.round((v / 100) * 100);
  const toY = (h: number) => 10 + (100 - h);

  const BAR_T_H = toH(T), BAR_C_H = toH(C), BAR_L_H = toH(L);
  const BAR_T_Y = toY(BAR_T_H), BAR_C_Y = toY(BAR_C_H), BAR_L_Y = toY(BAR_L_H);

  // 6️⃣ Generar recomendaciones automáticas según puntajes
  function generarRecomendaciones() {
  const recs: string[] = [];

  const t = result.breakdown.typography;
  const c = result.breakdown.color;
  const l = result.breakdown.layout;
  const total = result.breakdown.total;

  // Tipografía
  if (t < 50)
    recs.push('🔠 La jerarquía tipográfica es débil. Usa tamaños más contrastantes entre títulos y textos.');
  else if (t < 70)
    recs.push('🔠 Revisa la coherencia en familias y pesos tipográficos. Evita usar muchas combinaciones.');
  else if (t < 85)
    recs.push('🔠 Buen uso tipográfico, aunque podrías mejorar contraste y legibilidad en textos pequeños.');
  else
    recs.push('🔠 Excelente uso tipográfico: jerarquía y legibilidad destacadas.');

  // Colores
  if (c < 50)
    recs.push('🎨 El contraste de color es bajo. Asegúrate de cumplir las normas WCAG (AA/AAA).');
  else if (c < 70)
    recs.push('🎨 Paleta con poca coherencia o contraste insuficiente entre texto y fondo.');
  else if (c < 85)
    recs.push('🎨 Buen equilibrio cromático, aunque podrías ajustar tonos secundarios o fondos.');
  else
    recs.push('🎨 Excelente armonía de colores y contraste apropiado.');

  // Layout
  if (l < 50)
    recs.push('📐 El layout está desbalanceado. Usa un grid o flex más uniforme y margenes consistentes.');
  else if (l < 70)
    recs.push('📐 Algunos elementos podrían reorganizarse para mejorar la jerarquía visual.');
  else if (l < 85)
    recs.push('📐 Estructura adecuada, aunque puedes optimizar espaciados y alineaciones.');
  else
    recs.push('📐 Diseño bien estructurado con un layout consistente y limpio.');

  // Total general
  if (total < 60)
    recs.push('🚧 El diseño necesita mejoras generales para lograr una experiencia más clara y estética.');
  else if (total < 80)
    recs.push('💡 Buen diseño general con margen para optimización visual.');
  else if (total < 90)
    recs.push('✅ Diseño sólido con detalles menores por pulir.');
  else
    recs.push('🏆 Diseño sobresaliente con estándares visuales de alto nivel.');

  return recs;
}


  const recomendaciones = generarRecomendaciones();
  const recHtml = recomendaciones.map(r => `<li>${r}</li>`).join('');

  // 7️⃣ Reemplazar placeholders con los datos reales
  const replacements: Record<string, string | number> = {
    '{{URL}}': esc(result.url),
    '{{DATE}}': new Date(result.createdAt).toLocaleString(),
    '{{TOTAL}}': String(result.breakdown.total),
    '{{T}}': String(T),
    '{{C}}': String(C),
    '{{L}}': String(L),
    '{{SCREENSHOT_BASE64}}': shotBase64,
    '{{TYPO_ROWS}}': typoRows,
    '{{COLOR_ROWS}}': colorRows,
    '{{LAYOUT_GRID}}': String(result.layout.details?.grid ?? 0),
    '{{LAYOUT_FLEX}}': String(result.layout.details?.flex ?? 0),
    '{{LAYOUT_BLOCK}}': String(result.layout.details?.block ?? 0),
    '{{BAR_T_H}}': String(BAR_T_H),
    '{{BAR_T_Y}}': String(BAR_T_Y),
    '{{BAR_C_H}}': String(BAR_C_H),
    '{{BAR_C_Y}}': String(BAR_C_Y),
    '{{BAR_L_H}}': String(BAR_L_H),
    '{{BAR_L_Y}}': String(BAR_L_Y),
    '{{RECOMMENDATIONS}}': recHtml // 🆕 Nueva sección
  };

  for (const [k, v] of Object.entries(replacements)) {
    html = html.replace(new RegExp(k, 'g'), String(v));
  }

  // 8️⃣ Guardar versión HTML (útil para debug)
  const htmlOut = path.join(outDir, 'report.html');
  await fs.writeFile(htmlOut, html, 'utf8');

  // 9️⃣ Generar PDF final con Playwright
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const pdfPath = path.join(outDir, 'report.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  });

  await browser.close();

  return { pdfPath, htmlOut };
}

