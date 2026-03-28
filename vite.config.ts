import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const appSettingsPath = path.resolve(process.cwd(), 'appsettings.json');
let appSettings = { BackendPort: 3001, FrontendPort: 5173 };
if (fs.existsSync(appSettingsPath)) {
  try {
    appSettings = { ...appSettings, ...JSON.parse(fs.readFileSync(appSettingsPath, 'utf-8')) };
  } catch (e) {
    console.error('Error parsing appsettings.json:', e);
  }
}


const apiProxy = {
  '/api': {
    target: `http://localhost:${appSettings.BackendPort}`,
    changeOrigin: true,
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: appSettings.FrontendPort,
    proxy: apiProxy,
  },
  preview: {
    port: appSettings.FrontendPort,
    proxy: apiProxy,
  },
})
