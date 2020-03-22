import { tsx } from "springtype/web/vdom";
import { MatInput } from "../../../component/mat/mat-input";
import { email, minLength, required } from "springtype/core/validate";
import { Form } from "springtype/web/form";
import { RegisterPage } from "./register";
import { MatCheckbox } from "../../../component/mat/mat-checkbox";
import { LogoRow } from "../../../component/logo-row/logo-row";
import { ErrorMessage } from "../../../component/error-message/error-message";

export default (component: RegisterPage) => (
    <fragment>
        <div class="container">
            <LogoRow />
            <Form ref={{ formRef: component }} class="col s12">
                <div class="row">
                    <MatInput name="email" label="E-Mail"
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        helperText="Deine E-Mail-Adresse"
                        validators={[required, email]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld',
                            'email': 'Keine gültige E-Mail'
                        }}>
                    </MatInput>
                    <MatInput name="password" label="Passwort" type="password"
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}
                        helperText="Bitte wähle ein Passwort"
                        validators={[required, minLength(7)]}
                        errorMessage={{
                            required: 'Das ist ein Pflichtfeld',
                            'min-length': 'Bitte mindestens 7 Zeichen'
                        }}>
                    </MatInput>
                </div>
                <div class="row">
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <MatCheckbox name="accepted_terms_of_use" label="Ich habe die AGB gelesen, verstanden und akzeptiere sie." required={true} />
                    </div>
                    <div class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']}>
                        <MatCheckbox name="accepted_privacy_policy" label="Ich habe die Datenschutzerklärung gelesen, verstanden und bin damit einverstanden." required={true} />
                    </div>
                </div>
                <div class="row">
                    <ErrorMessage ref={{ errorMessage: component }}
                        class={['col', 's12', 'm6', 'offset-m3', 'l4', 'offset-l4']} />
                </div>
                <div class="row">
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's6', 'offset-l4', 'l2']}
                        onClick={() => component.onBackClick()}>Zurück</a>
                    <a class={['waves-effect', 'waves-light', 'btn', 'col', 's6', 'l2']}
                        onClick={() => component.onNextClick()}>Weiter</a>
                </div>
            </Form>
        </div>
    </fragment>
)

export interface IRegisterFormState {
    email: string;
    password: string;
    accepted_privacy_policy: boolean;
    accepted_terms_of_use: boolean;
}
