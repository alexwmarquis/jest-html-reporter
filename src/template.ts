import * as os from 'os';
import type {
  ReportData,
  TemplateOptions,
  ProcessedTestSuite,
  ProcessedTest,
  EnvironmentInfo,
  CustomColors,
  ThemePreset,
  TestTreeNode,
} from './types';

const COMPILED_CSS = `/* __INJECT_CSS__ */`;

const THEME_PREVIEWS: Record<ThemePreset, string> = {
  dark: '#1e1e1e',
  light: '#ffffff',
  github: '#0d1117',
  monokai: '#272822',
  dracula: '#282a36',
  nord: '#2e3440',
};

export function generateHtmlReport(data: ReportData, options: TemplateOptions): string {
  const {
    pageTitle,
    subtitle,
    logo,
    logoHeight,
    showPassed,
    showFailed,
    showPending,
    showDuration,
    showFilePath,
    showProgressBar,
    theme,
    customColors,
    enableThemeToggle,
    customCss,
    customJs,
    collapsePassed,
    collapseAll,
    expandLevel,
    includeEnvironment,
    dateFormat,
    fonts,
  } = options;

  const { summary, testSuites } = data;
  const skippedTests = (summary.pendingTests || 0) + (summary.todoTests || 0);
  const themeClass = `theme-${theme}`;

  const envInfo: EnvironmentInfo | null = includeEnvironment
    ? {
        nodeVersion: process.version,
        platform: `${os.platform()} ${os.release()}`,
        cwd: process.cwd(),
        cpuCores: os.cpus().length,
        totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
      }
    : null;

  const renderOptions = {
    showPassed,
    showFailed,
    showPending,
    showDuration,
    showFilePath,
    collapsePassed,
    collapseAll,
    expandLevel,
  };

  const customColorsCss = customColors ? generateCustomColorsCss(customColors) : '';

  const fontLinks = fonts
    ? `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(fonts.url)}" rel="stylesheet">`
    : '';

  const fontOverrideCss = fonts
    ? `:root { --font-sans: '${fonts.sans}'; --font-mono: '${fonts.mono}'; }`
    : '';

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>${fontLinks}
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <style>
${COMPILED_CSS}
${fontOverrideCss ? `\n${fontOverrideCss}` : ''}
${customColorsCss ? `\n${customColorsCss}` : ''}
${customCss ? `\n${customCss}` : ''}
  </style>
</head>
<body>
  <div class="container">
    ${generateReportHeader(pageTitle, subtitle, logo, logoHeight)}
    
    <div class="header">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input type="text" id="search-input" data-testid="search-input" placeholder="Filter tests">
      </div>
      <div class="subnav-container">
        <nav class="subnav">
          <a class="subnav-item active" data-filter="all" data-testid="filter-chip-all" href="#" role="button">
            <span class="subnav-item-label">All</span>
            <span class="counter">${summary.totalTests}</span>
          </a>
          <a class="subnav-item" data-filter="passed" data-testid="filter-chip-passed" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon passed">
              <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
            </svg>
            <span class="subnav-item-label">Passed</span>
            <span class="counter">${summary.passedTests}</span>
          </a>
          <a class="subnav-item" data-filter="failed" data-testid="filter-chip-failed" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon failed">
              <path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
            </svg>
            <span class="subnav-item-label">Failed</span>
            <span class="counter">${summary.failedTests}</span>
          </a>
          <a class="subnav-item" data-filter="flaky" data-testid="filter-chip-flaky" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon flaky">
              <path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.75 4a.75.75 0 00-1.5 0v3.5a.75.75 0 00.22.53l2.25 2.25a.75.75 0 001.06-1.06L8.75 7.19V4z"></path>
            </svg>
            <span class="subnav-item-label">Flaky</span>
            <span class="counter">${summary.flakyTests}</span>
          </a>
          <a class="subnav-item" data-filter="pending" data-testid="filter-chip-skipped" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon skipped">
              <path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm3.28 5.78a.75.75 0 00-1.06-1.06l-5.5 5.5a.75.75 0 101.06 1.06l5.5-5.5z"></path>
            </svg>
            <span class="subnav-item-label">Skipped</span>
            <span class="counter">${skippedTests}</span>
          </a>
        </nav>
      </div>
      <div class="meta-info">
        ${formatDate(summary.endTime, dateFormat)}&nbsp;&nbsp;&nbsp;Total time: ${formatDuration(summary.duration)}
      </div>
    </div>

    ${showProgressBar ? generateProgressBar(summary) : ''}
    ${envInfo ? generateEnvironmentHtml(envInfo) : ''}

    <div id="test-suites">
      ${testSuites.map((suite, idx) => generateSuiteHtml(suite, idx, renderOptions)).join('')}
    </div>

    ${
      testSuites.length === 0
        ? `
      <div class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>No test results found</p>
      </div>
    `
        : ''
    }
  </div>

  ${enableThemeToggle ? generateThemeToggle(theme) : ''}

  <script>
${generateScript({ collapsePassed, collapseAll, expandLevel, enableThemeToggle, currentTheme: theme })}
${customJs ? `\n${customJs}` : ''}
  </script>
</body>
</html>`;
}

function generateReportHeader(
  title: string,
  subtitle?: string,
  logo?: string,
  logoHeight = 32,
): string {
  if (!subtitle && !logo) {
    return '';
  }

  return `
    <div class="report-header">
      <div class="report-title-row">
        ${logo ? `<img src="${escapeHtml(logo)}" alt="Logo" class="header-logo" style="height: ${logoHeight}px">` : ''}
        <h1 class="report-title">${escapeHtml(title)}</h1>
      </div>
      ${subtitle ? `<p class="report-subtitle" data-testid="report-subtitle">${escapeHtml(subtitle)}</p>` : ''}
    </div>
  `;
}

function generateProgressBar(summary: {
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  todoTests: number;
  totalTests: number;
}): string {
  const total = summary.totalTests || 1;
  const passedPct = (summary.passedTests / total) * 100;
  const failedPct = (summary.failedTests / total) * 100;
  const skippedPct = ((summary.pendingTests + summary.todoTests) / total) * 100;

  return `
    <div class="progress-bar-container" data-testid="progress-bar">
      <div class="progress-bar-header">
        <div class="progress-bar-stats">
          <span class="stat"><span class="dot passed"></span> ${summary.passedTests} passed</span>
          <span class="stat"><span class="dot failed"></span> ${summary.failedTests} failed</span>
          <span class="stat"><span class="dot skipped"></span> ${summary.pendingTests + summary.todoTests} skipped</span>
        </div>
        <span>${Math.round((summary.passedTests / total) * 100)}% passed</span>
      </div>
      <div class="progress-bar">
        <div class="segment passed" style="width: ${passedPct}%"></div>
        <div class="segment failed" style="width: ${failedPct}%"></div>
        <div class="segment skipped" style="width: ${skippedPct}%"></div>
      </div>
    </div>
  `;
}

function generateCustomColorsCss(colors: CustomColors): string {
  const mappings: Record<keyof CustomColors, string> = {
    bgPrimary: '--bg-primary',
    bgSecondary: '--bg-secondary',
    bgHover: '--bg-hover',
    textPrimary: '--text-primary',
    textSecondary: '--text-secondary',
    borderColor: '--border-color',
    colorPassed: '--color-passed',
    colorFailed: '--color-failed',
    colorSkipped: '--color-skipped',
    colorAccent: '--color-accent',
  };

  const rules: string[] = [];
  for (const [key, cssVar] of Object.entries(mappings)) {
    const value = colors[key as keyof CustomColors];
    if (value) {
      rules.push(`  ${cssVar}: ${value};`);
    }
  }

  if (rules.length === 0) return '';

  return `:root {\n${rules.join('\n')}\n}`;
}

function generateThemeToggle(currentTheme: ThemePreset): string {
  const themes: ThemePreset[] = ['dark', 'light', 'github', 'monokai', 'dracula', 'nord'];

  return `
    <button class="theme-toggle" id="theme-toggle" data-testid="theme-toggle" title="Change theme">
      <i class="bi bi-palette"></i>
    </button>
    <div class="theme-menu" id="theme-menu" data-testid="theme-menu">
      ${themes
        .map(
          t => `
        <div class="theme-option${t === currentTheme ? ' active' : ''}" data-theme="${t}" data-testid="theme-option-${t}">
          <span class="color-preview" style="background: ${THEME_PREVIEWS[t]}"></span>
          ${t.charAt(0).toUpperCase() + t.slice(1)}
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function generateEnvironmentHtml(env: EnvironmentInfo): string {
  return `
    <div class="environment-info" id="env-info" data-testid="environment-info">
      <div class="env-header" data-testid="environment-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <i class="bi bi-chevron-down"></i>
        <span>Environment</span>
      </div>
      <div class="env-grid" data-testid="environment-grid">
        <div class="env-item">
          <span class="env-label">Node.js</span>
          <span class="env-value">${escapeHtml(env.nodeVersion)}</span>
        </div>
        <div class="env-item">
          <span class="env-label">Platform</span>
          <span class="env-value">${escapeHtml(env.platform)}</span>
        </div>
        <div class="env-item">
          <span class="env-label">CPU Cores</span>
          <span class="env-value">${env.cpuCores}</span>
        </div>
        <div class="env-item">
          <span class="env-label">Memory</span>
          <span class="env-value">${escapeHtml(env.totalMemory)}</span>
        </div>
      </div>
    </div>
  `;
}

function generateSuiteHtml(
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

  const testsHaveFailureMessages = suite.tests.some(
    t => t.failureMessages && t.failureMessages.length > 0,
  );
  const showSuiteFailureMessage = suite.failureMessage && !testsHaveFailureMessages;

  return `
    <div class="suite${shouldCollapse ? ' collapsed' : ''}" data-status="${suite.status}" data-has-failed="${hasFailed}" data-name="${escapeHtml(suite.name)}" data-testid="test-suite">
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
              <div class="error-block">${escapeHtml(stripAnsi(suite.failureMessage || ''))}</div>
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

function buildTestTree(tests: ProcessedTest[]): TestTreeNode[] {
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

function calculateDescribeStatus(nodes: TestTreeNode[]): void {
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

function collectStatuses(nodes: TestTreeNode[]): string[] {
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

function generateTreeHtml(
  nodes: TestTreeNode[],
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
    collapsePassed: boolean;
    collapseAll: boolean;
  },
  depth: number = 0,
): string {
  return nodes
    .map(node => {
      if (node.type === 'describe') {
        return generateDescribeGroupHtml(node, options, depth);
      } else if (node.type === 'test' && node.test) {
        return generateTestItemHtml(node.test, options);
      }
      return '';
    })
    .join('');
}

function generateDescribeGroupHtml(
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
  if (!hasVisibleTests) return '';

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
    <div class="describe-group${shouldCollapse ? ' collapsed' : ''}" data-status="${node.status || 'passed'}" data-depth="${depth}" data-testid="describe-group">
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

function countTestsInTree(node: TestTreeNode): number {
  if (node.type === 'test') return 1;
  return node.children.reduce((sum, child) => sum + countTestsInTree(child), 0);
}

function hasVisibleTestsInTree(
  node: TestTreeNode,
  options: { showPassed: boolean; showFailed: boolean; showPending: boolean },
): boolean {
  if (node.type === 'test' && node.test) {
    const { status } = node.test;
    if (status === 'passed' && options.showPassed) return true;
    if (status === 'failed' && options.showFailed) return true;
    if ((status === 'pending' || status === 'skipped' || status === 'todo') && options.showPending)
      return true;
    return false;
  }
  return node.children.some(child => hasVisibleTestsInTree(child, options));
}

function hasFailedTestsInTree(node: TestTreeNode): boolean {
  if (node.type === 'test' && node.test) {
    return node.test.status === 'failed';
  }
  return node.children.some(child => hasFailedTestsInTree(child));
}

function generateTestItemHtml(
  test: ProcessedTest,
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
  },
): string {
  if (test.status === 'passed' && !options.showPassed) return '';
  if (test.status === 'failed' && !options.showFailed) return '';
  if (
    (test.status === 'pending' || test.status === 'skipped' || test.status === 'todo') &&
    !options.showPending
  )
    return '';

  const statusIcon: Record<string, string> = {
    passed: 'bi-check-lg',
    failed: 'bi-x-lg',
    pending: 'bi-skip-forward-fill',
    skipped: 'bi-skip-forward-fill',
    todo: 'bi-skip-forward-fill',
  };

  const icon = test.isFlaky ? 'bi-arrow-repeat' : statusIcon[test.status] || 'bi-circle';
  const iconClass = test.isFlaky ? 'flaky' : test.status;

  const flakyBadge = test.isFlaky
    ? `<span class="flaky-badge" data-testid="flaky-badge"><i class="bi bi-arrow-repeat"></i>${test.invocations} attempts</span>`
    : '';

  return `
    <div class="test-item" data-status="${test.status}" data-flaky="${test.isFlaky}" data-testid="test-item">
      <i class="bi ${icon} test-status-icon ${iconClass}"></i>
      <div class="test-content">
        <span class="test-title" data-testid="test-title">${escapeHtml(test.title)}</span>${flakyBadge}
        ${
          test.failureMessages.length > 0
            ? `
          <div class="error-block" data-testid="test-error-block">${test.failureMessages.map(msg => escapeHtml(stripAnsi(msg))).join('\n\n')}</div>
        `
            : ''
        }
      </div>
      ${options.showDuration ? `<span class="test-duration" data-testid="test-duration">${formatDuration(test.duration)}</span>` : ''}
    </div>
  `;
}

function generateScript(options: {
  collapsePassed: boolean;
  collapseAll: boolean;
  expandLevel: number;
  enableThemeToggle: boolean;
  currentTheme: ThemePreset;
}): string {
  return `
    document.querySelectorAll('.suite-header').forEach(header => {
      header.addEventListener('click', () => {
        const suite = header.closest('.suite');
        suite.classList.toggle('collapsed');
      });
    });

    document.querySelectorAll('.describe-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const group = header.closest('.describe-group');
        group.classList.toggle('collapsed');
      });
    });

    document.querySelectorAll('.subnav-item').forEach(navItem => {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = navItem.dataset.filter;
        
        document.querySelectorAll('.subnav-item').forEach(c => c.classList.remove('active'));
        navItem.classList.add('active');

        document.querySelectorAll('.test-item').forEach(item => {
          if (filter === 'all') {
            item.style.display = 'flex';
          } else if (filter === 'flaky') {
            const isFlaky = item.dataset.flaky === 'true';
            item.style.display = isFlaky ? 'flex' : 'none';
          } else {
            const status = item.dataset.status;
            const match = filter === 'pending' 
              ? ['pending', 'skipped', 'todo'].includes(status)
              : status === filter;
            item.style.display = match ? 'flex' : 'none';
          }
        });

        Array.from(document.querySelectorAll('.describe-group')).reverse().forEach(group => {
          const hasVisible = Array.from(group.querySelectorAll(':scope > .describe-body > .test-item')).some(t => t.style.display !== 'none');
          const hasVisibleNested = Array.from(group.querySelectorAll(':scope > .describe-body > .describe-group')).some(g => g.style.display !== 'none');
          group.style.display = (hasVisible || hasVisibleNested) ? 'block' : 'none';
        });

        document.querySelectorAll('.suite').forEach(suite => {
          const hasVisible = Array.from(suite.querySelectorAll('.test-item')).some(t => t.style.display !== 'none');
          suite.style.display = hasVisible ? 'block' : 'none';
        });
      });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      
      document.querySelectorAll('.test-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) || !query ? 'flex' : 'none';
      });

      Array.from(document.querySelectorAll('.describe-group')).reverse().forEach(group => {
        const hasVisible = Array.from(group.querySelectorAll('.test-item')).some(t => t.style.display !== 'none');
        group.style.display = hasVisible ? 'block' : 'none';
        if (hasVisible && query) group.classList.remove('collapsed');
      });

      document.querySelectorAll('.suite').forEach(suite => {
        const hasVisible = Array.from(suite.querySelectorAll('.test-item')).some(t => t.style.display !== 'none');
        suite.style.display = hasVisible ? 'block' : 'none';
        if (hasVisible && query) suite.classList.remove('collapsed');
      });
    });

    ${
      options.enableThemeToggle
        ? `
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    let currentTheme = '${options.currentTheme}';
    
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('visible');
    });
    
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', () => {
        const newTheme = option.dataset.theme;
        document.documentElement.className = 'theme-' + newTheme;
        
        document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        try {
          localStorage.setItem('jest-reporter-theme', newTheme);
        } catch (e) {}
        
        themeMenu.classList.remove('visible');
      });
    });
    
    document.addEventListener('click', () => {
      themeMenu.classList.remove('visible');
    });
    
    try {
      const savedTheme = localStorage.getItem('jest-reporter-theme');
      if (savedTheme) {
        document.documentElement.className = 'theme-' + savedTheme;
        document.querySelectorAll('.theme-option').forEach(o => {
          o.classList.toggle('active', o.dataset.theme === savedTheme);
        });
      }
    } catch (e) {}
    `
        : ''
    }
  `;
}

function getFileName(filePath: string): string {
  return filePath.split('/').pop() || filePath;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash);
}

function stripAnsi(text: string): string {
  return text.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
}

function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text).replace(/[&<>"']/g, char => htmlEntities[char]);
}

function formatDuration(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return '0ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(1);
  return `${minutes}m ${seconds}s`;
}

function formatDate(isoString: string, format: 'locale' | 'iso' | 'relative'): string {
  const date = new Date(isoString);

  switch (format) {
    case 'iso':
      return isoString;
    case 'relative':
      return getRelativeTime(date);
    case 'locale':
    default:
      return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString('en-US');
}
