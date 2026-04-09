import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';
import fs from 'fs';
import path from 'path';

// Path constants
const UMBRACO_13_DIR = 'umbraco/Umbraco.13';
const PUBLIC_DIR = 'public';
const OUTPUT_DIR = path.join(__dirname, '..', 'core/wwwroot/App_Plugins/BetterIcons');
const ASSET_PREFIX = '/App_Plugins/BetterIcons/';
const HTML_FILE = 'index.html';

export default defineConfig({
  source: {
    entry: {
      'bettericons.U13': './src/index.U13.tsx',
      'dashboard.U13': './src/dashboard.U13.tsx',
    },
  },
  plugins: [
    pluginPreact({
      reactAliasesEnabled: true,
    }),
    {
      name: 'copy-static-files',
      setup(api) {
        api.onAfterBuild(() => {
          const htmlSrc = path.join(__dirname, UMBRACO_13_DIR, HTML_FILE);
          const htmlDest = path.join(OUTPUT_DIR, HTML_FILE);
          fs.copyFileSync(htmlSrc, htmlDest);
          api.logger.info('✓ Copied index.html (v13)');
          
          const logoSrc = path.join(__dirname, PUBLIC_DIR, 'better-icons.png');
          const logoDest = path.join(OUTPUT_DIR, 'better-icons.png');
          if (fs.existsSync(logoSrc)) {
            fs.copyFileSync(logoSrc, logoDest);
            api.logger.info('✓ Copied better-icons.png');
          }

          const manifestSrc = path.join(__dirname, UMBRACO_13_DIR, 'package.manifest');
          const manifestDest = path.join(OUTPUT_DIR, 'package.manifest');
          if (fs.existsSync(manifestSrc)) {
            fs.copyFileSync(manifestSrc, manifestDest);
            api.logger.info('✓ Copied package.manifest (v11-13)');
          }
          
          // Remove generated HTML file (not needed, we use index.html instead)
          const generatedHtmlFile = path.join(OUTPUT_DIR, 'bettericons.U13.html');
          if (fs.existsSync(generatedHtmlFile)) {
            fs.unlinkSync(generatedHtmlFile);
            api.logger.info('✓ Removed unnecessary bettericons HTML file');
          }
          
          const dashboardHtmlFile = path.join(OUTPUT_DIR, 'dashboard.U13.html');
          if (fs.existsSync(dashboardHtmlFile)) {
            fs.unlinkSync(dashboardHtmlFile);
            api.logger.info('✓ Removed unnecessary dashboard HTML file');
          }
        });
      },
    },
  ],
  html: {
    template: path.join(__dirname, UMBRACO_13_DIR, HTML_FILE),
    inject: false, 
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
    cleanDistPath: false,
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
