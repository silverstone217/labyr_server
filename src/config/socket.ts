import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export const initSocket = (server: HTTPServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: "*", // autoriser toutes origines pour tests
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connecté:", socket.id);

    // ENVOYER LE SOCKET.ID AU CLIENT
    socket.emit("yourSocketID", socket.id);

    socket.on("disconnect", () => {
      console.log("Client déconnecté:", socket.id);
    });
  });

  return io;
};
