import path from 'path';
import { defaultTargetDirPaths } from './registry/config';

export const ROOT_PATH = path.resolve(process.cwd(), '../../../');
export const JS_PATH = path.join(ROOT_PATH, 'resources', 'js');
export const CSS_PATH = path.join(ROOT_PATH, 'resources', 'css');

export const getTargetDirPaths = ({
  overridePaths,
  cwd,
}: {
  cwd: string;
  overridePaths: { path?: string; script?: string; css?: string };
}) => {
  return {
    path: overridePaths.path ?? path.join(cwd, defaultTargetDirPaths.path),
    script:
      overridePaths.script ?? path.join(cwd, defaultTargetDirPaths.script),
    css: overridePaths.css ?? path.join(cwd, defaultTargetDirPaths.css),
  };
};
