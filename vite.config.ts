import { ConfigEnv, defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';
import viteCompression from  "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => {
  return {
    plugins: [plugin(), viteCompression({
      include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml|kml|csv|geo_cache)$/,
      algorithms: ['gzip']
    })],
    // github pages用
    base: env.mode == 'production' ? '/election-map/' : '/',
    server: {
      port: 53198,
    }
  }
})
