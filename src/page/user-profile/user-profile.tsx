import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl, { IUserProfileFromState } from "./user-profile.tpl";
import { inject } from "springtype/core/di";
import { ref } from "springtype/core/ref";
import { Form, Input } from "springtype/web/form";
import { ErrorMessage } from "../../component/error-message/error-message";
import { GeoService } from "../../service/geo";
import { MatModal } from "../../component/mat/mat-modal";
import { MatLoadingIndicator } from "../../component/mat/mat-loading-indicator";
import { address } from "../../validators/address";
import { UserService } from "../../service/user";
import { IUserProfileResponse, UserProfile } from "../../datamodel/user";
import { calculateAvailableHeightPercent } from "../../function/calculate-available-height-percent";
import { COLOR_COLIVERY_PRIMARY } from "../../config/colors";
import { MatLoaderCircle } from "../../component/mat/mat-loader-circle";
import { tsx } from "springtype/web/vdom";
import { MatInput } from "st-materialize";
import { required, email } from "springtype/core/validate";
import { MatTextarea } from "../../component/mat/mat-textarea";

@component({
    tpl
})
export class UserProfilePage extends st.component implements ILifecycle {

    static ROUTE = "user-profile";

    @inject(UserService)
    userService: UserService;

    @inject(GeoService)
    geoService: GeoService;

    @ref
    formRef: Form;

    @ref
    errorMessage: ErrorMessage;

    @ref
    afterSaveModal: MatModal;

    state: IUserProfileResponse;

    @ref
    loadingIndicator: MatLoadingIndicator;

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

    @ref
    formContainer: HTMLElement;

    userGeoLocation: {
        lat: number;
        lng: number;
    };

    validatedUserAddress: string;

    onRouteEnter() {
        this.loadData();
    }

    onAfterRender(): void {
        this.loadingIndicator.toggle();
        if (this.state) {
            this.addressValidator()(this.state.address)
        }
    }

    addressValidator = () => {
        return address(this.geoService, this, async (geolocation: any, address: string) => {

            this.userGeoLocation = geolocation;

            // render/update static map image
            const mapSrc = this.geoService.getStaticMapImageSrc(address, {
                ...geolocation,
                lable: 'Hier bist Du',
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

    getDataToSave = (): UserProfile => {
        const formState = this.formRef.getState() as any as IUserProfileFromState;
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

    updateUserProfile = async () => {
        try {
            this.loadingIndicator.toggle();
            if (await this.formRef.validate()) {

                await this.userService.upsertUserProfile(this.getDataToSave());
                this.afterSaveModal.toggle();
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
        this.loadingIndicator.toggle();
    };

    private async loadData() {
        this.state = await this.userService.getUserProfile();

        this.renderPartial(
            <Form ref={{ formRef: this }}>
                {this.getFormInputs()}
            </Form>, this.formContainer)
    }


    getFormInputs() {
        return <fragment>
            <MatInput name="email" label="E-Mail"
                class={['col', 's12', 'm6']}
                disabled={true}
                helperText="Deine E-Mail-Adresse"
                validators={[required, email]}
                value={this.state.email}
                validationErrorMessages={{
                    required: 'Das ist ein Pflichtfeld',
                    'email': 'Keine gültige E-Mail'
                }}>
            </MatInput>
            <MatInput name="first_name" label="Vorname"
                class={['col', 's6', 'm3']}
                helperText="z.B. Max"
                validators={[required]}
                value={this.state.first_name}
                validationErrorMessages={{
                    required: 'Das ist ein Pflichtfeld'
                }}>
            </MatInput>

            <MatInput name="last_name" label="Nachname"
                class={['col', 's6', 'm3']}
                helperText="z.B. Mustermann"
                validators={[required]}
                value={this.state.last_name}
                validationErrorMessages={{
                    required: 'Das ist ein Pflichtfeld'
                }}>
            </MatInput>
            <MatInput name="phone" label="Phone"
                class={['col', 's12', 'm6']}
                helperText="Enter your phone number here"
                validators={[required]}
                value={this.state.phone}
                validationErrorMessages={{
                    required: 'Das ist ein Pflichtfeld'
                }}>
            </MatInput>
            <MatTextarea ref={{ addressRef: this }} name="address" label="Wohl/Lieferadresse"
                class={['col', 's12', 'm6']}
                rows={2}
                helperText="Wohin die Fahrer*in kommen soll"
                validators={[required, this.addressValidator()]}
                value={this.state.address}
                errorMessage={{
                    required: 'Das ist ein Pflichtfeld',
                    address: 'Diese Adresse können wir nicht verstehen'
                }}>
            </MatTextarea>
            <div class={['col', 's12', 'hide']} ref={{ mapContainer: this }}>

                <center>
                    <strong>Wir haben folgende Adresse erkannt:<br /></strong>

                    <span ref={{ addressField: this }}></span>
                    <img class="static-map" ref={{ staticMapImage: this }} />
                </center>

            </div>

            <MatLoaderCircle ref={{ matLoaderCircle: this }} class={['col', 's12',]} />
        </fragment>
    }
}
