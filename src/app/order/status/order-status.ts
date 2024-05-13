import { HttpException, HttpStatus } from '@nestjs/common';

export const OrderStatus = {
  OPEN: {
    id: 'OPEN',
    changeOrderStatus(orderStatus: string) {
      if (orderStatus == OrderStatus.IN_PROGRESS.id) {
        return OrderStatus.IN_PROGRESS;
      }
      throw new OrderStatusError(orderStatus);
    },
    assignEmployee: () => false,
  },
  IN_PROGRESS: {
    id: 'IN_PROGRESS',
    changeOrderStatus(orderStatus: string) {
      if (orderStatus == OrderStatus.DONE.id) {
        return OrderStatus.DONE;
      }
      throw new OrderStatusError(orderStatus);
    },
    assignEmployee: () => true,
  },
  DONE: {
    id: 'DONE',
    changeOrderStatus(orderStatus: string) {
      throw new OrderStatusError(orderStatus);
    },
    assignEmployee: () => false,
  },
};

export class OrderStatusError extends HttpException {
  message: string;
  constructor(orderStatus: string) {
    super(
      `You are not allowed change to order status: ${orderStatus}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
