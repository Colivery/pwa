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
import {address} from "../../../validators/address";
import {UserService} from "../../../service/user";
import { EsriMap } from "../../../component/esri/EsriMap";

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
    map: EsriMap;

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

    addressValidator = () => {
        return address(this.geoService, this, async(geolocation) => {
            await this.map.removeAllMarkers();
            const latitude = parseFloat(geolocation.lat);
            const longitude = parseFloat(geolocation.lon);
            await this.map.setCenter(latitude, longitude);
            await this.map.addMarker(latitude, longitude, require('../../../../assets/images/map_marker.png'), 20, 25);
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

                await this.userService.upsertUserProfile({ 
                    phone: formState.phone,
                    first_name: formState.first_name,
                    last_name: formState.last_name,
                    address: formState.address,               
                    geo_location: this.userGeoLocation
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
