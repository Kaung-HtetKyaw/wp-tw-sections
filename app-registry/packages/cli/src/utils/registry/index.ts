/* eslint-disable turbo/no-undeclared-env-vars */
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';
import {
  registryIndexSchema,
  registryItemWithContentSchema,
  registryWithContentSchema,
} from './schema';
import { z } from 'zod';

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined;

const baseUrl =
  process.env.COMPONENTS_REGISTRY_URL ?? 'https://blocks.vo-wptw.com';

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(['index.json']);

    return registryIndexSchema.parse(result);
  } catch (error) {
    throw new Error(`Failed to fetch components from registry.`);
  }
}

async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/registry/${path}`, {
          agent,
        });
        return await response.json();
      })
    );

    return results;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch registry from ${baseUrl}.`);
  }
}

export async function fetchTree(tree: z.infer<typeof registryIndexSchema>) {
  try {
    const paths = tree.map((item) => `blocks/${item.name}.json`);
    const result = await fetchRegistry(paths);

    return registryWithContentSchema.parse(result);
  } catch (error) {
    throw new Error(`Failed to fetch tree from registry.`);
  }
}

export type ItemTargetPaths = { path: string; script: string; css: string };
