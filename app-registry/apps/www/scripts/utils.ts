import path from 'path';
import { Project, ScriptKind } from 'ts-morph';
import { existsSync, promises as fs, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { BLOCKS_PATH, CSS_PATH, JS_PATH, ROOT_PATH } from './build-registry';
import fg from 'fast-glob';

const INCLUDE_PHP_FILE_REGEX = /(?<=['"])([^'"]*\.php)(?=['"]\s*\?>)/g;
const IMPORT_CSS_REGEX = /(?<=@import\s["'])(?:(?!@import).)*?(?=["'];)/g;

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'));
  return path.join(dir, filename);
}

export const removeDuplicates = <T>(items: T[]): T[] => {
  return items
    .filter((item, index, self) => self.findIndex((c) => item === c) === index)
    .filter(Boolean);
};

export const resolveScriptContentTree = async (
  scripts: string[],
  project: Project
) => {
  // TODO: handle error for Promise.all
  const scriptTree = (
    await Promise.all(scripts.map((el) => resolveScriptTree(el, project)))
  ).flat();

  return [...scripts, ...scriptTree]?.map((script) => {
    const content = readFileSync(path.join(JS_PATH, script), 'utf8');

    return {
      path: script,
      content,
    };
  });
};

export const resolveScriptTree = async (
  filename: string,
  project: Project,
  dir = ''
) => {
  let importedScripts: string[] = [];

  const tempFile = await createTempSourceFile(filename);
  const dirName = dir ?? '';

  const raw = await fs.readFile(
    path.join(JS_PATH, dirName, getImportFilenameWithExtension(filename, 'js')),
    'utf8'
  );

  const sourceFile = project.createSourceFile(tempFile, raw, {
    scriptKind: ScriptKind.JS,
  });

  sourceFile.getImportDeclarations().forEach((node) => {
    const module = node.getModuleSpecifier().getLiteralValue();

    importedScripts.push(
      getImportFilenameWithExtension(
        path.join(dir, path.dirname(filename), module),
        'js'
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

export const getImportFilenameWithExtension = (
  filename: string,
  extension: string
) => {
  const baseFilename = path.basename(filename);

  const hasExtension = baseFilename.split('.').slice(-1).pop() === extension;

  return hasExtension ? filename : `${filename}.${extension}`;
};

export const resolveCssContentTree = async (paths: string[]) => {
  const files = paths?.map((file) => {
    const content = readFileSync(path.join(CSS_PATH, file), 'utf8');

    return {
      path: path.basename(file),
      content,
    };
  });

  // TODO: handle error for Promise.all
  const dependencies = await Promise.all(
    files?.map(async (file) => {
      // match all php includes
      const allMatches = Array.from(file.content.match(IMPORT_CSS_REGEX) || []);

      // remove duplicates
      const matches = allMatches
        .filter(
          (path, index, self) => self.findIndex((c) => path === c) === index
        )
        .filter(Boolean);

      const resolvedFiles = await Promise.all(
        matches?.map(async (el) => {
          try {
            const resolvedPath = await fg(`${ROOT_PATH}/resources/css/**${el}`);

            const content = readFileSync(resolvedPath.join(''), 'utf8');

            return { path: path.basename(el), content };
          } catch {
            console.warn(`Cannot read file path: ${el} for file: ${file.path}`);

            return { path: null, content: null };
          }
        })
      );

      return resolvedFiles.filter((el) => el.path);
    })
  );

  return [...files, ...dependencies.flat()];
};

export const resolvePhpContentTree = async (paths: string[]) => {
  const files = paths?.map((file) => {
    const content = readFileSync(path.join(BLOCKS_PATH, file), 'utf8');

    return {
      path: path.basename(file),
      content,
    };
  });

  const dependencies = await Promise.all(
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

            return { path: path.basename(el), content };
          } catch {
            console.warn(`Cannot read file path: ${el} for file: ${file.path}`);

            return { path: null, content: null };
          }
        })
      );

      return resolvedFiles.filter((el) => el.path);
    })
  );

  return [...files, ...dependencies.flat()];
};
