import "./user-profile.scss";

import {st} from "springtype/core";
import {component, state} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./user-profile.tpl";
import {ConsumerOrderAddPage} from "../consumer-order-add/consumer-order-add";
import {inject} from "springtype/core/di";
import {RegisterService} from "../../service/register";
import {IUserProfile} from "../../datamodel/user";
import {ref} from "springtype/core/ref";
import {Form, Input} from "springtype/web/form";
import {ErrorMessage} from "../../component/error-message/error-message";
import {GeoService} from "../../service/geocoding";
import {OlMap} from "../../component/ol-map/ol-map";
import {MatModal} from "../../component/mat/mat-modal";
import {MatLoadingIndicator} from "../../component/mat/mat-loading-indicator";
import {address} from "../../validatoren/address";

@component({
    tpl
})
export class UserProfile extends st.component implements ILifecycle {

    static ROUTE = "user-profile";

    @inject(RegisterService)
    registerService: RegisterService;

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
    state: IUserProfile;

    @ref
    loadingIndicator: MatLoadingIndicator;

    userId!: string;

    lookupTimeout: any;

    userGeoLocation: any;

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
            this.olMapRef.setCenter(parseFloat(geolocation.lat), parseFloat(geolocation.lon));
            this.olMapRef.setMarker(parseFloat(geolocation.lat), parseFloat(geolocation.lon));
            this.userGeoLocation = geolocation;
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
                const formState = this.formRef.getState() as any;
                st.debug('userProfile', formState);

                delete formState.id;
                const location = this.registerService.getGeoPoint(this.userGeoLocation.lat, this.userGeoLocation.lon);

                await this.registerService.updateProfile({...formState as IUserProfile, geo_location: location});

                this.afterSaveModal.toggle();
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
        this.loadingIndicator.toggle();
    };

    private async loadData() {
        this.userId = this.registerService.getUserId();
        this.state = await this.registerService.getUserProfile();
        console.log('profile',);
    }

    onAfterInitialRender() {
        this.loadingIndicator.toggle();
    }
}
