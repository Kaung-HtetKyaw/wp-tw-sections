import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { Command } from 'commander';
import { z } from 'zod';
import { existsSync, promises as fs } from 'fs';
import { logger } from '../utils/logger';
import { preFlight } from '../utils/get-project-info';
import { getPackageManager } from '../utils/get-package-manager';
import { execa } from 'execa';

const PROJECT_DEPENDENCIES = [
  'tailwindcss-animate',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
];

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  defaults: z.boolean(),
});

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-d, --defaults,', 'use default configuration.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd()
  )
  .action(async (opts) => {
    const options = initOptionsSchema.parse(opts);
    const cwd = path.resolve(options.cwd);

    // Ensure target directory exists.
    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    // check to make sure prerequisites are present
    preFlight(cwd);

    await runInit(cwd);

    logger.info('');
    logger.info(
      `${chalk.green(
        'Success!'
      )} Project initialization completed. You may now add components.`
    );
  });

export async function runInit(cwd: string) {
  const spinner = ora(`Initializing project...`)?.start();

  // Install dependencies.
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start();
  const packageManager = await getPackageManager(cwd);

  // TODO: add support for other icon libraries.
  const deps = [...PROJECT_DEPENDENCIES];

  await execa(
    packageManager,
    [packageManager === 'npm' ? 'install' : 'add', ...deps],
    {
      cwd,
    }
  );
  dependenciesSpinner?.succeed();
  spinner?.succeed();
}
