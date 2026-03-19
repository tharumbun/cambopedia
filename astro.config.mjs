// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import path from 'path';
// 1. ADD THIS IMPORT
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  // Set the site URL for production
  site: 'https://cambopedia.com/',
  
  // Base path (set to '/' for most sites)
  base: '/',
  
  // Configure Vite plugins and server settings
  vite: {
    plugins: [
      tailwindcss() 
    ],
    server: {
      fs: {
        allow: [
          '.',
          path.resolve('./src/assets'),
        ],
      },
    },
  },
  
  // Configure Astro integrations
  // 2. ADD THE PARTYTOWN FUNCTION HERE
  integrations: [
    mdx(), 
    icon(), 
    sitemap(),
    partytown({
      config: {
        // This is the critical part for Google Analytics 4
        forward: ["gtag", "dataLayer.push"],
      },
    }),
  ]
});