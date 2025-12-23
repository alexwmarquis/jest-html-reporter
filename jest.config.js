module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['dist/**/*.js', '!dist/**/*.d.ts', '!dist/**/*.map'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
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
