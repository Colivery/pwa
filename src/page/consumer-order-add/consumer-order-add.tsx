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
    
    buffer = (fn: Function, buffer: number = 1000): Function => {
        return () => {
            clearTimeout(this.lookupTimeout);
            this.lookupTimeout = setTimeout(fn, buffer);
        };
    }

    onLocationKeyUp = () => {
        const value = (this.locationField as any).el.querySelector('input').value;
        const searchForPlacesBuffered = this.buffer(() => {
            console.log('location keybup', value)

            this.geoService.forwardLocalPlacesSearch(value, 5);
        });
        searchForPlacesBuffered();
    }
}
