import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['ru', 'de']),
    section: z.enum(['about', 'faith', 'services', 'contact', 'media', 'legal']),
    order: z.number().default(0),
  }),
});

export const collections = { pages };
