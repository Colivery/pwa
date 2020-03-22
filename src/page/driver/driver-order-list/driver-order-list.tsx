import "./driver-order-list.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./driver-order-list.tpl";
import { context } from "springtype/core/context/context";
import { getOrderContext, ORDER_CONTEXT } from "../../../context/order";
import { ConsumerOrderDetailPage } from "../../consumer-order-detail/consumer-order-detail";
import { MatLoadingIndicator } from "../../../component/mat/mat-loading-indicator";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { EngineService } from "../../../service/engine";
import { GeoService } from "../../../service/geocoding";
import { DriverOrderDetailPage } from "../../driver-order-detail/driver-order-detail";

@component({
    tpl
})
export class DriverOrderList extends st.component implements ILifecycle {

    static ROUTE = "driver-order-list";

    displayData = [];

    @context(ORDER_CONTEXT)
    orderContext: any = getOrderContext();

    @ref
    loadingIndicator: MatLoadingIndicator;

    @inject(EngineService)
    engineService: EngineService;

    @inject(GeoService)
    geoService: GeoService;

    range: number = 5;

    async onRouteEnter() {

        this.updateList();

        // mock: TODO: get data from firebase
        this.displayData = [{
            id: 'woEIqAywu7SkD3M6ijip',
            shop_name: 'Hr. Baumann / Edeka Sabitz',
            distance: '10 km',
            items: [{
                id: 'asdasd8',
                description: "Brot",
                status: "todo"
            }],
            status: 'to_be_delivered',
            hint: 'Hintere Haustür',
            date: '2020-03-21'
        }, {
            id: 'woEIqAywu7SkD3M6ijip3',
            shop_name: 'Fr. Holle / Apotheke am Hart',
            distance: '8 km',
            driver_user_id: 'adasdasd323423',
            items: [{
                id: 'asdasd1',
                description: "Paracetamol 25mg",
                status: "todo"
            }, {
                id: 'asdasd2',
                description: "Fusicutan 200mg",
                status: "done"
            }],
            hint: 'Hintere Haustür',
            status: 'accepted',
            date: '2020-03-20'
        }, {
            id: 'woEIqAywu7SkD3M6ijip2',
            shop_name: 'Fr. Wassermann / Rossmann',
            distance: '3 km',
            hint: 'Hintere Haustür',
            items: [{
                id: 'asdasd3',
                description: "Shampoo",
                status: "todo"
            }, {
                id: 'asdasd4',
                description: "Honig",
                status: "todo"
            }],
            status: 'to_be_delivered',
            date: '2020-03-20'
        }];

        this.doRender();
    }

    async updateList() {

        this.loadingIndicator.setVisible(true);

        const currentPosition = await this.geoService.getCurrentLocation();
        const serviceResonse = await this.engineService.search(currentPosition.latitude, currentPosition.longitude, this.range);

        console.log('engine serviceResonse', serviceResonse);

        this.loadingIndicator.setVisible(false);
        this.doRender();
    }

    onRefreshButtonClick() {
        this.updateList();
    }

    onRangeChange = (evt: MouseEvent) => {

        const rangeValue = parseInt((evt.target as HTMLInputElement).value);

        console.log('rangeValue', rangeValue);

        this.range = rangeValue;
        this.doRender();
    };

    onRowClick = (evt: MouseEvent) => {
        const id = ((evt.target as HTMLElement).closest('tr') as HTMLElement).getAttribute('data-id');

        for (let item of this.displayData) {
            if (item.id === id) {
                this.orderContext = item;
            }
        }

        st.route = {
            path: DriverOrderDetailPage.ROUTE,
            params: {
                id
            }
        }
    }
}
