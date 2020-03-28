import { tsx } from "springtype/web/vdom";
import { MatInput } from "../../../component/mat/mat-input";
import { required } from "springtype/core/validate";
import { Form } from "springtype/web/form";
import { RegisterUserAddressPage } from "./register-user-address";
import { MatTextarea } from "../../../component/mat/mat-textarea";
import { LogoRow } from "../../../component/logo-row/logo-row";
import { ErrorMessage } from "../../../component/error-message/error-message";
import { OlMap } from "../../../component/ol-map/ol-map";

export default (component: RegisterUserAddressPage) => (
    <fragment>
        <div class="container">
            <Form ref={{ formRef: component }}>
                <LogoRow />
                <div class="row">

                    <MatInput name="firstname" label="Vorname"
                        class={['col', 's6', 'm3', 'offset-m3', 'l3', 'offset-l3']}
                        helperText="z.B. Max"
                        validators={[required]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld'
                        }}>
                    </MatInput>

                    <MatInput name="lastname" label="Nachname"
                        class={['col', 's6', 'm3', 'l3']}
                        helperText="z.B. Mustermann"
                        validators={[required]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld'
                        }}>
                    </MatInput>

                    <MatInput name="phone" label="Telefonnummer"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText="z.B. 0170 11 22 33 44"
                        validators={[required]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld'
                        }}>
                    </MatInput>
                    <MatTextarea name="address" label="Wohn/Lieferadresse"
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        helperText="Wohin die Fahrer*in kommen soll"
                        validators={[required, component.addressValidator()]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld',
                            address: 'Diese Adresse können wir nicht verstehen'
                        }}>
                    </MatTextarea>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}>
                        <OlMap ref={{ olMapRef: component }} hideZoom={false} />
                    </div>
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']} />
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's12', 'm6', 'offset-m3', 'l6', 'offset-l3']}
                        onClick={() => component.onNextClick()}>Weiter</a>
                </div>
            </Form>
        </div>
    </fragment>
)

export interface IRegisterUserAddressFormState {
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    accepted_support_inquiry: boolean;
}
