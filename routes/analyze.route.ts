// routes/analyze.route.ts
// 👉 Esta ruta recibe una URL por POST, ejecuta el análisis y devuelve el resultado.

import { Router } from 'express';
import { analyzeUrl } from '../analyzer/index';  // importa la función que creamos antes

const router = Router();

// Ruta principal: POST /api/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;                      // leemos el campo "url" del body

    if (!url || typeof url !== 'string') {         // validamos que sea un texto válido
      return res.status(400).json({ error: 'Debes enviar una URL válida.' });
    }

    console.log(`🧠 Recibida URL: ${url}`);

    const result = await analyzeUrl(url);          // ejecutamos el análisis principal

    // Devolvemos un resumen
    res.json({
      ok: true,
      id: result.id,
      totalScore: result.score,
      resultPath: result.path
    });
  } catch (error: any) {
    console.error('❌ Error al analizar:', error.message);
    res.status(500).json({ error: 'Error al procesar la URL.' });
  }
});

export default router;
