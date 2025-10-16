// analyzer/typography.ts
// 👉 Analiza las fuentes, tamaños y jerarquía de texto en la página.

import type { Page } from 'playwright';

export async function analyzeTypography(page: Page) {
  // Ejecutamos código dentro del navegador para extraer información
  const typographyData = await page.evaluate(() => {
    const allText = Array.from(document.querySelectorAll('body *'))
      .filter(el => window.getComputedStyle(el).fontFamily)
      .map(el => {
        const style = window.getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight
        };
      });

    // Buscar fuentes más usadas
    const fontCounts: Record<string, number> = {};
    for (const item of allText) {
      fontCounts[item.fontFamily] = (fontCounts[item.fontFamily] || 0) + 1;
    }

    const topFonts = Object.entries(fontCounts).sort((a,b)=>b[1]-a[1]).slice(0,3);

    return {
      fontsUsed: Object.keys(fontCounts),
      topFonts,
      sample: allText.slice(0, 10) // muestra parcial
    };
  });

  // Generar una puntuación básica (puedes mejorarla luego)
  const score = typographyData.topFonts.length <= 3 ? 90 : 70;

  return { score, details: typographyData };
}
