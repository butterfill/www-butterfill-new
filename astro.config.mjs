// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind'; // 1. Import the integration

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // 2. Add the integration to the array
  integrations: [svelte(), tailwind()],

  adapter: cloudflare(),
});