export interface StackFrame {
  raw: string;
  filePath?: string | undefined;
  lineNumber?: number | undefined;
  columnNumber?: number | undefined;
  functionName?: string | undefined;
  isNodeModule: boolean;
}

export interface ParsedError {
  mainMessage: string;
  expected?: string | undefined;
  received?: string | undefined;
  diff?: string | undefined;
  stackFrames: StackFrame[];
}
