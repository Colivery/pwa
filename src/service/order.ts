import { injectable } from "springtype/core/di";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";
import { Order } from "../datamodel/order";
import { UserProfile } from "../datamodel/user";

export interface OwnOrderUnion {
    order: Order;
    creator: UserProfile;
    driver?: UserProfile;
}

export type OwnOrdersResponse = Array<OwnOrderUnion>;

export interface DriverOwnOrderUnion {
    order: Order;
    creator?: UserProfile;
    driver: UserProfile;
}

export type DriverOwnOrdersResponse = Array<DriverOwnOrderUnion>

@injectable
export class OrderService {

    async declide(id: string) {

        await fetch(`${SERVICE_API_ENDPOINT}/order/declide?order_id=${id}`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
    }

    async userCancelOrder(id: string) {
        await fetch(`${SERVICE_API_ENDPOINT}/order/update_order_status?order_id=${id}&status=consumer_canceled`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
    }

    async markOrderDelivered(id: string) {
        await fetch(`${SERVICE_API_ENDPOINT}/order/update_order_status?order_id=${id}&status=delivered`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
    }

    async accept(id: string): Promise<UserProfile> {
        const response = await fetch(`${SERVICE_API_ENDPOINT}/order/accept?order_id=${id}`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
        return await response.json();
    }

    async getById(id: string): Promise<Order> {
        const response = await fetch(`${SERVICE_API_ENDPOINT}/order?order_id=${id}`, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer' // no-referrer, *client
        });
        return await response.json();
    }

    async getOwnOrders(): Promise<OwnOrdersResponse> {

        return (await fetch(`${SERVICE_API_ENDPOINT}/order/own`, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })).json();
    }

    async getDriverOwnOrders(): Promise<DriverOwnOrdersResponse> {

        return (await fetch(`${SERVICE_API_ENDPOINT}/order/driver/own`, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })).json();
    }

    async createOrder(order: any): Promise<Order> {

        const response = await fetch(`${SERVICE_API_ENDPOINT}/order`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(order) // body data type must match "Content-Type" header
        });
        return await response.json();
    }
}