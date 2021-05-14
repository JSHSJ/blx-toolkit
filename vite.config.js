// vite.config.js
const path = require('path');

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'Bloxxter Toolkit',
    },
    rollupOptions: {
      // external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
      },
    },
  },
};
