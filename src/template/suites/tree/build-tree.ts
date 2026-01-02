import type { ProcessedTest, TestTreeNode } from '../../../types';

export function buildTestTree(tests: ProcessedTest[]): TestTreeNode[] {
  const root: TestTreeNode[] = [];

  for (const test of tests) {
    let currentLevel = root;

    for (const ancestorTitle of test.ancestorTitles) {
      let describeNode = currentLevel.find(
        node => node.type === 'describe' && node.name === ancestorTitle,
      );

      if (!describeNode) {
        describeNode = {
          type: 'describe',
          name: ancestorTitle,
          children: [],
        };
        currentLevel.push(describeNode);
      }

      currentLevel = describeNode.children;
    }

    currentLevel.push({
      type: 'test',
      name: test.title,
      children: [],
      test,
    });
  }

  calculateDescribeStatus(root);

  return root;
}

export function calculateDescribeStatus(nodes: TestTreeNode[]): void {
  for (const node of nodes) {
    if (node.type === 'describe') {
      calculateDescribeStatus(node.children);

      const statuses = collectStatuses(node.children);
      if (statuses.includes('failed')) {
        node.status = 'failed';
      } else if (statuses.every(s => s === 'pending' || s === 'skipped' || s === 'todo')) {
        node.status = 'pending';
      } else {
        node.status = 'passed';
      }
    }
  }
}

export function collectStatuses(nodes: TestTreeNode[]): string[] {
  const statuses: string[] = [];
  for (const node of nodes) {
    if (node.type === 'test' && node.test) {
      statuses.push(node.test.status);
    } else if (node.type === 'describe' && node.status) {
      statuses.push(node.status);
    }
  }
  return statuses;
}
