declare module "@remix-run/node" {
  interface AppLoadContext {
    cloudflare?: {
      env: Record<string, string>;
    };
  }
}

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    cloudflare?: {
      env: Record<string, string>;
    };
  }
}
