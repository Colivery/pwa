import "./register-user-address.scss";

import {GeoService} from "../../../service/geocoding";
import {MatTextarea} from "../../../component/mat/mat-textarea";
import {st} from "springtype/core";
import {inject} from "springtype/core/di";
import {component} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import {ref} from "springtype/core/ref";
import {Form, Input} from "springtype/web/form";
import tpl, {IRegisterUserAddressFormState} from "./register-user-address.tpl";
import {RegisterChooseProfile} from "../register-choose-profile/register-choose-profile";
import {RegisterService} from "../../../service/register";
import {ErrorMessage} from "../../../component/error-message/error-message";
import {OlMap} from "../../../component/ol-map/ol-map";
import {address} from "../../../validatoren/address";

@component({
    tpl
})
export class RegisterUserAddressPage extends st.component implements ILifecycle {
    static ROUTE = "register-user-address";

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
    addressField: MatTextarea;

    class = ['wrapper', 'valign-wrapper'];

    lookupTimeout: any;

    userGeoLocation: any;

    onAfterRender(hasDOMChanged: boolean): void {
        this.olMapRef.init();
    }

    addressValidator = () => {
        return address(this.geoService, this, (geolocation) => {
            this.olMapRef.removeAllMarker();
            this.olMapRef.setCenter(parseFloat(geolocation.lat),parseFloat(geolocation.lon));
            this.olMapRef.setMarker(parseFloat(geolocation.lat),parseFloat(geolocation.lon));
           this.userGeoLocation = geolocation;
        });
    };

    getFormData(): IRegisterUserAddressFormState {
        return this.formRef.getState() as any as IRegisterUserAddressFormState;
    }

    async onNextClick() {
        try {

            if (await this.formRef.validate()) {
                const data = this.getFormData();

                this.formRef.reset();

                const location = this.registerService.getGeoPoint(this.userGeoLocation.lat, this.userGeoLocation.lon);

                await this.registerService.createUserProfileComplete({...data, geo_location: location});

                st.debug('register user address data', data);
                st.route = {
                    path: RegisterChooseProfile.ROUTE
                };
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
    }

}
