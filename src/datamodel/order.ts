import { OrderStatus } from "./order-status";

export interface IOrder {
    hint: string;
    status: OrderStatus;
    userId: string;
    items: Array<IOrderItem>;
    driverUserId?: string;
    maxPrice: number;
    
}

export interface IOrderItem {
    id: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface IOrderRequest extends IOrder {
}

export interface IOrderResponse extends IOrder {
    id: string;
    createdAt: string;
    updatedAt: string;
    firebaseUid: string;
}