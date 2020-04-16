import "./register-user-address.scss";

import { GeoService } from "../../../service/geo";
import { st } from "springtype/core";
import { inject } from "springtype/core/di";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import { ref } from "springtype/core/ref";
import tpl, { IRegisterUserAddressFormState } from "./register-user-address.tpl";
import { RegisterChooseProfile } from "../register-choose-profile/register-choose-profile";
import { ErrorMessage } from "../../../component/error-message/error-message";
import { address, IAddress } from "../../../validators/address";
import { UserService } from "../../../service/user";
import { COLOR_COLIVERY_PRIMARY } from "../../../config/colors";
import { calculateAvailableHeightPercent } from "../../../function/calculate-available-height-percent";
import { MatForm, MatLoaderCircle } from "st-materialize";
import { IUserProfileRequest } from "../../../datamodel/user";

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
    formRef: MatForm;

    @ref
    errorMessage: ErrorMessage;

    @ref
    addressField: HTMLElement;

    @ref
    staticMapImage: HTMLElement;

    @ref
    mapContainer: HTMLElement;

    @ref
    matLoaderCircle: MatLoaderCircle;

    @ref
    submitButton: HTMLElement;

    userGeoLocation: {
        lat: number;
        lng: number;
    };

    validatedUserAddress: IAddress;

    class = ['wrapper', 'valign-wrapper'];

    addressValidator = () => {


        return address(this.geoService, this, async (geolocation: any, address: IAddress) => {
            this.userGeoLocation = geolocation;

            // render/update static map image
            const mapSrc = this.geoService.getStaticMapImageSrc(address.formatted, {
                ...geolocation,
                lable: st.t("You are here"),
                color: COLOR_COLIVERY_PRIMARY
            }, this.staticMapImage.closest('.row').clientWidth, calculateAvailableHeightPercent(20), 15);

            this.staticMapImage.setAttribute('src', mapSrc);

            // render/update validated address display
            this.validatedUserAddress = address;

            this.renderPartial(this.validatedUserAddress.formatted, this.addressField);

            // hide loaders, show map
            this.mapContainer.classList.remove('hide');
            this.matLoaderCircle.setVisible(false);
        });
    };

    getDataToSave = (): IUserProfileRequest => {
        const formState = this.formRef.getState() as any as IRegisterUserAddressFormState;
        return {
            email: window.authService.getEmail(),
            firstName: formState.first_name,
            phone: formState.phone,
            lastName: formState.last_name,
            street: this.validatedUserAddress.street,
            streetNo: this.validatedUserAddress.streetNo,
            zipCode: this.validatedUserAddress.zipCode,
            city: this.validatedUserAddress.city,
            location: {
                latitude: this.userGeoLocation.lat,
                longitude: this.userGeoLocation.lng
            }
        }
    }

    async onNextClick() {
        try {

            if (await this.formRef.validate(true)) {

                this.submitButton.classList.add('disabled');

                console.log('user data', this.getDataToSave());
                await this.userService.createUserProfile(this.getDataToSave());

                this.formRef.reset();

                st.route = {
                    path: RegisterChooseProfile.ROUTE
                };
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
    }
}
