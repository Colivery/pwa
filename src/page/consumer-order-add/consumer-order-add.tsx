import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl from "./consumer-order-add.tpl";
import "./consumer-order-add.scss";
import { inject } from "springtype/core/di";
import { GeoService } from "../../service/geo";
import { ref } from "springtype/core/ref";
import { MatInput, MatModal, MatLoadingIndicator, MatTextArea } from "st-materialize";
import { ConsumerOrderListPage } from "../consumer-order-list/consumer-order-list";
import { OrderService } from "../../service/order";
import { OrderStatus } from "../../datamodel/order-status";
import { OrderItemStatus } from "../../datamodel/order-item-status";
import { Shop } from "../../datamodel/shop";
import { EsriMap } from "../../component/esri/EsriMap";
import { tsx } from "springtype/web/vdom";
import { UserService } from "../../service/user";
import { GPSLocation } from "../../datamodel/gps-location";
import { OrderItem } from "../../datamodel/order";

@component({
    tpl
})
export class ConsumerOrderAddPage extends st.component implements ILifecycle {

    static ROUTE = "consumer-order-add";

    @inject(GeoService)
    geoService: GeoService;

    @inject(OrderService)
    orderService: OrderService;

    @inject(UserService)
    userService: UserService;

    @ref
    locationField: MatInput;

    @ref
    loadingIndicator: MatLoadingIndicator;

    @ref
    articleDescription: MatTextArea;

    @ref
    olMapRef: EsriMap;

    @ref
    dontCareForLocationSwitch: HTMLInputElement;

    @ref
    confirmCreateOrderModal: MatModal;

    @ref
    warnAtLeastOneItemModal: MatModal;

    @ref
    hintField: MatTextArea;

    @ref
    orderListContainer: HTMLElement;

    @ref
    maxPriceField: MatInput;

    @ref
    addOrderButton: HTMLElement;

    lookupTimeout: any;
    pickupLat = 0;
    pickupLon = 0;
    locationOptions: Array<Shop> = [];
    isLoading: boolean = false;
    selectedLocationType: string = 'supermarket';
    oldMarker: any;
    doesNotCareForLocation: boolean = false;
    selectedLocation: Shop;
    orderItems = [];
    activeShopTypeCard: HTMLElement;

    activateShopType = (evt: MouseEvent) => {

        if (this.activeShopTypeCard) {
            this.activeShopTypeCard.classList.remove('active');
        }

        this.activeShopTypeCard = (evt.target as HTMLElement).closest('.shop-card');
        this.activeShopTypeCard.classList.add('active');
    };

    buffer = (fn: Function, buffer: number = 1000): Function => {
        return () => {
            clearTimeout(this.lookupTimeout);
            this.lookupTimeout = setTimeout(fn, buffer);
        };
    }

    onToggleDontCareForLocationSwitch = () => {
        this.doesNotCareForLocation = this.dontCareForLocationSwitch.checked;
    }

    /*
    onLocationKeyUp = () => {
        const searchTerm = (this.locationField as any).el.querySelector('input').value;

        if (searchTerm.length < 3) return;

        const searchForPlacesBuffered = this.buffer(async () => {

            this.isLoading = true;
            this.loadingIndicator.setVisible(true);

            const currentLocation = await this.geoService.getCurrentLocation();
            this.locationOptions = await this.geoService.forwardLocalPlacesSearch(searchTerm);
            this.locationOptions = this.locationOptions.map((locationOption) => {

                // on-the-fly distance calculation
                locationOption.distance = this.geoService.getDistanceKm(currentLocation.latitude, currentLocation.longitude, locationOption.lat, locationOption.lon);

                return locationOption;
            });

            this.isLoading = false;
            this.loadingIndicator.setVisible(false);
        });
        searchForPlacesBuffered();
    }
    */

    onLocationOptionSelect = (evt: MouseEvent) => {

        const locationOptionIndex = parseInt((evt.target as HTMLElement).closest('a').getAttribute('data-index'), 10);
        const locationOption = this.locationOptions[locationOptionIndex];
        this.locationOptions = [];

        this.selectedLocationType = locationOption.shop;
        this.selectedLocation = locationOption;

        this.updateMapMarker();
    }

    updateMapMarker() {
        if (this.selectedLocation && this.olMapRef) {

            this.olMapRef.setCenter(this.selectedLocation.lat, this.selectedLocation.lon);

            this.olMapRef.removeMarker(this.oldMarker);

            this.oldMarker = this.olMapRef.addMarker(this.selectedLocation.lat, this.selectedLocation.lon, require('../../../assets/images/map_marker.png'), 20, 25);
        }
    }

