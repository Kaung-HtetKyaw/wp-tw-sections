import { existsSync, promises as fs, readFileSync } from 'fs';
import path from 'path';
import { Command } from 'commander';
import { z } from 'zod';
import { logger } from '../utils/logger';
import {
  fetchTree,
  getRegistryIndex,
  ItemTargetPaths,
} from '../utils/registry';
import prompts from 'prompts';
import ora, { Ora } from 'ora';
import chalk from 'chalk';
import {
  registryItemSchema,
  registryItemWithContentSchema,
} from '../utils/registry/schema';
import { defaultTargetDirPaths } from '../utils/registry/config';
import { getTargetDirPaths, JS_PATH, ROOT_PATH } from '../utils/paths';
import { handleError } from '../utils/handle-error';

const addOptionsSchema = z.object({
  blocks: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  script: z.string().optional(),
  css: z.string().optional(),
});

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument('[blocks...]', 'the blocks to add')
  .option('-y, --yes', 'skip confirmation prompt.', true)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd()
  )
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the block to.')
  .option('-css --css <css>', 'the path to add respective css to')
  .option('-script --script <script>', 'the path to add respective script to')
  .action(async (blocks, opts) => {
    try {
      const options = addOptionsSchema.parse({
        blocks,
        ...opts,
      });

      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      // fetch all blocks informations
      const registryIndex = await getRegistryIndex();

      let selectedBlocks = options.all
        ? registryIndex.map((entry) => entry.name)
        : options.blocks || [];

      if (!options.blocks?.length && !options.all) {
        const { blocks } = await prompts({
          type: 'multiselect',
          name: 'blocks',
          message: 'Which blocks would you like to add?',
          hint: 'Space to select. A to toggle all. Enter to submit.',
          instructions: false,
          choices: registryIndex.map((entry) => ({
            title: entry.name,
            value: entry.name,
            selected: options.all ? true : options.blocks?.includes(entry.name),
          })),
        });

        selectedBlocks = blocks;
      }

      const payload = await fetchTree(registryIndex);

      if (!payload?.length) {
        logger.warn('No blocks selected. Exiting.');
        process.exit(0);
      }

      if (!options.yes) {
        const { proceed } = await prompts({
          type: 'confirm',
          name: 'proceed',
          message: `Ready to install components and dependencies. Proceed?`,
          initial: true,
        });

        if (!proceed) {
          process.exit(0);
        }
      }

      const spinner = ora(`Installing components...`).start();

      await addBlocksAndDepedencies({
        payload,
        spinner,
        selectedBlocks,
        options,
        cwd,
      });

      spinner.succeed(`Done.`);
    } catch (error) {
      handleError(error);
    }
  });

export const addBlocksAndDepedencies = async ({
  options,
  selectedBlocks,
  payload,
  spinner,
  cwd,
}: {
  options: z.infer<typeof addOptionsSchema>;
  selectedBlocks: string[];
  payload: z.infer<typeof registryItemWithContentSchema>[];
  spinner: Ora;
  cwd: string;
}) => {
  for (const item of payload) {
    spinner.text = `Installing ${item.name}...`;

    const targetDirPaths = getTargetDirPaths({
      overridePaths: {
        path: options.path,
        script: options.script,
        css: options.css,
      },
      cwd,
    });

    if (!targetDirPaths.path || !targetDirPaths.script || !targetDirPaths.css) {
      logger.warn('Cannot find paths for blocks or script or css');
      continue;
    }

    // write content for blocks
    if (!existsSync(path.join(targetDirPaths.path, item.name))) {
      await fs.mkdir(path.join(targetDirPaths.path, item.name), {
        recursive: true,
      });
    }

    const existingBlocks = item.files.filter((file) =>
      existsSync(path.resolve(targetDirPaths.path, item.name, file.path))
    );

    if (existingBlocks.length && !options.overwrite) {
      if (selectedBlocks.includes(item.name)) {
        spinner.stop();
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: `Block ${item.name} already exists. Would you like to overwrite?`,
          initial: false,
        });

        if (!overwrite) {
          logger.info(
            `Skipped ${item.name}. To overwrite, run with the ${chalk.green(
              '--overwrite'
            )} flag.`
          );
          continue;
        }

        spinner.start(`Installing ${item.name}...`);
      } else {
        continue;
      }
    }

    for (const file of item.files) {
      let filePath = path.resolve(targetDirPaths.path, item.name, file.path);

      await fs.writeFile(filePath, file.content);
    }

    if (!existsSync(targetDirPaths.script)) {
      await fs.mkdir(targetDirPaths.script, { recursive: true });
    }

    for (const script of item.scripts || []) {
      let filePath = path.resolve(targetDirPaths.script, script.path);

      if (!existsSync(path.dirname(filePath))) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
      }

      await fs.writeFile(filePath, script.content);
    }

    if (!existsSync(targetDirPaths.css)) {
      await fs.mkdir(targetDirPaths.css, { recursive: true });
    }

    for (const css of item.css || []) {
      let filePath = path.resolve(targetDirPaths.css, css.path);

      if (!existsSync(path.dirname(filePath))) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
      }

      await fs.writeFile(filePath, css.content);
    }
  }
};
