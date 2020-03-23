import "./driver-order-list.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./driver-order-list.tpl";
import { context } from "springtype/core/context/context";
import { getOrderContext, ORDER_CONTEXT } from "../../../context/order";
import { MatLoadingIndicator } from "../../../component/mat/mat-loading-indicator";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { EngineService } from "../../../service/engine";
import { GeoService } from "../../../service/geocoding";
import { DriverOrderDetailPage } from "../../driver-order-detail/driver-order-detail";
import { OrderService } from "../../../service/order";
import { UserService } from "../../../service/user";

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

    @inject(OrderService)
    orderService: OrderService;

    @inject(UserService)
    userService: UserService;

    @inject(GeoService)
    geoService: GeoService;

    range: number = 5;
    isLoading: boolean = false;

    async onRouteEnter() {
        this.updateList();
    }

    async updateList() {
        this.isLoading = true;

        this.loadingIndicator.setVisible(true);

        const currentPosition = await this.geoService.getCurrentLocation();
        const serviceResonse = await this.engineService.search(currentPosition.latitude, currentPosition.longitude, this.range);

        const unionOrders = [];

        for (let order of serviceResonse.orders) {
            const orderData = await this.orderService.getById(order.order_id);
            order = {
                ...order,
                ...orderData
            }
            unionOrders.push(order);
        }
        this.displayData = unionOrders;


            console.log('this.displayData ', this.displayData )
        this.loadingIndicator.setVisible(false);

        this.isLoading = false;
        this.doRender();
    }

    onRefreshButtonClick = () => {
        this.updateList();
    }

    onRangeChange = (evt: MouseEvent) => {

        const rangeValue = parseInt((evt.target as HTMLInputElement).value);

        this.range = rangeValue;

        this.updateList();
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
