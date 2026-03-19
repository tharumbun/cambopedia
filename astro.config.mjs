// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import partytown from '@astrojs/partytown';

export default defineConfig({
  output: 'static', // 👈 fix 1: forces static build on Cloudflare

  site: 'https://cambopedia.com/',
  base: '/',

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {           // 👈 fix 2: makes @layouts, @config, @utils etc. work at build time
        '@components': path.resolve('./src/layouts/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@config': path.resolve('./src/config'),
        '@utils': path.resolve('./src/utils'),
        '@styles': path.resolve('./src/styles'),
        '@assets': path.resolve('./src/assets'),
      }
    },
    server: {
      fs: {
        allow: ['.', path.resolve('./src/assets')],
      },
    },
  },

  integrations: [
    mdx(),
    icon(),
    sitemap(),
    partytown({
      config: {
        forward: ["gtag", "dataLayer.push"],
      },
    }),
  ]
});