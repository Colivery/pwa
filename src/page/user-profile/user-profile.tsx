import { st } from "springtype/core";
import { component } from "springtype/web/component";
import { ILifecycle } from "springtype/web/component/interface/ilifecycle";
import tpl, { IUserProfileFromState } from "./user-profile.tpl";
import { inject } from "springtype/core/di";
import { ref } from "springtype/core/ref";
import { ErrorMessage } from "../../component/error-message/error-message";
import { GeoService } from "../../service/geo";
import { MatModal, MatLoadingIndicator, MatLoaderCircle, MatForm } from "st-materialize";
import { address, IAddress } from "../../validators/address";
import { UserService } from "../../service/user";
import { IUserProfileResponse, IUserProfileRequest } from "../../datamodel/user";
import { calculateAvailableHeightPercent } from "../../function/calculate-available-height-percent";
import { COLOR_COLIVERY_PRIMARY } from "../../config/colors";
import { tsx } from "springtype/web/vdom";
import { MatInput } from "st-materialize";
import { required, email } from "springtype/core/validate";
import { LoginPage } from "../login/login";
import { Center } from "../../component/center/center";
import { formatAddress } from "../../function/format-address";

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

    @ref
    cityField: MatInput;
    @ref
    streetField: MatInput;
    @ref
    streetNoField: MatInput;
    @ref
    zipCodeField: MatInput;

    userGeoLocation: {
        lat: number;
        lng: number;
    };

    validatedUserAddress: IAddress;

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
        return () => {

            console.log('validate')
            const fn = address(this.geoService, this, async (geolocation: any, address: IAddress) => {

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

                setImmediate(() => {

                    // hide loaders, show map
                    this.mapContainer.classList.remove('hide');
                    this.matLoaderCircle.setVisible(false);
                });
            });

            return fn(formatAddress(this.getDataToSave()));
        };
    };

    getDataToSave = (): Partial<IUserProfileRequest> => {
        const formState = this.formRef.getState() as any as IUserProfileFromState;
        return {
            firstName: formState.firstName,
            phone: formState.phone,
            lastName: formState.lastName,
            city: formState.city,
            street: formState.street,
            streetNo: formState.streetNo,
            zipCode: formState.zipCode,
            location: this.userGeoLocation ? {
                latitude: this.userGeoLocation.lat,
                longitude: this.userGeoLocation.lng
            } : null
        }
    }

    updateUserProfile = async () => {

        try {
            this.loadingIndicator.setVisible(true);

            if (await this.formRef.validate()) {

                console.log('updateUserProfile');
                await this.userService.updateUserProfile(this.getDataToSave());

                this.afterSaveModal.setVisible(true);
            }
        } catch (e) {
            this.errorMessage.setMessage(e.message);
        } finally {
            this.loadingIndicator.setVisible(false);
        }
    };

    private async loadData() {
        this.state = (await this.userService.getUserProfile(false)) as IUserProfileResponse;

        this.renderPartial(
            <MatForm ref={{ formRef: this }}>
                {this.getFormInputs()}
            </MatForm>, this.formContainer);
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
            <MatInput name="firstName" label={st.t("Firstname")}
                class={['col', 's6', 'm3']}
                helperText={st.t("i.e. John")}
                validators={[required]}
                value={this.state.firstName}
                validationErrorMessages={{
                    required: st.t("This is a required field")
                }}>
            </MatInput>

            <MatInput name="lastName" label={st.t("Lastname")}
                class={['col', 's6', 'm3']}
                helperText={st.t("i.e. Doe")}
                validators={[required]}
                value={this.state.lastName}
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
            <MatInput name="street" ref={{ streetField: this }} label={st.t("Street")}
                class={['col', 's12', 'm6']}
                validators={[required]}
                value={this.state.street}
                onValidation={(evt: any) => {
                    this.addressValidator()()
                }}
                validationErrorMessages={{
                    required: st.t("This is a required field"),
                    address: st.t("This address doesn't seem to be valid")
                }}>
            </MatInput>
            <MatInput name="streetNo" ref={{ streetNoField: this }} label={st.t("Steet no")}
                class={['col', 's12', 'm6']}
                validators={[required]}
                value={this.state.streetNo}
                onValidation={(evt: any) => {
                    this.addressValidator()()
                }}
                validationErrorMessages={{
                    required: st.t("This is a required field"),
                    address: st.t("This address doesn't seem to be valid")
                }}>
            </MatInput>
            <MatInput name="zipCode" ref={{ streetField: this }} label={st.t("Zip code")}
                class={['col', 's12', 'm6']}
                validators={[required]}
                onValidation={(evt: any) => {
                    this.addressValidator()()
                }}
                value={this.state.zipCode}
                validationErrorMessages={{
                    required: st.t("This is a required field"),
                    address: st.t("This address doesn't seem to be valid")
                }}>
            </MatInput>
            <MatInput name="city" ref={{ cityField: this }} label={st.t("City")}
                class={['col', 's12', 'm6']}
                validators={[required]}
                onValidation={(evt: any) => {
                    this.addressValidator()()
                }}
                value={this.state.city}
                validationErrorMessages={{
                    required: st.t("This is a required field"),
                    address: st.t("This address doesn't seem to be valid")
                }}>
            </MatInput>
            <div class={['col', 's12', 'hide']} ref={{ mapContainer: this }}>

                <Center>
                    <strong>{st.t("We recognized the following address:")}<br /></strong>

                    <span ref={{ addressField: this }}></span>
                    <img class="static-map" style={{ marginTop: '10px', marginBottom: '-20px' }} ref={{ staticMapImage: this }} />
                </Center>

            </div>

            <MatLoaderCircle ref={{ matLoaderCircle: this }} class={['col', 's12', 'hide']} />
        </fragment>
    }

    deleteUserProfile = async () => {
        this.beforeUserDeleteModal.toggle();
    }

    reallyDeleteUser = async () => {

        this.loadingIndicator.setVisible(true);

        await this.userService.deleteOwnUser();

        st.route = {
            path: LoginPage.ROUTE
        };
    }
}
