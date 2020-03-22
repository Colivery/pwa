export const getOrderStatusTextColorClass = (status: string) => {
    switch (status) {
        default:
        case "accepted":
        case "open":
            return "green-text";
        case "to_be_delivered":
            return "red-text";
    }
}