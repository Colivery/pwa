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
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { tsx } from "springtype/web/vdom";
import { IVirtualNode } from "springtype/web/vdom/interface";

@component({
    tpl
})
export class ConsumerOrderListPage extends st.staticComponent implements ILifecycle {

    static ROUTE = "consumer-order-list";

    displayData = [];

    class = "page-consumer-order-list";

    @inject(OrderService)
    orderService: OrderService;
    
    @context(ORDER_CONTEXT)
    orderContext: any = getOrderContext();

    @ref
    loadingComponent: HTMLElement;

    @ref
    loadingIndicator: MatLoadingIndicator;

    @ref
    myOrdersScrollContainer: HTMLElement;

    myOrdersDisplayData = [];
    isLoading: boolean = true;

    async onRouteEnter() {
        this.displayData = await this.orderService.getOwnOrders();
        this.loadingIndicator.setVisible(false);
        this.updateMyOrdersList();
    }

    async updateMyOrdersList() {

        this.isLoading = true;
        this.loadingComponent.classList.remove('hide');
        this.myOrdersScrollContainer.classList.add('hide');
        this.loadingIndicator.setVisible(true);

        this.myOrdersScrollContainer.innerHTML = '';

        const serviceResonse = await this.orderService.getOwnOrders();

        console.log('serviceResonse for my orders', serviceResonse)

        this.myOrdersDisplayData = serviceResonse;

        console.log('this.openOrdersDisplayData ', this.myOrdersDisplayData);

        this.renderMyOrders();

        this.myOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.loadingComponent.classList.add('hide');
        this.isLoading = false;
    }

    renderMyOrders = () => {

        if (!this.isLoading && this.myOrdersDisplayData.length === 0) {
            this.myOrdersScrollContainer.innerText = 'Du hast bisher keine Aufträge erstellt. Klicke auf den + Button um einen Auftrag zu kreieren.';
            return;
        }

        st.render(this.myOrdersDisplayData.map((order: any) =>
            <a href="javascript:" data-id={order.id} onclick={this.onOrderClick}>
                <div class="order-card">
                    <div class="order-card-inner">
                        <div class="order-date">
                            {order.updated.substring(0, 10)}
                        </div>
                        <h4 class="order-title truncate">
                            {order.shop_name}
                        </h4>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">shopping_cart</i> {order.items.length} Teile
</div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">directions</i> {order.pickup_address} | ~{Math.round(parseInt(order.distance_km))} km
</div>
                        </div>
                        <a href="javascript:" data-id={order.id} onClick={this.onOrderClick} class="btn material-align-middle"><i class="material-icons">eye</i> &nbsp;Details ansehen</a>
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.myOrdersScrollContainer)
    }

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    }

    onOrderClick = (evt: MouseEvent) => {
        const id = ((evt.target as HTMLElement).closest('a') as HTMLElement).getAttribute('data-id');

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
