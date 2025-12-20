import { test as teardown } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

teardown('delete sample report', async () => {
  const outputPath = path.resolve(__dirname, 'test-report.html');
  const jsonPath = path.resolve(__dirname, 'test-report.json');

  console.log('Cleaning up sample report files...');

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log('Deleted:', outputPath);
  }

  if (fs.existsSync(jsonPath)) {
    fs.unlinkSync(jsonPath);
    console.log('Deleted:', jsonPath);
  }
});
