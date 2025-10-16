// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,                // Timeout máximo por test
  retries: 1,                         // Reintento de tests fallidos
  reporter: [
    ['html', { open: 'never' }],     // Reporte HTML sin abrir automáticamente
    ['list'],                         // Lista en consola para seguimiento
  ],
  use: {
    browserName: 'chromium',
    headless: false,                  // Mostrar navegador para demostraciones
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',    // Captura solo si falla
    video: 'on',              // Video solo si falla
    trace: 'on-first-retry',          // Traza para el primer retry
    actionTimeout: 15 * 1000,         // Timeout para acciones individuales
    navigationTimeout: 15 * 1000,     // Timeout para navegación
    storageState: path.join(__dirname, 'state.json'), // Guarda estado opcional
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomenta para multi-browser si lo deseas
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
