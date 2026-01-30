import homepage from "../public/index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": homepage,
  },
  development: true,
});

console.log(`Listening on ${server.url}`);
