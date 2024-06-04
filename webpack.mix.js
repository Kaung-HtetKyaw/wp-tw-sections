let mix = require('laravel-mix');
let path = require('path');
require('mix-env-file')

mix.env('.env');

mix.setResourceRoot('../');
mix.setPublicPath(path.resolve('./'));

mix.webpackConfig({
    watchOptions: { ignored: [
        path.posix.resolve(__dirname, './node_modules'),
        path.posix.resolve(__dirname, './css'),
        path.posix.resolve(__dirname, './js')
    ] }
});

mix.js('resources/js/app.js', 'js');

mix.js('resources/js/directives.js', 'js');

mix.postCss("resources/css/app.css", "css");

mix.postCss("resources/css/editor-style.css", "css");

mix.browserSync({
    proxy: `${process.env.HTTPS ? "http" : "https" }://${process.env.WP_URL}`,
    host: `${process.env.WP_URL}`,
    open: 'external',
    files: [
        `${__dirname}/**/*.php`,
        `${__dirname}/**/*.js`,
        `${__dirname}/**/*.css`,
    ],
    port: 8000
});

if (mix.inProduction()) {
    mix.version();
} else {
    mix.options({ manifest: false });
}
