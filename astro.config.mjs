// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind'; // 1. Import the integration
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// Math (SSR): remark-math + rehype-katex
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { resolveLastmodForUrl } from './scripts/lastmod.mjs';

// https://astro.build/config
export default defineConfig({
  // Canonical site URL for sitemap
  site: 'https://www.butterfill.com',
  // 2. Add the integration to the array
  integrations: [
    svelte(),
    tailwind(),
    sitemap({
      // exclude API endpoints from sitemap
      filter: (page) => !page.includes('/api/'),
      // set per-URL lastmod using repo/content info
      serialize: async (item) => {
        try {
          const url = typeof item.url === 'string' ? item.url : String(item.url);
          const pathname = new URL(url, 'https://www.butterfill.com').pathname;
          const lastmod = await resolveLastmodForUrl(pathname);
          return { ...item, lastmod };
        } catch {
          return item;
        }
      },
    }),
  ],

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