    onCreateOrderButtonClick = () => {

        // UX improvement: apply last written item
        if (this.articleDescription.textAreaRef.value.length > 0) {
            this.onOrderItemAddClick();
        }

        if (this.orderItems.length === 0) {
            this.warnAtLeastOneItemModal.toggle();
            return;
        }


        console.log('confirmCreateOrderModal', this.confirmCreateOrderModal);
        // open modal
        this.confirmCreateOrderModal.toggle();
    }

    renderOrderListContainer() {

        this.renderPartial(this.orderItems.map((orderItem, index) => <div data-index={index} class="row">
            <div class="col s11 truncate" style={{ lineHeight: '30px' }}>
                {orderItem.description}
            </div><div class="col s1">
                <a class="btn-floating btn-small waves-effect waves-light red  mat-align-middle" style={{ left: '-20px' }} onClick={this.onOrderItemRemoveClick}><i class="material-icons">delete</i></a>
            </div></div>) as any, this.orderListContainer);
    }

    articleDescriptionKeyDown = (event: KeyboardEvent) => {

        /*
        if (event.key === "Enter") {
            setTimeout(() => {
                this.onOrderItemAddClick();
            }, 100)
        }
        */
    }

    onOrderItemAddClick = () => {

        this.orderItems.push({
            description: this.articleDescription.textAreaRef.value
        });

        // reset value
        this.articleDescription.textAreaRef.value = '';

        this.renderOrderListContainer();

        this.articleDescription.textAreaRef.focus();
    }

    onOrderItemRemoveClick = (evt: MouseEvent) => {

        const orderItemIndex = parseInt((evt.target as HTMLElement).closest('.row').getAttribute('data-index'), 10);

        this.orderItems.splice(orderItemIndex, 1);

        this.renderOrderListContainer();

        this.articleDescription.textAreaRef.focus();
    }

    onReallyCreateOrderClick = async () => {

        this.addOrderButton.classList.add('disabled');

        const localUserData = await this.userService.getUserProfile();
        const maxPrice = parseInt((this.el.querySelector('input[name=maxPrice]') as HTMLInputElement).value, 10);

        // TODO: move to Service API
        const dropoffLocationGeohash = this.geoService.getGeoHash(
            localUserData.geo_location.latitude, localUserData.geo_location.longitude, 5
        );

        let pickupAddress: string;
        let pickupLocation: GPSLocation;
        let shopName: string;
        let pickupLocationGeohash: string;

        // optional selected location (otherwise determined by matching service API)
        if (this.selectedLocation) {
            pickupAddress = `${this.selectedLocation.street} ${this.selectedLocation.houseNumber}, ${this.selectedLocation.postcode} ${this.selectedLocation.city}`;
            pickupLocation = {
                "latitude": this.selectedLocation.lat,
                "longitude": this.selectedLocation.lon
            };
            shopName = this.selectedLocation.name;
            pickupLocationGeohash = this.geoService.getGeoHash(pickupLocation.latitude, pickupLocation.longitude, 5);
        }

        await this.orderService.createOrder({
            /*
            "pickup_address": pickupAddress, // leer
            "pickup_location": pickupLocation, // leer
            "pickup_location_geohash": pickupLocationGeohash, // leer
            "shop_name": shopName, // leer
            */
            "max_price": maxPrice,
            "shop_type": this.selectedLocationType,
            "status": OrderStatus.TO_BE_DELIVERED,
            "hint": this.hintField.textAreaRef.value,
            "dropoff_location_geohash": dropoffLocationGeohash, // TODO: move to Service API
            "dropoff_location": {
                "latitude": localUserData.geo_location.latitude,
                "longitude": localUserData.geo_location.longitude
            },
            "items": this.orderItems.map((orderItem: OrderItem) => {
                orderItem.status = OrderItemStatus.TODO;
                return orderItem;
            }).filter((orderItem: OrderItem) => !!orderItem.description)
        });

        // close modal
        this.confirmCreateOrderModal.toggle();

        this.addOrderButton.classList.remove('disabled');

        this.orderItems = [];
        this.renderOrderListContainer();
        (this.maxPriceField.inputRef).value = '';
        (this.articleDescription.textAreaRef).value = '';
        (this.hintField.textAreaRef).value = '';

        st.route = {
            path: ConsumerOrderListPage.ROUTE
        }
    }

    async onAfterRender() {

        if (this.olMapRef) {
            this.updateMapMarker();
        }
    }
}
