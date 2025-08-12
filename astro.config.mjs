// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind'; // 1. Import the integration

// https://astro.build/config
export default defineConfig({
  // 2. Add the integration to the array
  integrations: [svelte(), tailwind()],
});