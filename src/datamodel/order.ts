import {OrderItemStatus} from "./order-item-status";
import { GPSLocation } from "./gps-location";

export type OrderStatus = 'to_be_delivered' | 'accepted' | 'delivered' | 'consumer_canceled';

export interface Order {
    id: string;
    created: string;
    updated: string;
    hint: string;
    pickup_address: string;
    pickup_location_geohash: string;
    pickup_location: GPSLocation;
    dropoff_location_geohash: string;
    dropoff_location: GPSLocation;
    shop_name: string;
    shop_type: string;
    status: OrderStatus;
    user_id: string;
    items: Array<OrderItem>;
    driver_user_id?: string;
    max_price: number;
}

export interface OrderItem {
    id: string;
    description: string;
    status: OrderItemStatus;
    created: string;
    updated: string;
}


