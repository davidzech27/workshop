import { file } from "bun";
import path from "path";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(file(path.join(import.meta.dir, "../public/index.html")));
    }
    if (url.pathname === "/bundle.js") {
      const build = await Bun.build({
        entrypoints: [path.join(import.meta.dir, '../src/index.tsx')],
        target: 'browser',
      });
      if (build.outputs.length > 0) {
        return new Response(build.outputs[0]);
      }
      return new Response("Build failed", { status: 500 });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
