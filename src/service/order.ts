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

    async decline(id: string) {

        try {
            const response = await fetch(`${SERVICE_API_ENDPOINT}/order/declide?order_id=${id}`, {
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

            if (response.status >= 400) {
                throw(response);
            }
            
        } catch (e) {
            console.error('error deliding order', id, e);
            this.errorService.show();
        }
    }

    async userCancelOrder(id: string) {
        try {
            const response = await fetch(`${SERVICE_API_ENDPOINT}/order/update_order_status?order_id=${id}&status=consumer_canceled`, {
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

            if (response.status >= 400) {
                throw(response);
            }

        } catch (e) {
            console.error('error updating order status', id, e);
            this.errorService.show();
        }
    }

    async markOrderDelivered(id: string) {
        try {
            const response = await fetch(`${SERVICE_API_ENDPOINT}/order/update_order_status?order_id=${id}&status=delivered`, {
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

            if (response.status >= 400) {
                throw(response);
            }

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

            if (response.status >= 400) {
                throw(response);
            }

            return await response.json();
        } catch (e) {
            console.error('error accepting order', id, e);
            this.errorService.show();
        }
    }

    async getOwnOrders(): Promise<OwnOrdersResponse> {

        try {
            const response = (await fetch(`${SERVICE_API_ENDPOINT}/order/own`, {
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
            }));

            if (response.status >= 400) {
                throw(response);
            }

            return response.json();
        } catch (e) {
            console.error('error getting own order', e);
            this.errorService.show();
        }
    }

    async getDriverOwnOrders(): Promise<DriverOwnOrdersResponse> {

        try {
            const response = (await fetch(`${SERVICE_API_ENDPOINT}/order/driver/own`, {
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
            }));

            if (response.status >= 400) {
                throw(response);
            }
            return response.json();
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

            if (response.status >= 400) {
                throw(response);
            }

            return await response.json();
        } catch (e) {
            console.error('error creating order', order, e);
            this.errorService.show();
        }
    }
}