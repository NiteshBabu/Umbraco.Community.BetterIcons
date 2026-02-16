import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';
import fs from 'fs';
import path from 'path';

// Path constants
const OUTPUT_DIR = path.join(__dirname, '..', 'core/wwwroot/App_Plugins/BetterIcons');
const ASSET_PREFIX = '/App_Plugins/BetterIcons/';
const UMBRACO_14_DIR = 'umbraco/Umbraco.14';

export default defineConfig({
  source: {
    entry: {
      'bettericons.U14': './src/index.U14.tsx',
    },
  },
  plugins: [
    pluginPreact({
      reactAliasesEnabled: true,
    }),
    {
      name: 'copy-umbraco-manifest',
      setup(api) {
        api.onAfterBuild(() => {
          const manifestSrc = path.join(__dirname, UMBRACO_14_DIR, 'umbraco-package.json');
          const manifestDest = path.join(OUTPUT_DIR, 'umbraco-package.json');
          if (fs.existsSync(manifestSrc)) {
            fs.copyFileSync(manifestSrc, manifestDest);
            api.logger.info('✓ Copied umbraco-package.json (v14+)');
          }
          
          // Remove generated HTML files (not needed for web components)
          const htmlFile = path.join(OUTPUT_DIR, 'bettericons.U14.html');
          if (fs.existsSync(htmlFile)) {
            fs.unlinkSync(htmlFile);
            api.logger.info('✓ Removed unnecessary HTML file');
          }
        });
      },
    },
  ],
  html: {
    template: false, // Don't generate HTML files
  },
  output: {
    filename: {
      js: '[name].js',
      css: '[name].css',
    },
    distPath: {
      root: OUTPUT_DIR,
      js: 'static/js',
      css: 'static/css',
    },
    assetPrefix: ASSET_PREFIX,
    cleanDistPath: false, // Don't clean, angular build runs first
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
  dev: {
    writeToDisk: true,
  },
});
