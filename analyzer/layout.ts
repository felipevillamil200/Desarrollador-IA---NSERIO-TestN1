// analyzer/layout.ts
// 👉 Analiza la estructura de la página: uso de grid, flexbox, y proporciones.

import type { Page } from 'playwright';

export async function analyzeLayout(page: Page) {
  const layoutData = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('body *'));
    const layoutTypes = { flex: 0, grid: 0, block: 0 };

    for (const el of elements) {
      const display = window.getComputedStyle(el).display;
      if (display.includes('flex')) layoutTypes.flex++;
      else if (display.includes('grid')) layoutTypes.grid++;
      else layoutTypes.block++;
    }

    return layoutTypes;
  });

  // Ejemplo simple: premiamos el uso equilibrado de grid/flex
  const score = layoutData.grid > 0 || layoutData.flex > 0 ? 90 : 60;

  return { score, details: layoutData };
}
