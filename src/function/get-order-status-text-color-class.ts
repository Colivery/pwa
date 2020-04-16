import { OrderStatus } from "../datamodel/order-status";

export const getOrderStatusTextColorClass = (status: OrderStatus) => {
    switch (status) {
        default:
        case OrderStatus.ACCEPTED:
            return "green-text";
        case OrderStatus.TO_BE_DELIVERED:
            return "red-text";
    }
}