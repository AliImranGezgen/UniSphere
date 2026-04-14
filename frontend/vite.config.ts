// UniSphere notu: Vite ayarlari frontend gelistirme ve build surecini toplar.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
