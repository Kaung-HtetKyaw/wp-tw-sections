// @sts-nocheck
import { existsSync, promises as fs, readFileSync } from 'fs';
import { rimraf } from 'rimraf';
import path from 'path';
import { Registry, registrySchema } from '@/registry/schema';
import { registry } from '@/registry';
import { Project, ScriptKind } from 'ts-morph';
import { tmpdir } from 'os';
import {
  removeDuplicates,
  resolveCssContentTree,
  resolvePhpContentTree,
  resolveScriptContentTree,
  resolveScriptTree,
} from './utils';

const REGISTRY_PATH = path.join(process.cwd(), 'public/registry');

export const ROOT_PATH = path.resolve(process.cwd(), '../../../');
export const BLOCKS_PATH = path.join(ROOT_PATH, 'blocks');
export const JS_PATH = path.join(ROOT_PATH, 'resources', 'js');
export const CSS_PATH = path.join(ROOT_PATH, 'resources', 'css');

// ----------------------------------------------------------------------------
// Build registry/blocks/index.json.
// ----------------------------------------------------------------------------

async function buildRegistry(registry: Registry) {
  const registryJson = JSON.stringify(registry, null, 2);
  rimraf.sync(path.join(REGISTRY_PATH, 'index.json'));
  await fs.writeFile(
    path.join(REGISTRY_PATH, 'index.json'),
    registryJson,
    'utf8'
  );
}

// ----------------------------------------------------------------------------
// Build registry/blocks/[name].json.

// ----------------------------------------------------------------------------
async function buildStyles(registry: Registry) {
  const targetPath = path.join(REGISTRY_PATH, 'blocks');

  const project = new Project({
    compilerOptions: {},
  });

  // Create directory if it doesn't exist.
  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  for (const item of registry) {
    const phps = await resolvePhpContentTree(item.files);

    const scripts = await resolveScriptContentTree(item.scripts, project);

    const css = await resolveCssContentTree(item.css);

    const payload = {
      ...item,
      scripts,
      files: phps,
      css,
    };

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload, null, 2),
      'utf8'
    );
  }
}

try {
  const result = registrySchema.safeParse(registry);

  if (!result.success) {
    console.error(result.error);
    process.exit(1);
  }

  buildRegistry(result.data).then(() => {
    buildStyles(result.data).then(() => {
      console.log('✅ Done!');
    });
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
