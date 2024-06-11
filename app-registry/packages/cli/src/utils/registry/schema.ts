import { z } from 'zod';

export const registryItemSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  scripts: z.array(z.string()).optional(),
  files: z.array(z.string()),
  css: z.array(z.string()),
});

export const registryItemWithContentSchema = registryItemSchema.extend({
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
    })
  ),
  scripts: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
    })
  ),
  css: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
    })
  ),
});

export const registryIndexSchema = z.array(registryItemSchema);

export const registryWithContentSchema = z.array(registryItemWithContentSchema);
