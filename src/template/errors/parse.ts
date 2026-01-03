import { stripAnsi } from '../utils';
import type { ParsedError, StackFrame } from './types';

export function parseErrorMessage(rawMessage: string): ParsedError {
  const message = stripAnsi(rawMessage);
  const lines = message.split('\n');

  let mainMessage = '';
  let expected: string | undefined;
  let received: string | undefined;
  let diff: string | undefined;
  const stackFrames: StackFrame[] = [];

  let inDiff = false;
  const diffLines: string[] = [];
  const mainMessageLines: string[] = [];
  let foundStackTrace = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('Expected:')) {
      expected = trimmed.replace('Expected:', '').trim();
      continue;
    }
    if (trimmed.startsWith('Received:')) {
      received = trimmed.replace('Received:', '').trim();
      continue;
    }

    if (
      trimmed.startsWith('- Expected') ||
      trimmed.startsWith('+ Received') ||
      trimmed === 'Difference:' ||
      trimmed.startsWith('- ') ||
      trimmed.startsWith('+ ')
    ) {
      if (!inDiff && (trimmed.startsWith('- Expected') || trimmed === 'Difference:')) {
        inDiff = true;
      }
      if (inDiff) {
        diffLines.push(line);
        continue;
      }
    }

    const stackMatch =
      /^\s*at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/.exec(line) ??
      /^\s*at\s+(.+?):(\d+):(\d+)/.exec(line) ??
      /^\s*at\s+(.+)/.exec(line);

    if (stackMatch) {
      foundStackTrace = true;
      const frame = parseStackFrame(line);
      stackFrames.push(frame);
      continue;
    }

    if (!foundStackTrace && !inDiff && trimmed && !trimmed.startsWith('●')) {
      mainMessageLines.push(line);
    }
  }

  mainMessage = mainMessageLines.join('\n').trim();
  /* eslint-disable-next-line prefer-const */
  diff = diffLines.length > 0 ? diffLines.join('\n') : undefined;

  return { mainMessage, expected, received, diff, stackFrames };
}

export function parseStackFrame(line: string): StackFrame {
  const trimmed = line.trim();

  let match = /^at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)$/.exec(trimmed);
  if (match) {
    return {
      raw: trimmed,
      functionName: match[1]!,
      filePath: match[2]!,
      lineNumber: parseInt(match[3]!, 10),
      columnNumber: parseInt(match[4]!, 10),
      isNodeModule: match[2]!.includes('node_modules'),
    };
  }

  match = /^at\s+(.+?):(\d+):(\d+)$/.exec(trimmed);
  if (match) {
    return {
      raw: trimmed,
      filePath: match[1]!,
      lineNumber: parseInt(match[2]!, 10),
      columnNumber: parseInt(match[3]!, 10),
      isNodeModule: match[1]!.includes('node_modules'),
    };
  }

  match = /^at\s+(.+)$/.exec(trimmed);
  if (match) {
    return {
      raw: trimmed,
      functionName: match[1]!,
      isNodeModule: false,
    };
  }

  return { raw: trimmed, isNodeModule: false };
}
