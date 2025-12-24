import { test as setup, expect } from './fixtures';
import { execSync } from 'child_process';
import path from 'node:path';
import fs from 'node:fs';

setup.describe.configure({ mode: 'serial' });

const projectRoot = path.join(__dirname, '..', '..');
const htmlReportPath = path.join(projectRoot, 'jest-report.html');
const jsonReportPath = path.join(projectRoot, 'jest-report.json');

setup('should delete existing test results', async () => {
  const reportPaths = [htmlReportPath, jsonReportPath];

  for (const reportPath of reportPaths) {
    if (fs.existsSync(reportPath)) {
      fs.rmSync(reportPath);
    }
  }
});

setup('should execute unit tests', async () => {
  const result = execSync('npm run test:unit');
  const output = result.toString();

  expect(output).toContain(htmlReportPath);
  expect(output).toContain(jsonReportPath);
});
