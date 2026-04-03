import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: { customerId: string; title: string; description: string; category: string; budgetRange: string }) {
    const order = await this.prisma.order.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
    return order;
  }

  async getAllPendingOrders() {
    return this.prisma.order.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true }
        }
      }
    });
  }

  async acceptOrder(orderId: string, companyId: string) {
    // ATOMIC TRANSACTION FOR MONGODB: 
    // We utilize updateMany filtering by status='PENDING' to ensure only one vendor successfully modifies the document.
    const result = await this.prisma.order.updateMany({
      where: { 
        id: orderId,
        status: 'PENDING'
      },
      data: {
        status: 'ACCEPTED',
        acceptedById: companyId,
      },
    });

    if (result.count === 0) {
      // It means no document was updated. Either it doesn't exist, or it was ALREADY accepted.
      const existingReq = await this.prisma.order.findUnique({ where: { id: orderId }});
      if (!existingReq) throw new NotFoundException('Order not found');
      
      throw new ConflictException('This order has already been accepted by another company.');
    }

    // Since count > 0, we successfully locked the document. Let's return the updated record.
    return await this.prisma.order.findUnique({
      where: { id: orderId }
    });
  }
}

