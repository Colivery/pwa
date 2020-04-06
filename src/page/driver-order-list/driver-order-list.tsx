import "./driver-order-list.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./driver-order-list.tpl";
import { MatLoadingIndicator, MatModal } from "st-materialize";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { MatchingService } from "../../service/matching";
import { GeoService } from "../../service/geo";
import { OrderService, DriverOwnOrdersResponse, DriverOwnOrderUnion } from "../../service/order";
import { UserService } from "../../service/user";
import { tsx } from "springtype/web/vdom";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { formatDate } from "../../function/formatDate";
import { COLOR_COLIVERY_PRIMARY } from "../../config/colors";
import { calculateAvailableHeightPercent } from "../../function/calculate-available-height-percent";
import { Order } from "../../datamodel/order";
import { GPSLocation } from "../../datamodel/gps-location";
import { Center } from "../../component/center/center";

export interface ILocation {
    latitude: number;
    longitude: number;
}

@component({
    tpl
})
export class DriverOrderList extends st.component implements ILifecycle {

    static ROUTE = "driver-order-list";

    readonly activeTabClass = 'order-active-tab';

    @ref
    loadingIndicator: MatLoadingIndicator;

    @ref
    map: HTMLImageElement;

    @ref
    openOrdersTabLink: HTMLAnchorElement;

    @ref
    myOrdersTabLink: HTMLAnchorElement;

    @ref
    myOrdersTab: HTMLElement;

    @ref
    openOrdersTab: HTMLElement;

    @ref
    openOrdersLoadingComponent: HTMLElement;

    @ref
    myOrdersLoadingComponent: HTMLElement;

    @ref
    openOrdersScrollContainer: HTMLElement;

    @ref
    myOrdersScrollContainer: HTMLElement;

    @ref
    confirmAcceptOrderModal: MatModal;

    @inject(MatchingService)
    engineService: MatchingService;

    @inject(OrderService)
    orderService: OrderService;

    @inject(UserService)
    userService: UserService;

    @inject(GeoService)
    geoService: GeoService;

    @ref
    myOrderDetailsModal: MatModal;

    @ref
    myOrderDetailsContainer: HTMLElement;

    @ref
    markOrderDeliveredModal: MatModal;

    @ref
    rangeDisplay: HTMLElement;

    @ref
    refreshButton: HTMLElement;

    @ref
    declideOrderModal: MatModal;

    @ref
    confirmOrderItemListContainer: HTMLElement;

    // local state
    range: number = 20;
    isLoading: boolean = true;
    activeCard: HTMLElement;
    activeTab: 'my-orders' | 'open-orders' = 'open-orders';
    openOrdersDisplayData: Array<Order> = [];
    myOrdersDisplayData: DriverOwnOrdersResponse = [];
    activeOrderContext: Order;
    mySelectedOrderUnion: DriverOwnOrderUnion;

    async onRouteEnter() {
        this.updateOpenOrdersList();
    }

    async onAfterRender() {
        this.resetMap();
    }

    async resetMap() {
        const currentPosition = await this.geoService.getCurrentLocation();
        this.updateMap({
            lat: currentPosition.latitude,
            lng: currentPosition.longitude
        });
    }

    async updateMap(location: {
        lat: number,
        lng: number
    }) {

        // update static map
        const mapSrc = this.geoService.getStaticMapImageSrc('', {
            ...location,
            lable: st.t("You are here"),
            color: COLOR_COLIVERY_PRIMARY
        }, this.map.closest('.container').clientWidth, calculateAvailableHeightPercent(20), 10);

        this.map.setAttribute('src', mapSrc);
    }

