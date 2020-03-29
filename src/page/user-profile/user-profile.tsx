import "./user-profile.scss";

import { st } from "springtype/core";
import { component, state } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl, { IUserProfileFromState } from "./user-profile.tpl";
import { ConsumerOrderAddPage } from "../consumer-order-add/consumer-order-add";
import { inject } from "springtype/core/di";
import { ref } from "springtype/core/ref";
import { Form, Input } from "springtype/web/form";
import { ErrorMessage } from "../../component/error-message/error-message";
import { GeoService } from "../../service/geocoding";
import { MatModal } from "../../component/mat/mat-modal";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { address } from "../../validators/address";
import { UserService } from "../../service/user";
import { IUserProfileResponse } from "../../datamodel/user";
import { EsriMap } from "../../component/esri/EsriMap";

@component({
    tpl
})
export class UserProfile extends st.component implements ILifecycle {

    static ROUTE = "user-profile";

    @inject(UserService)
    userService: UserService;

    @inject(GeoService)
    geoService: GeoService;

    @ref
    formRef: Form;

    @ref
    map: EsriMap;

    @ref
    latInputRef: Input;

    @ref
    lngInputRef: Input;

    @ref
    errorMessage: ErrorMessage;

    @ref
    afterSaveModal: MatModal;

    @state
    state: IUserProfileResponse;

    @ref
    loadingIndicator: MatLoadingIndicator;

    lookupTimeout: any;

    userGeoLocation: {
        latitude: number;
        longitude: number;
    };

    constructor() {
        super();
        this.loadData()
    }

    onAfterRender(): void {
        if (this.state) {
            this.addressValidator()(this.state.address)
        }
    }

    addressValidator = () => {
        return address(this.geoService, this, async(geolocation) => {
            await this.map.removeAllMarkers();
            const latitude = parseFloat(geolocation.lat);
            const longitude = parseFloat(geolocation.lon);
            await this.map.setCenter(latitude, longitude);
            await this.map.addMarker(latitude, longitude, require('../../../assets/images/map_marker.png'), 20, 25);
            this.userGeoLocation = { latitude, longitude };
        });
    };

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    };

    updateUserProfile = async () => {
        try {
            this.loadingIndicator.toggle();
            if (await this.formRef.validate()) {
                const formState = this.formRef.getState() as any as IUserProfileFromState;

                console.log('formState before save', formState);

                await this.userService.upsertUserProfile({
                    phone: formState.phone,
                    first_name: formState.first_name,
                    last_name: formState.last_name,
                    address: formState.address,
                    geo_location: this.userGeoLocation
                });

                this.afterSaveModal.toggle();
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
        this.loadingIndicator.toggle();
    };

    private async loadData() {
        this.state = await this.userService.getUserProfile();
        console.log('this.state', this.state);
        this.doRender();
    }

    onAfterInitialRender() {
        this.loadingIndicator.toggle();
    }
}
