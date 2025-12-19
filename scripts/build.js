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

function injectCssIntoTemplate(css) {
  step('Injecting CSS into template');

  const templatePath = path.join(SRC, 'template.ts');
  const backupPath = path.join(SRC, 'template.ts.backup');

  const originalContent = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(backupPath, originalContent);

  const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  const modifiedContent = originalContent.replace(
    /const COMPILED_CSS = `\/\* __INJECT_CSS__ \*\/`;/,
    `const COMPILED_CSS = \`${escapedCss}\`;`,
  );

  fs.writeFileSync(templatePath, modifiedContent);
  success('Injected CSS into template.ts');

  return backupPath;
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

function restoreTemplate(backupPath) {
  step('Restoring source files');

  const templatePath = path.join(SRC, 'template.ts');

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, templatePath);
    fs.unlinkSync(backupPath);
    success('Restored original template.ts');
  }
}

function createExports() {
  step('Creating package exports');

  const indexDts = path.join(DIST, 'index.d.ts');
  if (fs.existsSync(indexDts)) {
    success('Type definitions generated');
  }
}

function build() {
  log('\n🔨 Building @awmarquis/jest-html-reporter\n', colors.yellow);

  let backupPath = null;

  try {
    ensureDistDir();
    const css = compileSass();
    backupPath = injectCssIntoTemplate(css);
    compileTypeScript();
    createExports();

    log('\n✨ Build complete!\n', colors.green);
  } finally {
    if (backupPath && fs.existsSync(backupPath)) {
      restoreTemplate(backupPath);
    }
  }
}

build();
