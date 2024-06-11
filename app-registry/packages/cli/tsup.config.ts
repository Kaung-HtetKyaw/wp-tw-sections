/* eslint-disable turbo/no-undeclared-env-vars */
import { defineConfig, Options } from 'tsup';
import { envConfig as devEnvConfig } from './config.development';
import { envConfig as prodEnvConfig } from './config.production';
console.log(process.env.NODE_ENV);
const envConfig =
  process.env.NODE_ENV === 'production' ? prodEnvConfig : devEnvConfig;

export const config = {
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  sourcemap: true,
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  env: {
    COMPONENTS_REGISTRY_URL: envConfig.COMPONENTS_REGISTRY_URL || '',
  },
} as Options;

export default defineConfig(config);