    async updateOpenOrdersList() {

        this.isLoading = true;
        this.refreshButton.classList.add('disabled');
        this.openOrdersLoadingComponent.classList.remove('hide');
        this.openOrdersScrollContainer.classList.add('hide');
        this.loadingIndicator.setVisible(true);

        let currentPosition: GPSLocation = await this.geoService.getCurrentLocation();
        const ownUserProfile = await this.userService.getUserProfile();

        const serviceResonse = await this.engineService.search(currentPosition.latitude, currentPosition.longitude, this.range);
        const unionOrders = [];

        for (let order of (await serviceResonse.data).orders) {

            // do not allow to self-assign; don't even show own orders
            if (ownUserProfile.user_id !== order.user_id) {
                unionOrders.push(order);
            }
        }

        console.log('unionOrders', unionOrders);

        unionOrders.sort((orderA, orderB) => orderA.created > orderB.created ? 1 : -1);

        this.openOrdersDisplayData = unionOrders;

        this.renderOpenOrders();

        this.openOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.openOrdersLoadingComponent.classList.add('hide');
        this.refreshButton.classList.remove('disabled');
        this.isLoading = false;
    }

    renderOpenOrders = async () => {

        const currentPosition = await this.geoService.getCurrentLocation();

        if (this.openOrdersDisplayData.length === 0) {
            this.renderPartial(
                <p>
                    <Center><strong>{st.t("Great, there is nothing todo")} 👍</strong></Center>
                </p>,
                this.openOrdersScrollContainer
            );
            return;
        }

        this.renderPartial(this.openOrdersDisplayData.map((order: Order) =>
            <a href="javascript:" class="order-card-container" data-id={order.id} onclick={this.onOrderClick}>
                <div class="order-card">
                    <div class="order-card-inner">
                        <div class="order-header">
                            {st.t("Driver is searched for:")}
                        </div>
                        <h4 class="order-title truncate">
                            {/*order.shop_name*/}
                            <br />
                        </h4>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">search</i> {formatDate(new Date(order.created))}
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">shopping_cart</i> {order.items.length} {st.t("Items")}
                            </div>
                        </div>

                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">near_me</i> {this.geoService.roundTo1Decimal(this.geoService.haversine(currentPosition, order.dropoff_location) * 1.2 /* make it more realistic */)} {st.t("km away")}
                                </div>
                        </div>

                        {/*
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">fingerprint</i> <code>{order.id.substring(0, 6)}</code>
                            </div>
                        </div> */}
                        <a href="javascript:" data-id={order.id} class="btn material-align-middle success-button"><i class="material-icons">done</i> &nbsp;{st.t("Accept")}</a>
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.openOrdersScrollContainer)
    }

    renderMyOrders = async () => {

        const currentPosition = await this.geoService.getCurrentLocation();

        if (this.myOrdersDisplayData.length === 0) {
            this.renderPartial(<p><Center><strong>{st.t("You do not have any driver requests yet.")}</strong></Center></p>, this.myOrdersScrollContainer);
            return;
        }

        this.renderPartial(this.myOrdersDisplayData.map((orderUnion: DriverOwnOrderUnion, index: number) =>
            <a href="javascript:" data-id={orderUnion.order.id}>
                <div class="order-card">
                    <div class="order-card-inner">
                        <div class={["order-header", "material-align-middle", "order-header-orange", orderUnion.order.status === 'delivered' ? "order-header-green" : '']}>
                            {st.t("Request by:")}
                        </div>
                        <h4 class="order-title truncate">
                            {/*order.shop_name*/}
                            <br />
                        </h4>

                        {orderUnion.order.status === 'delivered' ? <fragment><strong>🎉 {st.t("FINISHED")} 👍</strong> <hr /></fragment> : ''}

                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">account_circle</i> {orderUnion.creator.first_name} {orderUnion.creator.last_name}
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">search</i> {formatDate(new Date(orderUnion.order.created))}
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">shopping_cart</i> {orderUnion.order.items.length} {st.t("Items")}
                            </div>
                        </div>

                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">near_me</i> {this.geoService.roundTo1Decimal(this.geoService.haversine(currentPosition, orderUnion.order.dropoff_location) * 1.2)} {st.t("km away")}
                                </div>
                        </div>

                        {/*
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">fingerprint</i> <code>{orderUnion.order.id.substring(0, 6)}</code>
                                </div>
                        </div> */}
                        <a href="javascript:" data-index={index} onClick={this.onOrderShowDetails} class="btn material-align-middle info-button"><i class="material-icons">visibility</i> &nbsp;{st.t("Details")}</a>
                        {orderUnion.order.status !== 'delivered' ? <a href="javascript:" data-index={index} onClick={this.onOrderComplete} class="btn material-align-middle success-button"><i class="material-icons">done_all</i> &nbsp;{st.t("Finish")}</a> : ''}
                        {orderUnion.order.status !== 'delivered' ? <a href="javascript:" data-index={index} onClick={this.onOrderDeclide} class="btn material-align-middle cancel-button"><i class="material-icons">cancel</i> &nbsp;{st.t("Cancel")}</a> : ''}
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.myOrdersScrollContainer)
    }

    onOrderShowDetails = (evt: MouseEvent) => {

        const myOrdersDataIndex = parseInt((evt.target as HTMLElement).closest('a').getAttribute('data-index'));
        const orderUnion = this.myOrdersDisplayData[myOrdersDataIndex];

        this.renderPartial(<div class="container details-modal">
            <Center>
                <h5 class="material-align-middle">
                    <i class="material-icons order-card-icon">fingerprint</i> <code>{orderUnion.order.id.substring(0, 6)}</code>
                </h5>
            </Center>

            <br />

            <h5><span class="material-align-middle"><i class="material-icons">location_on</i>&nbsp;{st.t("Delivery address")}</span></h5>

            <div class="row">
                <strong>{orderUnion.creator.first_name} {orderUnion.creator.last_name}</strong><br />
                {orderUnion.creator.address} <br />
                <a href={`https://www.google.com/maps/place/${orderUnion.creator.address}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                    <span class="material-align-middle"><i class="material-icons">directions</i>&nbsp;{st.t("Google Maps")}</span>
                </a>
            </div>

            <h5><span class="material-align-middle"><i class="material-icons">perm_contact_calendar</i>&nbsp;{st.t("Contact")}</span></h5>

            <div class="row">

                <a href={`tel:${orderUnion.creator.phone}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                    <span class="material-align-middle"><i class="material-icons">call</i>&nbsp;{orderUnion.creator.phone}</span>
                </a><br />
                <a href={`mailto:${orderUnion.creator.email}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                    <span class="material-align-middle"><i class="material-icons">email</i>&nbsp;{orderUnion.creator.email}</span>
                </a>
            </div>

            <h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">shopping_cart</i>&nbsp;{st.t("Items")}
                </span>
            </h5>

            <div class="row">
                <ul>
                    {orderUnion.order.items.map((orderItem: any) => <li>
                        &ndash; {orderItem.description}
                    </li>)}
                </ul>
            </div>

            {orderUnion.order.hint.trim() ? <fragment>
                <h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">speaker_notes</i>&nbsp;{st.t("Notes")}
                </span>
                </h5>
                <p>{orderUnion.order.hint}</p>
            </fragment> : null}

            {orderUnion.order.max_price ? <fragment>
                <h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">monetization_on</i>&nbsp;{st.t("Maximum budget")}
                    </span>
                </h5>

                <p>{st.t("The request is allowed to cost")} <strong>{st.t("at most")} {orderUnion.order.max_price} (€) {st.t("/verb/cost.")}</strong></p>
            </fragment> : ''}

        </div>, this.myOrderDetailsContainer);

        this.myOrderDetailsModal.toggle();
    }

    onOrderComplete = (evt: MouseEvent) => {
        this.mySelectedOrderUnion = this.getMyOrderUnionByEvent(evt);
        this.markOrderDeliveredModal.toggle();
    }

    onReallyMarkOrderDelivered = async () => {
        await this.orderService.markOrderDelivered(this.mySelectedOrderUnion.order.id);
        this.markOrderDeliveredModal.toggle();
        this.updateMyOrdersList();
    }

    getMyOrderUnionByEvent(evt: MouseEvent): DriverOwnOrderUnion {
        const orderIndex = parseInt((evt.target as HTMLElement).closest('a').getAttribute('data-index'));
        return this.myOrdersDisplayData[orderIndex];
    }

    onOrderDeclide = (evt: MouseEvent) => {
        this.mySelectedOrderUnion = this.getMyOrderUnionByEvent(evt);
        this.declideOrderModal.toggle();
    }

    onReallyDeclideOrder = async () => {
        await this.orderService.declide(this.mySelectedOrderUnion.order.id);
        this.declideOrderModal.toggle();
        this.updateMyOrdersList();
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

    updateMyOrdersList = async () => {
        this.isLoading = true;
        this.refreshButton.classList.add('disabled');
        this.loadingIndicator.setVisible(true);
        this.myOrdersLoadingComponent.classList.remove('hide');

        const driverOwnOrders = await this.orderService.getDriverOwnOrders();

        driverOwnOrders.sort((unionA: DriverOwnOrderUnion, unionB: DriverOwnOrderUnion) => unionA.order.created > unionB.order.created ? 1 : -1);

        this.myOrdersDisplayData = driverOwnOrders;

        this.renderMyOrders();

        this.myOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.myOrdersLoadingComponent.classList.add('hide');
        this.refreshButton.classList.remove('disabled');
        this.isLoading = false;
    }

    onRangeChange = (evt: MouseEvent) => {

        const rangeValue = parseInt((evt.target as HTMLInputElement).value);

        this.range = rangeValue;
        this.rangeDisplay.innerText = this.range.toString();

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

        await this.orderService.accept(this.activeOrderContext.id);

        this.activateMyOrdersTab();
    }

    onCancelAccept = () => {
        this.confirmAcceptOrderModal.toggle();
    }

    onOrderAccept = () => {

        setTimeout(() => {

            const orderUnion = {
                order: this.activeOrderContext
            };

            this.renderPartial(<fragment>
                <Center>
                    <h5 class="material-align-middle">
                        <i class="material-icons order-card-icon">fingerprint</i> <code>{orderUnion.order.id.substring(0, 6)}</code>
                    </h5>
                </Center>
                <br />
                {st.t("Are you sure, you want to accept this request? It is very frustrating for the other person, if it doesn't work out.")}

                {st.t("The following would have to be bought for the person:")}

                <h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">shopping_cart</i>&nbsp;{st.t("Items")}
                </span>
                </h5>

                <div class="row">
                    <ul>
                        {orderUnion.order.items.map((orderItem: any) => <li>
                            &ndash; {orderItem.description}
                        </li>)}
                    </ul>
                </div>

                {orderUnion.order.hint.trim() ? <fragment>
                    <h5><span class="material-align-middle">
                        <i class="material-icons order-card-icon">speaker_notes</i>&nbsp;{st.t("Notes")}
                </span>
                    </h5>

                    <p>{orderUnion.order.hint}</p>
                </fragment> : null}

                {orderUnion.order.max_price ? <fragment><h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">monetization_on</i>&nbsp;{st.t("Maximum budget")}
                </span>
                </h5>

                <p>{st.t("The request is allowed to cost")} <strong>{st.t("at most")} {orderUnion.order.max_price} (€) {st.t("/verb/cost.")}.</strong></p></fragment> : ''}

            </fragment>, this.confirmOrderItemListContainer);

            this.confirmAcceptOrderModal.toggle();
        }, 150)
    }

    onOrderClick = async (evt: MouseEvent) => {

        const card = ((evt.target as HTMLElement).closest('.order-card-container') as HTMLElement);
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
        this.activeCard = card;

        const currentPosition = await this.geoService.getCurrentLocation();

        // set center of map according to pickup location
        if (this.activeOrderContext.dropoff_location) {
            this.updateMap({
                lat: this.activeOrderContext.dropoff_location.latitude,
                lng: this.activeOrderContext.dropoff_location.longitude
            });
        } else {

            this.updateMap({
                lat: currentPosition.latitude,
                lng: currentPosition.longitude
            });
        }

        // activate card
        this.toggleCardActivation(card);

        // open modal for accept
        this.onOrderAccept();
    }
}