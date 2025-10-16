// analyzer/types.ts
// 👉 Define la estructura de datos para mantener el código ordenado.

export interface AnalysisResult {
  id: string;
  url: string;
  createdAt: string;
  screenshot: string;
  typography: { score: number; details: any };
  color: { score: number; details: any };
  layout: { score: number; details: any };
  breakdown: {
    total: number;
    typography: number;
    color: number;
    layout: number;
  };
}
