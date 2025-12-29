#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const STYLES = path.join(SRC, 'styles');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function step(name) {
  log(`\n▶ ${name}`, colors.cyan);
}

function success(message) {
  log(`  ✓ ${message}`, colors.green);
}

function ensureDistDir() {
  if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true });
  }
}

function compileSass() {
  step('Compiling SCSS');

  const inputFile = path.join(STYLES, 'main.scss');
  const outputFile = path.join(DIST, 'styles.css');

  try {
    execSync(`npx sass "${inputFile}" "${outputFile}" --style=compressed --no-source-map`, {
      cwd: ROOT,
      stdio: 'pipe',
    });
    success(`Compiled to ${path.relative(ROOT, outputFile)}`);
    return fs.readFileSync(outputFile, 'utf8');
  } catch (error) {
    console.error('Failed to compile SCSS:', error.message);
    process.exit(1);
  }
}

function injectCssIntoDist(css) {
  step('Injecting CSS into compiled output');

  const distTemplatePath = path.join(DIST, 'template.js');
  if (!fs.existsSync(distTemplatePath)) {
    console.error('Compiled template.js not found in dist/');
    process.exit(1);
  }

  const content = fs.readFileSync(distTemplatePath, 'utf8');
  const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  const modifiedContent = content.replace(/\/\* __INJECT_CSS__ \*\//, escapedCss);

  fs.writeFileSync(distTemplatePath, modifiedContent);
  success('Injected CSS into dist/template.js');
}

function compileTypeScript() {
  step('Compiling TypeScript');

  try {
    execSync('npx tsc', {
      cwd: ROOT,
      stdio: 'inherit',
    });
    success('TypeScript compiled to dist/');
  } catch (error) {
    console.error('TypeScript compilation failed');
    process.exit(1);
  }
}

function build() {
  log('\n🔨 Building @awmarquis/jest-html-reporter\n', colors.yellow);

  try {
    ensureDistDir();
    const css = compileSass();
    compileTypeScript();
    injectCssIntoDist(css);

    log('\n✨ Build complete!\n', colors.green);
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
