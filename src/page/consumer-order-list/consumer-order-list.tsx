import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-list.tpl";
import "./consumer-order-list.scss";
import { ConsumerOrderDetailPage } from "../consumer-order-detail/consumer-order-detail";
import { context } from "springtype/core/context/context";
import { ORDER_CONTEXT, getOrderContext } from "../../context/order";
import { ConsumerOrderAddPage } from "../consumer-order-add/consumer-order-add";
import { ref } from "springtype/core/ref";
import { NavHeader } from "../../component/nav-header/nav-header";
import { inject } from "springtype/core/di";
import { OrderService } from "../../service/order";

@component({
    tpl
})
export class ConsumerOrderListPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-list";

    displayData = [];

    @inject(OrderService)
    orderService: OrderService;
    
    @context(ORDER_CONTEXT)
    orderContext: any = getOrderContext();

    async onRouteEnter() {

        console.log('service response', await this.orderService.getOwnOrders());

        this.displayData = await this.orderService.getOwnOrders();

        this.doRender();
    }

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    }

    onRowClick = (evt: MouseEvent) => {
        const id = ((evt.target as HTMLElement).closest('tr') as HTMLElement).getAttribute('data-id');

        for (let item of this.displayData) {
            if (item.id === id) {
                this.orderContext = item;
            }
        }

        st.route = {
            path: ConsumerOrderDetailPage.ROUTE,
            params: {
                id
            }
        }
    }
}
