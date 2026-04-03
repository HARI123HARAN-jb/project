import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Broadcaster for new orders
  broadcastNewOrder(order: any) {
    this.server.emit('NEW_ORDER', order);
  }

  // Broadcaster when an order is accepted
  broadcastOrderAccepted(orderId: string, companyId: string) {
    this.server.emit('ORDER_ACCEPTED', { orderId, companyId });
  }
}
