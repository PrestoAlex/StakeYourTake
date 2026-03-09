// Abort handler for OP_NET contracts
export function abort(message: u32, fileName: u32, lineNumber: u32, columnNumber: u32): void {
  // Simple abort implementation for OP_NET
  // Just trap to stop execution
  unreachable();
}

// Helper function
declare function unreachable(): never;
