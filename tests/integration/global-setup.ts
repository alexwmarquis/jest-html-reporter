import { test as setup, expect } from './fixtures';
import path from 'node:path';
import fs from 'node:fs';

setup.describe.configure({ mode: 'serial' });

const projectRoot = path.join(__dirname, '..', '..');
const htmlReportPath = path.join(projectRoot, 'jest-report.html');
const jsonReportPath = path.join(projectRoot, 'jest-report.json');

setup('should have generated test reports', () => {
  expect(fs.existsSync(htmlReportPath)).toBe(true);
  expect(fs.existsSync(jsonReportPath)).toBe(true);
});
