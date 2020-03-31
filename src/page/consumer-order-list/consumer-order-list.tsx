import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-list.tpl";
import "./consumer-order-list.scss";
import { ConsumerOrderAddPage } from "../consumer-order-add/consumer-order-add";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { OrderService } from "../../service/order";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { tsx } from "springtype/web/vdom";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { getOrderStatusText } from "../../function/get-order-status-text";
import { formatDate } from "../../function/formatDate";
import { MatModal } from "../../component/mat/mat-modal";

@component({
    tpl
})
export class ConsumerOrderListPage extends st.staticComponent implements ILifecycle {

    static ROUTE = "consumer-order-list";

    class = "page-consumer-order-list";

    @inject(OrderService)
    orderService: OrderService;

    @ref
    loadingComponent: HTMLElement;

    @ref
    loadingIndicator: MatLoadingIndicator;

    @ref
    myOrdersScrollContainer: HTMLElement;

    @ref
    myOrderDetailsModal: MatModal;

    @ref
    myOrderDetailsContainer: HTMLElement;

    @ref
    cancelOrderModal: MatModal;

    @ref
    refreshButton: HTMLElement;

    myOrdersDisplayData = [];
    isLoading: boolean = true;
    selectedOrder;

    async onRouteEnter() {
        this.loadingIndicator.setVisible(false);
        this.updateMyOrdersList();
    }

    onRefreshButtonClick = () => {
        this.updateMyOrdersList();
    }

    async updateMyOrdersList() {

        this.isLoading = true;
        this.refreshButton.classList.add('disabled');
        this.loadingComponent.classList.remove('hide');
        this.myOrdersScrollContainer.classList.add('hide');
        this.loadingIndicator.setVisible(true);

        this.myOrdersScrollContainer.innerHTML = '';

        const serviceResonse = await this.orderService.getOwnOrders();
        this.myOrdersDisplayData = serviceResonse;
        this.renderMyOrders();

        this.myOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.loadingComponent.classList.add('hide');
        this.refreshButton.classList.remove('disabled');
        this.isLoading = false;
    }

    getOrderHeaderClass = (order): string => {

        switch (order.status) {
            case "accepted":
                return "order-header order-header-blue";
            case "to_be_delivered":
                return "order-header order-header-orange";
            case "delivered":
                return "order-header order-header-green";
            case "consumer_canceled":
                return "order-header order-header-orange";
        }
        return "order-header";
    }

    renderMyOrders = () => {

        if (this.myOrdersDisplayData.length === 0) {
            this.myOrdersScrollContainer.innerHTML = '<center><h6>Brauchst Du Hilfe beim Einkaufen?<br />Klick auf den <strong>+</strong> Button rechts unten.<br /><br /></h6></center>';
            return;
        }

        // filter-out user cancelled orders
        this.myOrdersDisplayData = this.myOrdersDisplayData.filter(order => order.status !== 'consumer_canceled');

        this.myOrdersDisplayData.sort((orderA, orderB) => orderA.created < orderB.created ? 1 : -1);

        st.render(this.myOrdersDisplayData.map((order: any, index: number) =>
            <a href="javascript:" data-id={order.id}>
                <div class="order-card">
                    <div class="order-card-inner">

                        <div class={[this.getOrderHeaderClass(order)]}>
                            {getOrderStatusText(order.status)}
                        </div>
                        {/*
                        <div class="order-date">
                            Eingetragen: 
                        </div>
                        */}

                        <h4 class="order-title truncate">
                            {order.shop_name}
                            <br />
                        </h4>

                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">create</i> {formatDate(new Date(order.created))}
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">shopping_cart</i> {order.items.length} Teile
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">fingerprint</i> <code>{order.id.substring(0, 6)}</code>
                            </div>
                        </div>
                        <a href="javascript:" data-index={index} onClick={this.onOrderShowDetails} class="btn material-align-middle info-button"><i class="material-icons">visibility</i> &nbsp;Details ansehen</a>
                        {order.status === 'to_be_delivered' ? <a href="javascript:" data-index={index} onClick={this.onOrderCancel} class="btn material-align-middle cancel-button"><i class="material-icons">cancel</i> &nbsp;Abbrechen</a> : ''}
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.myOrdersScrollContainer)
    }

    onOrderCancel = (evt: MouseEvent) => {
        this.selectedOrder = this.getOrderByEvent(evt);
        this.cancelOrderModal.toggle();
    }

    onReallyCancelOrder = async () => {
        this.cancelOrderModal.toggle();

        await this.orderService.userCancelOrder(this.selectedOrder.id);

        this.updateMyOrdersList();
    }

    getOrderByEvent(evt: MouseEvent) {
        const orderIndex = ((evt.target as HTMLElement).closest('a') as HTMLElement).getAttribute('data-index');
        return this.myOrdersDisplayData[orderIndex];
    }

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    }

    onOrderShowDetails = (evt: MouseEvent) => {

        const order = this.getOrderByEvent(evt);

        this.myOrderDetailsContainer.innerHTML = '';

        st.render(<div class="container details-modal">

            <br />

            {order.status === 'accepted' || order.status === 'delivered' ? <fragment><h5><span class="material-align-middle"><i class="material-icons">perm_contact_calendar</i>&nbsp;Dein Fahrer</span></h5>

                <div class="row">

                    <p>
                        <strong>TODO: Firstname Lastname</strong>
                    </p>
                    <a href={`tel:TODO`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                        <span class="material-align-middle"><i class="material-icons">call</i>&nbsp;+1 TODO</span>
                    </a><br />
                    <a href={`mailto:TODO`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                        <span class="material-align-middle"><i class="material-icons">email</i>&nbsp;TODO@TODO.TODO</span>
                    </a>
                </div> </fragment> : ''}

            <h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">shopping_cart</i>&nbsp;Artikel
                </span>
            </h5>

            <div class="row">
                <ul>
                    {order.items.map((orderItem: any) => <li>
                        &ndash; {orderItem.description}
                    </li>)}
                </ul>
            </div>

            <h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">speaker_notes</i>&nbsp;Hinweise
                </span>
            </h5>

            <p>{order.hint}</p>

            {order.max_price ? <fragment><h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">monetization_on</i>&nbsp;Maximalbetrag
                </span>
            </h5>

                <p>Der Einkauf darf <strong>maximal {order.max_price} kosten.</strong></p></fragment> : ''}


        </div>, this.myOrderDetailsContainer);

        this.myOrderDetailsModal.toggle();
    }
}
