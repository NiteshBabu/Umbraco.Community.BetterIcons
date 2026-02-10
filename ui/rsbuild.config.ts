import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';
import fs from 'fs';
import path from 'path';

// Path constants
const STATIC_DIR = 'static';
const OUTPUT_DIR = path.join(__dirname, '..', 'core/wwwroot/App_Plugins/BetterIcons');
const ASSET_PREFIX = '/App_Plugins/BetterIcons/';
const HTML_FILE = 'index.html';

export default defineConfig({
  plugins: [
    pluginPreact({
      reactAliasesEnabled: true,
    }),
    {
      name: 'copy-static-files',
      setup(api) {
        api.onAfterBuild(() => {
          const htmlSrc = path.join(__dirname, STATIC_DIR, HTML_FILE);
          const htmlDest = path.join(OUTPUT_DIR, HTML_FILE);
          fs.copyFileSync(htmlSrc, htmlDest);
          api.logger.info('✓ Copied index.html');
          
          const logoSrc = path.join(__dirname, STATIC_DIR, 'better-icons.png');
          const logoDest = path.join(OUTPUT_DIR, 'better-icons.png');
          if (fs.existsSync(logoSrc)) {
            fs.copyFileSync(logoSrc, logoDest);
            api.logger.info('✓ Copied better-icons.png');
          }
        });
      },
    },
  ],
  html: {
    template: path.join(__dirname, STATIC_DIR, HTML_FILE),
    inject: false, 
  },
  output: {
    filename: {
      js: 'index.js',
      css: 'index.css',
    },
    distPath: {
      root: OUTPUT_DIR,
      js: 'js',
    },
    assetPrefix: ASSET_PREFIX,
    cleanDistPath: true,
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
  dev: {
    writeToDisk: true,
  },
})
