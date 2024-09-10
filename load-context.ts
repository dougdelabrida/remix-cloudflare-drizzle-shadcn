import { AppLoadContext } from "@remix-run/cloudflare";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    db: DrizzleD1Database<Record<string, never>>;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
  const db = drizzle(context.cloudflare.env.DB);

  return {
    ...context,
    db,
  };
};
