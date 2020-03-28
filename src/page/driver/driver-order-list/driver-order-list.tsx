import "./driver-order-list.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./driver-order-list.tpl";
import { MatLoadingIndicator } from "../../../component/mat/mat-loading-indicator";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { EngineService } from "../../../service/engine";
import { GeoService } from "../../../service/geocoding";
import { OrderService } from "../../../service/order";
import { UserService } from "../../../service/user";
import { OlMap } from "../../../component/ol-map/ol-map";
import { tsx } from "springtype/web/vdom";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { MatModal } from "../../../component/mat/mat-modal";

export interface ILocation {
    latitude: number;
    longitude: number;
}

@component({
    tpl
})
export class DriverOrderList extends st.staticComponent implements ILifecycle {

    static ROUTE = "driver-order-list";

    readonly activeTabClass = 'order-active-tab';

    @ref
    loadingIndicator: MatLoadingIndicator;

    @ref
    map: OlMap;

    @ref
    openOrdersTabLink: HTMLAnchorElement;

    @ref
    myOrdersTabLink: HTMLAnchorElement;

    @ref
    myOrdersTab: HTMLElement;

    @ref
    openOrdersTab: HTMLElement;

    @ref
    loadingComponent: HTMLElement;

    @ref
    openOrdersScrollContainer: HTMLElement;

    @ref
    myOrdersScrollContainer: HTMLElement;

    @ref
    confirmAcceptOrderModal: MatModal;

    @inject(EngineService)
    engineService: EngineService;

    @inject(OrderService)
    orderService: OrderService;

    @inject(UserService)
    userService: UserService;

    @inject(GeoService)
    geoService: GeoService;

    // local state
    range: number = 5;
    isLoading: boolean = true;
    activeCard: HTMLElement;
    activeTab: 'my-orders' | 'open-orders' = 'open-orders';
    openOrdersDisplayData = [];
    activeOrderContext: any;

    async onRouteEnter() {
        this.updateOpenOrdersList();
    }

    async onAfterRender() {
        this.map.init();
        this.resetMap();
    }

    async resetMap() {

        const currentPosition = await this.geoService.getCurrentLocation();

        this.updateMap(currentPosition);
    }

    updateMap(location: ILocation) {
        this.map.removeAllMarker();
        this.map.setCenter(location.latitude, location.longitude);
        this.map.addMarker(location.latitude, location.longitude);
    }

    async updateOpenOrdersList() {

        this.isLoading = true;
        this.loadingComponent.classList.remove('hide');
        this.openOrdersScrollContainer.classList.add('hide');
        this.loadingIndicator.setVisible(true);

        this.openOrdersScrollContainer.innerHTML = '';

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
        this.openOrdersDisplayData = unionOrders;

        console.log('this.openOrdersDisplayData ', this.openOrdersDisplayData);

        this.renderOpenOrders();

        this.openOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.loadingComponent.classList.add('hide');
        this.isLoading = false;
    }

    renderOpenOrders = () => {

        if (!this.isLoading && this.openOrdersDisplayData.length === 0) {
            this.openOrdersScrollContainer.innerText = 'Keine offenen Aufträge im Umkreis.';
            return;
        }

        st.render(this.openOrdersDisplayData.map((order: any) =>
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
                        <a href="javascript:" onClick={this.onOrderAccept} class="btn material-align-middle"><i class="material-icons">done</i> &nbsp;Auftrag Annehmen</a>
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.openOrdersScrollContainer)
    }

    renderMyOrders = () => {

        if (!this.isLoading && this.openOrdersDisplayData.length === 0) {
            this.myOrdersScrollContainer.innerText = 'Keine offenen Aufträge im Umkreis.';
            return;
        }

        st.render(this.openOrdersDisplayData.map((order: any) =>
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
                        <a href="javascript:" onClick={this.onOrderAccept} class="btn material-align-middle"><i class="material-icons">done</i> &nbsp;Auftrag Annehmen</a>
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.myOrdersScrollContainer)
    }

    activateOpenOrdersTab = () => {
        this.activeTab = 'open-orders';
        this.openOrdersTabLink.classList.add(this.activeTabClass);
        this.myOrdersTabLink.classList.remove(this.activeTabClass);
        this.openOrdersTab.classList.remove('hide');
        this.myOrdersTab.classList.add('hide');
    }

    activateMyOrdersTab = () => {

        if (this.activeTab !== 'my-orders') {
            // coming from 'open-orders' tab, update
            this.updateMyOrdersList();
        }

        this.activeTab = 'my-orders';
        this.openOrdersTabLink.classList.remove(this.activeTabClass);
        this.myOrdersTabLink.classList.add(this.activeTabClass);
        this.openOrdersTab.classList.add('hide');
        this.myOrdersTab.classList.remove('hide');
    }

    onRefreshButtonClick = () => {

        if (this.activeTab === 'open-orders') {
            this.updateOpenOrdersList();
        } else {
            this.updateMyOrdersList();
        }
    }

    updateMyOrdersList = () => {
        this.isLoading = true;
        console.log('TODO: refresh my orders');
        this.isLoading = false;
    }

    onRangeChange = (evt: MouseEvent) => {

        const rangeValue = parseInt((evt.target as HTMLInputElement).value);

        this.range = rangeValue;

        this.updateOpenOrdersList();
    };

    toggleCardActivation(card: HTMLElement) {

        if (!card.querySelector('a')) {

            // card is <a>
            card.closest('.order-card').classList.toggle('active');
            card.classList.toggle('inverted');

        } else {

            card.querySelector('.order-card').classList.toggle('active');
            card.querySelector('.order-card a').classList.toggle('inverted');
        }
    }

    onReallyAcceptOrder = async () => {

        if (!this.activeOrderContext) return;

        // remove this entry from horizontal list, as it is taken now
        this.activeCard.parentNode.removeChild(this.activeCard);

        // reset map of open orders tab
        this.resetMap();

        // hide confirmation dialog
        this.confirmAcceptOrderModal.toggle();

        const user = await this.orderService.accept(this.activeOrderContext.id);

        this.activateMyOrdersTab();
    }

    onCancelAccept = () => {
        this.confirmAcceptOrderModal.toggle();
    }

    onOrderAccept = () => {
        this.confirmAcceptOrderModal.toggle();
    }

    onOrderClick = async (evt: MouseEvent) => {

        const card = ((evt.target as HTMLElement).closest('a') as HTMLElement);
        const id = card.getAttribute('data-id');

        for (let item of this.openOrdersDisplayData) {
            if (item.id === id) {
                this.activeOrderContext = item;
            }
        }

        // un-toggle previously activated card
        if (this.activeCard) {
            this.toggleCardActivation(this.activeCard);
        }

        if (card.querySelector('a')) {

            // remember this card reference only if it's not 
            // the confirm button being clicked on
            this.activeCard = card;
        }

        // set center of map according to pickup location
        if (this.activeOrderContext.pickup_location) {
            this.updateMap(this.activeOrderContext.pickup_location);
        } else {
            this.updateMap(await this.geoService.getCurrentLocation());
        }

        // activate card
        this.toggleCardActivation(card);
    }
}