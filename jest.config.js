module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/types.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 75,
      functions: 90,
      lines: 85,
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
        minify: true,
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
        logo: '/logo.png',
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
