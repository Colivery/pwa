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
import {validatorNameFactory} from "springtype/core/validate/function/validator-name-factory";
import {Feature} from "ol";
import {MatInput} from "../../../component/mat/mat-input";

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

    oldMarker: Feature;

    onAfterRender(hasDOMChanged: boolean): void {
        this.olMapRef.init();

    }

    buffer = (fn: Function, buffer: number = 500): Function => {
        return () => {
            return new Promise((resolve => {
                clearTimeout(this.lookupTimeout);
                this.lookupTimeout = setTimeout(() => {
                    fn(resolve)
                }, buffer);
            }))
        };
    };

    addressValidator = validatorNameFactory(async (value: string) => {
        const geocodeBuffered = this.buffer(async (callback: Function) => {
            const sanitizedValue = value.split('\n').join(' ');
            st.debug('address value sanitizedValue', value, sanitizedValue );
            const geoCoordinates = await this.geoService.forwardGeoCode(sanitizedValue);

            if (geoCoordinates && geoCoordinates[0]) {
                this.userGeoLocation = {
                    lat: geoCoordinates[0].lat,
                    lon: geoCoordinates[0].lon
                };

                st.debug('userGeoLocation', this.userGeoLocation);

                st.debug('lat lng',this.userGeoLocation.lat,this.userGeoLocation.lon);
                this.olMapRef.setCenter(this.userGeoLocation.lat,this.userGeoLocation.lon);
                this.olMapRef.removeMarker(this.oldMarker);
                this.oldMarker = this.olMapRef.setMarker(this.userGeoLocation.lat,this.userGeoLocation.lon);
                this.latInputRef.value = this.userGeoLocation.lat;
                this.lngInputRef.value = this.userGeoLocation.lon;
                callback(true);
            } else {

                st.debug('invalid');
                callback(false);
            }
        });
        return geocodeBuffered();
    }, 'address');

    getFormData(): IRegisterUserAddressFormState {
        return this.formRef.getState() as any as IRegisterUserAddressFormState;
    }

    async onNextClick() {
        try {

            if (await this.formRef.validate()) {
                const data = this.getFormData();

                this.formRef.reset();

                await this.registerService.createUserProfileComplete(data);

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
