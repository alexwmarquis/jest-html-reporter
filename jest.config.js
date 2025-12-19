module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/example.test.js'],
  reporters: [
    'default',
    ['./dist/index.js', {
      outputPath: 'jest-report.html',
      outputJson: true,
      pageTitle: 'Jest HTML Reporter - Demo',
      subtitle: 'A beautiful, customizable test reporter for Jest',
      showPassed: true,
      showFailed: true,
      showPending: true,
      showDuration: true,
      showProgressBar: true,
      includeEnvironment: true,
      sort: 'default',
      collapsePassed: false,
      theme: 'dark',
      enableThemeToggle: true,
    }]
  ]
};
