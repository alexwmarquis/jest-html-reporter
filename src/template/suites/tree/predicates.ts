import type { TestTreeNode } from '../../../types';

export function countTestsInTree(node: TestTreeNode): number {
  if (node.type === 'test') {
    return 1;
  }
  return node.children.reduce((sum, child) => sum + countTestsInTree(child), 0);
}

export function hasVisibleTestsInTree(
  node: TestTreeNode,
  options: { showPassed: boolean; showFailed: boolean; showPending: boolean },
): boolean {
  if (node.type === 'test' && node.test) {
    const { status } = node.test;
    if (status === 'passed' && options.showPassed) {
      return true;
    }
    if (status === 'failed' && options.showFailed) {
      return true;
    }
    if (
      (status === 'pending' || status === 'skipped' || status === 'todo') &&
      options.showPending
    ) {
      return true;
    }
    return false;
  }
  return node.children.some(child => hasVisibleTestsInTree(child, options));
}

export function hasFailedTestsInTree(node: TestTreeNode): boolean {
  if (node.type === 'test' && node.test) {
    return node.test.status === 'failed';
  }
  return node.children.some(child => hasFailedTestsInTree(child));
}
