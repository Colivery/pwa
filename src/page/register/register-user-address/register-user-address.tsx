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
import { address } from "../../../validators/address";
import { UserService } from "../../../service/user";
import { COLOR_COLIVERY_PRIMARY } from "../../../config/colors";
import { calculateAvailableHeightPercent } from "../../../function/calculate-available-height-percent";
import { Form, MatLoaderCircle } from "st-materialize";

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

    validatedUserAddress: string;

    class = ['wrapper', 'valign-wrapper'];

    addressValidator = () => {


        return address(this.geoService, this, async (geolocation: any, address: string) => {
            this.userGeoLocation = geolocation;

            console.log('addressValidator called')
            // render/update static map image
            const mapSrc = this.geoService.getStaticMapImageSrc(address, {
                ...geolocation,
                lable: st.t("You are here"),
                color: COLOR_COLIVERY_PRIMARY
            }, this.staticMapImage.closest('.row').clientWidth, calculateAvailableHeightPercent(20), 15);

            this.staticMapImage.setAttribute('src', mapSrc);

            // render/update validated address display
            this.validatedUserAddress = address;

            this.renderPartial(this.validatedUserAddress, this.addressField);

            // hide loaders, show map
            this.mapContainer.classList.remove('hide');
            this.matLoaderCircle.setVisible(false);
        });
    };

    getDataToSave = () => {
        const formState = this.formRef.getState() as any as IRegisterUserAddressFormState;
        return {
            first_name: formState.first_name,
            phone: formState.phone,
            last_name: formState.last_name,
            address: this.validatedUserAddress,
            geo_location: {
                latitude: this.userGeoLocation.lat,
                longitude: this.userGeoLocation.lng
            }
        }
    }

    async onNextClick() {
        try {

            if (await this.formRef.validate(true)) {

                await this.userService.upsertUserProfile(this.getDataToSave());

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
