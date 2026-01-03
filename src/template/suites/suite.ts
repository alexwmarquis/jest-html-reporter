import type { ProcessedTestSuite } from '../../types';
import { escapeHtml, formatDuration, getFileName, stripAnsi } from '../utils';
import { buildTestTree } from './tree/build-tree';
import { generateTreeHtml } from './tree/render-tree';

export function generateSuiteHtml(
  suite: ProcessedTestSuite,
  index: number,
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
    showFilePath: 'full' | 'filename';
    collapsePassed: boolean;
    collapseAll: boolean;
    expandLevel: number;
  },
): string {
  const hasFailed = suite.tests.some(t => t.status === 'failed');

  let shouldCollapse = false;

  if (options.collapseAll) {
    shouldCollapse = true;
  }

  if (options.collapsePassed && suite.status === 'passed') {
    shouldCollapse = true;
  }

  if (!options.collapseAll && options.expandLevel >= 0 && index >= options.expandLevel) {
    shouldCollapse = true;
  }

  if (hasFailed && !options.collapseAll) {
    shouldCollapse = false;
  }

  const displayName = options.showFilePath === 'full' ? suite.name : getFileName(suite.name);

  const testTree = buildTestTree(suite.tests);

  const treeOptions = {
    showPassed: options.showPassed,
    showFailed: options.showFailed,
    showPending: options.showPending,
    showDuration: options.showDuration,
    collapsePassed: options.collapsePassed,
    collapseAll: options.collapseAll,
  };

  const testsHaveFailureMessages = suite.tests.some(t => t.failureMessages.length > 0);
  const showSuiteFailureMessage = suite.failureMessage && !testsHaveFailureMessages;

  return `
    <div class="suite${shouldCollapse ? ' collapsed' : ''}" data-status="${suite.status}" data-has-failed="${hasFailed}" data-name="${escapeHtml(suite.name)}" data-testid="test-suite" data-collapsed="${shouldCollapse}">
      <div class="suite-header" data-testid="suite-header">
        <i class="bi bi-chevron-down suite-chevron"></i>
        <span class="suite-name" data-testid="suite-name">${escapeHtml(displayName)}</span>
        ${options.showDuration ? `<span class="test-duration" data-testid="suite-duration" style="margin-left: auto">${formatDuration(suite.duration)}</span>` : ''}
      </div>
      <div class="suite-body" data-testid="suite-body">
        ${
          showSuiteFailureMessage
            ? `
          <div class="test-item">
            <div class="test-content">
              <div class="error-block">${escapeHtml(stripAnsi(suite.failureMessage ?? ''))}</div>
            </div>
          </div>
        `
            : ''
        }
        ${generateTreeHtml(testTree, treeOptions)}
      </div>
    </div>
  `;
}
