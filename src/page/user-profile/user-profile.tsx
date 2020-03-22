import "./user-profile.scss";

import {st} from "springtype/core";
import {component, state} from "springtype/web/component";
import {ILifecycle} from "springtype/web/component/interface/ilifecycle";
import tpl from "./user-profile.tpl";
import {ConsumerOrderAddPage} from "../consumer-order-add/consumer-order-add";
import {inject} from "springtype/core/di";
import {RegisterService} from "../../service/register";
import {IUserProfile} from "../../datamodel/user";
import {ref} from "springtype/core/ref";
import {Form, Input} from "springtype/web/form";
import {ErrorMessage} from "../../component/error-message/error-message";
import {validatorNameFactory} from "springtype/core/validate/function/validator-name-factory";
import {Feature} from "ol";
import {GeoService} from "../../service/geocoding";
import {OlMap} from "../../component/ol-map/ol-map";
import {TextArea} from "../../component/mat/mat-textarea";

@component({
    tpl
})
export class UserProfile extends st.component implements ILifecycle {

    static ROUTE = "user-profile";

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

    @state
    state: IUserProfile;

    userId!: string;

    lookupTimeout: any;

    userGeoLocation: any;

    oldMarker: Feature;

    constructor() {
        super();
        this.loadData()
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
            st.debug('address value sanitizedValue', value, sanitizedValue);
            const geoCoordinates = await this.geoService.forwardGeoCode(sanitizedValue);

            if (geoCoordinates && geoCoordinates[0]) {
                this.userGeoLocation = {
                    lat: geoCoordinates[0].lat,
                    lon: geoCoordinates[0].lon
                };

                st.debug('userGeoLocation', this.userGeoLocation);

                st.debug('lat lng', this.userGeoLocation.lat, this.userGeoLocation.lon);
                this.olMapRef.setCenter(this.userGeoLocation.lat, this.userGeoLocation.lon);
                this.olMapRef.removeMarker(this.oldMarker);
                this.oldMarker = this.olMapRef.setMarker(this.userGeoLocation.lat, this.userGeoLocation.lon);
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

    onAfterRender(hasDOMChanged: boolean): void {
        if (this.state) {
            this.olMapRef.init();
            this.addressValidator(this.state.address)
        }
    }

    onAddButtonClick = () => {
        st.route = {
            path: ConsumerOrderAddPage.ROUTE
        }
    };
    updateUserProfile = async () => {
        try {

            if ( await this.formRef.validate()) {
                const formState = this.formRef.getState() as any;
                st.debug('userProfile', formState);

                delete formState.id;
                await this.registerService.updateProfile(formState as IUserProfile);
            }
        } catch (e) {
            this.errorMessage.message = e.message;
        }
    };

    private async loadData() {
        this.userId = this.registerService.getUserId();
        this.state = await this.registerService.getUserProfile();
        console.log('profile',);
    }
}
