import "./user-profile.scss";

import {st} from "springtype/core";
import {component, state} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl, {IUserProfileFromState} from "./user-profile.tpl";
import {ConsumerOrderAddPage} from "../consumer-order-add/consumer-order-add";
import {inject} from "springtype/core/di";
import {ref} from "springtype/core/ref";
import {Form, Input} from "springtype/web/form";
import {ErrorMessage} from "../../component/error-message/error-message";
import {GeoService} from "../../service/geocoding";
import {OlMap} from "../../component/ol-map/ol-map";
import {MatModal} from "../../component/mat/mat-modal";
import {MatLoadingIndicator} from "../../component/mat/mat-loading-indicator";
import {address} from "../../validatoren/address";
import {UserService} from "../../service/user";
import {IUserProfileResponse} from "../../datamodel/user";

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
    olMapRef: OlMap;

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

    onAfterRender(hasDOMChanged: boolean): void {
        if (this.state) {
            this.olMapRef.init();
            this.addressValidator()(this.state.address)
        }
    }

    addressValidator = () => {
        return address(this.geoService, this, (geolocation) => {
            this.olMapRef.removeAllMarker();
            const latitude = parseFloat(geolocation.lat);
            const longitude = parseFloat(geolocation.lon);
            this.olMapRef.setCenter(latitude, longitude);
            this.olMapRef.setMarker(latitude, longitude);
            this.userGeoLocation = {latitude, longitude};
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
                st.debug('userProfile', formState);

                await this.userService.upsertUserProfile({
                    phone: formState.phone,
                    name: formState.name,
                    address: formState.address,
                    accepted_support_inquiry: formState.accepted_support_inquiry                    ,
                    geo_location: this.userGeoLocation,
                    //TODO: maybe change this have to be true!
                    accepted_privacy_policy: true,
                    accepted_terms_of_use: true,
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
        console.log('profile',);
    }

    onAfterInitialRender() {
        this.loadingIndicator.toggle();
    }
}
