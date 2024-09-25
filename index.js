import wisp from "wisp-server-node";
import { createServer } from "node:http";

const server = createServer();

server.on("upgrade", (req, socket, head) => {
  if (req.url && req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.on("listening", () => {
  console.log(`Wisp server is listening at http://localhost:8080`);
});

// Graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
}

server.listen(8080);
