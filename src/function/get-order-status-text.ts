import { OrderStatus } from "../datamodel/order";

export const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
        case "accepted":
            return "Auf dem Weg zu Dir";
        case "to_be_delivered":
            return "Bisher kein Fahrer gefunden";
        case "delivered":
            return "Erfolgreich geliefert";
        case "consumer_canceled":
            return "Abbruch durch Dich";
    }
}