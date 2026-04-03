import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  @Post()
  async createOrder(@Body() createOrderDto: any) {
    const order = await this.ordersService.createOrder(createOrderDto);
    // Broadcast the new order instantly to all connected vendors
    this.ordersGateway.broadcastNewOrder(order);
    return order;
  }

  @Get('pending')
  async getPendingOrders() {
    return this.ordersService.getAllPendingOrders();
  }

  @Patch(':id/accept')
  async acceptOrder(@Param('id') id: string, @Body('companyId') companyId: string) {
    const order = await this.ordersService.acceptOrder(id, companyId);
    
    // Notify all other vendors that order is taken!
    this.ordersGateway.broadcastOrderAccepted(id, companyId);
    
    return order;
  }
}
