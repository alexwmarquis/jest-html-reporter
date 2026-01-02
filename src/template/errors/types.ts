export interface StackFrame {
  raw: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  functionName?: string;
  isNodeModule: boolean;
}

export interface ParsedError {
  mainMessage: string;
  expected?: string;
  received?: string;
  diff?: string;
  stackFrames: StackFrame[];
}
