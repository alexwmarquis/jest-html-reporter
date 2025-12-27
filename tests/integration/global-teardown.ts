import { test as teardown } from './fixtures';
import path from 'node:path';
import fs from 'node:fs';

teardown.describe.configure({ mode: 'serial' });

const projectRoot = path.join(__dirname, '..', '..');
const htmlReportPath = path.join(projectRoot, 'jest-report.html');
const jsonReportPath = path.join(projectRoot, 'jest-report.json');

teardown('should delete existing test results', async () => {
  const reportPaths = [htmlReportPath, jsonReportPath];

  for (const reportPath of reportPaths) {
    if (fs.existsSync(reportPath)) {
      fs.rmSync(reportPath);
    }
  }
});
