export interface Shop {
    id: string,
    lat: number;
    lon: number
    name: string,
    shop: string;
    street: string,
    postcode: string;
    houseNumber: string;
    city?: string;
    distance?: number;
}
