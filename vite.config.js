import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const solidJsPath = isDev 
    ? path.resolve(__dirname, './node_modules/solid-js/dist/dev.js')
    : path.resolve(__dirname, './node_modules/solid-js/dist/solid.js');
  const solidWebPath = isDev
    ? path.resolve(__dirname, './node_modules/@solidjs/web/dist/dev.js')
    : path.resolve(__dirname, './node_modules/@solidjs/web/dist/web.js');

  return {
    plugins: [
      solidPlugin(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: 'solid-js?original', replacement: solidJsPath },
        { find: '@solidjs/web?original', replacement: solidWebPath },
        { find: /^solid-js$/, replacement: path.resolve(__dirname, './src/solid-shim.js') },
        { find: 'solid-js/store', replacement: path.resolve(__dirname, './src/solid-shim.js') },
        { find: 'solid-js/web', replacement: path.resolve(__dirname, './src/solid-web-shim.js') },
        { find: 'solid-js/html', replacement: path.resolve(__dirname, './src/solid-shim.js') },
        { find: 'solid-js/h', replacement: path.resolve(__dirname, './src/solid-shim.js') },
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    },
    optimizeDeps: {
      exclude: ['solid-js/store', 'solid-js/web', 'solid-js/html', 'solid-js/h'],
    },
  };
})
