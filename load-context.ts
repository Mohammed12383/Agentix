// Node.js/Vercel load context type augmentation
declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    cloudflare?: {
      env: Record<string, string>;
    };
  }
}

export { };
