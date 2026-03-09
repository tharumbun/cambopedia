// src/pages/open-graph/[...slug].png.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import path from 'node:path';

// 1. Tell Astro which images to generate at build time
export async function getStaticPaths() {
  const posts = await getCollection('blog'); // Change 'blog' to your collection name
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, description: post.data.description },
  }));
}

// 2. The GET function that handles the image generation
export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props;

  // Load font file
  const fontPath = path.resolve('./public/fonts/Inter-Bold.ttf');
  const fontData = await fs.readFile(fontPath);

  // Design the image using Satori (React-like syntax)
  const svg = await satori(
    {
      type: 'div',
      props: {
        children: [
          {
            type: 'div',
            props: {
              children: title,
              style: { fontSize: 72, fontWeight: 'bold', color: 'white', marginBottom: '24px' }
            }
          },
          {
            type: 'div',
            props: {
              children: "Cambopedia",
              style: { fontSize: 32, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }
            }
          }
        ],
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          padding: '80px',
          textAlign: 'center',
          fontFamily: 'Inter',
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, style: 'normal' }],
    }
  );

  // Convert SVG to PNG
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Return the PNG response
  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
};