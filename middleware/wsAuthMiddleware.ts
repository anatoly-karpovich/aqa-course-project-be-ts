import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { getDataDataFromToken } from "../utils/utils";

export default (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const token = socket.handshake.auth.token;
    const userData = getDataDataFromToken(token.replace("Bearer ", ""));
    socket.data.user = userData; // или socket.data.user, если TS ругается
    next();
  } catch (e) {
    next(new Error("Authentication error: " + (e as Error).message));
  }
};
