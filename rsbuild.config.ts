import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: '/afn-afd/',
  },
  tools: {
    postcss: (config) => {
      config.postcssOptions ||= {};
      config.postcssOptions.plugins ||= [];
      config.postcssOptions.plugins.push(tailwindcss());
    },
  },
});