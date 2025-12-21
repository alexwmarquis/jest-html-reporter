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
        collapsePassed: false,
        theme: 'dark',
        enableThemeToggle: true,
        logo: '/example.png',
        logoHeight: 32,
        fonts: {
          sans: 'Google Sans',
          mono: 'Google Sans Code',
        },
      },
    ],
  ],
  verbose: true,
};
