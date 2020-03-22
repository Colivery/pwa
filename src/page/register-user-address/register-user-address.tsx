import "./register-user-address.scss";

import { st } from "springtype/core";
import { inject } from "springtype/core/di";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ref } from "springtype/core/ref";
import { Form } from "springtype/web/form";
import tpl, { IRegisterUserAddressFormState } from "./register-user-address.tpl";
import { LoginPage } from "../login/login";
import { RegisterService } from "../../service/register";
import { ErrorMessage } from "../../component/error-message/error-message";
import { FirebaseService } from "../../service/firebase";
import { GeoService } from "../../service/geocoding";
import { MatTextarea } from "../../component/mat/mat-textarea";

@component({
    tpl
})
export class RegisterUserAddressPage extends st.component implements ILifecycle {
    static ROUTE = "register-user-address";

    @inject(RegisterService)
    registerService: RegisterService;

    @inject(FirebaseService)
    firebaseService: FirebaseService;

    @inject(GeoService)
    geoService: GeoService;

    @ref
    formRef: Form;

    @ref
    errorMessage: ErrorMessage;

    @ref
    addressField: MatTextarea;

    class = ['wrapper', 'valign-wrapper'];

    lookupTimeout: any;

    userGeoLocation: any;

    buffer = (fn: Function, buffer: number = 500): Function => {
        return () => {
            clearTimeout(this.lookupTimeout);
            this.lookupTimeout = setTimeout(fn, buffer);
        };
    }

    onAddressKeyUp = async () => {

        const geocodeBuffered = this.buffer(async () => {

            const geoCoordinates = await this.geoService.forwardGeoCode(this.getFormData().address);

            if (geoCoordinates && geoCoordinates[0]) {
                this.userGeoLocation = {
                    lat: geoCoordinates[0].lat,
                    lon: geoCoordinates[0].lon
                };

                console.log('userGeoLocation', this.userGeoLocation)
                //this.addressField.inputRef.state.valid = true;
                // TODO: Validator
            } else {

                console.log('invalid')
                // TODO: Validator
            }
        });
        geocodeBuffered();
    }

    getFormData(): IRegisterUserAddressFormState {
        return this.formRef.getState() as any as IRegisterUserAddressFormState;
    }

    async onNextClick() {
        try {

            if (await this.formRef.validate()) {
                const data = this.getFormData();

                this.formRef.reset();

                await this.registerService.createUserProfileComplete(this.firebaseService.getLoggedInUserId(), data);

                st.debug('register user address data', data);
                st.route = {
                    path: LoginPage.ROUTE
                };
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
    }

}
