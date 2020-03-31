import "./driver-order-list.scss";

import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./driver-order-list.tpl";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { ref } from "springtype/core/ref";
import { inject } from "springtype/core/di";
import { MatchingService } from "../../service/matching";
import { GeoService } from "../../service/geo";
import { OrderService } from "../../service/order";
import { UserService } from "../../service/user";
import { tsx } from "springtype/web/vdom";
import { IVirtualNode } from "springtype/web/vdom/interface";
import { MatModal } from "../../component/mat/mat-modal";
import { formatDate } from "../../function/formatDate";
import { COLOR_COLIVERY_PRIMARY } from "../../config/colors";
import { calculateAvailableHeightPercent } from "../../function/calculate-available-height-percent";

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
    openOrdersDisplayData = [];
    myOrdersDisplayData = [];
    activeOrderContext: any;
    mySelectedOrderUnion;

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
            lable: 'Hier bist Du',
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

        const currentPosition = await this.geoService.getCurrentLocation();
        const serviceResonse = await this.engineService.search(currentPosition.latitude, currentPosition.longitude, this.range);

        const unionOrders = [];
        const ownUserProfile = await this.userService.getUserProfile();

        for (let order of (await serviceResonse.data).orders) {

            // TODO: remove when created and updated is in place
            /*
            const orderData = await this.orderService.getById(order.id);

            order = {
                ...order,
                ...orderData
            }*/

            // do not allow to self-assign; don't even show own orders
            if (ownUserProfile.user_id !== order.user_id) {
                unionOrders.push(order);
            }
        }

        unionOrders.sort((orderA, orderB) => orderA.created > orderB.created ? 1 : -1);

        this.openOrdersDisplayData = unionOrders;

        this.openOrdersScrollContainer.innerHTML = '';

        this.renderOpenOrders();

        this.openOrdersScrollContainer.classList.remove('hide');
        this.loadingIndicator.setVisible(false);
        this.openOrdersLoadingComponent.classList.add('hide');
        this.refreshButton.classList.remove('disabled');
        this.isLoading = false;
    }

    renderOpenOrders = () => {

        if (this.openOrdersDisplayData.length === 0) {
            this.openOrdersScrollContainer.innerHTML = '<p><center><strong>Klasse, es gibt nichts zu tun 👍</strong></center></p>.';
            return;
        }

        st.render(this.openOrdersDisplayData.map((order: any) =>
            <a href="javascript:" class="order-card-container" data-id={order.id} onclick={this.onOrderClick}>
                <div class="order-card">
                    <div class="order-card-inner">
                        <div class="order-header">
                            Fahrer wird gesucht für:
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
                                <i class="material-icons order-card-icon">shopping_cart</i> {order.items.length} Teile
                            </div>
                        </div>
                        <div class="order-line">
                            <div class="material-align-middle truncate">
                                <i class="material-icons order-card-icon">fingerprint</i> <code>{order.id.substring(0, 6)}</code>
                            </div>
                        </div>
                        <a href="javascript:" data-id={order.id} onClick={this.onOrderAccept} class="btn material-align-middle success-button"><i class="material-icons">done</i> &nbsp;Auftrag Annehmen</a>
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.openOrdersScrollContainer)
    }

    renderMyOrders = () => {

        if (this.myOrdersDisplayData.length === 0) {
            this.myOrdersScrollContainer.innerHTML = '<p><center><strong>Du hast noch keine Fahrten.</strong></center></p>';
            return;
        }

        st.render(this.myOrdersDisplayData.map((orderUnion: any, index: number) =>
            <a href="javascript:" data-id={orderUnion.order.id}>
                <div class="order-card">
                    <div class="order-card-inner">
                        <div class={["order-header", "material-align-middle", "order-header-orange", orderUnion.order.status === 'delivered' ? "order-header-green" : '']}>
                            Auftrag: &nbsp; <i class="material-icons order-card-icon">fingerprint</i> <code>{orderUnion.order.id.substring(0, 6)}</code>
                        </div>
                        <h4 class="order-title truncate">
                            {/*order.shop_name*/}
                            <br />
                        </h4>

                        {orderUnion.order.status === 'delivered' ? <fragment><strong>🎉 ABGESCHLOSSEN 👍</strong> <hr /></fragment> : ''}

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
                                <i class="material-icons order-card-icon">shopping_cart</i> {orderUnion.order.items.length} Teile
                            </div>
                        </div>
                        <a href="javascript:" data-index={index} onClick={this.onOrderShowDetails} class="btn material-align-middle info-button"><i class="material-icons">visibility</i> &nbsp;Details</a>
                        {orderUnion.order.status !== 'delivered' ? <a href="javascript:" data-index={index} onClick={this.onOrderComplete} class="btn material-align-middle success-button"><i class="material-icons">done_all</i> &nbsp;Abschließen</a> : ''}
                        {orderUnion.order.status !== 'delivered' ? <a href="javascript:" data-index={index} onClick={this.onOrderDeclide} class="btn material-align-middle cancel-button"><i class="material-icons">cancel</i> &nbsp;Abbrechen</a> : ''}
                    </div>
                </div>
            </a>
        ) as unknown as IVirtualNode, this.myOrdersScrollContainer)
    }

    onOrderShowDetails = (evt: MouseEvent) => {

        const myOrdersDataIndex = parseInt((evt.target as HTMLElement).closest('a').getAttribute('data-index'));
        const orderUnion = this.myOrdersDisplayData[myOrdersDataIndex];

        this.myOrderDetailsContainer.innerHTML = '';

        st.render(<div class="container details-modal">

            <br />

            <h5><span class="material-align-middle"><i class="material-icons">location_on</i>&nbsp;Lieferadresse</span></h5>

            <div class="row">
                <strong>{orderUnion.creator.first_name} {orderUnion.creator.last_name}</strong><br />
                {orderUnion.creator.address} <br />
                <a href={`https://www.google.com/maps/place/${orderUnion.creator.address}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                    <span class="material-align-middle"><i class="material-icons">directions</i>&nbsp;Google Maps</span>
                </a>
            </div>

            <h5><span class="material-align-middle"><i class="material-icons">perm_contact_calendar</i>&nbsp;Kontakt</span></h5>

            <div class="row">

                <a href={`tel:${orderUnion.creator.phone}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                    <span class="material-align-middle"><i class="material-icons">call</i>&nbsp;{orderUnion.creator.phone}</span>
                </a><br />
                <a href={`mailto:${orderUnion.creator.email}`} target="_blank" style={{ marginTop: '10px' }} class="btn btn-small info-button">
                    <span class="material-align-middle"><i class="material-icons">email</i>&nbsp;{orderUnion.creator.email}</span>
                </a>
            </div>

            <h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">shopping_cart</i>&nbsp;Artikel
                </span>
            </h5>

            <div class="row">
                <ul>
                    {orderUnion.order.items.map((orderItem: any) => <li>
                        &ndash; {orderItem.description}
                    </li>)}
                </ul>
            </div>

            <h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">speaker_notes</i>&nbsp;Hinweise
                </span>
            </h5>

            <p>{orderUnion.order.hint}</p>

            {orderUnion.order.max_price ? <fragment><h5><span class="material-align-middle">
                <i class="material-icons order-card-icon">monetization_on</i>&nbsp;Maximalbetrag
                </span>
            </h5>

                <p>Der Einkauf darf <strong>maximal {orderUnion.order.max_price} (€) kosten.</strong></p></fragment> : ''}

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

    getMyOrderUnionByEvent(evt: MouseEvent) {
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

        this.myOrdersScrollContainer.innerHTML = '';

        const driverOwnOrders = await this.orderService.getDriverOwnOrders();

        driverOwnOrders.sort((orderA, orderB) => orderA.created > orderB.created ? 1 : -1);

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

            this.confirmOrderItemListContainer.innerHTML = '';

            const orderUnion = {
                order: this.activeOrderContext
            };

            st.render(<fragment>


                <h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">shopping_cart</i>&nbsp;Artikel
                </span>
                </h5>

                <div class="row">
                    <ul>
                        {orderUnion.order.items.map((orderItem: any) => <li>
                            &ndash; {orderItem.description}
                        </li>)}
                    </ul>
                </div>

                <h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">speaker_notes</i>&nbsp;Hinweise
                </span>
                </h5>

                <p>{orderUnion.order.hint}</p>

                {orderUnion.order.max_price ? <fragment><h5><span class="material-align-middle">
                    <i class="material-icons order-card-icon">monetization_on</i>&nbsp;Maximalbetrag
                </span>
                </h5>

                    <p>Der Einkauf darf <strong>maximal {orderUnion.order.max_price} (€) kosten.</strong></p></fragment> : ''}

            </fragment>, this.confirmOrderItemListContainer);

            this.confirmAcceptOrderModal.toggle();
        }, 50)
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
    }
}