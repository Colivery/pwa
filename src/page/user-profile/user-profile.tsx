import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl, { IUserProfileFromState } from "./user-profile.tpl";
import { inject } from "springtype/core/di";
import { ref } from "springtype/core/ref";
import { ErrorMessage } from "../../component/error-message/error-message";
import { GeoService } from "../../service/geo";
import { MatModal, MatLoadingIndicator, MatLoaderCircle, MatTextArea, MatForm } from "st-materialize";
import { address } from "../../validators/address";
import { UserService } from "../../service/user";
import { IUserProfileResponse, UserProfile } from "../../datamodel/user";
import { calculateAvailableHeightPercent } from "../../function/calculate-available-height-percent";
import { COLOR_COLIVERY_PRIMARY } from "../../config/colors";
import { tsx } from "springtype/web/vdom";
import { MatInput } from "st-materialize";
import { required, email } from "springtype/core/validate";
import { LoginPage } from "../login/login";
import { I18nService } from "../../service/i18n";
import { SplashscreenService } from "../../service/splashscreen";
import { Center } from "../../component/center/center";

@component({
    tpl
})
export class UserProfilePage extends st.component implements ILifecycle {

    static ROUTE = "user-profile";

    @inject(SplashscreenService)
    splashscreenService: SplashscreenService;

    @inject(UserService)
    userService: UserService;

    @inject(GeoService)
    geoService: GeoService;

    @inject(I18nService)
    i18nService: I18nService;

    @ref
    formRef: MatForm;

    @ref
    errorMessage: ErrorMessage;

    @ref
    afterSaveModal: MatModal;

    @ref
    beforeUserDeleteModal: MatModal;

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
    matLoaderCirclePreFormLoad: MatLoaderCircle;

    @ref
    submitButton: HTMLAnchorElement;

    @ref
    formContainer: HTMLElement;

    @ref
    deleteButton: HTMLAnchorElement;

    userGeoLocation: {
        lat: number;
        lng: number;
    };

    validatedUserAddress: string;

    async onRouteEnter() {

        await this.loadData();

        if (this.matLoaderCirclePreFormLoad) {
            this.matLoaderCirclePreFormLoad.setVisible(false);
        }

        this.activateSubmitButton();
    }

    onAfterRender(): void {

        this.loadingIndicator.toggle();
        if (this.state) {

            this.activateSubmitButton();

            this.addressValidator()(this.state.address)
        } else {
            if (this.matLoaderCirclePreFormLoad) {
                this.matLoaderCirclePreFormLoad.setVisible(true);
            }
        }
    }

    activateSubmitButton() {

        if (this.submitButton) {
            this.submitButton.classList.remove('disabled');
        }
    }

    addressValidator = () => {
        return address(this.geoService, this, async (geolocation: any, address: string) => {

            this.userGeoLocation = geolocation;

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
            if (await this.formRef.validate(true)) {

                await this.userService.upsertUserProfile(this.getDataToSave());
                this.afterSaveModal.toggle();
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
        this.loadingIndicator.toggle();
    };

    private async loadData() {
        this.state = (await this.userService.getUserProfile(false)) as IUserProfileResponse;

        this.renderPartial(
            <MatForm ref={{ formRef: this }}>
                {this.getFormInputs()}
            </MatForm>, this.formContainer);

        setImmediate(() => {
            this.addressValidator()(this.state.address);
        })
    }

    getFormInputs() {
        return <fragment>
            <MatInput name="email" label={st.t("E-mail")}
                class={['col', 's12', 'm6']}
                disabled={true}
                helperText={st.t("Your e-mail address")}
                validators={[required, email]}
                value={this.state.email}
                validationErrorMessages={{
                    required: st.t("This is a required field"),
                    'email': st.t("Not a valid e-mail address")
                }}>
            </MatInput>
            <MatInput name="first_name" label={st.t("Firstname")}
                class={['col', 's6', 'm3']}
                helperText={st.t("i.e. John")}
                validators={[required]}
                value={this.state.first_name}
                validationErrorMessages={{
                    required: st.t("This is a required field")
                }}>
            </MatInput>

            <MatInput name="last_name" label={st.t("Lastname")}
                class={['col', 's6', 'm3']}
                helperText={st.t("i.e. Doe")}
                validators={[required]}
                value={this.state.last_name}
                validationErrorMessages={{
                    required: st.t("This is a required field")
                }}>
            </MatInput>
            <MatInput name="phone" label={st.t("Phone number")}
                class={['col', 's12', 'm6']}
                helperText={st.t("Please enter your phone number here")}
                validators={[required]}
                value={this.state.phone}
                validationErrorMessages={{
                    required: st.t("This is a required field")
                }}>
            </MatInput>
            <MatTextArea name="address" label={st.t("Home/Delivery address")}
                class={['col', 's12', 'm6']}
                rows={2}
                helperText={st.t("Where should the purchases be delivered to?")}
                validators={[required, this.addressValidator()]}
                value={this.state.address}
                validationErrorMessages={{
                    required: st.t("This is a required field"),
                    address: st.t("This address doesn't seem to be valid")
                }}>
            </MatTextArea>
            <div class={['col', 's12', 'hide']} ref={{ mapContainer: this }}>

                <Center>
                    <strong>{st.t("We recognized the following address:")}<br /></strong>

                    <span ref={{ addressField: this }}></span>
                    <img class="static-map" ref={{ staticMapImage: this }} />
                </Center>

            </div>

            <MatLoaderCircle ref={{ matLoaderCircle: this }} class={['col', 's12',]} />
        </fragment>
    }

    deleteUserProfile = async () => {
        this.beforeUserDeleteModal.toggle();
    }

    reallyDeleteUser = async() => {

        this.loadingIndicator.setVisible(true);

        await this.userService.deleteOwnUser();

        st.route = {
            path: LoginPage.ROUTE
        };
    }

    getLanguages = function () {
        return this.i18nService.getSupportedLanguages();
    }

    onLanguageItemPress = function (item : object) {
        this.splashscreenService.show();

        window.setTimeout(function () {
            this.i18nService.setLanguage(item.key);
        }.bind(this), 100);
    }

    getSelectedLanguage = function () {
        return this.i18nService.getLanguage();
    }
}
