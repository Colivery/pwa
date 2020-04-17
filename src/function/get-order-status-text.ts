import { st } from "springtype/core";
import { OrderStatus } from "../datamodel/order-status";

export const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.ACCEPTED:
            return st.t("In delivery");
        case OrderStatus.TO_BE_DELIVERED:
            return st.t("No driver yet");
        case OrderStatus.DELIVERED:
            return st.t("Delivered successfully");
        case OrderStatus.CONSUMER_CANCELLED:
            return st.t("Cancelled by user");
    }
}