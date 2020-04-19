import { injectable, inject } from "springtype/core/di";
import { SERVICE_API_ENDPOINT, SERVICE_API_ENDPOINT_VERSION } from "../config/endpoints";
import { IOrder, IOrderResponse, IOrderRequest } from "../datamodel/order";
import { IUserProfileResponse } from "../datamodel/user";
import { ErrorService } from "./error";
import { OrderStatus } from "../datamodel/order-status";

export interface OwnOrderUnion {
    order: IOrderResponse;
    driver?: IUserProfileResponse;
}

export type OwnOrdersResponse = Array<OwnOrderUnion>;

export interface DriverOwnOrderUnion {
    order: IOrderResponse;
    consumer?: IUserProfileResponse;
}

export type DriverOwnOrdersResponse = Array<DriverOwnOrderUnion>


@injectable
export class OrderService {

    @inject(ErrorService)
    errorService: ErrorService;

    async setOrderStatus(id: string, status: OrderStatus, action: string) {

        try {
            const response = await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/order/${id}/${action}`, {
                method: 'PATCH',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer', // no-referrer, *client
                body: JSON.stringify({
                    status: status.toUpperCase()
                }) // body data type must match "Content-Type" header
            });

            if (response.status >= 400) {
                throw (response);
            }

        } catch (e) {
            console.error('error setting order status', id, status, e);
            this.errorService.show();
        }
    }

    async abort(id: string) {
        return this.setOrderStatus(id, OrderStatus.DELIVERED, 'abort');
    }

    async userCancelOrder(id: string) {
        return this.setOrderStatus(id, OrderStatus.CONSUMER_CANCELLED, 'cancel');
    }

    async markOrderDelivered(id: string) {
        return this.setOrderStatus(id, OrderStatus.DELIVERED, 'deliver');
    }

    async accept(id: string) {
        return this.setOrderStatus(id, OrderStatus.ACCEPTED, 'accept');
    }

    async getOwnOrders(): Promise<OwnOrdersResponse> {

        try {
            const response = (await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/user/orders`, {
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
                throw (response);
            }

            return response.json();
        } catch (e) {
            console.error('error getting own order', e);
            this.errorService.show();
        }
    }

    async getDriverOwnOrders(): Promise<DriverOwnOrdersResponse> {

        try {
            const response = (await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/user/orders-accepted`, {
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
                throw (response);
            }
            return response.json();
        } catch (e) {
            console.error('error getting own driver order', e);
            this.errorService.show();
        }
    }

    async createOrder(order: Partial<IOrderRequest>): Promise<IOrder> {

        try {
            const response = await fetch(`${SERVICE_API_ENDPOINT}/${SERVICE_API_ENDPOINT_VERSION}/order`, {
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
                throw (response);
            }

            return await response.json();
        } catch (e) {
            console.error('error creating order', order, e);
            this.errorService.show();
        }
    }
}