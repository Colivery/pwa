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
import { OlMap } from "../../component/ol-map/ol-map";
import { Feature } from "ol";
import { MatInput } from "../../component/mat/mat-input";
import { MatModal } from "../../component/mat/mat-modal";
import { ConsumerOrderListPage } from "../consumer-order-list/consumer-order-list";

@component({
    tpl
})
export class ConsumerOrderAddPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-add";

    @inject(GeoService)
    geoService: GeoService;

    @ref
    locationField: MatInput;

    @ref
    articleDescription: HTMLInputElement;

    @ref
    olMapRef: OlMap;

    @ref
    dontCareForLocationSwitch: HTMLInputElement;

    @ref
    confirmCreateOrderModal: MatModal

    lookupTimeout: any;
    pickupLat = 0;
    pickupLon = 0;
    locationOptions = [];
    isLoading: boolean = false;
    selectedLocationType: string = '';
    oldMarker: Feature;
    doesNotCareForLocation: boolean = false;
    selectedLocation: any;

    orderItems = [];

    buffer = (fn: Function, buffer: number = 1000): Function => {
        return () => {
            clearTimeout(this.lookupTimeout);
            this.lookupTimeout = setTimeout(fn, buffer);
        };
    }

    onToggleDontCareForLocationSwitch = () => {
        this.doesNotCareForLocation = this.dontCareForLocationSwitch.checked;
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
        this.selectedLocation = locationOption;

        this.doRender();
        this.updateMapMarker();
    }

    updateMapMarker() {
        if (this.selectedLocation && this.olMapRef) {

            this.olMapRef.setCenter(this.selectedLocation.lat, this.selectedLocation.lon);
            try {
                this.olMapRef.removeMarker(this.oldMarker);
            } catch (e) { }
            this.oldMarker = this.olMapRef.setMarker(this.selectedLocation.lat, this.selectedLocation.lon);
        }
    }

    onCreateOrderButtonClick = () => {

        // open modal
        this.confirmCreateOrderModal.toggle();
    }

    onOrderItemAddClick = () => {

        this.orderItems.push({
            description: this.articleDescription.value
        });

        this.doRender();
    }

    onOrderItemRemoveClick = (evt: MouseEvent) => {

        const orderItemIndex = parseInt((evt.target as HTMLElement).closest('.row').getAttribute('data-index'), 10);

        this.orderItems.splice(orderItemIndex, 1);

        this.doRender();

        console.log('remove', orderItemIndex)
    }

    onReallyCreateOrderClick = () => {

        // close modal
        this.confirmCreateOrderModal.toggle();

        // TODO: OrderService.create(...)

        st.route = {
            path: ConsumerOrderListPage.ROUTE
        }
    }

    onAfterRender(): void {
        if (this.olMapRef) {
            this.olMapRef.init();
            this.updateMapMarker();
        }
    }
}
