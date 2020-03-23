import {injectable} from "springtype/core/di";
import {st} from "springtype/core";
import {request} from "../function/http";
import {ENDPOINT_URL} from "./user";
import {OrderResponse} from "../datamodel/order";

@injectable
export class OrderService {

    async getOwnOrders() {
        try {
            st.debug('getUserProfile');

            return JSON.parse(await request(
                'GET',
                `${ENDPOINT_URL}/order/own`,
                {
                    'Authorization': `Bearer ${await window.authService.getIdToken()}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            ));
        } catch (e) {
            st.error('error in get user profile request', e)
        }
    }

    async getOrder(orderId: string): Promise<OrderResponse>{
        return (await fetch(`https://colivery-api.s0ra.de/order?order_id=${orderId}`, {
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

    async createOrder(order: any) {

        console.log('createOrder...', order);

        const response = await fetch('https://colivery-api.s0ra.de/order', {
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