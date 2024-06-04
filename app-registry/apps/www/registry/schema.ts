import { z } from "zod";

export const registryEntrySchema = z.object({
  name: z.string(),
  namespace: z.string(),
  files: z.array(z.string()),
  scripts: z.array(z.string()).optional().default([]),
  css: z.array(z.string()).optional().default([]),
});

export const registrySchema = z.array(registryEntrySchema);

export type Registry = z.infer<typeof registrySchema>;

export const blockChunkSchema = z.object({
  name: z.string(),
  content: z.any(),
  file: z.string(),
  code: z.string().optional(),
  container: z
    .object({
      className: z.string().nullish(),
    })
    .optional(),
});
