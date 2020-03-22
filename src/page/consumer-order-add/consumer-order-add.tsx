import { st } from "springtype/core";
import { component, state } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-add.tpl";
import "./consumer-order-add.scss";
import { context } from "springtype/core/context/context";
import { ORDER_CONTEXT, getOrderContext } from "../../context/order";
import { inject } from "springtype/core/di";
import { GeoService } from "../../service/geocoding";
import { ref } from "springtype/core/ref";

@component({
    tpl
})
export class ConsumerOrderAddPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-add";

    @inject(GeoService)
    geoService: GeoService;

    @ref
    locationField: HTMLInputElement;

    lookupTimeout: any;

    pickupLat = 0;
    pickupLon = 0;

    locationOptions = [];

    isLoading: boolean = false;
    selectedLocationType: string = '';

    buffer = (fn: Function, buffer: number = 1000): Function => {
        return () => {
            clearTimeout(this.lookupTimeout);
            this.lookupTimeout = setTimeout(fn, buffer);
        };
    }

    onLocationKeyUp = () => {
        const value = (this.locationField as any).el.querySelector('input').value;
        const searchForPlacesBuffered = this.buffer(async () => {

            this.isLoading = true;
            this.doRender();

            const currentLocation = await this.geoService.getCurrentLocation();

            this.locationOptions = await this.geoService.forwardLocalPlacesSearch(value);

            this.locationOptions = this.locationOptions.map((locationOption) => {

                // on-the-fly distance calculation
                locationOption.distance = this.geoService.getDistanceKm(currentLocation.latitude, currentLocation.longitude, locationOption.lat, locationOption.lon);

                return locationOption;
            });
            this.isLoading = false;
            this.doRender();
        });
        searchForPlacesBuffered();
    }

    onLocationOptionSelect = (evt: MouseEvent) => {

        const locationOptionIndex = parseInt((evt.target as HTMLElement).closest('a').getAttribute('data-index'), 10);
        const locationOption = this.locationOptions[locationOptionIndex];
        this.locationOptions = [];

        this.selectedLocationType = locationOption.tags.shop;
        this.doRender();

        console.log('locationOption', locationOption);
    }
}
