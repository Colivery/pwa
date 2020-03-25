import {validatorNameFactory} from "springtype/core/validate/function/validator-name-factory";
import {st} from "springtype/core";
import {GeoService} from "../service/geocoding";
import {buffer} from "../function/buffer";

export const address = (geoService: GeoService, instance: any, geoCallback: (geolocation: { lat: string; lon: string; }) => void) => {

    return validatorNameFactory(async (value: string) => {
        const geocodeBuffered = buffer(instance, async (innerCallback: Function) => {
            const sanitizedValue = value.split('\n').join(' ');

            st.debug('address value sanitizedValue', value, sanitizedValue);
            const geoCoordinates = await geoService.forwardGeoCode(sanitizedValue);

            if (geoCoordinates && geoCoordinates[0]) {
                const userGeoLocation = {
                    lat: geoCoordinates[0].lat,
                    lon: geoCoordinates[0].lon
                };

                st.debug('userGeoLocation', userGeoLocation);

                st.debug('lat lng', userGeoLocation.lat, userGeoLocation.lon);

                await geoCallback(userGeoLocation);
                await innerCallback(true);
            } else {
                st.debug('invalid');
                await innerCallback(false);
            }
        }, 800);
        return geocodeBuffered();
    }, 'address')
};