// analyzer/color.ts
// 👉 Analiza la paleta de colores y los contrastes principales.

import type { Page } from 'playwright';

export async function analyzeColor(page: Page) {
  const colorData = await page.evaluate(() => {
    // Obtener colores de fondo y texto de algunos elementos visibles
    const elements = Array.from(document.querySelectorAll('body *')).slice(0, 100);
    const colors: { fg: string; bg: string }[] = [];

    for (const el of elements) {
      const style = window.getComputedStyle(el);
      const fg = style.color;
      const bg = style.backgroundColor;
      if (fg && bg) colors.push({ fg, bg });
    }
    return colors;
  });

  // Ejemplo simple: contar colores distintos (más colores = menos consistencia)
  const uniqueColors = new Set(colorData.map(c => c.fg + c.bg));
  const consistencyScore = Math.max(50, 100 - (uniqueColors.size / 10));

  return { score: Math.round(consistencyScore), details: colorData };
}
