import { escapeHtml, stripAnsi } from '../utils';
import { formatDiffHtml } from './diff';
import { parseErrorMessage } from './parse';
import type { ParsedError, StackFrame } from './types';

export function generateEnhancedErrorHtml(failureMessages: string[]): string {
  const errorId = `error-${Math.random().toString(36).slice(2, 11)}`;
  const allMessages = failureMessages.map(msg => stripAnsi(msg)).join('\n\n');

  const blocks = failureMessages
    .map((msg, idx) => {
      const parsed = parseErrorMessage(msg);
      return generateSingleErrorBlock(parsed, `${errorId}-${idx}`);
    })
    .join('');

  return `
    <div class="error-container" data-testid="error-container">
      <div class="error-actions" data-testid="error-actions">
        <button class="copy-error-btn" data-testid="copy-error-btn" data-error="${escapeHtml(allMessages.replace(/"/g, '&quot;'))}" title="Copy error to clipboard">
          <i class="bi bi-clipboard"></i>
          <span>Copy</span>
        </button>
      </div>
      ${blocks}
    </div>
  `;
}

export function generateSingleErrorBlock(parsed: ParsedError, errorId: string): string {
  let html = '<div class="error-block-enhanced" data-testid="error-block-enhanced">';

  if (parsed.mainMessage) {
    html += `<div class="error-message" data-testid="error-message">${escapeHtml(parsed.mainMessage)}</div>`;
  }

  if (parsed.expected !== undefined || parsed.received !== undefined) {
    html += '<div class="error-diff-container" data-testid="error-diff-container">';
    if (parsed.expected !== undefined) {
      html += `
        <div class="error-diff-row expected" data-testid="error-diff-row-expected">
          <span class="error-diff-label" data-testid="error-diff-label-expected">Expected</span>
          <code class="error-diff-value" data-testid="error-diff-value-expected">${escapeHtml(parsed.expected)}</code>
        </div>
      `;
    }
    if (parsed.received !== undefined) {
      html += `
        <div class="error-diff-row received" data-testid="error-diff-row-received">
          <span class="error-diff-label" data-testid="error-diff-label-received">Received</span>
          <code class="error-diff-value" data-testid="error-diff-value-received">${escapeHtml(parsed.received)}</code>
        </div>
      `;
    }
    html += '</div>';
  }

  if (parsed.diff) {
    html += `
      <div class="error-diff-full" data-testid="error-diff-full">
        <div class="error-diff-title" data-testid="error-diff-title">Difference</div>
        <pre class="error-diff-content" data-testid="error-diff-content">${formatDiffHtml(parsed.diff)}</pre>
      </div>
    `;
  }

  if (parsed.stackFrames.length > 0) {
    const visibleFrames = parsed.stackFrames.slice(0, 3);
    const hiddenFrames = parsed.stackFrames.slice(3);

    html += '<div class="error-stack" data-testid="error-stack">';
    html += '<div class="error-stack-title" data-testid="error-stack-title">Stack Trace</div>';
    html += '<div class="error-stack-frames" data-testid="error-stack-frames">';

    visibleFrames.forEach(frame => {
      html += generateStackFrameHtml(frame);
    });

    if (hiddenFrames.length > 0) {
      html += `
        <div class="error-stack-hidden" data-testid="error-stack-hidden" id="${errorId}-hidden" style="display: none;">
          ${hiddenFrames.map(frame => generateStackFrameHtml(frame)).join('')}
        </div>
        <button class="error-stack-toggle" data-testid="error-stack-toggle" data-target="${errorId}-hidden">
          <i class="bi bi-chevron-down"></i>
          <span>Show ${hiddenFrames.length} more frame${hiddenFrames.length > 1 ? 's' : ''}</span>
        </button>
      `;
    }

    html += '</div></div>';
  }

  html += '</div>';
  return html;
}

export function generateStackFrameHtml(frame: StackFrame): string {
  const classes = `error-stack-frame${frame.isNodeModule ? ' is-node-module' : ''}`;

  if (frame.filePath && frame.lineNumber) {
    const displayPath = frame.filePath.replace(/^.*[/\\]/, '');
    const vsCodeLink = `vscode://file/${frame.filePath}:${frame.lineNumber}${frame.columnNumber ? ':' + frame.columnNumber : ''}`;

    return `
      <div class="${classes}" data-testid="error-stack-frame" data-is-node-module="${frame.isNodeModule}">
        <span class="stack-at" data-testid="stack-at">at</span>
        ${frame.functionName ? `<span class="stack-function" data-testid="stack-function">${escapeHtml(frame.functionName)}</span>` : ''}
        <a href="${vsCodeLink}" class="stack-location" data-testid="stack-location" title="Open in VS Code: ${escapeHtml(frame.filePath)}">
          <span class="stack-file" data-testid="stack-file">${escapeHtml(displayPath)}</span>
          <span class="stack-line" data-testid="stack-line">:${frame.lineNumber}${frame.columnNumber ? ':' + frame.columnNumber : ''}</span>
        </a>
      </div>
    `;
  }

  return `
    <div class="${classes}" data-testid="error-stack-frame" data-is-node-module="${frame.isNodeModule}">
      <span class="stack-raw" data-testid="stack-raw">${escapeHtml(frame.raw)}</span>
    </div>
  `;
}
