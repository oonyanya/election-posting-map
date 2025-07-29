import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';
import viteCompression from  "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin(), viteCompression({
    include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml|kml|csv|geo_cache)$/,
    algorithms: ['gzip']
  })],
    server: {
        port: 53198,
    }
})
