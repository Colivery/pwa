import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-list.tpl";
import "./consumer-order-list.scss";
import { ConsumerOrderAddPage } from "../consumer-order-add/consumer-order-add";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { OrderService, OwnOrdersResponse, OwnOrderUnion } from "../../service/order";
import { tsx } from "springtype/web/vdom";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { getOrderStatusText } from "../../function/get-order-status-text";
import { formatDate } from "../../function/formatDate";
import { MatModal, MatLoadingIndicator } from "st-materialize";
import { Order, OrderItem } from "../../datamodel/order";
import { Center } from "../../component/center/center";

@component({
    tpl
})
export class ConsumerOrderListPage extends st.component implements ILifecycle {

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

    myOrdersDisplayData: OwnOrdersResponse = [];
    isLoading: boolean = true;
    selectedOrderUnion: OwnOrderUnion;

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

        this.myOrdersDisplayData = await this.orderService.getOwnOrders();
        this.renderMyOrders();

        this.myOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.loadingComponent.classList.add('hide');
        this.refreshButton.classList.remove('disabled');
        this.isLoading = false;
    }

    getOrderHeaderClass = (order: Order): string => {

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
    }

    renderMyOrders = () => {

        if (this.myOrdersDisplayData.length === 0) {
            this.renderPartial(
                <Center>
                    <h6>
                        <strong>{st.t("Do you need help with shopping?")}</strong><br />
                        {st.t("Press the button: \"New Request\".")}
                        <br /><br />
                        <strong>{st.t("Would you rather want to help?")}</strong> <br />
                        {st.t("Press on the menu on the top left and")} <br />
                        {st.t("change to the driver mode.")}
                        <br /><br />
                    </h6>
                </Center>,
                this.myOrdersScrollContainer);
            return;
        }

        // filter-out user cancelled orders
        this.myOrdersDisplayData = this.myOrdersDisplayData.filter((union: OwnOrderUnion) => union.order.status !== 'consumer_canceled');

        this.myOrdersDisplayData.sort((unionA: OwnOrderUnion, unionB: OwnOrderUnion) => unionA.order.created < unionB.order.created ? 1 : -1);

        this.renderPartial(this.myOrdersDisplayData.map((union: OwnOrderUnion, index: number) =>
            <a href="javascript:" data-id={union.order.id}>
                <div class="order-card">
                    <div class="order-card-inner">

                        <div class={[this.getOrderHeaderClass(union.order)]}>
                            {getOrderStatusText(union.order.status)}
                        </div>
                        {/*
                        <div class="order-date">
                            {st.t("Requested at:")}
                        </div>
                        */}

                        <h4 class="order-title truncate">
                            {union.order.shop_name}
                            <br />
                        </h4>

                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">create</i> {formatDate(new Date(union.order.created))}
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">shopping_cart</i> {union.order.items.length} {st.t("Items")}
                            </div>
                        </div>
                        {/*
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">fingerprint</i> <code>{union.order.id.substring(0, 6)}</code>
                            </div>
                        </div>
                         */}
                        <a href="javascript:" data-index={index} onClick={this.onOrderShowDetails} class="btn material-align-middle info-button"><i class="material-icons">visibility</i> &nbsp;{st.t("View Details")}</a>
                        {union.order.status === 'to_be_delivered' ? <a href="javascript:" data-index={index} onClick={this.onOrderCancel} class="btn material-align-middle cancel-button"><i class="material-icons">cancel</i> &nbsp;{st.t("Cancel")}</a> : ''}
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.myOrdersScrollContainer)
    }

    onOrderCancel = (evt: MouseEvent) => {
        this.selectedOrderUnion = this.getOwnOrderUnionByEvent(evt);
        this.cancelOrderModal.toggle();
    }

    onReallyCancelOrder = async () => {
        this.cancelOrderModal.toggle();

        await this.orderService.userCancelOrder(this.selectedOrderUnion.order.id);

        this.updateMyOrdersList();
    }

    getOwnOrderUnionByEvent(evt: MouseEvent): OwnOrderUnion {
        const orderIndex = ((evt.target as HTMLElement).closest('a') as HTMLElement).getAttribute('data-index');
        return this.myOrdersDisplayData[orderIndex];
    }

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    }

    onOrderShowDetails = (evt: MouseEvent) => {

        const union = this.getOwnOrderUnionByEvent(evt);

        this.renderPartial(<div class="container details-modal">

            <Center>
                <h5 class="material-align-middle">
                    <i class="material-icons order-card-icon">fingerprint</i> <code>{union.order.id.substring(0, 6)}</code>
                </h5>
            </Center>

            <br />

            {union.order.status === 'accepted' || union.order.status === 'delivered' ? <fragment><h5><span class="material-align-middle"><i class="material-icons">time_to_leave</i>&nbsp;{st.t("Your driver")}</span></h5>

                <div class="row">
                    <strong>{union.driver.first_name} {union.driver.last_name}</strong><br />
                    <a href={`tel:${union.driver.phone}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                        <span class="material-align-middle"><i class="material-icons">call</i>&nbsp;{union.driver.phone}</span>
                    </a><br />
                    <a href={`mailto:$${union.driver.email}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                        <span class="material-align-middle"><i class="material-icons">email</i>&nbsp;{union.driver.email}</span>
                    </a>
                </div> </fragment> : ''}

            <h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">shopping_cart</i>&nbsp;{st.t("Items")}
                </span>
            </h5>

            <div class="row">
                <ul>
                    {union.order.items.map((orderItem: OrderItem) => <li>
                        &ndash; {orderItem.description}
                    </li>)}
                </ul>
            </div>

            {union.order.hint ? <fragment><h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">speaker_notes</i>&nbsp;{st.t("Notes")}
                </span>
            </h5>

                <div class="row">
                    <p>{union.order.hint}</p>
                </div>
            </fragment> : ''}

            {union.order.max_price ? <fragment><h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">monetization_on</i>&nbsp;{st.t("Maximum budget")}
                </span>
            </h5>

                <p>{st.t("The request is allowed to cost")} <strong>{st.t("at most")} {union.order.max_price} (€) {st.t("/verb/cost.")}</strong></p></fragment> : ''}

        </div>, this.myOrderDetailsContainer);

        this.myOrderDetailsModal.toggle();
    }
}
