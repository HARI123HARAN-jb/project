import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway, PrismaService],
})
export class OrdersModule {}
