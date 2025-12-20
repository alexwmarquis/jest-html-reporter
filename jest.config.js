module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'],
  reporters: [
    'default',
    [
      './dist/index.js',
      {
        outputPath: 'jest-report.html',
        outputJson: true,
        pageTitle: 'Jest HTML Reporter',
        subtitle: 'Unit tests for Jest HTML Reporter',
        showPassed: true,
        showFailed: true,
        showPending: true,
        showDuration: true,
        showProgressBar: true,
        includeEnvironment: true,
        sort: 'default',
        collapsePassed: true,
        theme: 'dark',
        enableThemeToggle: true,
      },
    ],
  ],
  verbose: true,
};
