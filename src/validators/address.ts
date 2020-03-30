import { validatorNameFactory } from "springtype/core/validate/function/validator-name-factory";
import { st } from "springtype/core";
import { GeoService } from "../service/geo";
import { buffer } from "../function/buffer";

export const address = (geoService: GeoService, instance: any, geoCallback: (geolocation: { lat: string; lon: string; }, address: string) => void) => {

    return validatorNameFactory(async (value: string) => {

        if (value.length === 0) {
            return;
        }

        instance.mapContainer.classList.add('hide');
        instance.matLoaderCircle.setVisible(true);
        instance.submitButton.classList.add('disabled');

        const geocodeBuffered = buffer(instance, async (innerCallback: Function) => {
            const sanitizedValue = value.split('\n').join(' ');

            if (sanitizedValue.length === 0) {
                await innerCallback(false); 
                return;
            }

            // Google
            const esriGeoCoordinates = await geoService.geoCode(sanitizedValue);

            if (esriGeoCoordinates.results.length) {
                const geoCodeResult = esriGeoCoordinates.results[0];
                const userGeoLocation = geoCodeResult.geometry.location;

                await geoCallback(userGeoLocation, geoCodeResult.formatted_address);
                instance.submitButton.classList.remove('disabled');
                await innerCallback(true);
            } else {
                await innerCallback(false);
            }

            /* ESRI/OSM
            const geoCoordinates = await geoService.forwardGeoCode(sanitizedValue);
            if (geoCoordinates && geoCoordinates[0]) {
                const userGeoLocation = {
                    lat: geoCoordinates[0].lat,
                    lon: geoCoordinates[0].lon
                };


                st.debug('userGeoLocation', userGeoLocation);

                st.debug('lat lng', userGeoLocation.lat, userGeoLocation.lon);

                const geoValidatonResultValid = await geoCallback(userGeoLocation);

                if (!geoValidatonResultValid) {
                    await innerCallback(false);
                } else {
                    instance.saveButton.classList.remove('disabled');
                    await innerCallback(true);
                }
            } else {
                st.debug('invalid, no GPS position found');
                await innerCallback(false);
            }
            */
        }, 800);
        return geocodeBuffered();
    }, 'address')
};