import {OrderItemStatus} from "../types/order-item-status";

export interface OrderResponse {
    id: string;
    created: string;
    updated: string;
    hint: string;
    pickup_address: string;
    pickup_location: Location;
    shop_name: string;
    shop_type: string;
    status: string;
    user_id: string;
    items: Array<OrderItem>;
    driver_user_id?: string;
}

export interface OrderItem {
    id: string;
    description: string;
    status: OrderItemStatus;
    created: string;
    updated: string;
}

