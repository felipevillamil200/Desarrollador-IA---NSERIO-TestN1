// server-evaluator.ts
// 👉 Este archivo arranca el servidor Express y conecta la ruta del analizador.

import express from 'express';
import path from 'path';
import analyzeRouter from './routes/analyze.route';  // importamos nuestra ruta

const app = express();                  // crea la aplicación Express
const PORT = 3000;                      // puedes cambiar el puerto si quieres

// 🟢 Permite que Express lea datos JSON enviados en las peticiones
app.use(express.json());

// 🟢 Sirve la carpeta "public" para acceder a tus archivos estáticos (HTML, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));
// Ejemplo: http://localhost:3000/evaluator.html  → abrirá public/evaluator.html
//           http://localhost:3000/index.html     → abrirá tu tienda original

// 🟢 Todas las rutas de API del analizador comienzan con /api
app.use('/api', analyzeRouter);

// 🟢 Sirve la carpeta "results" para acceder a los PDF y screenshots generados
app.use('/results', express.static(path.join(__dirname, 'results')));
// Ejemplo: http://localhost:3000/results/123456789/report.pdf

// 🟢 Ruta raíz de prueba (para verificar que el servidor esté funcionando)
app.get('/', (req, res) => {
  res.send(`
    <h2>🟢 Servidor de evaluación web activo</h2>
    <p>Usa <code>POST /api/analyze</code> con una URL o abre 
    <a href="/evaluator.html">/evaluator.html</a> para probar la interfaz visual.</p>
  `);
});

// 🟢 Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log(`👉 Abre http://localhost:${PORT}/evaluator.html para probar la herramienta`);
});
