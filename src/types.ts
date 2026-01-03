export interface CustomColors {
  bgPrimary?: string | undefined;
  bgSecondary?: string | undefined;
  bgHover?: string | undefined;
  textPrimary?: string | undefined;
  textSecondary?: string | undefined;
  borderColor?: string | undefined;
  colorPassed?: string | undefined;
  colorFailed?: string | undefined;
  colorSkipped?: string | undefined;
  colorAccent?: string | undefined;
}

export type ThemePreset = 'dark' | 'light' | 'github' | 'monokai' | 'dracula' | 'nord';

export interface ReporterOptions {
  outputPath?: string | undefined;
  outputJson?: boolean | undefined;
  openOnFailure?: boolean | undefined;
  pageTitle?: string | undefined;
  subtitle?: string | undefined;
  logo?: string | undefined;
  logoHeight?: number | undefined;
  showPassed?: boolean | undefined;
  showFailed?: boolean | undefined;
  showPending?: boolean | undefined;
  showDuration?: boolean | undefined;
  showFilePath?: 'full' | 'filename' | undefined;
  hideEmptySuites?: boolean | undefined;
  includeEnvironment?: boolean | undefined;
  additionalInfo?: AdditionalInfo | undefined;
  minify?: boolean | undefined;
  showProgressBar?: boolean | undefined;
  sort?: 'default' | 'status' | 'duration' | 'name' | undefined;
  collapsePassed?: boolean | undefined;
  collapseAll?: boolean | undefined;
  expandLevel?: number | undefined;
  dateFormat?: 'locale' | 'iso' | 'relative' | undefined;
  theme?: ThemePreset | undefined;
  customColors?: CustomColors | undefined;
  enableThemeToggle?: boolean | undefined;
  customCssPath?: string | undefined;
  customJsPath?: string | undefined;
  embedAssets?: boolean | undefined;
  fonts?:
    | {
        sans?: string | undefined;
        mono?: string | undefined;
      }
    | false
    | undefined;
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
  flakyTests: number;
  duration: number;
  success: boolean;
  startTime: string;
  endTime: string;
  wasInterrupted: boolean;
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
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo' | 'disabled';
  duration: number;
  failureMessages: string[];
  failureDetails: unknown[];
  invocations: number;
  isFlaky: boolean;
}

export interface ReportData {
  summary: TestSummary;
  testSuites: ProcessedTestSuite[];
}

export interface TemplateOptions {
  pageTitle: string;
  subtitle?: string | undefined;
  logo?: string | undefined;
  logoHeight: number;
  showPassed: boolean;
  showFailed: boolean;
  showPending: boolean;
  showDuration: boolean;
  showFilePath: 'full' | 'filename';
  showProgressBar: boolean;
  theme: ThemePreset;
  customColors?: CustomColors | undefined;
  enableThemeToggle: boolean;
  customCss?: string | undefined;
  customJs?: string | undefined;
  sort: 'default' | 'status' | 'duration' | 'name';
  collapsePassed: boolean;
  collapseAll: boolean;
  expandLevel: number;
  includeEnvironment: boolean;
  additionalInfo?: AdditionalInfo | undefined;
  minify?: boolean | undefined;
  dateFormat: 'locale' | 'iso' | 'relative';
  embedAssets: boolean;
  fonts:
    | {
        sans: string;
        mono: string;
        url: string;
      }
    | false;
}

export interface EnvironmentInfo {
  nodeVersion: string;
  platform: string;
  jestVersion?: string;
  cwd: string;
  cpuCores: number;
  totalMemory: string;
}

export interface AdditionalInfo {
  title?: string | undefined;
  [key: string]: string | number | boolean | null | undefined;
}

export interface TestTreeNode {
  type: 'describe' | 'test';
  name: string;
  children: TestTreeNode[];
  test?: ProcessedTest;
  status?: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo';
}
