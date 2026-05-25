import { type PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/node' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    getAssetFromKV: any;
    ASSET_MANIFEST: Record<string, string>;
    ENV: Record<string, unknown>;
  }
}
