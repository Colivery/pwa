import { injectable, inject } from "springtype/core/di";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";
import { Order } from "../datamodel/order";
import { UserProfile } from "../datamodel/user";
import { ErrorService } from "./error";

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

    @inject(ErrorService)
    errorService: ErrorService;

    async declide(id: string) {

        try {
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
        } catch (e) {
            console.error('error deliding order', id, e);
            this.errorService.show();
        }
    }

    async userCancelOrder(id: string) {
        try {
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
        } catch (e) {
            console.error('error updating order status', id, e);
            this.errorService.show();
        }
    }

    async markOrderDelivered(id: string) {
        try {
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
        } catch (e) {
            console.error('error updating order status', id, e);
            this.errorService.show();
        }
    }

    async accept(id: string): Promise<UserProfile> {
        try {
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
        } catch (e) {
            console.error('error accepting order', id, e);
            this.errorService.show();
        }
    }

    async getById(id: string): Promise<Order> {
        try {
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
        } catch (e) {
            console.error('error getting order by id', id, e);
            this.errorService.show();
        }
    }

    async getOwnOrders(): Promise<OwnOrdersResponse> {

        try {
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
        } catch (e) {
            console.error('error getting own order', e);
            this.errorService.show();
        }
    }

    async getDriverOwnOrders(): Promise<DriverOwnOrdersResponse> {

        try {
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
        } catch (e) {
            console.error('error getting own driver order', e);
            this.errorService.show();
        }
    }

    async createOrder(order: any): Promise<Order> {

        try {
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
        } catch (e) {
            console.error('error creating order', order, e);
            this.errorService.show();
        }
    }
}