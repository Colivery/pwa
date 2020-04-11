import { injectable, inject } from "springtype/core/di";
import { MATCHING_API_ENDPOINT } from "../config/endpoints";
import { Order } from "../datamodel/order";
import { ErrorService } from "./error";

export interface IMatchingResponse {
    data: Promise<{
        orders: Array<Order>
    }>;
    abortController: AbortController;
}

@injectable
export class MatchingService {

    @inject(ErrorService)
    errorService: ErrorService;
    
    async search(lat: number, lon: number, rangeKm: number): Promise<IMatchingResponse> {

        try {
            const requestBody = {
                "coordinate": {
                    "latitude": lat,
                    "longitude": lon
                },
                "range": rangeKm
            };

            const abortController = new AbortController();

            const response = (await fetch(`${MATCHING_API_ENDPOINT}/search/query`, {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(requestBody),
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
            this.errorService.show();
        }
    }
}