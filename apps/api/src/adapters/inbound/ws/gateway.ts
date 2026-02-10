import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { PortfolioUpdatedV1 } from "@tb/shared";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ path: "/ws", cors: { origin: "*" } })
export class Gateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("subscribeUser")
  async subscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { user: string },
  ) {
    if (!data?.user) return { ok: false };
    const room = `user:${data.user}`;
    await socket.join(room);
    return { ok: true, room };
  }

  emitUser(user: string, event: string, payload: PortfolioUpdatedV1) {
    this.server.to(`user:${user}`).emit(event, payload);
  }
}
