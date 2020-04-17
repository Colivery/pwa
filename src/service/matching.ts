import { injectable, inject } from "springtype/core/di";
import { SERVICE_API_ENDPOINT } from "../config/endpoints";
import { IOrder, IOrderResponse } from "../datamodel/order";
import { ErrorService } from "./error";
import { GPSLocation } from "../datamodel/gps-location";

export interface IAnonymizedUser {
    zipCode: string;
    location: GPSLocation;
}

export interface IMatchingOrder {
    distance: number;
    order: IOrderResponse;
    consumer: IAnonymizedUser;
}

export interface IMatchingResponse {
    data: Promise<Array<IMatchingOrder>>;
    abortController: AbortController;
}

@injectable
export class MatchingService {

    @inject(ErrorService)
    errorService: ErrorService;
    
    async search(lat: number, lon: number, rangeKm: number): Promise<IMatchingResponse> {

        try {

            const abortController = new AbortController();

            const response = (await fetch(`${SERVICE_API_ENDPOINT}/order?latitude=${lat}&longitude=${lon}&range=${rangeKm}`, {
                method: 'GET',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                signal: abortController.signal
            }));
            
            if (response.status >= 400) {
                throw(response);
            }

            return {
                data: response.json(),
                abortController
            };
        } catch (e) {

            console.error('error finding matches', lat, lon, rangeKm);
            // TODO: re-enable after matching API has been re-implemented
            //this.errorService.show();
        }
    }
}