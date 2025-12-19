export interface CustomColors {
  bgPrimary?: string;
  bgSecondary?: string;
  bgHover?: string;
  textPrimary?: string;
  textSecondary?: string;
  borderColor?: string;
  colorPassed?: string;
  colorFailed?: string;
  colorSkipped?: string;
  colorAccent?: string;
}

export type ThemePreset = 'dark' | 'light' | 'github' | 'monokai' | 'dracula' | 'nord';

export interface ReporterOptions {
  outputPath?: string;
  outputJson?: boolean;
  openOnFailure?: boolean;
  pageTitle?: string;
  subtitle?: string;
  logo?: string;
  logoHeight?: number;
  showPassed?: boolean;
  showFailed?: boolean;
  showPending?: boolean;
  showDuration?: boolean;
  showFilePath?: 'full' | 'filename';
  hideEmptySuites?: boolean;
  includeEnvironment?: boolean;
  showProgressBar?: boolean;
  sort?: 'default' | 'status' | 'duration' | 'name';
  collapsePassed?: boolean;
  collapseAll?: boolean;
  expandLevel?: number;
  dateFormat?: 'locale' | 'iso' | 'relative';
  theme?: ThemePreset;
  customColors?: CustomColors;
  enableThemeToggle?: boolean;
  customCssPath?: string;
  customJsPath?: string;
  embedAssets?: boolean;
}

export interface TestSummary {
  totalSuites: number;
  passedSuites: number;
  failedSuites: number;
  pendingSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  todoTests: number;
  duration: number;
  success: boolean;
  startTime: string;
  endTime: string;
}

export interface ProcessedTestSuite {
  name: string;
  path: string;
  status: 'passed' | 'failed' | 'pending';
  duration: number;
  tests: ProcessedTest[];
  failureMessage: string | null;
}

export interface ProcessedTest {
  title: string;
  fullName: string;
  ancestorTitles: string[];
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo';
  duration: number;
  failureMessages: string[];
  failureDetails: unknown[];
}

export interface ReportData {
  summary: TestSummary;
  testSuites: ProcessedTestSuite[];
}

export interface TemplateOptions {
  pageTitle: string;
  subtitle?: string;
  logo?: string;
  logoHeight: number;
  showPassed: boolean;
  showFailed: boolean;
  showPending: boolean;
  showDuration: boolean;
  showFilePath: 'full' | 'filename';
  showProgressBar: boolean;
  theme: ThemePreset;
  customColors?: CustomColors;
  enableThemeToggle: boolean;
  customCss?: string;
  customJs?: string;
  sort: 'default' | 'status' | 'duration' | 'name';
  collapsePassed: boolean;
  collapseAll: boolean;
  expandLevel: number;
  includeEnvironment: boolean;
  dateFormat: 'locale' | 'iso' | 'relative';
  embedAssets: boolean;
}

export interface EnvironmentInfo {
  nodeVersion: string;
  platform: string;
  jestVersion?: string;
  cwd: string;
  cpuCores: number;
  totalMemory: string;
}

export interface TestTreeNode {
  type: 'describe' | 'test';
  name: string;
  children: TestTreeNode[];
  test?: ProcessedTest;
  status?: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo';
}
