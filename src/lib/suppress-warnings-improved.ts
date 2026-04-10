// Suppress development warnings that are not actionable
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Suppress CSS preload warnings
  console.warn = (...args) => {
    const message = args[0]?.toString?.() || '';
    if (
      message.includes('was preloaded using link preload but not used') ||
      message.includes('resource was preloaded') ||
      message.includes('link preload')
    ) {
      return; // Suppress these warnings
    }
    originalWarn.apply(console, args);
  };
  
  // Also suppress in console.error for some cases
  console.error = (...args) => {
    const message = args[0]?.toString?.() || '';
    if (message.includes('was preloaded using link preload but not used')) {
      return; // Suppress these errors
    }
    originalError.apply(console, args);
  };
}

export {};