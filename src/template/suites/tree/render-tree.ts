import type { ProcessedTest, TestTreeNode } from '../../../types';
import { generateEnhancedErrorHtml } from '../../errors';
import { escapeHtml, formatDuration } from '../../utils';
import { countTestsInTree, hasFailedTestsInTree, hasVisibleTestsInTree } from './predicates';

export function generateTreeHtml(
  nodes: TestTreeNode[],
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
    collapsePassed: boolean;
    collapseAll: boolean;
  },
  depth = 0,
): string {
  return nodes
    .map(node => {
      if (node.type === 'describe') {
        return generateDescribeGroupHtml(node, options, depth);
      } else if (node.test) {
        return generateTestItemHtml(node.test, options);
      }
      return '';
    })
    .join('');
}

export function generateDescribeGroupHtml(
  node: TestTreeNode,
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
    collapsePassed: boolean;
    collapseAll: boolean;
  },
  depth: number,
): string {
  const hasVisibleTests = hasVisibleTestsInTree(node, options);
  if (!hasVisibleTests) {
    return '';
  }

  const hasFailed = hasFailedTestsInTree(node);
  let shouldCollapse = false;

  if (options.collapseAll) {
    shouldCollapse = true;
  }
  if (options.collapsePassed && node.status === 'passed') {
    shouldCollapse = true;
  }

  if (hasFailed && !options.collapseAll) {
    shouldCollapse = false;
  }

  return `
    <div class="describe-group${shouldCollapse ? ' collapsed' : ''}" data-status="${node.status ?? 'passed'}" data-depth="${depth}" data-testid="describe-group" data-collapsed="${shouldCollapse}">
      <div class="describe-header" data-testid="describe-header">
        <i class="bi bi-chevron-down describe-chevron"></i>
        <span class="describe-name" data-testid="describe-name">${escapeHtml(node.name)}</span>
        <span class="describe-count" data-testid="describe-count">${countTestsInTree(node)} tests</span>
      </div>
      <div class="describe-body" data-testid="describe-body">
        ${generateTreeHtml(node.children, options, depth + 1)}
      </div>
    </div>
  `;
}

export function generateTestItemHtml(
  test: ProcessedTest,
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
  },
): string {
  if (test.status === 'passed' && !options.showPassed) {
    return '';
  }
  if (test.status === 'failed' && !options.showFailed) {
    return '';
  }
  if (
    (test.status === 'pending' || test.status === 'skipped' || test.status === 'todo') &&
    !options.showPending
  ) {
    return '';
  }

  const statusIcon: Record<string, string> = {
    passed: 'bi-check-lg',
    failed: 'bi-x-lg',
    pending: 'bi-skip-forward-fill',
    skipped: 'bi-skip-forward-fill',
    todo: 'bi-skip-forward-fill',
  };

  const icon = test.isFlaky ? 'bi-arrow-repeat' : (statusIcon[test.status] ?? 'bi-circle');
  const iconClass = test.isFlaky ? 'flaky' : test.status;

  const flakyBadge = test.isFlaky
    ? `<span class="flaky-badge" data-testid="flaky-badge"><i class="bi bi-arrow-repeat"></i>${test.invocations} attempts</span>`
    : '';

  return `
    <div class="test-item" data-status="${test.status}" data-flaky="${test.isFlaky}" data-testid="test-item">
      <i class="bi ${icon} test-status-icon ${iconClass}"></i>
      <div class="test-content">
        <span class="test-title" data-testid="test-title">${escapeHtml(test.title)}</span>${flakyBadge}
        ${test.failureMessages.length > 0 ? generateEnhancedErrorHtml(test.failureMessages) : ''}
      </div>
      ${options.showDuration ? `<span class="test-duration" data-testid="test-duration">${formatDuration(test.duration)}</span>` : ''}
    </div>
  `;
}
