// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // other configurations...

  define: {
    'process.env': process.env
  }
});
