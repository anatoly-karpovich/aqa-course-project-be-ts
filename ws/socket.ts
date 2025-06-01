import { Server as SocketIOServer } from "socket.io";
import wsAuthMiddleware from "../middleware/wsAuthMiddleware";
import { NotificationService } from "../services/notification.service";
import http from "http";

// Функция, которая экспортируется и инициализирует io
export default function initSocketIO(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.use(wsAuthMiddleware); // Авторизация как у REST

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;
    socket.join(userId);
  });

  NotificationService.setSocketIO(io);
}
