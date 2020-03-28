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
import {ErrorMessage} from "../../../component/error-message/error-message";
import {OlMap} from "../../../component/ol-map/ol-map";
import {address} from "../../../validators/address";
import {UserService} from "../../../service/user";

@component({
    tpl
})
export class RegisterUserAddressPage extends st.component implements ILifecycle {
    static ROUTE = "register-user-address";

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
    addressField: MatTextarea;

    class = ['wrapper', 'valign-wrapper'];

    lookupTimeout: any;

    userGeoLocation: {
        latitude: number;
        longitude: number;
    };


    onAfterRender(): void {
        this.olMapRef.init();
    }

    addressValidator = () => {
        return address(this.geoService, this, (geolocation) => {
            this.olMapRef.removeAllMarker();
            const latitude = parseFloat(geolocation.lat);
            const longitude = parseFloat(geolocation.lon);
            this.olMapRef.setCenter(latitude, longitude);
            this.olMapRef.addMarker(latitude, longitude);
            this.userGeoLocation = {latitude, longitude};

        });
    };

    getFormData(): IRegisterUserAddressFormState {
        return this.formRef.getState() as any as IRegisterUserAddressFormState;
    }

    async onNextClick() {
        try {

            if (await this.formRef.validate()) {
                const formState = this.getFormData() as IRegisterUserAddressFormState;

                this.formRef.reset();

                await this.userService.upsertUserProfile({ phone: formState.phone,
                    name: `${formState.firstname} ${formState.lastname}`,
                    address: formState.address,
                    accepted_support_inquiry: formState.accepted_support_inquiry                    ,
                    geo_location: this.userGeoLocation,
                    is_support_member: false,
                    //TODO: maybe change this have to be true!
                    accepted_privacy_policy: true,
                    accepted_terms_of_use: true,
                });

                st.debug('register user address data', formState);
                st.route = {
                    path: RegisterChooseProfile.ROUTE
                };
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
    }

}
