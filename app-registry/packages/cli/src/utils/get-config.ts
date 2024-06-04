import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

const explorer = cosmiconfig('components', {
  searchPlaces: ['blocks.json'],
});

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    style: z.string(),
    rsc: z.coerce.boolean().default(false),
    tsx: z.coerce.boolean().default(true),
    tailwind: z.object({
      config: z.string(),
      css: z.string(),
      baseColor: z.string(),
      cssVariables: z.boolean().default(true),
      prefix: z.string().default('').optional(),
    }),
    aliases: z.object({
      components: z.string(),
      utils: z.string(),
      ui: z.string().optional(),
    }),
  })
  .strict();
