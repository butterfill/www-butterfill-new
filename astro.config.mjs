// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind'; // 1. Import the integration

import cloudflare from '@astrojs/cloudflare';

// Math (SSR): remark-math + rehype-katex
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // 2. Add the integration to the array
  integrations: [svelte(), tailwind()],

  // Enable math globally in Markdown
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          throwOnError: false,
          strict: false,
          macros: {
            "\\sf": "\\mathsf",
            "\\tt": "\\mathtt",
            "\\bf": "\\mathbf",
            "\\it": "\\mathit",
            "\\rm": "\\mathrm",
            "\\upbeta": "\\beta"
          }
        }
      ]
    ]
  },

  adapter: cloudflare(),
});