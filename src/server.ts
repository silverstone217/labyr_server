import http from "http";
import app from "./app";
import { initSocket } from "./config/socket";

const PORT = 5000;

const server = http.createServer(app);

// init socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
