import { tsx } from "springtype/web/vdom";
import { MatInput, MatTextArea, MatLoaderCircle, Form } from "st-materialize";
import { required } from "springtype/core/validate";
import { RegisterUserAddressPage } from "./register-user-address";
import { LogoRow } from "../../../component/logo-row/logo-row";
import { ErrorMessage } from "../../../component/error-message/error-message";
import { st } from "springtype/core";
import { Center } from "../../../component/center/center";

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
                        validationErrorMessages={{
                            required: st.t("This is a required field")
                        }}>
                    </MatInput>

                    <MatInput name="last_name" label={st.t("Lastname")}
                        class={['col', 's6', 'm3', 'l3']}
                        helperText={st.t("i.e. Doe")}
                        validators={[required]}
                        validationErrorMessages={{
                            required: st.t("This is a required field")
                        }}>
                    </MatInput>

                    <MatInput name="phone" label={st.t("Phone number")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("i.e. 0170 11 22 33 44")}
                        validators={[required]}
                        validationErrorMessages={{
                            required: st.t("This is a required field")
                        }}>
                    </MatInput>
                    <MatTextArea name="address" label={st.t("Home/Delivery address")}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText={st.t("Where goods should be delivered")}
                        validators={[required, component.addressValidator()]}
                        validationErrorMessages={{
                            required: st.t("This is a required field"),
                            address: st.t("This address does not seem valid")
                        }}>
                    </MatTextArea>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3', 'hide']} ref={{ mapContainer: component }}>

                        <Center>
                            <strong>{st.t("We understood this address:")}<br /></strong>

                            <span ref={{ addressField: component }}></span>

                            <img class="static-map" ref={{ staticMapImage: component }} />
                        </Center>
                    </div>

                    <MatLoaderCircle ref={{ matLoaderCircle: component }} class={['col', 's12', 'hide']} />
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
