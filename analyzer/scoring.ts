// analyzer/scoring.ts
// 👉 Calcula la puntuación total (0–100) combinando los tres módulos.

export function score(parts: { typography: any; color: any; layout: any }) {
  const WEIGHTS = { typography: 0.4, color: 0.3, layout: 0.3 }; // pesos relativos
  const total =
    parts.typography.score * WEIGHTS.typography +
    parts.color.score * WEIGHTS.color +
    parts.layout.score * WEIGHTS.layout;

  return {
    total: Math.round(total),
    typography: parts.typography.score,
    color: parts.color.score,
    layout: parts.layout.score
  };
}
