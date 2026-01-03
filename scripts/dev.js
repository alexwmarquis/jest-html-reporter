#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const STYLES = path.join(SRC, 'styles');

console.log('🔧 Development build...\n');

function clearDist() {
  console.log('▶ Clearing the dist directory...');
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
}

clearDist();

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

console.log('▶ Compiling SCSS (expanded)...');
execSync(
  `npx sass "${path.join(STYLES, 'main.scss')}" "${path.join(DIST, 'styles.css')}" --style=expanded`,
  {
    cwd: ROOT,
    stdio: 'inherit',
  },
);

const css = fs.readFileSync(path.join(DIST, 'styles.css'), 'utf8');
let template = fs.readFileSync(path.join(SRC, 'template.ts'), 'utf8');

const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

template = template.replace(
  /const COMPILED_CSS = `\/\* __INJECT_CSS__ \*\/`;/,
  `const COMPILED_CSS = \`${escapedCss}\`;`,
);

fs.writeFileSync(path.join(SRC, 'template.built.ts'), template);

console.log('\n▶ Compiling TypeScript...');
execSync('npx tsc', { cwd: ROOT, stdio: 'inherit' });

const builtJs = path.join(DIST, 'template.built.js');
const finalJs = path.join(DIST, 'template.js');
if (fs.existsSync(builtJs)) {
  fs.copyFileSync(builtJs, finalJs);
  fs.unlinkSync(builtJs);
}

const builtDts = path.join(DIST, 'template.built.d.ts');
const finalDts = path.join(DIST, 'template.d.ts');
if (fs.existsSync(builtDts)) {
  fs.copyFileSync(builtDts, finalDts);
  fs.unlinkSync(builtDts);
}

const srcBuilt = path.join(SRC, 'template.built.ts');
if (fs.existsSync(srcBuilt)) {
  fs.unlinkSync(srcBuilt);
}

console.log('\n✨ Dev build complete!\n');
