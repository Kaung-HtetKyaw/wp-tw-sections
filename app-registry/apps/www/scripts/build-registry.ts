// @sts-nocheck
import { existsSync, promises as fs, readFileSync } from 'fs';
import { rimraf } from 'rimraf';
import fg from 'fast-glob';
import path from 'path';
import { BLOCKS_PATH } from '../../../../paths';
import { Registry, registrySchema } from '@/registry/schema';
import { registry } from '@/registry';
import { Project, ScriptKind } from 'ts-morph';
import { tmpdir } from 'os';
import { removeDuplicates } from './utils';

const REGISTRY_PATH = path.join(process.cwd(), 'public/registry');
const INCLUDE_PHP_FILE_REGEX = /(?<=['"])([^'"]*\.php)(?=['"]\s*\?>)/g;

export const ROOT_PATH = path.resolve(process.cwd(), '../../../');
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

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'));
  return path.join(dir, filename);
}

const resolveScriptTree = async (
  filename: string,
  project: Project,
  dir = ''
) => {
  let importedScripts: string[] = [];

  const tempFile = await createTempSourceFile(filename);
  const dirName = dir ?? '';

  const raw = await fs.readFile(
    path.join(
      `${ROOT_PATH}/resources/js/`,
      dirName,
      getJSImportFilenameWithExtension(filename)
    ),
    'utf8'
  );

  const sourceFile = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.JS,
  });

  sourceFile.getImportDeclarations().forEach((node) => {
    const module = node.getModuleSpecifier().getLiteralValue();

    importedScripts.push(
      getJSImportFilenameWithExtension(
        path.join(dir, path.dirname(filename), module)
      )
    );
  });

  await Promise.all(
    importedScripts.map(async (el) => {
      const dependencies = await resolveScriptTree(
        path.basename(el),
        project,
        path.join(path.dirname(el))
      );

      importedScripts.push(...dependencies);
    })
  );

  return removeDuplicates(importedScripts);
};

const getJSImportFilenameWithExtension = (filename: string) => {
  const baseFilename = path.basename(filename);

  const hasExtension = baseFilename.split('.').slice(-1).pop() === 'js';

  return hasExtension ? filename : `${filename}.js`;
};

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
    const files = item.files?.map((file) => {
      const content = readFileSync(
        path.join(BLOCKS_PATH, 'blocks', file),
        'utf8'
      );

      return {
        name: path.basename(file),
        content,
      };
    });

    const resolvedFileDependencies = await getResolvedFileDependencies(files);

    let scriptsTree = (
      await Promise.all(
        item.scripts.map((el) => resolveScriptTree(el, project))
      )
    ).flat();

    const scripts = [...item.scripts, ...scriptsTree]?.map((script) => {
      const content = readFileSync(path.join(JS_PATH, script), 'utf8');

      return {
        path: script,
        content,
      };
    });

    // TODO: resolve complete tree for css
    const css = [...item.css].map((file) => {
      const content = readFileSync(path.join(CSS_PATH, file), 'utf8');

      return { path: file, content };
    });

    const payload = {
      ...item,
      scripts,
      files: [...files, ...resolvedFileDependencies.flat()],
      css,
    };

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(payload, null, 2),
      'utf8'
    );
  }
}

const getResolvedFileDependencies = async (
  files: { name: string; content: string }[]
) => {
  return Promise.all(
    files?.map(async (file) => {
      // match all php includes
      const allMatches = Array.from(
        file.content.match(INCLUDE_PHP_FILE_REGEX) || []
      );

      // remove duplicates
      const matches = allMatches
        .filter(
          (path, index, self) => self.findIndex((c) => path === c) === index
        )
        .filter(Boolean);

      const resolvedFiles = await Promise.all(
        matches?.map(async (el) => {
          try {
            const resolvedPath = await fg(`${ROOT_PATH}/blocks/**${el}`);

            const content = readFileSync(resolvedPath.join(''), 'utf8');

            return { name: path.basename(el), content };
          } catch {
            console.warn(`Cannot read file path: ${el} for file: ${file.name}`);

            return { name: null, content: null };
          }
        })
      );

      return resolvedFiles.filter((el) => el.name);
    })
  );
};

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
