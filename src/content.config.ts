import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Articles du blog — un fichier .md par article dans src/content/blog/
// (créés/édités depuis /admin par Decap CMS)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string(),
    cover: z.string().optional().nullable().transform((v) => v || undefined),
    coverAlt: z.string().optional().nullable().transform((v) => v || undefined),
    draft: z.boolean().default(false),
  }),
});

// Pages éditables depuis l'admin (Accueil, À propos, Services, Contact)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    image: z.string().optional().nullable().transform((v) => v || undefined),
    imageAlt: z.string().optional().nullable().transform((v) => v || undefined),
    cta: z
      .object({ label: z.string(), href: z.string() })
      .optional()
      .nullable()
      .transform((v) => v || undefined),
    services: z
      .array(z.object({ title: z.string(), description: z.string() }))
      .optional()
      .default([]),
  }),
});

export const collections = { blog, pages };
