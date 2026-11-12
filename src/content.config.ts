import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const optionalString = z.string().optional().nullable().transform((v) => v || undefined);

// Sports — un fichier par sport dans src/content/sports/ (éditable depuis /admin)
const sports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sports' }),
  schema: z.object({
    name: z.string(),
    emoji: z.string().default('🏅'),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#69f2c4'),
    tagline: z.string(),
    cover: optionalString,
    order: z.number().default(100),
  }),
});

// Articles du blog — un fichier .md par article dans src/content/blog/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional().nullable().transform((v) => v || undefined),
    description: z.string(),
    // identifiant du sport (nom du fichier dans src/content/sports/, ex. « football »)
    sport: z.string(),
    tags: z.array(z.string()).optional().nullable().transform((v) => v ?? []),
    cover: optionalString,
    coverAlt: optionalString,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Pages éditables depuis l'admin (Accueil, À propos, Contact)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: optionalString,
    intro: optionalString,
    image: optionalString,
    imageAlt: optionalString,
    cta: z
      .object({ label: z.string(), href: z.string() })
      .optional()
      .nullable()
      .transform((v) => v || undefined),
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional()
      .nullable()
      .transform((v) => v ?? []),
  }),
});

export const collections = { sports, blog, pages };
