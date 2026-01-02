import type { EnvironmentInfo } from '../../types';
import { escapeHtml } from '../utils';

export function generateEnvironmentHtml(env: EnvironmentInfo): string {
  return `
    <div class="environment-info" id="env-info" data-testid="environment-info">
      <div class="env-header clickable" data-testid="environment-header">
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
