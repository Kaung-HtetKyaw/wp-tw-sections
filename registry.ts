export const registry: {
  namespace: string;
  name: string;
  scripts: string[];
  files: string[];
  css: string[];
}[] = [
  {
    namespace: 'vo-custom-blocks/base',
    name: 'base',
    scripts: ['base.js'],
    files: ['base/base.php'],
    css: ['base.css'],
  },
  {
    namespace: 'vo-custom-blocks/wordpress-sidebar-block',
    name: 'wordpress-sidebar-block',
    files: ['wordpress-sidebar-block/wordpress-sidebar-block.php'],
    scripts: ['wordpress-sidebar-block.js'],
    css: [],
  },
];
