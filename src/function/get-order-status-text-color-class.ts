import { OrderStatus } from "../datamodel/order";

export const getOrderStatusTextColorClass = (status: OrderStatus) => {
    switch (status) {
        default:
        case "accepted":
            return "green-text";
        case "to_be_delivered":
            return "red-text";
    }
}