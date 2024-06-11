import { Command } from 'commander';
import { z } from 'zod';
import { handleError } from '../utils/handle-error';
import path from 'path';
import { existsSync, promises as fs } from 'fs';
import { logger } from '../utils/logger';
import { fetchTree, getRegistryIndex } from '../utils/registry';
import { getTargetDirPaths } from '../utils/paths';
import { registryIndexSchema } from '../utils/registry/schema';
import { diffLines, type Change } from 'diff';
import chalk from 'chalk';

const updateOptionsSchema = z.object({
  block: z.string().optional(),
  yes: z.boolean(),
  cwd: z.string(),
  path: z.string().optional(),
  script: z.string().optional(),
  css: z.string().optional(),
});

export const diff = new Command()
  .name('diff')
  .description('check for updates against the registry')
  .argument('[block]', 'the block name')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd()
  )
  .action(async (name, opts) => {
    try {
      const options = updateOptionsSchema.parse({
        block: name,
        ...opts,
      });

      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const registryIndex = await getRegistryIndex();

      if (!options.block) {
        const targetDirPaths = getTargetDirPaths({
          overridePaths: {
            path: options.path,
            script: options.script,
            css: options.css,
          },
          cwd,
        });

        // Find all components that exist in the project.
        const projectBlocks = registryIndex.filter((item) => {
          for (const file of item.files) {
            const filePath = path.resolve(targetDirPaths.path, file);

            if (existsSync(filePath)) {
              return true;
            }
          }

          return false;
        });

        // Check for updates.
        const blocksWithUpdates = [];

        for (const component of projectBlocks) {
          const changes = await diffComponent(component, options, cwd);
          if (changes.length) {
            blocksWithUpdates.push({
              name: component.name,
              changes,
            });
          }
        }

        if (!blocksWithUpdates.length) {
          logger.info('No updates found.');
          process.exit(0);
        }

        logger.info('The following components have updates available:');

        for (const block of blocksWithUpdates) {
          logger.info(`- ${block.name}`);
          for (const change of block.changes) {
            logger.info(`  - ${change.filePath}`);
          }
        }

        logger.break();
        logger.info(
          `Run ${chalk.green(`diff <component>`)} to see the changes.`
        );
        process.exit(0);
      }

      // Show diff for a single component.
      const block = registryIndex.find((item) => item.name === options.block);

      if (!block) {
        logger.error(
          `The component ${chalk.green(options.block)} does not exist.`
        );
        process.exit(1);
      }

      const changes = await diffComponent(block, options, cwd);

      if (!changes.length) {
        logger.info(`No updates found for ${options.block}.`);
        process.exit(0);
      }

      for (const change of changes) {
        logger.info(`- ${change.filePath}`);
        await printDiff(change.patch);
        logger.info('');
      }
    } catch (error) {
      handleError(error);
    }
  });

async function diffComponent(
  block: z.infer<typeof registryIndexSchema>[number],
  options: z.infer<typeof updateOptionsSchema>,
  cwd: string
) {
  const payload = await fetchTree([block]);

  const changes = [];

  for (const item of payload) {
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

    for (const file of item.files) {
      const filePath = path.resolve(targetDirPaths.path, item.name, file.path);

      if (!existsSync(filePath)) {
        continue;
      }

      const fileContent = await fs.readFile(filePath, 'utf8');

      const patch = diffLines(fileContent, file.content);

      if (patch.length > 1) {
        changes.push({
          file: file.path,
          filePath,
          patch,
        });
      }
    }
  }

  return changes;
}

async function printDiff(diff: Change[]) {
  diff.forEach((part) => {
    if (part) {
      if (part.added) {
        return process.stdout.write(chalk.green(part.value));
      }
      if (part.removed) {
        return process.stdout.write(chalk.red(part.value));
      }

      return process.stdout.write(part.value);
    }
  });
}
