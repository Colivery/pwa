import { OrderStatus } from "../datamodel/order";
import { st } from "springtype/core";

export const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
        case "accepted":
            return st.t("In delivery");
        case "to_be_delivered":
            return st.t("No driver yet");
        case "delivered":
            return st.t("Delivered successfully");
        case "consumer_canceled":
            return st.t("Cancelled by user");
    }
}