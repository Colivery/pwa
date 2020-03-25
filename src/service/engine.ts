import { injectable, inject } from "springtype/core/di";
import { MATCHING_API_ENDPOINT } from "../config/endpoints";

@injectable
export class EngineService {

    async search(lat: number, lon: number, rangeKm: number) {

        const requestBody = {
            "coordinate": {
                "latitude": lat,
                "longitude": lon
            },
            "range": rangeKm
        };

        console.log('requestBody', requestBody);

        return (await fetch(`${MATCHING_API_ENDPOINT}/search/query`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBody)
        })).json();
    }
}