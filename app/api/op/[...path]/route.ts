import { createRouteHandler } from "@openpanel/nextjs/server";

const handler = createRouteHandler({
  apiUrl: "https://analytics.vinena.studio/api",
});

export const GET = handler;
export const POST = handler;
