import { tsx } from "springtype/web/vdom";
import { MatInput } from "../../../component/mat/mat-input";
import { required } from "springtype/core/validate";
import { Form } from "springtype/web/form";
import { RegisterUserAddressPage } from "./register-user-address";
import { MatTextarea } from "../../../component/mat/mat-textarea";
import { LogoRow } from "../../../component/logo-row/logo-row";
import { ErrorMessage } from "../../../component/error-message/error-message";
import { MatLoaderCircle } from "../../../component/mat/mat-loader-circle";
import { st } from "springtype/core";

export default (component: RegisterUserAddressPage) => (
    <fragment>
        <div class="container">
            <Form ref={{ formRef: component }}>
                <LogoRow />
                <div class="row">

                    <MatInput name="first_name" label={st.t("Firstname")}
                        class={['col', 's6', 'm3', 'offset-m3', 'l3', 'offset-l3']}
                        helperText={st.t("i.e. John")}
                        validators={[required]}
                        errorMessage={{
                            required: st.t("This is a required field")
                        }}>
                    </MatInput>

                    <MatInput name="last_name" label={st.t("Lastname")}
                        class={['col', 's6', 'm3', 'l3']}
                        helperText={st.t("i.e. Doe")}
                        validators={[required]}
                        errorMessage={{
                            required: st.t("This is a required field")
                        }}>
                    </MatInput>

                    <MatInput name="phone" label={st.t("Phone number")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("i.e. 0170 11 22 33 44")}
                        validators={[required]}
                        errorMessage={{
                            required: st.t("This is a required field")
                        }}>
                    </MatInput>
                    <MatTextarea name="address" label={st.t("Home/Delivery address")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Where goods should be delivered")}
                        validators={[required, component.addressValidator()]}
                        errorMessage={{
                            required: st.t("This is a required field"),
                            address: st.t("This address does not seem valid")
                        }}>
                    </MatTextarea>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3', 'hide']} ref={{ mapContainer: component }}>

                        <center>
                            <strong>{st.t("We understood this address:")}<br /></strong>

                            <span ref={{ addressField: component }}></span>

                            <img class="static-map" ref={{ staticMapImage: component }} />
                        </center>
                    </div>

                    <MatLoaderCircle ref={{ matLoaderCircle: component }} class={['col', 's12',]} />
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />

                    <a ref={{ submitButton: component }} style={{ marginTop: '10px' }} class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        onClick={() => component.onNextClick()}>{st.t("Next")}</a>
                </div>
            </Form>
        </div>
    </fragment>
)

export interface IRegisterUserAddressFormState {
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    accepted_support_inquiry: boolean;
}
