export const getOrderStatusText = (status: string) => {
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