import { injectable, inject } from "springtype/core/di";

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

        return (await fetch('https://colivery-engine.s0ra.de/search/query', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.authService.getIdToken()}`
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBody)
        })).json();
    }
}