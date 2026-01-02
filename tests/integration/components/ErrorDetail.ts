import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export class ErrorDetail extends Report {
  readonly errorContainer: Locator;
  readonly errorActions: Locator;
  readonly copyErrorBtn: Locator;
  readonly errorBlockEnhanced: Locator;
  readonly errorMessage: Locator;
  readonly errorDiffContainer: Locator;
  readonly errorDiffContent: Locator;
  readonly errorDiffFull: Locator;
  readonly errorDiffTitle: Locator;
  readonly errorDiffRowExpected: Locator;
  readonly errorDiffRowReceived: Locator;
  readonly errorDiffLabelExpected: Locator;
  readonly errorDiffLabelReceived: Locator;
  readonly errorDiffValueExpected: Locator;
  readonly errorDiffValueReceived: Locator;
  readonly diffAdded: Locator;
  readonly diffRemoved: Locator;

  readonly errorStack: Locator;
  readonly errorStackTitle: Locator;
  readonly errorStackFrames: Locator;
  readonly errorStackFrame: Locator;
  readonly errorStackHidden: Locator;
  readonly errorStackToggle: Locator;
  readonly stackAt: Locator;
  readonly stackFile: Locator;
  readonly stackFunction: Locator;
  readonly stackLine: Locator;
  readonly stackLocation: Locator;
  readonly stackRaw: Locator;

  constructor(page: Page) {
    super(page);

    this.errorContainer = this.page.getByTestId('error-container');
    this.errorActions = this.page.getByTestId('error-actions');
    this.copyErrorBtn = this.page.getByTestId('copy-error-btn');
    this.errorBlockEnhanced = this.page.getByTestId('error-block-enhanced');
    this.errorMessage = this.page.getByTestId('error-message');
    this.errorDiffContainer = this.page.getByTestId('error-diff-container');
    this.errorDiffContent = this.page.getByTestId('error-diff-content');
    this.errorDiffFull = this.page.getByTestId('error-diff-full');
    this.errorDiffTitle = this.page.getByTestId('error-diff-title');
    this.errorDiffRowExpected = this.page.getByTestId('error-diff-row-expected');
    this.errorDiffRowReceived = this.page.getByTestId('error-diff-row-received');
    this.errorDiffLabelExpected = this.page.getByTestId('error-diff-label-expected');
    this.errorDiffLabelReceived = this.page.getByTestId('error-diff-label-received');
    this.errorDiffValueExpected = this.page.getByTestId('error-diff-value-expected');
    this.errorDiffValueReceived = this.page.getByTestId('error-diff-value-received');
    this.diffAdded = this.page.getByTestId('diff-added');
    this.diffRemoved = this.page.getByTestId('diff-removed');

    this.errorStack = this.page.getByTestId('error-stack');
    this.errorStackTitle = this.page.getByTestId('error-stack-title');
    this.errorStackFrames = this.page.getByTestId('error-stack-frames');
    this.errorStackFrame = this.page.getByTestId('error-stack-frame');
    this.errorStackHidden = this.page.getByTestId('error-stack-hidden');
    this.errorStackToggle = this.page.getByTestId('error-stack-toggle');
    this.stackAt = this.page.getByTestId('stack-at');
    this.stackFile = this.page.getByTestId('stack-file');
    this.stackFunction = this.page.getByTestId('stack-function');
    this.stackLine = this.page.getByTestId('stack-line');
    this.stackLocation = this.page.getByTestId('stack-location');
    this.stackRaw = this.page.getByTestId('stack-raw');
  }
}
